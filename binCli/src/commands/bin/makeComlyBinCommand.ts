import { ComlyCommand, ComlyCommandOpts, PathOptionParsed } from '../../../../src/index.js';
// import { BinCliConfigOption, BinCliConfigOptionParsed } from '../../opts/BinCliConfigOption.js';
import { BinCliSourcePathOption } from '../../opts/BinCliSourcePathOption.js';
import { styleText } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { makeComlyBinFile } from './functions/makeComlyBinFile.js';

interface Opts extends ComlyCommandOpts {
  // config?: BinCliConfigOptionParsed
  sourcePath?: PathOptionParsed
  distFilepath?: string
}

const DESCRIPTION = `Compile CLI distributable bin file.
${styleText(['italic'], '(Core options are resolved from both config and inline; then merged and validated)')}`;

export const makeComlyBinCommand = new ComlyCommand('make')
  .description(DESCRIPTION)
  // .addOption(new BinCliConfigOption('-c,--config <file>'))
  .addOption(new BinCliSourcePathOption())
  .option('-d,--dist-filepath <file>', 'Dist file path to emit bin file to')
  .action(action);

async function action(this: ComlyCommand, opts: Opts) {
  const { sourceFilepath, distFilepath } = resolveInputPaths(opts);
  await makeComlyBinFile.call({ log: this.log }, {
    sourcePath: sourceFilepath,
    distFilepath,
  });
}

/*** Private ***/

function resolveInputPaths(opts: Opts): { sourceFilepath: string, distFilepath: string } {
  // Resolve source file path

  let sourcePath;

  if (opts.sourcePath) {
    // Try to resolve source path from option relative to PWD (or absolute path)
    sourcePath = path.resolve(process.cwd(), opts.sourcePath.path);
  }/* else if (opts.config && opts.config.config?.sourcePath) {
    // Try to resolve source path from config relative to it (or absolute path)
    sourcePath = path.resolve(path.dirname(opts.config.filepath), opts.config.config.sourcePath);
  }*/ else {
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
  }/* else if (opts.config && opts.config.config?.distFilepath) {
    // Try to resolve dist filepath from config relative to it (or absolute path)
    distFilepath = path.resolve(path.dirname(opts.config.filepath), opts.config.config.distFilepath);
  }*/ else {
    throw new Error('Missing dist file path from options');
  }

  return { sourceFilepath: sourcePath, distFilepath };
}
