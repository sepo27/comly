import { ComlyCommand, ComlyCommandOpts, PathOptionParsed } from '../../../../src/index.js';
import { BinCliSourcePathOption } from '../../opts/BinCliSourcePathOption.js';
import fs from 'node:fs';
import path from 'node:path';
import { makeComlyBinFile } from './functions/makeComlyBinFile.js';

interface Opts extends ComlyCommandOpts {
  sourcePath?: PathOptionParsed
  distFilepath?: string
}

export const makeComlyBinCommand = new ComlyCommand('make')
  .description('Make distributable bin file')
  .addOption(new BinCliSourcePathOption())
  .option('-d,--dist-filepath <file>', 'Dist file path to emit bin file to')
  .action(action);

async function action(this: ComlyCommand, opts: Opts) {
  this.log.info('Producing bin file');

  const { sourceFilepath, distFilepath } = resolveInputPaths(opts);

  await makeComlyBinFile.call({ log: this.log }, {
    sourcePath: sourceFilepath,
    distFilepath,
  });

  this.log.separator();

  this.log.info('Done');
  this.log.print(distFilepath);
}

/*** Private ***/

function resolveInputPaths(opts: Opts): { sourceFilepath: string, distFilepath: string } {
  // Resolve source file path

  let sourcePath;

  if (opts.sourcePath) {
    // Try to resolve source path from option relative to PWD (or absolute path)
    sourcePath = path.resolve(process.cwd(), opts.sourcePath.path);
  } else {
    throw new Error('Missing source path from options');
  }

  if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
    // Append index filename
    sourcePath = path.join(sourcePath, 'index.ts');
  }
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source path is invalid: ${sourcePath}`);
  }

  // Resolve dist file path

  let distFilepath;

  if (opts.distFilepath) {
    // Try to resolve dist filepath from option relative to PWD (or absolute path)
    distFilepath = path.resolve(process.cwd(), opts.distFilepath);
  } else {
    throw new Error('Missing dist file path from options');
  }

  return { sourceFilepath: sourcePath, distFilepath };
}
