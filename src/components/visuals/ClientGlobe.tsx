"use client";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { marketFlags as Flags } from "./market-flags";
import { COUNTRY_COORDINATES } from "./country-coordinates";
const FlagGlobe = lazy(() => import("./FlagGlobe"));
import "./ClientGlobe.css";
const markets = [
  ["IQ", "Iraq", "Asia"], ["OM", "Oman", "Asia"], ["MT", "Malta", "Europe"], ["QA", "Qatar", "Asia"], ["CA", "Canada", "Americas"], ["JO", "Jordan", "Asia"], ["KW", "Kuwait", "Asia"], ["BH", "Bahrain", "Asia"], ["IE", "Ireland", "Europe"], ["RO", "Romania", "Europe"], ["MV", "Maldives", "Asia"], ["AU", "Australia", "Asia Pacific"], ["MU", "Mauritius", "Africa"], ["LK", "Sri Lanka", "Asia"], ["SC", "Seychelles", "Africa"], ["NZ", "New Zealand", "Asia Pacific"], ["SA", "Saudi Arabia", "Asia"], ["GB", "Scotland, UK", "Europe"], ["GB", "United Kingdom", "Europe"], ["AE", "United Arab Emirates", "Asia"],
];
export default function ClientGlobe() {
  const stage = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {setNearby(true); observer.disconnect();}
    }, {rootMargin:"250px"});
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const visible = markets.filter(m => region === "All" || (region === "Asia" ? ["Asia", "Asia Pacific"].includes(m[2]) : region === "Europe" ? m[2] === "Europe" : ["Americas", "Africa"].includes(m[2])));
  const location = COUNTRY_COORDINATES[selected ?? "LK"];
  const selectedName = selected ? markets.find(([code]) => code === selected)?.[1] : undefined;
  return <section id="client-network" className="market-network" aria-labelledby="client-map-title"><div className="hf-shell">
    <div className="hf-heading"><div><p className="hf-eyebrow">Our service area</p><h2 id="client-map-title">Opportunities that<br />travel further.</h2></div><p>From Sri Lanka to 19 destinations worldwide.</p></div>
    <div className="market-layout"><div className="market-globe-stage" ref={stage}>
      {nearby ? <Suspense fallback={<div className="market-flag-globe" role="status">Loading client globe…</div>}><FlagGlobe className="market-flag-globe" markers={[{code:"LK"}, ...visible.map(m => ({code:m[0]}))]} autoRotate rotationSpeed={0.25} stars={false} dark baseColor="#23765f" glowColor="#73b79a" flagSize={30} phi={-Math.PI / 2 - location[1] * Math.PI / 180} theta={location[0] * Math.PI / 180} /></Suspense> : <div className="market-flag-globe" aria-hidden="true" />}
      <div className="market-globe-foot"><span>Drag to explore · Flags show our markets</span></div>
    </div><div className="market-panel"><h3>Explore service areas</h3><div className="market-filters" role="group" aria-label="Filter service areas by region">{["All","Asia","Europe","Other regions"].map(r => <button key={r} aria-pressed={region === r} onClick={() => {setRegion(r);setSelected(null);}}>{r}</button>)}</div>
      <div className="market-flags">{visible.map(([code,name], index) => {const Flag = Flags[code as keyof typeof Flags];return <button key={`${code}-${index}`} title={name} aria-label={name} aria-pressed={selected === code} onClick={() => {setSelected(selected === code ? null : code);}}><Flag aria-hidden="true" /></button>;})}</div>
      <p className="market-help">Choose a flag to bring its country into view.</p><span className="market-origin"><Flags.LK aria-hidden="true" /><span>{selectedName ? `Sri Lanka to ${selectedName}` : "Connected from Sri Lanka"}</span></span>
    </div></div></div></section>;
}
