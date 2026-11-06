"use strict";
const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");
const { ScramjetController } = $scramjetLoadController();
const scramjet = new ScramjetController({
  files: {
    wasm: "/scram/scramjet.wasm.wasm",
    all: "/scram/scramjet.all.js",
    sync: "/scram/scramjet.sync.js",
  },
});
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
let initialization;
let frame;
let busy = false;
function withTimeout(promise, milliseconds, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); }),
  ]).finally(() => clearTimeout(timer));
}
async function initialize() {
  if (!initialization) {
    initialization = (async () => {
      await scramjet.init();
      await registerSW();
      await withTimeout(navigator.serviceWorker.ready, 20000,
        "The browser did not activate the service worker. Reload this page and try again.");
      const websocket = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/wisp/`;
      await withTimeout(connection.setTransport("/libcurl/index.mjs", [{ websocket }]), 20000,
        "The connection transport did not start. Reload this page and try again.");
    })().catch((cause) => { initialization = undefined; throw cause; });
  }
  return initialization;
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (busy || !address.value.trim()) return;
  busy = true;
  address.disabled = true;
  error.textContent = "Connecting…";
  errorCode.textContent = "";
  try {
    await initialize();
    const url = search(address.value, searchEngine.value);
    if (!frame) {
      frame = scramjet.createFrame();
      frame.frame.id = "sj-frame";
      frame.frame.setAttribute("allow", "autoplay; fullscreen; gamepad");
      document.body.appendChild(frame.frame);
    }
    frame.go(url);
    error.textContent = "";
  } catch (cause) {
    error.textContent = "Could not open the page.";
    errorCode.textContent = cause instanceof Error ? cause.message : String(cause);
  } finally {
    busy = false;
    address.disabled = false;
  }
});
