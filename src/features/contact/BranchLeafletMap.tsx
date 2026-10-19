"use client";
import { useEffect, useMemo, useRef } from "react";
import { divIcon, latLngBounds, type Map as LeafletMap } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Branch } from "./branches";
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


export default function BranchLeafletMap({region, visibleBranches, selectedBranchId, setSelectedBranchId, resetVersion}: {
region: string; visibleBranches: Branch[]; selectedBranchId: string | null;
setSelectedBranchId: (id: string) => void; resetVersion: number;
}) {
const mapRef = useRef<LeafletMap | null>(null);
const branchBounds = useMemo(() => latLngBounds(visibleBranches.map(branch => branch.position)), [visibleBranches]);
const selectedBranch = visibleBranches.find(branch => branch.id === selectedBranchId) ?? null;
useEffect(() => { if (resetVersion) mapRef.current?.fitBounds(branchBounds, {padding:[44,44], animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches}); }, [resetVersion, branchBounds]);
return (<MapContainer
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
          </MapContainer>);
}
