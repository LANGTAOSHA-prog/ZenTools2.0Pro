import "./core.js";
import "./router.js";
import "./db.js";
import "./pwa.js";

/* =========================
   Init Ultra System
========================= */

async function init(){

  console.log("ZenTools Ultra Starting...");

  const tools =
    await fetch("./data/tools-data.json")
    .then(r=>r.json());

  tools.forEach(t =>
    ZenTools.registerTool(t)
  );

  ZenTools.emit("app:ready", true);

}

init();
