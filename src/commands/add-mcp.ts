/**
 * `claude-kit add mcp <name>` command
 * Adds MCP server configuration to .claude/.mcp.json
 */
import inquirer from 'inquirer';
import path from 'node:path';
import { getClaudeDir, isClaudeProject, mergeJSON, readJSON } from '../utils/file-ops.js';
import { MCP_PRESETS, getMcpPreset, type McpServerConfig } from '../templates/mcp-presets.js';
import { logger } from '../utils/logger.js';

interface AddMcpOptions {
    preset?: boolean;
}

export async function addMcpCommand(name: string | undefined, options: AddMcpOptions): Promise<void> {
    if (!isClaudeProject()) {
        logger.error('Not a Claude project. Run "claude-kit init" first.');
        return;
    }

    logger.title('🔌 Add MCP Server');

    if (name && !options.preset) {
        // Check if it's a preset name
        const preset = getMcpPreset(name);
        if (preset) {
            return applyMcpPreset(name);
        }
        // Custom server with given name
        return addCustomMcp(name);
    }

    // Interactive mode
    const { mode } = await inquirer.prompt([
        {
            type: 'list',
            name: 'mode',
            message: 'How would you like to add an MCP server?',
            choices: [
                { name: 'Choose from presets', value: 'preset' },
                { name: 'Configure custom server', value: 'custom' },
            ],
        },
    ]);

    if (mode === 'preset') {
        const { presetName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'presetName',
                message: 'Select an MCP server:',
                choices: MCP_PRESETS.map((p) => ({
                    name: `${p.name} — ${p.description}`,
                    value: p.name,
                })),
            },
        ]);
        return applyMcpPreset(presetName);
    }

    const { serverName } = await inquirer.prompt([
        { type: 'input', name: 'serverName', message: 'Server name:' },
    ]);
    return addCustomMcp(serverName);
}

async function applyMcpPreset(presetName: string): Promise<void> {
    const preset = getMcpPreset(presetName);
    if (!preset) {
        logger.error(`MCP preset "${presetName}" not found.`);
        return;
    }

    // Ask for env vars if needed
    const config: McpServerConfig = { ...preset.config };
    if (preset.envVarsNeeded.length > 0) {
        logger.info(`This server requires ${preset.envVarsNeeded.length} environment variable(s):`);

        const envAnswers = await inquirer.prompt(
            preset.envVarsNeeded.map((envVar) => ({
                type: 'input',
                name: envVar,
                message: `${envVar}:`,
                default: '',
            })),
        );

        config.env = {};
        for (const envVar of preset.envVarsNeeded) {
            if (envAnswers[envVar]) {
                config.env[envVar] = envAnswers[envVar];
            }
        }
        if (Object.keys(config.env).length === 0) {
            delete config.env;
            logger.warn('No env vars provided. You can add them later in .claude/.mcp.json');
        }
    }

    const mcpPath = path.join(getClaudeDir(), '.mcp.json');
    mergeJSON(mcpPath, { mcpServers: { [preset.name]: config } });

    logger.success(`MCP server "${preset.name}" added`);
    logger.dim(`Configuration saved to .claude/.mcp.json`);
}

async function addCustomMcp(name: string): Promise<void> {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'command', message: 'Command to run:', default: 'npx' },
        {
            type: 'input',
            name: 'args',
            message: 'Arguments (space-separated):',
            filter: (input: string) => input.split(/\s+/).filter(Boolean),
        },
        {
            type: 'confirm',
            name: 'hasEnv',
            message: 'Does this server need environment variables?',
            default: false,
        },
    ]);

    const config: McpServerConfig = {
        command: answers.command,
        args: answers.args,
    };

    if (answers.hasEnv) {
        const { envPairs } = await inquirer.prompt([
            {
                type: 'input',
                name: 'envPairs',
                message: 'Environment variables (KEY=VALUE, comma-separated):',
            },
        ]);

        config.env = {};
        for (const pair of envPairs.split(',')) {
            const [key, ...rest] = pair.trim().split('=');
            if (key) config.env[key.trim()] = rest.join('=').trim();
        }
    }

    const mcpPath = path.join(getClaudeDir(), '.mcp.json');
    mergeJSON(mcpPath, { mcpServers: { [name]: config } });

    logger.success(`MCP server "${name}" added`);
    logger.dim(`Configuration saved to .claude/.mcp.json`);
}
