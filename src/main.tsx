import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { updateSeo } from "./lib/seo";
import "./styles/globals.css";

const root = createRoot(document.getElementById("root")!);

function render() {
  updateSeo(window.location.pathname);
  root.render(<StrictMode><App /></StrictMode>);
  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.substring(1));
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  } else {
    window.scrollTo({ top: 0, behavior: "auto" });
  }
}

document.addEventListener("click", (event) => {
  const target = event.target as Element | null;
  const anchor = target?.closest("a");
  if (!anchor || event.defaultPrevented || event.button !== 0 || anchor.target || anchor.origin !== window.location.origin || anchor.hasAttribute("download")) return;

  const url = new URL(anchor.href);
  if (url.pathname === window.location.pathname && url.hash) {
    event.preventDefault();
    window.history.pushState({}, "", anchor.href);
    const id = decodeURIComponent(url.hash.substring(1));
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  event.preventDefault();
  window.history.pushState({}, "", anchor.href);
  render();
});

window.addEventListener("popstate", render);
render();
