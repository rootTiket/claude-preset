/**
 * `claude-kit preset <name>` command
 * Applies a predefined preset profile to the current project
 */
import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'node:fs';
import { ensureDir, writeFile, getClaudeDir, mergeJSON } from '../utils/file-ops.js';
import { generateClaudeMd } from '../templates/claude-md.js';
import { getSkillTemplate } from '../templates/skill-templates.js';
import { getHookPreset } from '../templates/hooks-presets.js';
import { getMcpPreset } from '../templates/mcp-presets.js';
import { getPreset, listPresets } from '../presets/profiles.js';
import { logger } from '../utils/logger.js';
export async function presetCommand(name, options) {
    logger.title('📦 Claude Kit — Apply Preset');
    // If no name given, show list
    if (!name) {
        const presets = listPresets();
        const { selectedPreset } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedPreset',
                message: 'Select a preset profile:',
                choices: presets.map((p) => ({
                    name: `${p.name} — ${p.description}`,
                    value: p.name,
                })),
            },
        ]);
        name = selectedPreset;
    }
    const preset = getPreset(name);
    if (!preset) {
        logger.error(`Preset "${name}" not found.`);
        logger.info(`Available presets: ${listPresets().map((p) => p.name).join(', ')}`);
        return;
    }
    // Show what will be applied
    logger.info(`Preset: ${preset.name}`);
    logger.dim(`  ${preset.description}`);
    console.log('');
    logger.info('This will configure:');
    if (preset.skills.length > 0)
        logger.dim(`  • ${preset.skills.length} skill(s)`);
    if (preset.hooks.length > 0)
        logger.dim(`  • ${preset.hooks.length} hook preset(s)`);
    if (preset.mcpServers.length > 0)
        logger.dim(`  • ${preset.mcpServers.length} MCP server(s)`);
    if (preset.commands.length > 0)
        logger.dim(`  • ${preset.commands.length} slash command(s)`);
    if (preset.rules.length > 0)
        logger.dim(`  • ${preset.rules.length} rule(s)`);
    console.log('');
    if (!options.yes) {
        const { proceed } = await inquirer.prompt([
            { type: 'confirm', name: 'proceed', message: 'Apply this preset?', default: true },
        ]);
        if (!proceed)
            return;
    }
    await applyPreset(preset);
}
async function applyPreset(preset) {
    const claudeDir = getClaudeDir();
    // Create base directory structure
    for (const dir of ['commands', 'rules', 'skills', 'hooks']) {
        ensureDir(path.join(claudeDir, dir));
    }
    // Create settings.json if missing
    const settingsPath = path.join(claudeDir, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
        writeFile(settingsPath, JSON.stringify({ permissions: {}, hooks: {} }, null, 2) + '\n');
    }
    // Create .mcp.json if missing
    const mcpPath = path.join(claudeDir, '.mcp.json');
    if (!fs.existsSync(mcpPath)) {
        writeFile(mcpPath, JSON.stringify({ mcpServers: {} }, null, 2) + '\n');
    }
    // Apply CLAUDE.md
    const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
    if (!fs.existsSync(claudeMdPath)) {
        const content = generateClaudeMd(preset.claudeMd);
        writeFile(claudeMdPath, content);
    }
    else {
        logger.warn('CLAUDE.md already exists, skipping');
    }
    // Apply skills
    for (const skill of preset.skills) {
        const skillDir = path.join(claudeDir, 'skills', skill.name);
        ensureDir(skillDir);
        const content = getSkillTemplate(skill.template, {
            name: skill.name,
            description: skill.description,
        });
        writeFile(path.join(skillDir, 'SKILL.md'), content);
    }
    // Apply hooks
    for (const hookPresetName of preset.hooks) {
        const hookPreset = getHookPreset(hookPresetName);
        if (!hookPreset)
            continue;
        const existing = fs.existsSync(settingsPath)
            ? JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
            : {};
        const hooks = existing.hooks ?? {};
        for (const hookDef of hookPreset.hooks) {
            if (!hooks[hookDef.event])
                hooks[hookDef.event] = [];
            hooks[hookDef.event].push({
                description: hookDef.description,
                matcher: hookDef.matcher,
                handler: hookDef.handler,
            });
        }
        mergeJSON(settingsPath, { hooks });
        logger.success(`Hook preset "${hookPresetName}" applied`);
    }
    // Apply MCP servers
    for (const mcpName of preset.mcpServers) {
        const mcpPreset = getMcpPreset(mcpName);
        if (!mcpPreset)
            continue;
        const config = { ...mcpPreset.config };
        // Remove empty env vars for cleaner config
        if (config.env) {
            const hasValues = Object.values(config.env).some((v) => v);
            if (!hasValues)
                delete config.env;
        }
        mergeJSON(mcpPath, { mcpServers: { [mcpName]: config } });
        logger.success(`MCP server "${mcpName}" added`);
        if (mcpPreset.envVarsNeeded.length > 0) {
            logger.warn(`  → Set env vars in .claude/.mcp.json: ${mcpPreset.envVarsNeeded.join(', ')}`);
        }
    }
    // Apply commands
    for (const cmd of preset.commands) {
        writeFile(path.join(claudeDir, 'commands', `${cmd.name}.md`), cmd.content.trim() + '\n');
    }
    // Apply rules
    for (const rule of preset.rules) {
        writeFile(path.join(claudeDir, 'rules', `${rule.name}.md`), rule.content.trim() + '\n');
    }
    logger.title('✅ Preset applied successfully!');
    logger.dim('Run "claude-kit list" to see the full configuration.');
    logger.dim('Run "claude-kit validate" to check compliance.');
}
//# sourceMappingURL=preset.js.map