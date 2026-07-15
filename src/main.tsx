import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { updateSeo } from "./lib/seo";
import "./styles/globals.css";

const root = createRoot(document.getElementById("root")!);

function render() {
  updateSeo(window.location.pathname);
  root.render(<StrictMode><App /></StrictMode>);
  window.scrollTo({ top: 0, behavior: "auto" });
}

document.addEventListener("click", (event) => {
  const target = event.target as Element | null;
  const anchor = target?.closest("a");
  if (!anchor || event.defaultPrevented || event.button !== 0 || anchor.target || anchor.origin !== window.location.origin || anchor.hasAttribute("download")) return;
  event.preventDefault();
  window.history.pushState({}, "", anchor.href);
  render();
});

window.addEventListener("popstate", render);
render();
