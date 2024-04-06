import { readFileSync } from "fs";

export const safeReadFileSync = (fileName) => {
    try {
        return readFileSync(fileName, "utf8");
    }
    catch (err) {
        return null;
    }
};