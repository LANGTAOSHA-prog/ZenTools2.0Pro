/* ================================
   ZenTools 2.0 Pro UI Engine
   有 UI、有路由、有独立详情链接
================================ */

const app = document.getElementById("app");

const FALLBACK = {
  tools: [
    {
      id: 1,
      name: "JSON Formatter",
      title: "JSON格式化工具",
      category: "开发工具",
      description: "格式化、校验和美化 JSON 数据。",
      icon: "{}",
      rating: 5,
      tags: ["JSON", "开发"]
    },
    {
      id: 2,
      name: "Base64 Encode",
      title: "Base64转换",
      category: "开发工具",
      description: "文本与 Base64 快速互转。",
      icon: "🔐",
      rating: 5,
      tags: ["编码", "开发"]
    }
  ],
  tutorials: [
    {
      id: 1,
      title: "如何新增一个独立工具页面",
      category: "ZenTools",
      summary: "按照主分类目录结构新增工具。",
      read_time: 8,
      tags: ["工具", "ZenTools"]
    }
  ],
  reviews: [
    {
      id: 1,
      slug: "chatgpt",
      title: "ChatGPT 深度评测",
      tool: "ChatGPT",
      category: "AI助手",
      rating: 5,
      summary: "从写作、代码、搜索、Agent 能力等多个维度分析。",
      tags: ["ChatGPT", "AI助手"]
    }
  ]
};

let DB = { tools: [], tutorials: [], reviews: [] };
let activeSearch = "";

async function safeFetch(url, fallback){
  const timeout = new Promise((_, reject)=>
    setTimeout(()=>reject(new Error("timeout")), 3000)
  );

  try{
    const res = await Promise.race([fetch(url), timeout]);
    if(!res || !res.ok) throw new Error(`HTTP ${res && res.status}`);
    return await res.json();
  }catch(e){
    console.warn("加载失败，使用兜底数据:", url, e);
    return fallback;
  }
}

async function initData(){
  const [tools, tutorials, reviews] = await Promise.all([
    safeFetch("./data/tools-data.json", FALLBACK.tools),
    safeFetch("./data/tutorials-data.json", FALLBACK.tutorials),
    safeFetch("./data/reviews-data.json", FALLBACK.reviews)
  ]);

  DB = { tools, tutorials, reviews };
}

const routeFor = (type, item) => `#/${type}/${encodeURIComponent(item.slug || item.id || item.name || item.title)}`;
function matchesSearch(item){
  if(!activeSearch) return true;
  const haystack = [
    item.title,
    item.name,
    item.category,
    item.description,
    item.summary,
    ...(item.tags || [])
  ].join(" ").toLowerCase();

  return haystack.includes(activeSearch.toLowerCase());
}

function getFeatured(items, count = 6){
  const featured = items.filter(item => item.featured).slice(0, count);
  return featured.length ? featured : items.slice(0, count);
}

function renderShell(content){
  app.innerHTML = `
    <header class="header">
      <div class="container navbar">
        <a class="logo" href="#/" aria-label="ZenTools 首页">ZenTools</a>
        <nav class="nav-menu" aria-label="主导航">
          <a href="#/tools">工具库</a>
          <a href="#/tutorials">教程</a>
          <a href="#/reviews">评测</a>
          <a href="#/categories">分类</a>
        </nav>
        <div class="nav-actions">
          <button id="themeToggle" type="button" aria-label="切换深色模式">🌙</button>
        </div>
      </div>
    </header>
    ${content}
    <footer class="site-footer">
      <div class="container">© 2026 ZenTools 2.0 Pro · 每个卡片都有可分享的独立链接</div>
    </footer>
  `;

  document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

function renderHero(){
  return `
    <section class="hero">
      <div class="container">
        <p class="eyebrow">可打开 · 有 UI · 有独立链接</p>
        <h1 class="hero-title">ZenTools 2.0 Pro 工具导航</h1>
        <p class="hero-subtitle">精选 AI、PDF、开发、图片、文本工具，配套教程与深度评测。</p>
        <form class="search-wrapper" id="searchForm">
          <input id="searchInput" value="${activeSearch}" placeholder="搜索工具、教程、评测..." aria-label="搜索">
          <button type="submit">搜索</button>
        </form>
        <div class="hero-stats">
          <div class="stat"><span>${DB.tools.length}</span>工具</div>
          <div class="stat"><span>${DB.tutorials.length}</span>教程</div>
          <div class="stat"><span>${DB.reviews.length}</span>评测</div>
          <div class="stat"><span>${new Set(DB.tools.map(t=>t.category)).size}</span>分类</div>
        </div>
      </div>
    </section>
  `;
}

function card(type, item){
  const summary = item.description || item.summary || `${item.title} 的详情页面`;
  return `
    <article class="card resource-card">
      <div class="card-top">
        <span class="tool-icon">${item.icon || "✨"}</span>
        <span class="badge">${item.category || item.difficulty || "精选"}</span>
      </div>
      <h3>${item.title || item.name}</h3>
      <p>${summary}</p>
      <div class="tag-row">${(item.tags || []).slice(0,3).map(tag=>`<span>${tag}</span>`).join("")}</div>
      <a class="btn" href="${routeFor(type, item)}">打开独立页面</a>
    </article>
  `;
}

function section(title, subtitle, type, items){
  const list = items.filter(matchesSearch);
  return `
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
        <div class="card-grid">${list.map(item => card(type, item)).join("") || emptyState()}</div>
      </div>
    </section>
  `;
}

function emptyState(){
  return `<div class="empty-state">没有匹配内容，请尝试其他关键词。</div>`;
}

function renderHome(){
  renderShell(`
    ${renderHero()}
    ${section("热门工具", "直接进入工具详情，复制地址即可分享。", "tools", getFeatured(DB.tools))}
    ${section("实用教程", "部署、建站、数据管理和工具页面制作指南。", "tutorials", getFeatured(DB.tutorials, 4))}
    ${section("深度评测", "AI 助手、AI 编程与效率工具评测。", "reviews", getFeatured(DB.reviews, 4))}
  `);
  bindSearch();
}

function renderList(type){
  const category = new URLSearchParams((location.hash.split("?")[1] || "")).get("category");
  const config = {
    tools: ["全部工具", "完整工具库，每个工具都有独立详情链接。", DB.tools],
    tutorials: ["全部教程", "从部署到新增页面的完整教程列表。", DB.tutorials],
    reviews: ["全部评测", "真实场景导向的工具评测集合。", DB.reviews]
  }[type];
  const items = category ? config[2].filter(item => item.category === category) : config[2];
  const title = category ? `${category}工具` : config[0];

  renderShell(`${renderHero()}${section(title, config[1], type, items)}`);
  bindSearch();
}

function renderCategories(){
  const categories = [...new Set(DB.tools.map(tool => tool.category || "其他"))];
  renderShell(`
    <section class="section">
      <div class="container">
        <div class="section-header"><h2>工具分类</h2><p>按分类浏览工具。</p></div>
        <div class="category-grid">
          ${categories.map(category => `
            <a class="category-card" href="#/tools?category=${encodeURIComponent(category)}">
              <div class="icon">🧭</div>
              <h3>${category}</h3>
              <p>${DB.tools.filter(tool => tool.category === category).length} 个工具</p>
            </a>
          `).join("")}
        </div>
      </div>
    </section>
  `);
}

function renderDetail(type, id){
  const collection = DB[type] || [];
  const decoded = decodeURIComponent(id || "");
  const item = collection.find(entry =>
    String(entry.slug || entry.id || entry.name || entry.title) === decoded
  );

  if(!item){
    renderShell(`<section class="section"><div class="container"><div class="empty-state">页面不存在。<br><a class="btn" href="#/">返回首页</a></div></div></section>`);
    return;
  }

  renderShell(`
    <section class="detail-hero">
      <div class="container detail-card">
        <span class="tool-icon large">${item.icon || "✨"}</span>
        <p class="eyebrow">${item.category || item.difficulty || "ZenTools"}</p>
        <h1>${item.title || item.name}</h1>
        <p>${item.description || item.summary || "这是 ZenTools 的独立详情页面。"}</p>
        <div class="tag-row">${(item.tags || []).map(tag=>`<span>${tag}</span>`).join("")}</div>
        <div class="detail-actions">
          <a class="btn" href="#/${type}">返回列表</a>
          <button class="btn secondary" id="copyLink" type="button">复制独立链接</button>
        </div>
      </div>
    </section>
  `);

  document.getElementById("copyLink").addEventListener("click", async () => {
    const copyButton = document.getElementById("copyLink");
    if(navigator.clipboard){
      await navigator.clipboard.writeText(location.href);
      copyButton.textContent = "已复制";
    }else{
      copyButton.textContent = location.href;
    }
  });
}

function bindSearch(){
  document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    activeSearch = document.getElementById("searchInput").value.trim();
    router();
  });
}

function router(){
  const [path] = (location.hash || "#/").slice(2).split("?");
  const parts = path.split("/").filter(Boolean);

  if(parts[0] === "tools" && parts[1]) return renderDetail("tools", parts[1]);
  if(parts[0] === "tutorials" && parts[1]) return renderDetail("tutorials", parts[1]);
  if(parts[0] === "reviews" && parts[1]) return renderDetail("reviews", parts[1]);
  if(["tools", "tutorials", "reviews"].includes(parts[0])) return renderList(parts[0]);
  if(parts[0] === "categories") return renderCategories();

  renderHome();
}

async function init(){
  try{
    await initData();
  }catch(e){
    console.error("初始化失败，使用兜底数据", e);
    DB = FALLBACK;
  }

  router();
  window.addEventListener("hashchange", router);
}

init();
