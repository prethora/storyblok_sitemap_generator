import yaml from "js-yaml";

export const loadConfig = (content) => {
    try {
        const doc = yaml.load(content);
        return doc;
    }
    catch (err) {
        throw new Error(`unable to parse YAML: ${err.message}`);
    }
};

export const validateConfig = (config) => {
    // Validate that config is an object
    if (typeof config !== 'object' || config === null) {
        throw new Error('config should be a non-null object.');
    }

    // Validate base_url
    if (typeof config.base_url !== 'string' || !/^https?:\/\/.+/.test(config.base_url)) {
        throw new Error('base_url must be a string and a valid URL starting with http or https.');
    }

    // Validate access_token
    if (typeof config.access_token !== 'string' || config.access_token.trim().length === 0) {
        throw new Error('access_token must be a non-empty string.');
    }

    // Validate access_token
    if (config.timezone !== undefined && (typeof config.timezone !== 'number' || config.timezone < -12 || config.timezone > 12)) {
        throw new Error('timezone if provided must be a number between -12 and 12 (inclusive)');
    }

    if (config.timezone === undefined) {
        config.timezone = 0;
    }

    // Validate defaults
    if (typeof config.defaults !== 'object' || config.defaults === null) {
        throw new Error('defaults must be a non-null object.');
    }

    if (typeof config.defaults.priority !== 'number') {
        throw new Error('defaults.priority must be a number.');
    }

    if (typeof config.defaults.changefreq !== 'string' || config.defaults.changefreq.trim().length === 0) {
        throw new Error('defaults.changefreq must be a non-empty string.');
    }

    // Validate exceptions (optional)
    if (config.exceptions !== undefined) {
        if (!Array.isArray(config.exceptions) || config.exceptions.length < 1) {
            throw new Error('if provided, exceptions must be a non-empty array.');
        }

        config.exceptions.forEach((exception, index) => {
            if (typeof exception !== 'object' || exception === null) {
                throw new Error(`exception at index ${index} must be a non-null object.`);
            }

            if (typeof exception.path_name !== 'string' || !exception.path_name.startsWith('/')) {
                throw new Error(`exception at index ${index} must have a string path_name starting with '/'.`);
            }

            if (exception.priority !== undefined && typeof exception.priority !== 'number') {
                throw new Error(`exception at index ${index} has an invalid priority value; it must be a number.`);
            }

            if (exception.changefreq !== undefined && (typeof exception.changefreq !== 'string' || exception.changefreq.trim().length === 0)) {
                throw new Error(`exception at index ${index} has an invalid changefreq value; it must be a non-empty string.`);
            }

            if (exception.priority === undefined && exception.changefreq === undefined) {
                throw new Error(`exception at index ${index} must have at least a priority or a changefreq field.`);
            }
        });
    }

    if (config.exceptions === undefined) {
        config.exceptions = [];
    }

    return config;
}
