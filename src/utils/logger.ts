import chalk from 'chalk';

export const logger = {
    success: (msg: string) => console.log(chalk.green('✓'), msg),
    error: (msg: string) => console.log(chalk.red('✗'), msg),
    warn: (msg: string) => console.log(chalk.yellow('⚠'), msg),
    info: (msg: string) => console.log(chalk.blue('ℹ'), msg),
    title: (msg: string) => console.log(chalk.bold.cyan(`\n${msg}\n`)),
    dim: (msg: string) => console.log(chalk.dim(msg)),
    list: (label: string, value: string) =>
        console.log(`  ${chalk.gray('•')} ${chalk.white(label)}: ${chalk.cyan(value)}`),
};
