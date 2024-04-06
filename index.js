import { exitWithErrorMessage } from "./lib/misc.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { loadConfig, validateConfig } from "./lib/config.js";
import { safeReadFileSync } from "./lib/io.js";
import { getStoryBlokEntries } from "./lib/storyblok.js";
import { mkdirSync, writeFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const argv = process.argv.slice(2);

if (argv.length !== 1) exitWithErrorMessage("expecting a single argument (siteID)");

const siteID = argv[0];

const configFilePath = `${__dirname}/config/${siteID}.yaml`;
const yamlContent = safeReadFileSync(configFilePath);

if (yamlContent === null) exitWithErrorMessage(`config file for siteID '${siteID}' not found (./config/${siteID}.yaml)`);

let config;
try {
    config = validateConfig(loadConfig(yamlContent));
}
catch (err) {
    exitWithErrorMessage(err.message);
}

const lines = [];
lines.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
lines.push(...(await getStoryBlokEntries(config)).map(({ path, date, priority, changefreq }) => {
    const lines = [];
    lines.push(`    <url>`);
    lines.push(`        <loc>${path}</loc>`);
    lines.push(`        <priority>${priority}</priority>`);
    lines.push(`        <changefreq>${changefreq}</changefreq>`);
    lines.push(`        <lastmod>${date}</lastmod>`);
    lines.push(`    </url>`);
    return lines.join("\n");
}));
lines.push(`</urlset>\n`);
const output = lines.join("\n");

const outputDirPath = `${__dirname}/out/${siteID}`;
const outputFilePath = `${outputDirPath}/sitemap.xml`;
mkdirSync(outputDirPath, { recursive: true });
writeFileSync(outputFilePath, output);
console.log(`successfully created: ./out/${siteID}/sitemap.xml`);