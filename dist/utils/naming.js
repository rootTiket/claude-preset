/**
 * Naming convention utilities following Claude Skill Building Guide rules:
 * - kebab-case only
 * - No spaces, underscores, or capitals
 * - Must not contain "claude" or "anthropic" (reserved)
 */
const KEBAB_CASE_REGEX = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const RESERVED_NAMES = ['claude', 'anthropic'];
export function isKebabCase(name) {
    return KEBAB_CASE_REGEX.test(name);
}
export function toKebabCase(input) {
    return input
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .replace(/[^a-z0-9-]/gi, '')
        .toLowerCase()
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
export function validateSkillName(name) {
    const errors = [];
    if (!name) {
        errors.push('Name is required');
        return { valid: false, errors };
    }
    if (!isKebabCase(name)) {
        errors.push(`Name must be kebab-case (e.g., "my-skill-name"). Got: "${name}"`);
        if (/[A-Z]/.test(name))
            errors.push('  → No capital letters allowed');
        if (/\s/.test(name))
            errors.push('  → No spaces allowed');
        if (/_/.test(name))
            errors.push('  → No underscores allowed (use hyphens)');
    }
    for (const reserved of RESERVED_NAMES) {
        if (name.toLowerCase().startsWith(reserved)) {
            errors.push(`Name must not start with "${reserved}" (reserved by Anthropic)`);
        }
    }
    return { valid: errors.length === 0, errors };
}
export function validateDescription(description) {
    const errors = [];
    const warnings = [];
    if (!description) {
        errors.push('Description is required');
        return { valid: false, errors, warnings };
    }
    if (description.length > 1024) {
        errors.push(`Description must be under 1024 characters (got ${description.length})`);
    }
    if (/<[^>]+>/.test(description)) {
        errors.push('Description must not contain XML tags (< >) — security restriction');
    }
    // Check for trigger phrases (WHAT + WHEN)
    const hasWhat = /does|creates?|generates?|manages?|analyzes?|processes?|handles?|builds?|sets? up/i.test(description);
    const hasWhen = /use when|use for|use if|trigger|invoke|activate|when user/i.test(description);
    if (!hasWhat) {
        warnings.push('Description should include WHAT the skill does');
    }
    if (!hasWhen) {
        warnings.push('Description should include WHEN to use it (trigger conditions)');
    }
    return { valid: errors.length === 0, errors, warnings };
}
//# sourceMappingURL=naming.js.map