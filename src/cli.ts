#!/usr/bin/env node

/**
 * claude-kit — CLI toolkit for managing Claude Code configurations
 *
 * Manages skills, hooks, MCP servers, slash commands, and rules
 * following the Anthropic Claude Skill Building Guide.
 */
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addSkillCommand } from './commands/add-skill.js';
import { addHookCommand } from './commands/add-hook.js';
import { addMcpCommand } from './commands/add-mcp.js';
import { addCommandCommand } from './commands/add-command.js';
import { addRuleCommand } from './commands/add-rule.js';
import { validateCommand } from './commands/validate.js';
import { listCommand } from './commands/list.js';
import { presetCommand } from './commands/preset.js';

const program = new Command();

program
    .name('claude-kit')
    .description('CLI toolkit for managing Claude Code configurations (skills, hooks, MCP, commands, rules)')
    .version('1.0.0');

// ─── init ───────────────────────────────────────────────────────
program
    .command('init')
    .description('Initialize .claude/ directory structure in the current project')
    .option('-d, --defaults', 'Use default settings (non-interactive)')
    .action(initCommand);

// ─── add ────────────────────────────────────────────────────────
const add = program
    .command('add')
    .description('Add a new skill, hook, MCP server, command, or rule');

add
    .command('skill <name>')
    .description('Create a new skill folder with SKILL.md')
    .option('-t, --template <type>', 'Template type: feature, fix, refactor, docs, test, review, blank')
    .option('--description <text>', 'Skill description')
    .action(addSkillCommand);

add
    .command('hook')
    .description('Add a hook configuration to settings.json')
    .option('-p, --preset <name>', 'Apply a hook preset (e.g., format-on-save, lint-after-edit)')
    .action(addHookCommand);

add
    .command('mcp [name]')
    .description('Add an MCP server configuration')
    .option('-p, --preset', 'Choose from preset servers')
    .action(addMcpCommand);

add
    .command('command <name>')
    .description('Create a new slash command')
    .action(addCommandCommand);

add
    .command('rule <name>')
    .description('Create a new rule file')
    .action(addRuleCommand);

// ─── validate ───────────────────────────────────────────────────
program
    .command('validate')
    .description('Validate skills and configuration against Claude Skill Building Guide rules')
    .option('-p, --path <path>', 'Validate a specific skill path')
    .action(validateCommand);

// ─── list ───────────────────────────────────────────────────────
program
    .command('list')
    .alias('ls')
    .description('Show current project Claude configuration summary')
    .action(listCommand);

// ─── preset ─────────────────────────────────────────────────────
program
    .command('preset [name]')
    .description('Apply a predefined preset profile (e.g., nextjs, react)')
    .option('-y, --yes', 'Skip confirmation prompt')
    .action(presetCommand);

program.parse();
