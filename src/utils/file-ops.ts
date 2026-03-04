import fs from 'node:fs';
import path from 'node:path';
import { logger } from './logger.js';

/**
 * Ensures a directory exists, creating it recursively if needed.
 */
export function ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Writes a file, creating parent directories if needed.
 * Skips if file already exists (unless force=true).
 */
export function writeFile(filePath: string, content: string, force = false): boolean {
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
export function readJSON<T = Record<string, unknown>>(filePath: string): T | null {
    if (!fs.existsSync(filePath)) return null;
    try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

/**
 * Deep merges source into target JSON and writes back to file.
 */
export function mergeJSON(filePath: string, data: Record<string, unknown>): void {
    const existing = readJSON(filePath) ?? {};
    const merged = deepMerge(existing, data);
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
}

/**
 * Deep merge two objects.
 */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
    const result = { ...target };
    for (const key of Object.keys(source)) {
        if (
            source[key] &&
            typeof source[key] === 'object' &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === 'object' &&
            !Array.isArray(target[key])
        ) {
            result[key] = deepMerge(
                target[key] as Record<string, unknown>,
                source[key] as Record<string, unknown>,
            );
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

/**
 * Resolves the .claude directory path relative to project root.
 */
export function getClaudeDir(projectRoot?: string): string {
    return path.join(projectRoot ?? process.cwd(), '.claude');
}

/**
 * Checks if the current directory is a Claude-configured project.
 */
export function isClaudeProject(projectRoot?: string): boolean {
    const claudeDir = getClaudeDir(projectRoot);
    return fs.existsSync(claudeDir);
}
