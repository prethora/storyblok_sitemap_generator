import StoryblokClient from "storyblok-js-client"
import { convertDate } from "./date.js";
import { normalizePathName } from "./misc.js";

export const getStoryBlokEntries = async (config) => {
    let { base_url: baseUrl, access_token: accessToken } = config;
    if (baseUrl.endsWith("/")) baseUrl = baseUrl.substring(0, baseUrl.length - 1);

    const exceptionMap = {};

    config.exceptions.forEach(({ path_name: pathName, priority, changefreq }) => {
        exceptionMap[normalizePathName(pathName)] = {
            ...((priority !== undefined) ? { priority } : {}),
            ...((changefreq !== undefined) ? { changefreq } : {})
        };
    });

    const Storyblok = new StoryblokClient({
        accessToken
    });

    let links;
    let stories

    try {
        links = await Storyblok.getAll('cdn/links', {
            version: 'published'
        });

        stories = await Storyblok.getAll('cdn/stories', {
            version: 'published'
        });
    }
    catch (err) {
        throw new Error(`could not fetch data from StoryBlok: ${err.message}`);
    }

    const dateMap = {};
    const ret = [];

    stories.forEach(({ uuid, published_at }) => dateMap[uuid] = convertDate(published_at, config.timezone));
    links.forEach(({ is_folder, real_path, uuid }) => {
        if ((!is_folder) && (dateMap[uuid])) {
            real_path = normalizePathName(real_path);
            let { priority, changefreq } = config.defaults;
            if (exceptionMap[real_path]) {
                priority = exceptionMap[real_path].priority || priority;
                changefreq = exceptionMap[real_path].changefreq || changefreq;
            }
            ret.push({
                path: `${baseUrl}${real_path}`,
                date: dateMap[uuid],
                priority,
                changefreq
            });
        }
    });

    ret.sort((a, b) => {
        if (a.priority < b.priority) return 1;
        if (a.priority > b.priority) return -1;
        return 0;
    });

    return ret;
};