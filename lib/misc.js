export const exitWithErrorMessage = (message, code = 1) => {
    console.error(`error: ${message}`);
    process.exit(code);
};

export const normalizePathName = (value) => {
    if ((value !== "/") && (value.endsWith("/"))) value = value.substring(0, value.length - 1);
    return value;
};