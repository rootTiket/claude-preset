/**
 * `claude-kit validate [path]` command
 * Validates skills and configuration against Claude Skill Building Guide rules
 * Based on Reference A: Quick checklist from the PDF
 */
import fs from 'node:fs';
import path from 'node:path';
import { getClaudeDir, isClaudeProject, readJSON } from '../utils/file-ops.js';
import { validateSkillName, validateDescription } from '../utils/naming.js';
import { parseFrontmatter } from '../utils/validator.js';
import { logger } from '../utils/logger.js';

interface ValidateOptions {
    path?: string;
}

interface ValidationResult {
    file: string;
    errors: string[];
    warnings: string[];
}

export async function validateCommand(options: ValidateOptions): Promise<void> {
    if (!isClaudeProject()) {
        logger.error('Not a Claude project. Run "claude-kit init" first.');
        return;
    }

    logger.title('🔍 Claude Kit — Validation');

    const results: ValidationResult[] = [];

    if (options.path) {
        // Validate specific skill path
        const result = validateSkillDir(options.path);
        results.push(result);
    } else {
        // Validate all skills
        const skillsDir = path.join(getClaudeDir(), 'skills');
        if (fs.existsSync(skillsDir)) {
            const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const result = validateSkillDir(path.join(skillsDir, entry.name));
                    results.push(result);
                }
            }
        }

        // Validate settings.json
        const settingsResult = validateSettings();
        if (settingsResult) results.push(settingsResult);

        // Validate .mcp.json
        const mcpResult = validateMcpConfig();
        if (mcpResult) results.push(mcpResult);
    }

    // Report
    if (results.length === 0) {
        logger.info('No skills or configurations found to validate.');
        return;
    }

    let totalErrors = 0;
    let totalWarnings = 0;

    for (const result of results) {
        const status =
            result.errors.length === 0
                ? result.warnings.length === 0
                    ? '✅'
                    : '⚠️'
                : '❌';

        console.log(`\n${status} ${path.relative(process.cwd(), result.file)}`);

        for (const error of result.errors) {
            logger.error(`  ${error}`);
            totalErrors++;
        }
        for (const warning of result.warnings) {
            logger.warn(`  ${warning}`);
            totalWarnings++;
        }
    }

    console.log('');
    if (totalErrors === 0 && totalWarnings === 0) {
        logger.success('All validations passed! 🎉');
    } else {
        if (totalErrors > 0) logger.error(`${totalErrors} error(s) found`);
        if (totalWarnings > 0) logger.warn(`${totalWarnings} warning(s) found`);
    }
}

function validateSkillDir(skillPath: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const dirName = path.basename(skillPath);

    // Check folder naming convention
    const nameResult = validateSkillName(dirName);
    if (!nameResult.valid) {
        errors.push(...nameResult.errors.map((e) => `Folder name: ${e}`));
    }

    // Check SKILL.md exists (exactly, case-sensitive)
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) {
        // Check for wrong casing
        const files = fs.readdirSync(skillPath);
        const wrongCase = files.find((f) => f.toLowerCase() === 'skill.md' && f !== 'SKILL.md');
        if (wrongCase) {
            errors.push(`Found "${wrongCase}" but must be exactly "SKILL.md" (case-sensitive)`);
        } else {
            errors.push('Missing SKILL.md file (required)');
        }
        return { file: skillPath, errors, warnings };
    }

    // Check for README.md (forbidden inside skill folder)
    if (fs.existsSync(path.join(skillPath, 'README.md'))) {
        errors.push('README.md must not exist inside skill folder (use SKILL.md or references/ instead)');
    }

    // Parse and validate SKILL.md content
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const { frontmatter, errors: parseErrors } = parseFrontmatter(content);
    errors.push(...parseErrors);

    if (frontmatter) {
        // Validate name field
        if (frontmatter.name) {
            const fnResult = validateSkillName(frontmatter.name);
            if (!fnResult.valid) {
                errors.push(...fnResult.errors.map((e) => `name field: ${e}`));
            }
            // Check folder name matches
            if (frontmatter.name !== dirName) {
                warnings.push(`name field "${frontmatter.name}" doesn't match folder name "${dirName}"`);
            }
        }

        // Validate description
        if (frontmatter.description) {
            const descResult = validateDescription(frontmatter.description);
            if (!descResult.valid) {
                errors.push(...descResult.errors.map((e) => `description: ${e}`));
            }
            warnings.push(...descResult.warnings.map((w) => `description: ${w}`));
        }

        // Check for XML tags in entire frontmatter
        const yamlSection = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
        if (/<[^>]+>/.test(yamlSection)) {
            errors.push('Frontmatter must not contain XML angle brackets (< >) — security restriction');
        }

        // Check compatibility length
        if (frontmatter.compatibility && frontmatter.compatibility.length > 500) {
            errors.push('compatibility field must be 1-500 characters');
        }
    }

    return { file: skillPath, errors, warnings };
}

function validateSettings(): ValidationResult | null {
    const settingsPath = path.join(getClaudeDir(), 'settings.json');
    if (!fs.existsSync(settingsPath)) return null;

    const errors: string[] = [];
    const warnings: string[] = [];

    const settings = readJSON(settingsPath);
    if (!settings) {
        errors.push('settings.json is not valid JSON');
    }

    return errors.length > 0 || warnings.length > 0
        ? { file: settingsPath, errors, warnings }
        : null;
}

function validateMcpConfig(): ValidationResult | null {
    const mcpPath = path.join(getClaudeDir(), '.mcp.json');
    if (!fs.existsSync(mcpPath)) return null;

    const errors: string[] = [];
    const warnings: string[] = [];

    const mcp = readJSON<{ mcpServers?: Record<string, unknown> }>(mcpPath);
    if (!mcp) {
        errors.push('.mcp.json is not valid JSON');
    } else if (mcp.mcpServers) {
        for (const [name, config] of Object.entries(mcp.mcpServers)) {
            const server = config as Record<string, unknown>;
            if (!server.command) {
                errors.push(`MCP server "${name}": missing "command" field`);
            }
            if (server.env) {
                const env = server.env as Record<string, string>;
                for (const [key, value] of Object.entries(env)) {
                    if (!value) {
                        warnings.push(`MCP server "${name}": env var "${key}" is empty`);
                    }
                }
            }
        }
    }

    return errors.length > 0 || warnings.length > 0
        ? { file: mcpPath, errors, warnings }
        : null;
}
