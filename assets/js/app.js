/* ===========================
   ZenTools 2.0 Pro
   app.js
=========================== */

const DATA_PATH = {
  tools: "./data/tools-data.json",
  tutorials: "./data/tutorials-data.json",
  reviews: "./data/reviews-data.json"
};

/* ===========================
   DOM
=========================== */

const toolCountEl = document.getElementById("toolCount");
const tutorialCountEl = document.getElementById("tutorialCount");

const featuredToolsEl =
  document.getElementById("featuredTools");

const aiToolsEl =
  document.getElementById("aiTools");

const reviewListEl =
  document.getElementById("reviewList");

const tutorialListEl =
  document.getElementById("tutorialList");

const searchInput =
  document.getElementById("toolSearch");

const searchBtn =
  document.getElementById("searchBtn");

/* ===========================
   Theme
=========================== */

function loadTheme() {

  const savedTheme =
    localStorage.getItem("zentools-theme");

  if(savedTheme === "dark"){

    document.body.classList.add("dark");

  }

}

function toggleTheme() {

  document.body.classList.toggle("dark");

  const isDark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "zentools-theme",
    isDark ? "dark" : "light"
  );

}

const themeBtn =
  document.getElementById("themeToggle");

if(themeBtn){

  themeBtn.addEventListener(
    "click",
    toggleTheme
  );

}

loadTheme();

/* ===========================
   Fetch JSON
=========================== */

async function fetchJSON(url){

  try{

    const res = await fetch(url);

    if(!res.ok){

      throw new Error(
        `读取失败: ${url}`
      );

    }

    return await res.json();

  }catch(err){

    console.error(err);

    return [];

  }

}

/* ===========================
   Render Card
=========================== */

function createCard(item){

  return `
  <div class="card">

    <h3>
      ${item.title || item.name}
    </h3>

    <p>
      ${item.description || item.summary || ""}
    </p>

    <a
      class="btn"
      href="${item.url || item.slug || "#"}">

      查看详情

    </a>

  </div>
  `;

}

/* ===========================
   Featured Tools
=========================== */

function renderFeaturedTools(tools){

  if(!featuredToolsEl) return;

  const featured =
    tools.slice(0,6);

  featuredToolsEl.innerHTML =
    featured
      .map(createCard)
      .join("");

}

/* ===========================
   AI Tools
=========================== */

function renderAITools(tools){

  if(!aiToolsEl) return;

  const aiTools =
    tools.filter(tool => {

      const cat =
        tool.category || "";

      return cat.includes("AI");

    });

  aiToolsEl.innerHTML =
    aiTools
      .slice(0,6)
      .map(createCard)
      .join("");

}

/* ===========================
   Reviews
=========================== */

function renderReviews(reviews){

  if(!reviewListEl) return;

  reviewListEl.innerHTML =
    reviews
      .slice(0,6)
      .map(createCard)
      .join("");

}

/* ===========================
   Tutorials
=========================== */

function renderTutorials(tutorials){

  if(!tutorialListEl) return;

  tutorialListEl.innerHTML =
    tutorials
      .slice(0,6)
      .map(createCard)
      .join("");

}

/* ===========================
   Statistics
=========================== */

function updateStats(
  tools,
  tutorials
){

  if(toolCountEl){

    toolCountEl.textContent =
      tools.length;

  }

  if(tutorialCountEl){

    tutorialCountEl.textContent =
      tutorials.length;

  }

}

/* ===========================
   Search
=========================== */

let allTools = [];

function searchTools(){

  const keyword =
    searchInput.value
      .trim()
      .toLowerCase();

  if(!keyword){

    renderFeaturedTools(allTools);

    return;

  }

  const result =
    allTools.filter(tool => {

      const title =
        (
          tool.title ||
          tool.name ||
          ""
        ).toLowerCase();

      const desc =
        (
          tool.description ||
          ""
        ).toLowerCase();

      return (
        title.includes(keyword)
        ||
        desc.includes(keyword)
      );

    });

  renderFeaturedTools(result);

}

if(searchBtn){

  searchBtn.addEventListener(
    "click",
    searchTools
  );

}

if(searchInput){

  searchInput.addEventListener(
    "keyup",
    event => {

      if(event.key === "Enter"){

        searchTools();

      }

    }
  );

}

/* ===========================
   Load Data
=========================== */

async function init(){

  const tools =
    await fetchJSON(
      DATA_PATH.tools
    );

  const tutorials =
    await fetchJSON(
      DATA_PATH.tutorials
    );

  const reviews =
    await fetchJSON(
      DATA_PATH.reviews
    );

  allTools = tools;

  renderFeaturedTools(
    tools
  );

  renderAITools(
    tools
  );

  renderReviews(
    reviews
  );

  renderTutorials(
    tutorials
  );

  updateStats(
    tools,
    tutorials
  );

}

init();

/* ===========================
   Language Switch Placeholder
=========================== */

const langBtn =
  document.getElementById(
    "langToggle"
  );

if(langBtn){

  langBtn.addEventListener(
    "click",
    () => {

      alert(
        "i18n 多语言模块将在后续版本接入"
      );

    }
  );

}
