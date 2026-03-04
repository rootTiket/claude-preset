import yaml from 'js-yaml';

export interface SkillFrontmatter {
    name: string;
    description: string;
    license?: string;
    'allowed-tools'?: string;
    compatibility?: string;
    metadata?: Record<string, string>;
}

/**
 * Parse YAML frontmatter from a SKILL.md file content.
 */
export function parseFrontmatter(content: string): {
    frontmatter: SkillFrontmatter | null;
    body: string;
    errors: string[];
} {
    const errors: string[] = [];

    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) {
        errors.push('Missing YAML frontmatter delimiters (--- ... ---)');
        return { frontmatter: null, body: content, errors };
    }

    const [, yamlStr, body] = match;

    try {
        const parsed = yaml.load(yamlStr) as SkillFrontmatter;

        if (!parsed || typeof parsed !== 'object') {
            errors.push('Frontmatter is empty or not a valid YAML object');
            return { frontmatter: null, body, errors };
        }

        if (!parsed.name) errors.push('Missing required field: name');
        if (!parsed.description) errors.push('Missing required field: description');

        return { frontmatter: parsed, body, errors };
    } catch (err) {
        errors.push(`YAML parse error: ${(err as Error).message}`);
        return { frontmatter: null, body, errors };
    }
}

/**
 * Generate YAML frontmatter string from a SkillFrontmatter object.
 */
export function generateFrontmatter(data: SkillFrontmatter): string {
    const yamlStr = yaml.dump(data, {
        lineWidth: -1,
        quotingType: '"',
        forceQuotes: false,
    }).trim();

    return `---\n${yamlStr}\n---`;
}
