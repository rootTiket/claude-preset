/**
 * CLAUDE.md template generator.
 * Creates a project-specific CLAUDE.md based on framework and package manager.
 */
export function generateClaudeMd(ctx) {
    const pm = ctx.packageManager;
    const dev = ctx.devCommand ?? `${pm} ${pm === 'npm' ? 'run ' : ''}dev`;
    const build = ctx.buildCommand ?? `${pm} ${pm === 'npm' ? 'run ' : ''}build`;
    const lint = ctx.lintCommand ?? `${pm} ${pm === 'npm' ? 'run ' : ''}lint`;
    const test = ctx.testCommand ?? `${pm} ${pm === 'npm' ? 'run ' : ''}test`;
    return `# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **${ctx.framework}** project using **${ctx.language}**.

- Package manager: **${pm}**
${ctx.architecture ? `- Architecture pattern: **${ctx.architecture}**\n` : ''}
## Development Commands

### Running the Development Server

\`\`\`bash
${dev}
\`\`\`

### Building

\`\`\`bash
${build}
\`\`\`

### Linting

\`\`\`bash
${lint}
\`\`\`

### Testing

\`\`\`bash
${test}
\`\`\`

## Architecture

<!-- Add your project architecture description here -->

## Folder Structure Overview

\`\`\`
src/
├─ ...
\`\`\`

## Code Quality Tools

<!-- List your code quality tools (ESLint, Prettier, etc.) -->

## Instructions

- Create all files with UTF-8 encoding.
- Ensure all text files are saved without BOM.
`;
}
//# sourceMappingURL=claude-md.js.map