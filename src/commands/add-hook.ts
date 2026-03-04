/**
 * `claude-kit add hook` command
 * Adds hook configuration to .claude/settings.json
 */
import inquirer from 'inquirer';
import path from 'node:path';
import { getClaudeDir, isClaudeProject, mergeJSON, readJSON } from '../utils/file-ops.js';
import { HOOK_EVENTS, HOOK_PRESETS, getHookPreset, type HookDefinition } from '../templates/hooks-presets.js';
import { logger } from '../utils/logger.js';

interface AddHookOptions {
    preset?: string;
}

export async function addHookCommand(options: AddHookOptions): Promise<void> {
    if (!isClaudeProject()) {
        logger.error('Not a Claude project. Run "claude-kit init" first.');
        return;
    }

    logger.title('🪝 Add Hook Configuration');

    if (options.preset) {
        return applyHookPreset(options.preset);
    }

    const { mode } = await inquirer.prompt([
        {
            type: 'list',
            name: 'mode',
            message: 'How would you like to add a hook?',
            choices: [
                { name: 'Choose from presets', value: 'preset' },
                { name: 'Create custom hook', value: 'custom' },
            ],
        },
    ]);

    if (mode === 'preset') {
        const { presetName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'presetName',
                message: 'Select a hook preset:',
                choices: HOOK_PRESETS.map((p) => ({
                    name: `${p.name} — ${p.description}`,
                    value: p.name,
                })),
            },
        ]);
        return applyHookPreset(presetName);
    }

    // Custom hook
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'event',
            message: 'Hook event:',
            choices: HOOK_EVENTS.map((e) => e),
        },
        {
            type: 'list',
            name: 'handlerType',
            message: 'Handler type:',
            choices: [
                { name: 'command — Run a shell command', value: 'command' },
                { name: 'prompt — Send prompt to model for yes/no decision', value: 'prompt' },
                { name: 'http — Send HTTP POST request', value: 'http' },
            ],
        },
        {
            type: 'input',
            name: 'description',
            message: 'Hook description:',
        },
    ]);

    let handler: Record<string, string> = { type: answers.handlerType };

    if (answers.handlerType === 'command') {
        const { command } = await inquirer.prompt([
            { type: 'input', name: 'command', message: 'Shell command to run:' },
        ]);
        handler.command = command;
    } else if (answers.handlerType === 'prompt') {
        const { prompt } = await inquirer.prompt([
            { type: 'input', name: 'prompt', message: 'Prompt text (yes/no decision):' },
        ]);
        handler.prompt = prompt;
    } else {
        const { url } = await inquirer.prompt([
            { type: 'input', name: 'url', message: 'HTTP POST URL:' },
        ]);
        handler.url = url;
    }

    // Optional matcher
    const { addMatcher } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'addMatcher',
            message: 'Add a matcher (filter when this hook fires)?',
            default: false,
        },
    ]);

    let matcher: Record<string, string> | undefined;
    if (addMatcher) {
        const matcherAnswers = await inquirer.prompt([
            { type: 'input', name: 'tool_name', message: 'Tool name pattern (optional):' },
            { type: 'input', name: 'file_pattern', message: 'File pattern (optional, e.g., *.ts):' },
            { type: 'input', name: 'command_pattern', message: 'Command pattern regex (optional):' },
        ]);
        matcher = {};
        if (matcherAnswers.tool_name) matcher.tool_name = matcherAnswers.tool_name;
        if (matcherAnswers.file_pattern) matcher.file_pattern = matcherAnswers.file_pattern;
        if (matcherAnswers.command_pattern) matcher.command_pattern = matcherAnswers.command_pattern;
        if (Object.keys(matcher).length === 0) matcher = undefined;
    }

    const hookDef: Record<string, unknown> = {
        description: answers.description,
        handler,
    };
    if (matcher) hookDef.matcher = matcher;

    const settingsPath = path.join(getClaudeDir(), 'settings.json');
    const existing = readJSON<Record<string, unknown>>(settingsPath) ?? {};
    const hooks = (existing.hooks as Record<string, unknown[]>) ?? {};

    if (!hooks[answers.event]) hooks[answers.event] = [];
    (hooks[answers.event] as unknown[]).push(hookDef);

    mergeJSON(settingsPath, { hooks });

    logger.success(`Hook added: ${answers.event} → ${answers.handlerType}`);
    logger.dim(`Configuration saved to .claude/settings.json`);
}

async function applyHookPreset(presetName: string): Promise<void> {
    const preset = getHookPreset(presetName);
    if (!preset) {
        logger.error(`Hook preset "${presetName}" not found.`);
        logger.info(`Available presets: ${HOOK_PRESETS.map((p) => p.name).join(', ')}`);
        return;
    }

    const settingsPath = path.join(getClaudeDir(), 'settings.json');
    const existing = readJSON<Record<string, unknown>>(settingsPath) ?? {};
    const hooks = (existing.hooks as Record<string, unknown[]>) ?? {};

    for (const hookDef of preset.hooks) {
        if (!hooks[hookDef.event]) hooks[hookDef.event] = [];
        (hooks[hookDef.event] as unknown[]).push({
            description: hookDef.description,
            matcher: hookDef.matcher,
            handler: hookDef.handler,
        });
    }

    mergeJSON(settingsPath, { hooks });

    logger.success(`Hook preset "${preset.name}" applied (${preset.hooks.length} hooks)`);
    for (const h of preset.hooks) {
        logger.list(h.event, h.description);
    }
}
