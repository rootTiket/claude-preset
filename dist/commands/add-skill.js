/**
 * `claude-kit add skill <name>` command
 * Creates a skill folder with SKILL.md following Claude Skill Building Guide rules
 */
import inquirer from 'inquirer';
import path from 'node:path';
import { ensureDir, writeFile, getClaudeDir, isClaudeProject } from '../utils/file-ops.js';
import { validateSkillName, validateDescription } from '../utils/naming.js';
import { getSkillTemplate, TEMPLATE_DESCRIPTIONS } from '../templates/skill-templates.js';
import { logger } from '../utils/logger.js';
export async function addSkillCommand(name, options) {
    if (!isClaudeProject()) {
        logger.error('Not a Claude project. Run "claude-kit init" first.');
        return;
    }
    // Validate name
    const nameResult = validateSkillName(name);
    if (!nameResult.valid) {
        logger.error('Invalid skill name:');
        nameResult.errors.forEach((e) => logger.error(`  ${e}`));
        return;
    }
    logger.title(`🔧 Creating skill: ${name}`);
    // Check if skill already exists
    const skillDir = path.join(getClaudeDir(), 'skills', name);
    const exists = await checkExists(skillDir);
    if (exists === false)
        return;
    // Gather info
    const answers = await inquirer.prompt([
        ...(options.template
            ? []
            : [
                {
                    type: 'list',
                    name: 'template',
                    message: 'Skill template:',
                    choices: Object.entries(TEMPLATE_DESCRIPTIONS).map(([value, description]) => ({
                        name: `${value} — ${description}`,
                        value,
                    })),
                },
            ]),
        ...(options.description
            ? []
            : [
                {
                    type: 'input',
                    name: 'description',
                    message: 'Skill description (WHAT it does + WHEN to use):',
                    validate: (input) => {
                        if (!input)
                            return 'Description is required';
                        if (input.length > 1024)
                            return 'Must be under 1024 characters';
                        if (/<[^>]+>/.test(input))
                            return 'Must not contain XML tags (< >)';
                        return true;
                    },
                },
            ]),
        {
            type: 'confirm',
            name: 'createScripts',
            message: 'Create scripts/ directory?',
            default: false,
        },
    ]);
    const template = (options.template ?? answers.template);
    const description = options.description ?? answers.description;
    // Validate description
    const descResult = validateDescription(description);
    if (!descResult.valid) {
        logger.error('Invalid description:');
        descResult.errors.forEach((e) => logger.error(`  ${e}`));
        return;
    }
    descResult.warnings.forEach((w) => logger.warn(w));
    // Create skill directory structure
    ensureDir(skillDir);
    // Generate SKILL.md (exactly this name — case-sensitive requirement)
    const skillContent = getSkillTemplate(template, {
        name,
        description,
    });
    writeFile(path.join(skillDir, 'SKILL.md'), skillContent);
    // Create optional directories
    if (answers.createScripts)
        ensureDir(path.join(skillDir, 'scripts'));
    // NOTE: Do NOT create README.md inside skill folder (PDF rule)
    logger.title('✅ Skill created!');
    logger.info(`Path: .claude/skills/${name}/`);
    logger.dim('');
    logger.dim('Next: Edit SKILL.md to customize the instructions.');
    logger.dim('Run "claude-kit validate" to check compliance.');
}
async function checkExists(skillDir) {
    const fs = await import('node:fs');
    if (fs.existsSync(skillDir)) {
        const { proceed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'proceed',
                message: 'Skill already exists. Overwrite?',
                default: false,
            },
        ]);
        return proceed;
    }
    return true;
}
//# sourceMappingURL=add-skill.js.map