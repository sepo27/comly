#!/usr/bin/env node

// import { dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
import { comly } from '../../src/index.js';
import { comlyBinCommand } from './commands/bin/index.js';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const name = process.argv[1].startsWith(__dirname) ? 'np bin-cli' : 'comly';

comly()
  .name('comly')
  .description('Manage CLI app.')
  .addCommand(comlyBinCommand)
  .run();
