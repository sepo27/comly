import { Command } from 'commander';

export type CommandAction<T extends Command> = (this: T, ...args: any[]) => void | Promise<void>
