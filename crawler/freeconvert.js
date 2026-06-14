import axios from "axios";
import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";

const OUTPUT_DIR = "./data";
const OUTPUT_FILE = "./data/tools-data.json";

async function getSitemapUrls() {
  const sitemapUrl = "https://www.freeconvert.com/sitemap.xml";

  console.log("读取 Sitemap...");

  const response = await axios.get(sitemapUrl, {
    timeout: 30000,
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const xml = await parseStringPromise(response.data);

  const urls = [];

  if (
    xml.urlset &&
    xml.urlset.url
  ) {
    xml.urlset.url.forEach(item => {
      if (item.loc && item.loc[0]) {
        urls.push(item.loc[0]);
      }
    });
  }

  return urls;
}

function guessCategory(url, title) {
  const text = (url + " " + title).toLowerCase();

  if (text.includes("pdf")) return "PDF工具";
  if (text.includes("video")) return "视频工具";
  if (text.includes("audio")) return "音频工具";
  if (text.includes("image")) return "图片工具";
  if (text.includes("compress")) return "压缩工具";
  if (text.includes("document")) return "文档工具";
  if (text.includes("ebook")) return "电子书工具";
  if (text.includes("archive")) return "压缩包工具";

  return "文件工具";
}

function createSlug(url) {
  try {
    const u = new URL(url);

    return u.pathname
      .replace(/^\/+/g, "")
      .replace(/\/$/g, "");
  } catch {
    return "";
  }
}

async function scrapeTool(url) {
  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(response.data);

    const title =
      $("title").text().trim() ||
      $("h1").first().text().trim();

    const description =
      $('meta[name="description"]').attr("content") ||
      "";

    return {
      name: title || createSlug(url),
      category: guessCategory(url, title),
      description: description,
      website: url,
      slug: createSlug(url)
    };
  } catch (err) {
    console.log("跳过:", url);
    return null;
  }
}

async function main() {
  try {
    const urls = await getSitemapUrls();

    console.log(`发现 ${urls.length} 个页面`);

    const tools = [];

    for (const url of urls) {
      if (
        url.includes("/pdf") ||
        url.includes("/video") ||
        url.includes("/audio") ||
        url.includes("/image") ||
        url.includes("/compress") ||
        url.includes("/converter")
      ) {
        const tool = await scrapeTool(url);

        if (tool) {
          tools.push(tool);

          console.log(
            `✔ ${tool.name}`
          );
        }
      }
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, {
        recursive: true
      });
    }

    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(
        tools,
        null,
        2
      ),
      "utf8"
    );

    console.log("");
    console.log("================================");
    console.log(`采集完成`);
    console.log(`工具数量: ${tools.length}`);
    console.log(`输出文件: ${OUTPUT_FILE}`);
    console.log("================================");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
