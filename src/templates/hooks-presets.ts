/**
 * Hook presets for common Claude Code automation patterns.
 *
 * Claude Code hooks support 15 lifecycle events with 3 handler types:
 * - command: runs a shell command
 * - prompt: sends a prompt to a model for yes/no decisions
 * - http: sends HTTP POST request
 */

export interface HookHandler {
    type: 'command' | 'prompt' | 'http';
    command?: string;
    prompt?: string;
    url?: string;
}

export interface HookMatcher {
    tool_name?: string;
    file_pattern?: string;
    command_pattern?: string;
}

export interface HookDefinition {
    event: string;
    description: string;
    matcher?: HookMatcher;
    handler: HookHandler;
}

export interface HookPreset {
    name: string;
    description: string;
    hooks: HookDefinition[];
}

export const HOOK_EVENTS = [
    'PreToolExecution',
    'PostToolExecution',
    'PreFileEdit',
    'PostFileEdit',
    'PreFileCreate',
    'PostFileCreate',
    'PreFileDelete',
    'PostFileDelete',
    'PreCommand',
    'PostCommand',
    'SessionStart',
    'SessionEnd',
    'Notification',
    'PreSubagentStart',
    'PostSubagentEnd',
] as const;

export const HOOK_PRESETS: HookPreset[] = [
    {
        name: 'format-on-save',
        description: 'Auto-format files after Claude edits them',
        hooks: [
            {
                event: 'PostFileEdit',
                description: 'Run prettier on edited files',
                matcher: { file_pattern: '*.{ts,tsx,js,jsx,css,json,md}' },
                handler: {
                    type: 'command',
                    command: 'npx prettier --write "$FILE_PATH"',
                },
            },
        ],
    },
    {
        name: 'lint-after-edit',
        description: 'Run linter after code changes',
        hooks: [
            {
                event: 'PostFileEdit',
                description: 'Run ESLint on edited TypeScript/JavaScript files',
                matcher: { file_pattern: '*.{ts,tsx,js,jsx}' },
                handler: {
                    type: 'command',
                    command: 'npx eslint --fix "$FILE_PATH"',
                },
            },
        ],
    },
    {
        name: 'block-dangerous-commands',
        description: 'Prevent destructive commands from running',
        hooks: [
            {
                event: 'PreCommand',
                description: 'Block rm -rf, DROP TABLE, and similar destructive commands',
                matcher: { command_pattern: '(rm\\s+-rf|DROP\\s+TABLE|TRUNCATE|format\\s+c:)' },
                handler: {
                    type: 'command',
                    command: 'echo "BLOCKED: Dangerous command detected" && exit 1',
                },
            },
        ],
    },
    {
        name: 'type-check-after-edit',
        description: 'Run TypeScript type checking after edits',
        hooks: [
            {
                event: 'PostFileEdit',
                description: 'Run tsc --noEmit to catch type errors',
                matcher: { file_pattern: '*.{ts,tsx}' },
                handler: {
                    type: 'command',
                    command: 'npx tsc --noEmit',
                },
            },
        ],
    },
    {
        name: 'notification-webhook',
        description: 'Send webhook notifications on session events',
        hooks: [
            {
                event: 'SessionStart',
                description: 'Notify when a Claude session begins',
                handler: {
                    type: 'http',
                    url: 'https://your-webhook-url.com/claude-session',
                },
            },
            {
                event: 'SessionEnd',
                description: 'Notify when a Claude session ends',
                handler: {
                    type: 'http',
                    url: 'https://your-webhook-url.com/claude-session',
                },
            },
        ],
    },
];

export function getHookPreset(name: string): HookPreset | undefined {
    return HOOK_PRESETS.find((p) => p.name === name);
}
