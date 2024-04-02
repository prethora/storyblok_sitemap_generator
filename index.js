import "dotenv/config";
import StoryblokClient from "storyblok-js-client"

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { mkdirSync, writeFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Storyblok = new StoryblokClient({
    accessToken: process.env.STORYBLOK_ACCESS_TOKEN
});

let links = await Storyblok.getAll('cdn/links', {
    version: 'published'
});

let prefixUrl = process.env.SITE_BASE_URL;
if (prefixUrl.endsWith("/")) prefixUrl = prefixUrl.substring(0, prefixUrl.length - 1);

let sitemap_entries = links.map((link) => {
    if (link.is_folder) return ''
    return `\n    <url><loc>${prefixUrl}${link.real_path}</loc></url>`
});

let sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemap_entries.join('')}
</urlset>`;

let outputDir = path.join(__dirname, "out");
let outputFilePath = path.join(outputDir, "sitemap.xml");

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFilePath, sitemap);