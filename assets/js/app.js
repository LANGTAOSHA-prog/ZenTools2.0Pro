
/* =========================
   ZenTools Ultra Lite
   （稳定上线版）
========================= */

const app = document.getElementById("app");

let DB = {
  tools: [],
  tutorials: [],
  reviews: []
};

/* =========================
   安全加载 JSON
========================= */

async function loadJSON(url){

  try{

    const res = await fetch(url);

    if(!res.ok){
      throw new Error("404: " + url);
    }

    const text = await res.text();

    return JSON.parse(text);

  }catch(e){

    console.warn("JSON加载失败:", url, e);

    return [];

  }

}

}

/* =========================
   初始化数据
========================= */

async function initData(){

  DB.tools =
    await loadJSON("./data/tools-data.json");

  DB.tutorials =
    await loadJSON("./data/tutorials-data.json");

  DB.reviews =
    await loadJSON("./data/reviews-data.json");

}

/* =========================
   渲染函数
========================= */

function renderHome(){

  app.innerHTML = `
    <h1>ZenTools Ultra Lite</h1>

    <h2>热门工具</h2>

    ${DB.tools.slice(0,6).map(t=>`
      <div class="card">
        <h3>${t.title}</h3>
        <p>${t.description || ""}</p>
        <a href="${t.url}">使用</a>
      </div>
    `).join("")}

  `;

}

/* =========================
   工具页
========================= */

function renderTools(){

  app.innerHTML = `
    <h1>全部工具</h1>

    ${DB.tools.map(t=>`
      <div class="card">
        <h3>${t.title}</h3>
        <p>${t.description || ""}</p>
        <a href="${t.url}">打开</a>
      </div>
    `).join("")}

  `;

}

/* =========================
   教程页
========================= */

function renderTutorials(){

  app.innerHTML = `
    <h1>教程中心</h1>

    ${DB.tutorials.map(t=>`
      <div class="card">
        <h3>${t.title}</h3>
        <p>${t.summary}</p>
        <a href="${t.url}">查看</a>
      </div>
    `).join("")}

  `;

}

/* =========================
   评测页
========================= */

function renderReviews(){

  app.innerHTML = `
    <h1>深度评测</h1>

    ${DB.reviews.map(r=>`
      <div class="card">
        <h3>${r.title}</h3>
        <p>${r.summary}</p>
        <a href="${r.url}">阅读</a>
      </div>
    `).join("")}

  `;

}

/* =========================
   简单路由（稳定版）
========================= */

function router(){

  const hash = location.hash || "#/";

  if(hash === "#/tools") return renderTools();

  if(hash === "#/tutorials") return renderTutorials();

  if(hash === "#/reviews") return renderReviews();

  renderHome();

}

/* =========================
   启动
========================= */

async function init(){

  await initData();

  router();

  window.addEventListener("hashchange", router);

}

init();
