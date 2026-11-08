import { ComlyCommand } from './ComlyCommand.js';

export const createComlyCommand = (name?: string): ComlyCommand => new ComlyCommand(name);
