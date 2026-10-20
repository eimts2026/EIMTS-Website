/** Inline Bootstrap Icons keep public actions consistent across Safari and other browsers. */
export default function BootstrapIcon({ name, className }: { name: "arrow-down" | "arrow-up-right" | "arrow-right"; className?: string }) {
  const paths = {
    "arrow-down": <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />,
    "arrow-up-right": <path fillRule="evenodd" d="M5 3.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V4.707l-8.146 8.147a.5.5 0 0 1-.708-.708L11.293 4H5.5a.5.5 0 0 1-.5-.5" />,
    "arrow-right": <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />,
  };
  return <svg className={className} viewBox="0 0 16 16" width="16" height="16" fill="currentColor" focusable="false" aria-hidden="true">{paths[name]}</svg>;
}
