/**
 * Preset profiles for different project types.
 * Each preset includes practical development skills.
 */
import type { SkillTemplate } from '../templates/skill-templates.js';

export interface PresetProfile {
    name: string;
    description: string;
    claudeMd: {
        projectName: string;
        framework: string;
        packageManager: string;
        language: string;
        architecture?: string;
        devCommand?: string;
        buildCommand?: string;
        lintCommand?: string;
        testCommand?: string;
    };
    skills: Array<{
        name: string;
        template: SkillTemplate;
        description: string;
    }>;
    hooks: string[];
    mcpServers: string[];
    rules: Array<{ name: string; content: string }>;
    commands: Array<{ name: string; content: string }>;
}

// ─── Common skill sets ──────────────────────────────────────────

const STANDARD_SKILLS: PresetProfile['skills'] = [
    {
        name: 'feature',
        template: 'feature',
        description: 'New feature development workflow. Use when adding new functionality to the project. Analyzes requirements, plans implementation, writes code, and verifies the result.',
    },
    {
        name: 'fix',
        template: 'fix',
        description: 'Bug fix workflow. Use when something is broken or behaving unexpectedly. Reproduces the issue, diagnoses root cause, applies minimal fix, and verifies.',
    },
    {
        name: 'docs',
        template: 'docs',
        description: 'Documentation workflow. Use when creating or updating README, API docs, JSDoc/TSDoc, or any project documentation.',
    },
];

// ─── Presets ─────────────────────────────────────────────────────

export const PRESETS: Record<string, PresetProfile> = {
    nextjs: {
        name: 'nextjs',
        description: 'Generic Next.js project setup',
        claudeMd: {
            projectName: 'My Next.js App',
            framework: 'Next.js',
            packageManager: 'npm',
            language: 'TypeScript',
            devCommand: 'npm run dev',
            buildCommand: 'npm run build',
            lintCommand: 'npm run lint',
            testCommand: 'npm test',
        },
        skills: STANDARD_SKILLS,
        hooks: ['format-on-save'],
        mcpServers: [],
        rules: [],
        commands: [],
    },

    react: {
        name: 'react',
        description: 'Generic React (Vite) project setup',
        claudeMd: {
            projectName: 'My React App',
            framework: 'React (Vite)',
            packageManager: 'npm',
            language: 'TypeScript',
            devCommand: 'npm run dev',
            buildCommand: 'npm run build',
            lintCommand: 'npm run lint',
            testCommand: 'npm test',
        },
        skills: STANDARD_SKILLS,
        hooks: ['format-on-save', 'lint-after-edit'],
        mcpServers: [],
        rules: [],
        commands: [],
    },
};

export function getPreset(name: string): PresetProfile | undefined {
    return PRESETS[name];
}

export function listPresets(): PresetProfile[] {
    return Object.values(PRESETS);
}
