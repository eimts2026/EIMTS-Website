"use client";
import dynamic from "next/dynamic";

import { useEffect, useMemo, useRef, useState } from "react";

import "./BranchMap.css";

import { branches } from "./branches";



function DirectionsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5-5 5M19 10H9a4 4 0 0 0-4 4v5" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3h3l1.5 5-2.1 1.3a15 15 0 0 0 5.7 5.7l1.3-2.1 5 1.5v3c0 2-1.6 3.6-3.6 3.6A14.4 14.4 0 0 1 3 6.6C3 4.6 4.6 3 6.6 3Z" /></svg>;
}

const LeafletCanvas = dynamic(() => import("./BranchLeafletMap"), {ssr:false, loading: () => <p className="branch-map-loading" role="status">Loading interactive map…</p>});

export function BranchMap() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const fromHash = () => { if (window.location.hash.startsWith("#branch-map")) setMapReady(true); };
    fromHash();
    const observer = new IntersectionObserver(entries => { if(entries.some(entry => entry.isIntersecting)) {setMapReady(true); observer.disconnect();} }, {rootMargin:"300px"});
    observer.observe(node);
    window.addEventListener("hashchange", fromHash);
    return () => { observer.disconnect(); window.removeEventListener("hashchange", fromHash); };
  }, []);
  const [region, setRegion] = useState<"local" | "international">("local");
  const visibleBranches = useMemo(() => branches.filter((branch) => branch.region === region), [region]);
  useEffect(() => {
    const selectFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#branch-map-local" || hash === "#branch-map-international") {
        setRegion(hash.endsWith("international") ? "international" : "local");
        setSelectedBranchId(null);

      }
    };
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, []);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) ?? null,
    [selectedBranchId],
  );

  const showAllBranches = () => {
    setSelectedBranchId(null);
    setMapReady(true);
    setResetVersion(value => value + 1);
  };

  useEffect(() => {
    if (selectedBranchId) {
      const cardEl = document.querySelector(`.branch-map-card[data-id="${selectedBranchId}"]`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [selectedBranchId]);

  return <section className="branch-map-section" id="branch-map-section" aria-labelledby="branch-map-title">
    <div className="container">
      <header className="branch-map-heading">
        <div>
          <p className="section-kicker">Our international network</p>
          <h2 id="branch-map-title">Meet us closer to home.</h2>
          <p>Explore our offices in Sri Lanka, Nepal and the UAE. Select a branch for contact details.</p>
        </div>
        <div className="branch-map-metric" aria-label={`${visibleBranches.length} branch locations`}>
          <strong>{String(visibleBranches.length).padStart(2, "0")}</strong>
          <span>{region === "local" ? <>offices<br />in Sri Lanka</> : <>offices<br />overseas</>}</span>
        </div>
      </header>

      <div className="branch-region-tabs" role="tablist" aria-label="Branch region">
        {(["local", "international"] as const).map((item) => <button key={item} id={`branch-map-${item}`} type="button" role="tab" aria-selected={region === item} aria-controls="branch-region-panel" tabIndex={region === item ? 0 : -1}
          onClick={() => { setRegion(item); setSelectedBranchId(null); }}
          onKeyDown={(event) => { if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? "local" : event.key === "End" ? "international" : region === "local" ? "international" : "local"; setRegion(next); setSelectedBranchId(null); document.getElementById(`branch-map-${next}`)?.focus(); } }}>
          {item === "local" ? "Sri Lanka" : "International"}<span>{item === "local" ? "4 offices" : "Nepal & UAE"}</span>
        </button>)}
      </div>
      <div className="branch-map-shell" id="branch-region-panel" role="tabpanel" aria-labelledby={`branch-map-${region}`}>
        <div className="branch-map-canvas" ref={canvasRef}>
          {mapReady ? <LeafletCanvas region={region} visibleBranches={visibleBranches} selectedBranchId={selectedBranchId} setSelectedBranchId={setSelectedBranchId} resetVersion={resetVersion} /> : <button type="button" className="branch-map-loading" onClick={() => setMapReady(true)}>Load interactive map</button>}
          <div className="branch-map-country-label" aria-hidden="true">
            <span>{selectedBranch?.city ?? (region === "local" ? "Sri Lanka" : "Nepal · UAE")}</span>
            <small>{selectedBranch?.approximate ? "Approximate area location" : "Our branch network"}</small>
          </div>
        </div>

        <aside className="branch-map-panel" aria-label="Branch locations">
          <div className="branch-map-panel-topline">
            <p>Choose a branch</p>
            <button type="button" onClick={showAllBranches}>View all</button>
          </div>

          <div className="branch-map-list" data-lenis-prevent>
            {visibleBranches.map((branch, index) => {
              const isSelected = branch.id === selectedBranchId;
              const directionsUrl = branch.mapsUrl;

              return <article className={`branch-map-card${isSelected ? " is-selected" : ""}`} key={branch.id} data-id={branch.id}>
                <button
                  className="branch-map-card-select"
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedBranchId(branch.id)}
                >
                  <span className="branch-map-index">0{index + 1}</span>
                  <span className="branch-map-card-copy">
                    <strong>{branch.name}</strong>
                    <small>{branch.city}</small>
                    <span>{branch.address}</span>
                    {branch.approximate && <small>Approximate area · call for exact location</small>}
                  </span>
                  <span className="branch-map-card-arrow" aria-hidden="true">↗</span>
                </button>
                <div className="branch-map-card-actions">
                  <a href={branch.phoneHref}><PhoneIcon />{branch.phone}</a>
                  <a href={directionsUrl} target="_blank" rel="noreferrer"><DirectionsIcon />{branch.approximate ? "View area" : "Directions"}</a>
                </div>
              </article>;
            })}
          </div>
          <p className="branch-map-hint">Use the map controls or drag to explore. Scroll-wheel zoom is disabled.</p>
        </aside>
      </div>
    </div>
  </section>;
}
