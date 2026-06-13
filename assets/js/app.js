/* =====================================
   ZenTools Pro+ MAX Core Engine
===================================== */

const DB = {
  tools: [],
  tutorials: [],
  reviews: []
};

/* ================================
   STORAGE ENGINE
================================ */

const Storage = {

  get(key){
    return JSON.parse(
      localStorage.getItem(key) || "[]"
    );
  },

  set(key, value){
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }

};

/* ================================
   LOAD DATA ENGINE
================================ */

async function loadAllData(){

  const [tools, tutorials, reviews] =
    await Promise.all([
      fetch("./data/tools-data.json").then(r=>r.json()).catch(()=>[]),
      fetch("./data/tutorials-data.json").then(r=>r.json()).catch(()=>[]),
      fetch("./data/reviews-data.json").then(r=>r.json()).catch(()=>[])
    ]);

  DB.tools = tools;
  DB.tutorials = tutorials;
  DB.reviews = reviews;

}

/* ================================
   SEARCH ENGINE（核心升级）
================================ */

function searchAll(keyword){

  keyword = keyword.toLowerCase();

  const tools = DB.tools.filter(t=>
    (t.title+t.description+t.category)
    .toLowerCase()
    .includes(keyword)
  );

  const tutorials = DB.tutorials.filter(t=>
    (t.title+t.summary)
    .toLowerCase()
    .includes(keyword)
  );

  const reviews = DB.reviews.filter(r=>
    (r.title+r.summary)
    .toLowerCase()
    .includes(keyword)
  );

  return {
    tools,
    tutorials,
    reviews
  };

}

/* ================================
   RENDER ENGINE（统一UI）
================================ */

function card(item, type="tool"){

  const link =
    type === "tool"
    ? `#/tool/${item.id}`
    : item.url || "#";

  return `
    <div class="card">

      <h3>${item.title}</h3>

      <p>${item.description || item.summary || ""}</p>

      <a href="${link}">
        进入
      </a>

    </div>
  `;

}

/* ================================
   ROUTER（MAX升级版）
================================ */

function router(){

  const hash = location.hash || "#/";

  if(hash === "#/") return renderHome();

  if(hash === "#/tools") return renderTools();

  if(hash === "#/tutorials") return renderTutorials();

  if(hash === "#/reviews") return renderReviews();

  if(hash.startsWith("#/tool/"))
    return renderToolDetail(hash);

  renderNotFound();

}

window.addEventListener("hashchange", router);

/* ================================
   HOME（带搜索引擎）
================================ */

function renderHome(){

  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="container">

      <h1>ZenTools Pro+ MAX</h1>

      <input id="searchBox" placeholder="搜索工具 / 教程 / 评测">

      <div id="result"></div>

      <h2>热门工具</h2>

      <div class="grid">
        ${DB.tools.slice(0,6).map(t=>card(t,"tool")).join("")}
      </div>

    </div>
  `;

  const box =
    document.getElementById("searchBox");

  const result =
    document.getElementById("result");

  box.addEventListener("input",(e)=>{

    const res =
      searchAll(e.target.value);

    result.innerHTML = `
      <h3>搜索结果</h3>

      <div class="grid">

        ${res.tools.map(t=>card(t)).join("")}

        ${res.tutorials.map(t=>card(t,"tutorial")).join("")}

        ${res.reviews.map(r=>card(r,"review")).join("")}

      </div>
    `;

  });

}

/* ================================
   TOOLS PAGE
================================ */

function renderTools(){

  document.getElementById("app").innerHTML = `
    <div class="container">

      <h1>全部工具</h1>

      <div class="grid">
        ${DB.tools.map(t=>card(t)).join("")}
      </div>

    </div>
  `;

}

/* ================================
   TUTORIALS PAGE
================================ */

function renderTutorials(){

  document.getElementById("app").innerHTML = `
    <div class="container">

      <h1>教程中心</h1>

      <div class="grid">
        ${DB.tutorials.map(t=>card(t,"tutorial")).join("")}
      </div>

    </div>
  `;

}

/* ================================
   REVIEWS PAGE
================================ */

function renderReviews(){

  document.getElementById("app").innerHTML = `
    <div class="container">

      <h1>深度评测</h1>

      <div class="grid">
        ${DB.reviews.map(r=>card(r,"review")).join("")}
      </div>

    </div>
  `;

}

/* ================================
   TOOL DETAIL（详情页）
================================ */

function renderToolDetail(hash){

  const id = hash.split("/")[2];

  const tool =
    DB.tools.find(t=>t.id == id);

  if(!tool)
    return renderNotFound();

  document.getElementById("app").innerHTML = `
    <div class="container">

      <h1>${tool.title}</h1>

      <p>${tool.description}</p>

      <a href="${tool.url}">
        打开工具
      </a>

    </div>
  `;

}

/* ================================
   404
================================ */

function renderNotFound(){

  document.getElementById("app").innerHTML = `
    <div class="container">

      <h1>404</h1>

      <p>页面不存在</p>

      <a href="#/">返回首页</a>

    </div>
  `;

}

/* ================================
   INIT ENGINE
================================ */

async function init(){

  await loadAllData();

  router();

}

init();
