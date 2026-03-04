/**
 * MCP server presets for commonly used MCP servers.
 */
export const MCP_PRESETS = [
    {
        name: 'filesystem',
        description: 'Local filesystem access (read/write files)',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-filesystem', '.'],
        },
        envVarsNeeded: [],
    },
    {
        name: 'github',
        description: 'GitHub repository operations (issues, PRs, repos)',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-github'],
            env: { GITHUB_PERSONAL_ACCESS_TOKEN: '' },
        },
        envVarsNeeded: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
    },
    {
        name: 'slack',
        description: 'Slack workspace integration (messages, channels)',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-slack'],
            env: { SLACK_BOT_TOKEN: '', SLACK_TEAM_ID: '' },
        },
        envVarsNeeded: ['SLACK_BOT_TOKEN', 'SLACK_TEAM_ID'],
    },
    {
        name: 'postgres',
        description: 'PostgreSQL database access (query, schema)',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-postgres'],
            env: { DATABASE_URL: '' },
        },
        envVarsNeeded: ['DATABASE_URL'],
    },
    {
        name: 'sqlite',
        description: 'SQLite database access',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-sqlite', './database.db'],
        },
        envVarsNeeded: [],
    },
    {
        name: 'brave-search',
        description: 'Brave Search web search API',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-brave-search'],
            env: { BRAVE_API_KEY: '' },
        },
        envVarsNeeded: ['BRAVE_API_KEY'],
    },
    {
        name: 'puppeteer',
        description: 'Browser automation and web scraping',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-puppeteer'],
        },
        envVarsNeeded: [],
    },
    {
        name: 'memory',
        description: 'Persistent memory via knowledge graph',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-memory'],
        },
        envVarsNeeded: [],
    },
    {
        name: 'fetch',
        description: 'HTTP fetch for web content retrieval',
        config: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-fetch'],
        },
        envVarsNeeded: [],
    },
    {
        name: 'linear',
        description: 'Linear project management integration',
        config: {
            command: 'npx',
            args: ['-y', 'mcp-linear'],
            env: { LINEAR_API_KEY: '' },
        },
        envVarsNeeded: ['LINEAR_API_KEY'],
    },
    {
        name: 'notion',
        description: 'Notion workspace integration',
        config: {
            command: 'npx',
            args: ['-y', '@notionhq/notion-mcp-server'],
            env: { OPENAPI_MCP_HEADERS: '' },
        },
        envVarsNeeded: ['OPENAPI_MCP_HEADERS'],
    },
    {
        name: 'sentry',
        description: 'Sentry error monitoring integration',
        config: {
            command: 'npx',
            args: ['-y', '@sentry/mcp-server'],
            env: { SENTRY_AUTH_TOKEN: '' },
        },
        envVarsNeeded: ['SENTRY_AUTH_TOKEN'],
    },
];
export function getMcpPreset(name) {
    return MCP_PRESETS.find((p) => p.name === name);
}
//# sourceMappingURL=mcp-presets.js.map