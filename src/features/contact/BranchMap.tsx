"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  divIcon,
  latLngBounds,
  type Map as LeafletMap,
} from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./BranchMap.css";

import { branches, type Branch } from "./branches";



function markerIcon(isActive: boolean) {
  return divIcon({
    className: "branch-marker-icon",
    html: `<span class="branch-marker${isActive ? " is-active" : ""}" aria-hidden="true">
      <svg viewBox="0 0 48 60" focusable="false">
        <path d="M24 2C11.85 2 2 11.85 2 24c0 15.72 18.48 32.22 20.58 34.04a2.17 2.17 0 0 0 2.84 0C27.52 56.22 46 39.72 46 24 46 11.85 36.15 2 24 2Z" />
        <circle cx="24" cy="24" r="8" />
      </svg>
    </span>`,
    iconSize: [48, 60],
    iconAnchor: [24, 58],
    popupAnchor: [0, -54],
  });
}

function MapInit({ branch }: { branch: Branch | null }) {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize();
    };

    invalidate();
    const timer1 = setTimeout(invalidate, 100);
    const timer2 = setTimeout(invalidate, 500);

    window.addEventListener("resize", invalidate);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  useEffect(() => {
    if (branch) {
      map.flyTo(branch.position, branch.approximate ? 12 : 14, { duration: 0.75, animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    }
  }, [branch, map]);

  return null;
}

function DirectionsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5-5 5M19 10H9a4 4 0 0 0-4 4v5" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3h3l1.5 5-2.1 1.3a15 15 0 0 0 5.7 5.7l1.3-2.1 5 1.5v3c0 2-1.6 3.6-3.6 3.6A14.4 14.4 0 0 1 3 6.6C3 4.6 4.6 3 6.6 3Z" /></svg>;
}

export function BranchMap() {
  const [region, setRegion] = useState<"local" | "international">("local");
  const visibleBranches = useMemo(() => branches.filter((branch) => branch.region === region), [region]);
  const branchBounds = useMemo(() => latLngBounds(visibleBranches.map((branch) => branch.position)), [visibleBranches]);
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
  const mapRef = useRef<LeafletMap | null>(null);
  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === selectedBranchId) ?? null,
    [selectedBranchId],
  );

  const showAllBranches = () => {
    setSelectedBranchId(null);
    mapRef.current?.fitBounds(branchBounds, { padding: [44, 44] });
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
          <p>Find our teams in Sri Lanka, Nepal and the UAE. Select a branch to explore its location or call the team.</p>
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
        <div className="branch-map-canvas">
          <MapContainer
            key={region}
            ref={mapRef}
            className="branch-map"
            bounds={branchBounds}
            boundsOptions={{ padding: [44, 44] }}
            minZoom={2}
            maxZoom={17}
            scrollWheelZoom={false}
            zoomControl
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapInit branch={selectedBranch} />
            {visibleBranches.map((branch) => <Marker
              key={branch.id}
              position={branch.position}
              icon={markerIcon(branch.id === selectedBranchId)}
              title={`${branch.name}, ${branch.city}`}
              eventHandlers={{ click: () => setSelectedBranchId(branch.id) }}
            >
              <Popup>
                <div className="branch-map-popup">
                  <strong>{branch.name}</strong>
                  <span>{branch.address}</span>
                  {branch.approximate && <span>Approximate area — call for the exact office location.</span>}
                  <a href={branch.phoneHref}>{branch.phone}</a>
                </div>
              </Popup>
            </Marker>)}
          </MapContainer>
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
