/**
 * `claude-kit list` command
 * Shows a summary of all Claude configurations in the current project
 */
import fs from 'node:fs';
import path from 'node:path';
import { getClaudeDir, isClaudeProject, readJSON } from '../utils/file-ops.js';
import { parseFrontmatter } from '../utils/validator.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

export async function listCommand(): Promise<void> {
    if (!isClaudeProject()) {
        logger.error('Not a Claude project. Run "claude-kit init" first.');
        return;
    }

    const claudeDir = getClaudeDir();

    logger.title('📋 Claude Kit — Project Configuration');

    // CLAUDE.md
    const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
    console.log(chalk.bold('CLAUDE.md'));
    if (fs.existsSync(claudeMdPath)) {
        const stat = fs.statSync(claudeMdPath);
        logger.success(`  Found (${(stat.size / 1024).toFixed(1)} KB)`);
    } else {
        logger.warn('  Not found');
    }

    // Skills
    console.log('');
    console.log(chalk.bold('Skills'));
    const skillsDir = path.join(claudeDir, 'skills');
    if (fs.existsSync(skillsDir)) {
        const skills = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
        if (skills.length === 0) {
            logger.dim('  No skills configured');
        } else {
            for (const skill of skills) {
                const skillMdPath = path.join(skillsDir, skill.name, 'SKILL.md');
                if (fs.existsSync(skillMdPath)) {
                    const content = fs.readFileSync(skillMdPath, 'utf-8');
                    const { frontmatter } = parseFrontmatter(content);
                    const desc = frontmatter?.description
                        ? frontmatter.description.substring(0, 60) + (frontmatter.description.length > 60 ? '...' : '')
                        : '(no description)';
                    logger.list(skill.name, desc);
                } else {
                    logger.list(skill.name, chalk.red('⚠ Missing SKILL.md'));
                }
            }
        }
    } else {
        logger.dim('  No skills directory');
    }

    // Hooks
    console.log('');
    console.log(chalk.bold('Hooks'));
    const settingsPath = path.join(claudeDir, 'settings.json');
    const settings = readJSON<{ hooks?: Record<string, unknown[]> }>(settingsPath);
    if (settings?.hooks && Object.keys(settings.hooks).length > 0) {
        for (const [event, hooks] of Object.entries(settings.hooks)) {
            logger.list(event, `${(hooks as unknown[]).length} handler(s)`);
        }
    } else {
        logger.dim('  No hooks configured');
    }

    // MCP Servers
    console.log('');
    console.log(chalk.bold('MCP Servers'));
    const mcpPath = path.join(claudeDir, '.mcp.json');
    const mcp = readJSON<{ mcpServers?: Record<string, { command: string }> }>(mcpPath);
    if (mcp?.mcpServers && Object.keys(mcp.mcpServers).length > 0) {
        for (const [name, config] of Object.entries(mcp.mcpServers)) {
            logger.list(name, config.command ?? '(unknown)');
        }
    } else {
        logger.dim('  No MCP servers configured');
    }

    // Commands
    console.log('');
    console.log(chalk.bold('Slash Commands'));
    const commandsDir = path.join(claudeDir, 'commands');
    if (fs.existsSync(commandsDir)) {
        const commands = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.md'));
        if (commands.length === 0) {
            logger.dim('  No commands configured');
        } else {
            for (const cmd of commands) {
                logger.list(`/${cmd.replace('.md', '')}`, cmd);
            }
        }
    } else {
        logger.dim('  No commands directory');
    }

    // Rules
    console.log('');
    console.log(chalk.bold('Rules'));
    const rulesDir = path.join(claudeDir, 'rules');
    if (fs.existsSync(rulesDir)) {
        const rules = fs.readdirSync(rulesDir).filter((f) => f.endsWith('.md'));
        if (rules.length === 0) {
            logger.dim('  No rules configured');
        } else {
            for (const rule of rules) {
                logger.list(rule.replace('.md', ''), rule);
            }
        }
    } else {
        logger.dim('  No rules directory');
    }

    console.log('');
}
