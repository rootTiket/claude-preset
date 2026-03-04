/**
 * `claude-kit init` command
 * Creates the .claude/ directory structure and optional CLAUDE.md
 */
import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'node:fs';
import { ensureDir, writeFile } from '../utils/file-ops.js';
import { generateClaudeMd } from '../templates/claude-md.js';
import { logger } from '../utils/logger.js';

interface InitOptions {
    defaults?: boolean;
}

export async function initCommand(options: InitOptions): Promise<void> {
    const projectRoot = process.cwd();
    const claudeDir = path.join(projectRoot, '.claude');

    if (fs.existsSync(claudeDir)) {
        const { overwrite } = options.defaults
            ? { overwrite: false }
            : await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: '.claude/ directory already exists. Continue and merge?',
                    default: true,
                },
            ]);
        if (!overwrite && !options.defaults) return;
    }

    logger.title('🚀 Claude Kit — Project Initialization');

    // Gather project info (or use defaults)
    const answers = options.defaults
        ? {
            projectName: path.basename(projectRoot),
            framework: 'Next.js',
            packageManager: 'npm',
            language: 'TypeScript',
            architecture: '',
            createClaudeMd: true,
        }
        : await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Project name:',
                default: path.basename(projectRoot),
            },
            {
                type: 'list',
                name: 'framework',
                message: 'Framework:',
                choices: ['Next.js', 'React (Vite)', 'Vue', 'Svelte', 'Express', 'NestJS', 'Other'],
            },
            {
                type: 'list',
                name: 'packageManager',
                message: 'Package manager:',
                choices: ['npm', 'pnpm', 'yarn', 'bun'],
            },
            {
                type: 'list',
                name: 'language',
                message: 'Language:',
                choices: ['TypeScript', 'JavaScript', 'Python', 'Other'],
            },
            {
                type: 'input',
                name: 'architecture',
                message: 'Architecture pattern (optional, e.g., DDD, Clean Architecture):',
                default: '',
            },
            {
                type: 'confirm',
                name: 'createClaudeMd',
                message: 'Create CLAUDE.md template?',
                default: true,
            },
        ]);

    // Create directory structure
    const dirs = ['commands', 'rules', 'skills', 'hooks'];
    for (const dir of dirs) {
        ensureDir(path.join(claudeDir, dir));
    }
    logger.success('Created .claude/ directory structure');

    // Create settings.json
    const settingsPath = path.join(claudeDir, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
        writeFile(settingsPath, JSON.stringify({ permissions: {}, hooks: {} }, null, 2) + '\n');
    }

    // Create .mcp.json
    const mcpPath = path.join(claudeDir, '.mcp.json');
    if (!fs.existsSync(mcpPath)) {
        writeFile(mcpPath, JSON.stringify({ mcpServers: {} }, null, 2) + '\n');
    }

    // Create CLAUDE.md
    if (answers.createClaudeMd) {
        const claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
        if (!fs.existsSync(claudeMdPath)) {
            const content = generateClaudeMd({
                projectName: answers.projectName,
                framework: answers.framework,
                packageManager: answers.packageManager,
                language: answers.language,
                architecture: answers.architecture || undefined,
            });
            writeFile(claudeMdPath, content);
        } else {
            logger.warn('CLAUDE.md already exists, skipping');
        }
    }

    logger.title('✅ Initialization complete!');
    logger.info('Directory structure:');
    console.log(`  .claude/
  ├── commands/
  ├── rules/
  ├── skills/
  ├── hooks/
  ├── settings.json
  └── .mcp.json`);
    if (answers.createClaudeMd) {
        console.log(`  CLAUDE.md`);
    }
    console.log('');
    logger.info('Next steps:');
    logger.dim('  claude-kit add skill <name>  — Add a skill');
    logger.dim('  claude-kit add hook          — Add a hook');
    logger.dim('  claude-kit add mcp <name>    — Add an MCP server');
    logger.dim('  claude-kit preset <name>     — Apply a preset profile');
}
