"use client";

export function BackButton() {
  return <a href="#" onClick={(event) => { event.preventDefault(); window.history.back(); }}>← Back</a>;
}
