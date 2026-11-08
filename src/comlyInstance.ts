import { styleText } from 'node:util';
import { Comly } from './Comly';

export const comlyInstance = () => new Comly()
  .name(styleText(['bold'], './cli'))
  .usage(styleText('bold', '[command] [opts...]'));
