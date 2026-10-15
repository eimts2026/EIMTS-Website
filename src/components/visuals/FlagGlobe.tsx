// --- Component ---
"use client";

import * as React from "react";
import createGlobe from "cobe";
import { COUNTRY_COORDINATES } from "./country-coordinates";
import { marketFlags as Flags } from "./market-flags";

type RGB = [number, number, number];
type FlagSvg = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export interface FlagGlobeMarker {
  /** ISO 3166-1 alpha-2 country code, e.g. "KR". */
  code: string;
  /** Override the built-in coordinates as [latitude, longitude]. */
  location?: [number, number];
  /** Accessible name. Defaults to the English country name. */
  label?: string;
}

export interface FlagGlobeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Countries to pin on the globe. Pass only the codes; coordinates for 250 countries and territories are built in. Duplicate codes are ignored. */
  markers: FlagGlobeMarker[];
  /** Diameter in pixels. Omit to fill the parent's width. */
  size?: number;
  /** Flag width in pixels. Defaults to 4.5% of the diameter. */
  flagSize?: number;
  /** Spin while idle. Always off when the user prefers reduced motion. */
  autoRotate?: boolean;
  /** Idle spin speed in radians per second. */
  rotationSpeed?: number;
  /** Initial rotation around the vertical axis, in radians. */
  phi?: number;
  /** Height the flags float above the map, as a fraction of the globe radius. 0 pins them to the surface. */
  altitude?: number;
  /** Tilt toward the viewer, in radians. */
  theta?: number;
  /** Draw a dot on the globe surface under every flag. */
  markerDots?: boolean;
  /** Twinkling star field around the globe. */
  stars?: boolean;
  /** Sphere color (any CSS color). Defaults to a blend of your background and foreground tokens. */
  baseColor?: string;
  /** Rim glow color (any CSS color). Defaults to a blend of your background and foreground tokens. */
  glowColor?: string;
  /** Force dark or light rendering. By default it follows your background token. */
  dark?: boolean;
  /** Forwarded to the root element (React 19 passes `ref` as a regular prop). */
  ref?: React.Ref<HTMLDivElement>;
}

export { COUNTRY_COORDINATES } from "./country-coordinates";

const GLOBE_RADIUS = 0.8; // cobe draws the sphere at 0.8 of the half-canvas
const DRAG_FRICTION = 0.92; // per 60 Hz frame
const KEY_STEP = 0.025; // ≈18° per press once momentum settles
const RELEASE_GRACE_MS = 80;
const TEXTURE_RETRY_MS = [150, 600, 1500];

// Size utilities the consumer passes win over the component's defaults.
const WIDTH_CLASS = /(?:^|\s)(?:[\w-]+:)*!?(?:w|size)-/;
const HEIGHT_CLASS = /(?:^|\s)(?:[\w-]+:)*!?(?:h|size|aspect)-/;
const MAX_WIDTH_CLASS = /(?:^|\s)(?:[\w-]+:)*!?max-w-/;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toCartesian([lat, lng]: [number, number]): RGB {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180 - Math.PI;
  const c = Math.cos(la);
  return [-c * Math.cos(lo), Math.sin(la), c * Math.sin(lo)];
}

// Same rotation cobe applies on the GPU, so DOM flags stay glued to the map.
function project([x, y, z]: RGB, phi: number, theta: number, altitude: number) {
  const cp = Math.cos(phi);
  const sp = Math.sin(phi);
  const ct = Math.cos(theta);
  const st = Math.sin(theta);
  const radius = GLOBE_RADIUS * (1 + altitude);
  const sx = (cp * x + sp * z) * radius;
  const sy = (sp * st * x + ct * y - cp * st * z) * radius;
  const depth = -sp * ct * x + st * y + cp * ct * z;
  return { x: (sx + 1) / 2, y: (1 - sy) / 2, depth, rim: Math.hypot(sx, sy) - GLOBE_RADIUS };
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

// Flags thin out toward the horizon so the rim never turns into a wall: full
// strength only well inside the visible face, at most 35% once they slip
// behind the globe, and gone where the sphere hides them.
function flagOpacity(depth: number, rim: number) {
  if (depth >= 0) {
    const t = clamp01(depth / 0.35);
    return 0.35 + 0.65 * t * t * (3 - 2 * t);
  }
  const exposed = Math.max(clamp01(rim / 0.03), clamp01(1 + depth * 6));
  return 0.35 * exposed * clamp01(1 + depth * 2.5);
}

let colorCanvas: HTMLCanvasElement | null = null;
const UNRESOLVED = "rgb(1, 2, 3)";

// First candidate that resolves wins; an undefined custom property makes the
// probe inherit the sentinel instead of silently borrowing the text color.
// Any CSS color (oklch, hsl, var(--x), …) → 0..1 RGB via a 1×1 canvas.
function resolveColor(scope: HTMLElement, candidates: string[]): RGB | null {
  const holder = document.createElement("span");
  holder.style.cssText = `display:none;color:${UNRESOLVED}`;
  const probe = document.createElement("span");
  holder.appendChild(probe);
  scope.appendChild(holder);
  let computed: string | null = null;
  for (const candidate of candidates) {
    if (candidate.trim().toLowerCase() === "currentcolor") {
      computed = getComputedStyle(scope).color;
      break;
    }
    probe.style.color = "";
    probe.style.color = candidate;
    const value = probe.style.color ? getComputedStyle(probe).color : UNRESOLVED;
    if (value !== UNRESOLVED) {
      computed = value;
      break;
    }
  }
  holder.remove();
  if (!computed) return null;
  colorCanvas ??= document.createElement("canvas");
  colorCanvas.width = colorCanvas.height = 1;
  const ctx = colorCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = ctx.getImageData(0, 0, 1, 1).data;
  return a === 0 ? null : [r / 255, g / 255, b / 255];
}

// The bare variable first so scoped themes win, then shadcn's Tailwind v3
// HSL channels, then Tailwind v4's --color-* aliases.
function themeToken(name: string) {
  return [`var(--${name})`, `hsl(var(--${name}))`, `var(--color-${name})`];
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function luminance([r, g, b]: RGB) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Re-reads colors whenever the page could have switched themes: class,
// inline style or data-theme on <html>/<body>, or the OS color scheme.
function useThemeTick() {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    const observer = new MutationObserver(bump);
    for (const el of [document.documentElement, document.body]) {
      observer.observe(el, { attributes: true, attributeFilter: ["class", "style", "data-theme", "data-mode"] });
    }
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", bump);
    return () => {
      observer.disconnect();
      scheme.removeEventListener("change", bump);
    };
  }, []);
  return tick;
}

function useDevicePixelRatio() {
  const [dpr, setDpr] = React.useState(() =>
    typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2),
  );
  React.useEffect(() => {
    let query: MediaQueryList | null = null;
    const watch = () => {
      query?.removeEventListener("change", watch);
      setDpr(Math.min(window.devicePixelRatio || 1, 2));
      query = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      query.addEventListener("change", watch);
    };
    watch();
    return () => query?.removeEventListener("change", watch);
  }, []);
  return dpr;
}

let regionNames: Intl.DisplayNames | null = null;
function countryName(code: string) {
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

interface PlacedFlag {
  code: string;
  label: string;
  vector: RGB;
  location: [number, number];
}

type MarkerTuple = [string, [number, number] | null, string | null];

function placeMarkers(markers: MarkerTuple[]): PlacedFlag[] {
  const placed = new Map<string, PlacedFlag>();
  for (const [rawCode, custom, label] of markers) {
    const code = rawCode.toUpperCase();
    const location = custom ?? COUNTRY_COORDINATES[code];
    if (!location || placed.has(code)) continue;
    placed.set(code, { code, label: label ?? countryName(code), vector: toCartesian(location), location });
  }
  return [...placed.values()];
}

function seededStars(count: number) {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const stars = [];
  while (stars.length < count) {
    const x = 0.03 + rand() * 0.94;
    const y = 0.03 + rand() * 0.94;
    if (Math.hypot(x - 0.5, y - 0.5) < 0.43) continue; // keep the sphere and flag ring clear
    stars.push({
      id: stars.length,
      left: x * 100,
      top: y * 100,
      size: rand() < 0.75 ? 1 : 2,
      accent: rand() < 0.3,
      delay: rand() * 4,
      duration: 2.5 + rand() * 3,
    });
  }
  return stars;
}

const STARS = seededStars(56);

type GlState = "pending" | "ready" | "unavailable";

export function FlagGlobe({
  markers,
  size,
  flagSize,
  autoRotate = true,
  rotationSpeed = 0.12,
  phi = 0,
  theta = 0.3,
  altitude = 0.125,
  markerDots = false,
  stars = true,
  baseColor,
  glowColor,
  dark,
  ref,
  className,
  style,
  onKeyDown,
  ...rest
}: FlagGlobeProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const canvasHostRef = React.useRef<HTMLDivElement>(null);
  const flagRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const globeRef = React.useRef<ReturnType<typeof createGlobe> | null>(null);
  const kickRef = React.useRef<() => void>(() => {});
  const [measured, setMeasured] = React.useState(size ?? 0);
  const [glState, setGlState] = React.useState<GlState>("pending");
  const [glVersion, setGlVersion] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [autoDark, setAutoDark] = React.useState(true);
  const themeTick = useThemeTick();
  const dpr = useDevicePixelRatio();
  const isDark = dark ?? autoDark;
  const markerKey = JSON.stringify(
    markers.map((m): MarkerTuple => [m.code, m.location ?? null, m.label ?? null]),
  );
  const flags = React.useMemo(() => placeMarkers(JSON.parse(markerKey) as MarkerTuple[]), [markerKey]);
  const px = measured;
  const flagWidth = flagSize ?? Math.max(12, Math.round(px * 0.045));
  const ready = glState !== "pending";

  const setRootRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      rootRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = el;
    },
    [ref],
  );

  // Mutable state the animation loop reads every frame without re-rendering.
  const live = React.useRef({
    phi,
    theta,
    altitude,
    dark: isDark,
    speed: rotationSpeed,
    auto: autoRotate,
    reducedMotion: false,
    onScreen: true,
    dragging: false,
    pointerId: -1,
    lastX: 0,
    lastMoveAt: 0,
    velocity: 0,
    size: px,
    flags,
  });

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const s = live.current;
    s.theta = theta;
    s.altitude = altitude;
    s.dark = isDark;
    s.speed = rotationSpeed;
    s.auto = autoRotate;
    s.size = px;
    s.flags = flags;
    kickRef.current();
  }, [theta, altitude, isDark, rotationSpeed, autoRotate, px, flags]);

  React.useEffect(() => {
    live.current.phi = phi;
    kickRef.current();
  }, [phi]);

  // The globe is drawn in the largest square that fits the padding box, so a
  // stretched, padded or fixed-height container never squashes it.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => setMeasured(Math.floor(Math.min(root.clientWidth, root.clientHeight)));
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    measure();
    return () => observer.disconnect();
  }, []);

  // Pause off-screen, in background tabs, and for reduced motion.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const s = live.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      s.reducedMotion = motion.matches;
      kickRef.current();
    };
    const onVisibility = () => kickRef.current();
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      s.onScreen = entry?.isIntersecting ?? true;
      kickRef.current();
    });
    onMotion();
    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    observer.observe(root);
    return () => {
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  const hasSize = px > 0;

  // cobe v2 wraps its canvas in its own <div>, so React owns only the host and
  // the canvas is created imperatively.
  React.useEffect(() => {
    const host = canvasHostRef.current;
    if (!host || !hasSize) return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";
    host.appendChild(canvas);

    const s = live.current;
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: s.size,
      height: s.size,
      phi: s.phi,
      theta: s.theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 1, 1],
      glowColor: [0.5, 0.5, 0.5],
      markers: [],
      markerElevation: 0,
    });
    // cobe hands back a no-op globe when WebGL is missing; reading the context
    // back tells the two apart (it returns cobe's own context when one exists).
    const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
    globeRef.current = globe;

    let raf = 0;
    let last = 0;
    let renderedSize = s.size;
    const written = new WeakMap<HTMLElement, { opacity: number; zIndex: string; filter: string }>();

    const positionFlags = () => {
      const { flags: placed, size: diameter, phi: p, theta: t, dark: onDark } = s;
      for (let i = 0; i < placed.length; i++) {
        const el = flagRefs.current[i];
        const flag = placed[i];
        if (!el || !flag) continue;
        const point = project(flag.vector, p, t, s.altitude);
        const opacity = Math.round(flagOpacity(point.depth, point.rim) * 100) / 100;
        const behind = point.depth < 0;
        const zIndex = behind ? "1" : "2";
        const filter = behind && !onDark ? "brightness(0.82) saturate(0.6)" : "";
        const prev = written.get(el) ?? { opacity: -1, zIndex: "", filter: "none" };
        if (opacity !== prev.opacity) el.style.opacity = String(opacity);
        if (zIndex !== prev.zIndex) el.style.zIndex = zIndex;
        if (filter !== prev.filter) el.style.filter = filter;
        written.set(el, { opacity, zIndex, filter });
        if (opacity === 0) continue;
        el.style.transform = `translate3d(${point.x * diameter}px, ${point.y * diameter}px, 0) translate(-50%, -50%)`;
      }
    };

    const isMoving = () =>
      s.dragging || Math.abs(s.velocity) > 1e-4 || (s.auto && s.speed !== 0 && !s.reducedMotion);

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!s.dragging) {
        if (Math.abs(s.velocity) > 1e-4) {
          const steps = dt * 60;
          s.phi += s.velocity * steps;
          s.velocity *= Math.pow(DRAG_FRICTION, steps);
        } else if (s.auto && !s.reducedMotion) {
          s.phi += s.speed * dt;
        }
      }
      if (s.size !== renderedSize) {
        renderedSize = s.size;
        globe.update({ phi: s.phi, theta: s.theta, width: s.size, height: s.size });
      } else {
        globe.update({ phi: s.phi, theta: s.theta });
      }
      positionFlags();
      if (isMoving() && s.onScreen && !document.hidden) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    kickRef.current = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    kickRef.current();

    // cobe uploads the land texture on image load without redrawing, so a
    // globe that is not spinning needs a few late frames to show the map.
    const retries = TEXTURE_RETRY_MS.map((ms) => window.setTimeout(() => kickRef.current(), ms));

    const onLost = (event: Event) => {
      event.preventDefault();
      setGlState("unavailable");
    };
    const onRestored = () => setGlVersion((v) => v + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    setGlState(gl ? "ready" : "unavailable");

    return () => {
      cancelAnimationFrame(raf);
      retries.forEach((id) => window.clearTimeout(id));
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      kickRef.current = () => {};
      globe.destroy();
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      globeRef.current = null;
      host.replaceChildren();
      setGlState("pending");
    };
  }, [hasSize, dpr, glVersion]);

  // Colors follow the theme tokens unless overridden; dark or light is read
  // from the background itself, whatever mechanism the site uses to switch.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const resolvedBackground = resolveColor(root, themeToken("background"));
    const detectedDark = resolvedBackground
      ? luminance(resolvedBackground) < 0.5
      : document.documentElement.classList.contains("dark");
    setAutoDark(detectedDark);
    const globe = globeRef.current;
    if (!globe) return;
    const onDark = dark ?? detectedDark;
    const background = resolvedBackground ?? (onDark ? [0.04, 0.04, 0.04] : [1, 1, 1]);
    const foreground =
      resolveColor(root, themeToken("foreground")) ?? (onDark ? [0.98, 0.98, 0.98] : [0.04, 0.04, 0.04]);
    const primary = resolveColor(root, themeToken("primary")) ?? foreground;
    const base =
      (baseColor && resolveColor(root, [baseColor])) || mix(background, foreground, onDark ? 0.3 : 0.05);
    const glow =
      (glowColor && resolveColor(root, [glowColor])) || mix(background, foreground, onDark ? 0.45 : 0.14);
    globe.update({
      dark: onDark ? 1 : 0,
      diffuse: onDark ? 1.2 : 0.4,
      mapBrightness: onDark ? 6 : 1.2,
      baseColor: base,
      glowColor: glow,
      markerColor: primary,
      markers: markerDots ? flags.map((f) => ({ location: f.location, size: 0.025 })) : [],
    });
    kickRef.current();
  }, [ready, glVersion, themeTick, dark, baseColor, glowColor, markerDots, flags]);

  const rotateBy = (delta: number) => {
    const s = live.current;
    if (s.reducedMotion) s.phi += delta / (1 - DRAG_FRICTION);
    else s.velocity = delta;
    kickRef.current();
  };

  const endDrag = () => {
    const s = live.current;
    s.dragging = false;
    s.pointerId = -1;
    kickRef.current();
  };

  const count = flags.length;
  const description = `Globe with flags of ${count} ${count === 1 ? "country" : "countries"}. Drag or use the arrow keys to rotate.`;
  const consumerClasses = className ?? "";

  return (
    <div
      ref={setRootRef}
      role="region"
      aria-roledescription="globe"
      aria-label={description}
      tabIndex={0}
      className={cx(
        "relative isolate select-none rounded-full",
        "focus-visible:[outline:2px_solid_transparent] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        size === undefined && !WIDTH_CLASS.test(consumerClasses) && "w-full",
        size === undefined && !HEIGHT_CLASS.test(consumerClasses) && "aspect-square",
        !MAX_WIDTH_CLASS.test(consumerClasses) && "max-w-full",
        className,
      )}
      style={{ width: size, height: size, touchAction: "pan-y pinch-zoom", ...style }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.key === "ArrowLeft") rotateBy(-KEY_STEP);
        else if (e.key === "ArrowRight") rotateBy(KEY_STEP);
        else return;
        e.preventDefault();
      }}
      {...rest}
    >
      <div
        className="absolute"
        style={{ left: "50%", top: "50%", width: px, height: px, transform: "translate(-50%, -50%)" }}
      >
        {stars && (
          <div aria-hidden className={cx("pointer-events-none absolute inset-0", !isDark && "opacity-40")}>
            {STARS.map((star) => (
              <span
                key={star.id}
                className={cx(
                  "absolute rounded-full animate-pulse motion-reduce:animate-none",
                  star.accent ? "bg-primary" : "bg-foreground/50",
                )}
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  width: star.size,
                  height: star.size,
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {glState === "unavailable" && (
          <div role="status" style={{position:"absolute",inset:"20%",display:"grid",placeItems:"center",textAlign:"center",border:"1px solid #73b79a",borderRadius:"50%",padding:24}}>Globe unavailable. Browse our markets using the flags beside it.</div>
        )}

        <div
          ref={canvasHostRef}
          aria-hidden
          className={cx(
            "absolute inset-0 cursor-grab transition-opacity duration-700 active:cursor-grabbing",
            ready ? "opacity-100" : "opacity-0",
          )}
          onPointerDown={(e) => {
            if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return;
            const s = live.current;
            s.dragging = true;
            s.pointerId = e.pointerId;
            s.lastX = e.clientX;
            s.lastMoveAt = performance.now();
            s.velocity = 0;
            e.currentTarget.setPointerCapture(e.pointerId);
            kickRef.current();
          }}
          onPointerMove={(e) => {
            const s = live.current;
            if (!s.dragging || e.pointerId !== s.pointerId) return;
            const now = performance.now();
            const delta = ((e.clientX - s.lastX) / Math.max(s.size, 1)) * Math.PI;
            const elapsed = Math.max(now - s.lastMoveAt, 1);
            s.lastX = e.clientX;
            s.lastMoveAt = now;
            s.phi += delta;
            s.velocity = (delta / elapsed) * (1000 / 60);
          }}
          onPointerUp={(e) => {
            const s = live.current;
            if (e.pointerId !== s.pointerId) return;
            if (s.reducedMotion || performance.now() - s.lastMoveAt > RELEASE_GRACE_MS) s.velocity = 0;
            if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
            endDrag();
          }}
          onPointerCancel={() => {
            live.current.velocity = 0;
            endDrag();
          }}
          onLostPointerCapture={(e) => {
            if (e.pointerId === live.current.pointerId) endDrag();
          }}
        />

        <div
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-0 transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          {flags.map((flag, i) => {
            const Flag = (Flags as unknown as Record<string, FlagSvg | undefined>)[flag.code];
            return (
              <div
                key={flag.code}
                ref={(el) => {
                  flagRefs.current[i] = el;
                }}
                className="absolute opacity-0 will-change-transform"
                style={{ left: 0, top: 0 }}
              >
                <div
                  className="overflow-hidden rounded-[2px] bg-muted leading-none shadow-sm"
                  style={{ width: flagWidth, height: Math.round((flagWidth * 2) / 3) }}
                >
                  {Flag ? (
                    <Flag width="100%" height="100%" className="block" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[8px] font-medium text-muted-foreground">
                      {flag.code}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {mounted && (
        <ol className="sr-only">
          {flags.map((flag) => (
            <li key={flag.code}>{flag.label}</li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default FlagGlobe;



