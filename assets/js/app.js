
/* ================================
   ZenTools Ultimate Safe Engine
   永不白屏版本
================================ */

const app = document.getElementById("app");

/* ================================
   本地兜底数据（关键）
================================ */

const FALLBACK = {
  tools: [
    {
      id: 1,
      title: "JSON格式化工具",
      description: "本地备用工具（网络失败时显示）",
      url: "#"
    },
    {
      id: 2,
      title: "Base64转换",
      description: "基础编码工具",
      url: "#"
    }
  ],
  tutorials: [
    {
      title: "教程加载失败",
      summary: "当前使用本地备用数据",
      url: "#"
    }
  ],
  reviews: [
    {
      title: "评测加载失败",
      summary: "使用备用内容",
      url: "#"
    }
  ]
};

/* ================================
   超安全 fetch（核心）
================================ */

async function safeFetch(url, fallback){

  const timeout = new Promise((_, reject)=>
    setTimeout(()=>reject("timeout"), 3000)
  );

  try{

    const res = await Promise.race([
      fetch(url),
      timeout
    ]);

    if(!res || !res.ok)
      throw new Error("HTTP error");

    const text = await res.text();

    return JSON.parse(text);

  }catch(e){

    console.warn("加载失败:", url, e);

    return fallback;

  }

}

/* ================================
   数据层
================================ */

let DB = {
  tools: [],
  tutorials: [],
  reviews: []
};

/* ================================
   初始化数据（防崩溃）
================================ */

async function initData(){

  DB.tools =
    await safeFetch(
      "./data/tools-data.json",
      FALLBACK.tools
    );

  DB.tutorials =
    await safeFetch(
      "./data/tutorials-data.json",
      FALLBACK.tutorials
    );

  DB.reviews =
    await safeFetch(
      "./data/reviews-data.json",
      FALLBACK.reviews
    );

}

/* ================================
   强制渲染（永不空白）
================================ */

function renderHome(){

  app.innerHTML = `
    <div style="font-family:Arial;padding:20px">

      <h1>ZenTools</h1>

      <p style="color:gray">
        Ultra Safe Mode（防白屏模式）
      </p>

      <h2>工具</h2>

      ${DB.tools.map(t=>`
        <div style="padding:10px;margin:10px 0;border:1px solid #eee">
          <h3>${t.title}</h3>
          <p>${t.description || ""}</p>
        </div>
      `).join("")}

      <h2>教程</h2>

      ${DB.tutorials.map(t=>`
        <div style="padding:10px;margin:10px 0;border:1px solid #eee">
          <h3>${t.title}</h3>
          <p>${t.summary || ""}</p>
        </div>
      `).join("")}

      <h2>评测</h2>

      ${DB.reviews.map(r=>`
        <div style="padding:10px;margin:10px 0;border:1px solid #eee">
          <h3>${r.title}</h3>
          <p>${r.summary || ""}</p>
        </div>
      `).join("")}

    </div>
  `;

}

/* ================================
   路由（极简稳定）
================================ */

function router(){

  const hash = location.hash || "#/";

  if(hash === "#/tools"){
    return alert("工具页（Lite模式）");
  }

  if(hash === "#/tutorials"){
    return alert("教程页（Lite模式）");
  }

  if(hash === "#/reviews"){
    return alert("评测页（Lite模式）");
  }

  renderHome();

}

/* ================================
   启动器（永不卡死）
================================ */

async function init(){

  try{

    await initData();

  }catch(e){

    console.error("初始化失败，使用兜底数据");

    DB = FALLBACK;

  }

  renderHome();

  window.addEventListener("hashchange", router);

}

/* ================================
   强制执行
================================ */

init();
