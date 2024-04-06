# Storyblok Sitemap Generator (v1.0.2)

## Install

```bash
npm install
```

## Configure

To create a config file for a site, copy the `./config/example.com-sample.yaml` to a file called `./config/{siteID}.yml`, where `siteID` is an identifier for the site (e.g. the domain name). Configure the values (see the example file to understand the structure).

## Run

```bash
npm run sitemap "{siteID}"
```

## Output

You'll find the outputted file at `out/{siteID}/sitemap.xml`.