import chalk from 'chalk';
export const logger = {
    success: (msg) => console.log(chalk.green('✓'), msg),
    error: (msg) => console.log(chalk.red('✗'), msg),
    warn: (msg) => console.log(chalk.yellow('⚠'), msg),
    info: (msg) => console.log(chalk.blue('ℹ'), msg),
    title: (msg) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
    dim: (msg) => console.log(chalk.dim(msg)),
    list: (label, value) => console.log(`  ${chalk.gray('•')} ${chalk.white(label)}: ${chalk.cyan(value)}`),
};
//# sourceMappingURL=logger.js.map