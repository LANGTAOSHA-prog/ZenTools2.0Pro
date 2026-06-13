async function safeFetch(url){

  try{

    const res = await fetch(url);

    if(!res.ok) throw new Error(url);

    return await res.json();

  }catch(e){

    console.warn("加载失败:", url);

    return [];

  }

}

function safeRender(el, html){

  if(!el) return;

  el.innerHTML = html || `
    <div class="card">
      <h3>暂无数据</h3>
      <p>数据加载失败或为空</p>
    </div>
  `;

}

/* 初始化 */
async function init(){

  const tools =
    await safeFetch("./data/tools-data.json");

  const tutorials =
    await safeFetch("./data/tutorials-data.json");

  const reviews =
    await safeFetch("./data/reviews-data.json");

  /* 防止空白 */
  if(!tools.length){

    console.warn("tools为空");

  }

  const featuredToolsEl =
    document.getElementById("featuredTools");

  if(featuredToolsEl){

    featuredToolsEl.innerHTML =
      tools.slice(0,6).map(t => `
        <div class="card">
          <h3>${t.title}</h3>
          <p>${t.description || ""}</p>
          <a class="btn" href="${t.url}">
            使用
          </a>
        </div>
      `).join("");

  }

  document.getElementById("toolCount")
  .textContent = tools.length;

  document.getElementById("tutorialCount")
  .textContent = tutorials.length;

}

init();
