import { ComlyCommand } from '../../../../src/index.js';
import { makeComlyBinCommand } from './makeComlyBinCommand.js';

export const comlyBinCommand = new ComlyCommand('bin')
  .description('Make / distribute CLI via bin (compressed JS single executable file)')
  .addCommand(makeComlyBinCommand);
