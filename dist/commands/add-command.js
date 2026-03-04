/**
 * `claude-kit add command <name>` command
 * Creates a slash command file in .claude/commands/
 */
import inquirer from 'inquirer';
import path from 'node:path';
import { writeFile, getClaudeDir, isClaudeProject } from '../utils/file-ops.js';
import { logger } from '../utils/logger.js';
export async function addCommandCommand(name) {
    if (!isClaudeProject()) {
        logger.error('Not a Claude project. Run "claude-kit init" first.');
        return;
    }
    logger.title(`📝 Creating slash command: /${name}`);
    const answers = await inquirer.prompt([
        {
            type: 'editor',
            name: 'content',
            message: 'Command prompt content (will open editor):',
            default: `# /${name}\n\nDescribe what this command does.\n\n## Steps\n\n1. Step 1\n2. Step 2\n`,
        },
    ]);
    const commandPath = path.join(getClaudeDir(), 'commands', `${name}.md`);
    writeFile(commandPath, answers.content.trim() + '\n');
    logger.success(`Slash command "/${name}" created`);
    logger.dim(`Path: .claude/commands/${name}.md`);
    logger.dim('Usage in Claude: type "/" and select your command');
}
//# sourceMappingURL=add-command.js.map