import axios from "axios";
import fs from "fs";
import * as cheerio from "cheerio";
import { SOURCES } from "./sources.js";

const OUTPUT = "../data/tools-data.json";

// 去重
const seen = new Set();
const tools = [];

function guessCategory(text = "") {
  const t = text.toLowerCase();

  if (t.includes("pdf")) return "PDF工具";
  if (t.includes("video")) return "视频工具";
  if (t.includes("image")) return "图片工具";
  if (t.includes("audio")) return "音频工具";
  if (t.includes("compress")) return "压缩工具";
  if (t.includes("ebook")) return "电子书工具";
  if (t.includes("document")) return "文档工具";

  return "文件工具";
}

function cleanName(name) {
  return name
    .replace("FreeConvert", "")
    .replace("Converter", "")
    .replace("|", "")
    .trim();
}

async function crawlPage(url) {
  try {
    const res = await axios.get(url, {
      timeout: 20000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(res.data);

    const title =
      $("h1").first().text().trim() ||
      $("title").text().trim();

    const description =
      $('meta[name="description"]').attr("content") || "";

    const links = [];

    // 提取页面内工具链接
    $("a").each((_, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim();

      if (
        href &&
        href.includes("freeconvert.com") &&
        !seen.has(href)
      ) {
        seen.add(href);

        links.push({
          name: cleanName(text || title),
          url: href,
          category: guessCategory(text + href),
          description: description || text,
          source: url
        });
      }
    });

    return links;

  } catch (err) {
    console.log("跳过:", url);
    return [];
  }
}

async function run() {
  console.log("🚀 FreeConvert Pro Max 开始采集...\n");

  for (const url of SOURCES) {
    console.log("扫描:", url);

    const result = await crawlPage(url);
    tools.push(...result);

    console.log("获取:", result.length);
  }

  // 去重（最终保险）
  const final = Array.from(
    new Map(tools.map(t => [t.url, t])).values()
  );

  fs.writeFileSync(OUTPUT, JSON.stringify(final, null, 2));

  console.log("\n================================");
  console.log("✅ 采集完成");
  console.log("工具数量:", final.length);
  console.log("输出:", OUTPUT);
  console.log("================================");
}

run();
