import fs from 'node:fs';
import path from 'node:path';
import { logger } from './logger.js';
/**
 * Ensures a directory exists, creating it recursively if needed.
 */
export function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
/**
 * Writes a file, creating parent directories if needed.
 * Skips if file already exists (unless force=true).
 */
export function writeFile(filePath, content, force = false) {
    if (fs.existsSync(filePath) && !force) {
        logger.warn(`Skipped (exists): ${path.relative(process.cwd(), filePath)}`);
        return false;
    }
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, 'utf-8');
    logger.success(`Created: ${path.relative(process.cwd(), filePath)}`);
    return true;
}
/**
 * Reads and parses a JSON file. Returns null if not found.
 */
export function readJSON(filePath) {
    if (!fs.existsSync(filePath))
        return null;
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
/**
 * Deep merges source into target JSON and writes back to file.
 */
export function mergeJSON(filePath, data) {
    const existing = readJSON(filePath) ?? {};
    const merged = deepMerge(existing, data);
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
}
/**
 * Deep merge two objects.
 */
function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === 'object' &&
            !Array.isArray(target[key])) {
            result[key] = deepMerge(target[key], source[key]);
        }
        else {
            result[key] = source[key];
        }
    }
    return result;
}
/**
 * Resolves the .claude directory path relative to project root.
 */
export function getClaudeDir(projectRoot) {
    return path.join(projectRoot ?? process.cwd(), '.claude');
}
/**
 * Checks if the current directory is a Claude-configured project.
 */
export function isClaudeProject(projectRoot) {
    const claudeDir = getClaudeDir(projectRoot);
    return fs.existsSync(claudeDir);
}
//# sourceMappingURL=file-ops.js.map