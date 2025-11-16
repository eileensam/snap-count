// js/bootstrap.js
import { loadHeaderAndInit } from './core/header.js';

async function start() {
  await loadHeaderAndInit();

  const page = location.pathname.split("/").pop().replace(".html", "");

  switch (page) {
    case "index":
    case "":
      import("./pages/index.js").then(m => m.init());
      break;

    case "stats":
      import("./pages/stats.js").then(m => m.init());
      break;

    default:
      // no-op or 404 behavior
      break;
  }
}

start();
