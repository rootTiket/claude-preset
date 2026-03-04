/**
 * `claude-kit add rule <name>` command
 * Creates a rule file in .claude/rules/
 */
import inquirer from 'inquirer';
import path from 'node:path';
import { writeFile, getClaudeDir, isClaudeProject } from '../utils/file-ops.js';
import { logger } from '../utils/logger.js';

export async function addRuleCommand(name: string): Promise<void> {
    if (!isClaudeProject()) {
        logger.error('Not a Claude project. Run "claude-kit init" first.');
        return;
    }

    logger.title(`📏 Creating rule: ${name}`);

    const answers = await inquirer.prompt([
        {
            type: 'editor',
            name: 'content',
            message: 'Rule content (will open editor):',
            default: `# ${name
                .split('-')
                .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}\n\n## Rules\n\n- Rule 1\n- Rule 2\n`,
        },
    ]);

    const rulePath = path.join(getClaudeDir(), 'rules', `${name}.md`);
    writeFile(rulePath, answers.content.trim() + '\n');

    logger.success(`Rule "${name}" created`);
    logger.dim(`Path: .claude/rules/${name}.md`);
}
