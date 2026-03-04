import yaml from 'js-yaml';
/**
 * Parse YAML frontmatter from a SKILL.md file content.
 */
export function parseFrontmatter(content) {
    const errors = [];
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
        errors.push('Missing YAML frontmatter delimiters (--- ... ---)');
        return { frontmatter: null, body: content, errors };
    }
    const [, yamlStr, body] = match;
    try {
        const parsed = yaml.load(yamlStr);
        if (!parsed || typeof parsed !== 'object') {
            errors.push('Frontmatter is empty or not a valid YAML object');
            return { frontmatter: null, body, errors };
        }
        if (!parsed.name)
            errors.push('Missing required field: name');
        if (!parsed.description)
            errors.push('Missing required field: description');
        return { frontmatter: parsed, body, errors };
    }
    catch (err) {
        errors.push(`YAML parse error: ${err.message}`);
        return { frontmatter: null, body, errors };
    }
}
/**
 * Generate YAML frontmatter string from a SkillFrontmatter object.
 */
export function generateFrontmatter(data) {
    const yamlStr = yaml.dump(data, {
        lineWidth: -1,
        quotingType: '"',
        forceQuotes: false,
    }).trim();
    return `---\n${yamlStr}\n---`;
}
//# sourceMappingURL=validator.js.map