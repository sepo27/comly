import * as fs from 'node:fs';
import * as path from 'node:path';
import webpack, { Configuration, Stats, StatsError } from 'webpack';
import { Nodelog } from '../../../../../src/lib/Nodelog.js';
import webpackConfig from '../../../../webpack/webpack.config.js';
import { ComlyDebuggableError } from '../../../../../src/main/core/ComlyDebuggableError.js';

interface ThisContext {
  log: Nodelog
}

interface Params {
  sourcePath: string
  distFilepath: string
  verbosityLevel?: number
}

export async function makeComlyBinFile(this: ThisContext, args: Params): Promise<void> {
  const webpackConfig = resolveWebpackConfig(args);
  this.log.log('Compiling bin file ...');
  this.log.log('From %s -> %s', args.sourcePath, args.distFilepath);

  await runWebpack(webpackConfig).then((stats: Stats) => {
    this.log.log('Compiled in: %dms', stats?.toJson().time);
    writeCommonjsPackageJson(path.dirname(args.distFilepath));
  });
}

/*** Private ***/

function runWebpack(conifg: Configuration): Promise<Stats> {
  return new Promise<Stats>((resolve, reject) => {
    webpack(conifg, (err, stats) => {
      if (err) {
        reject(err);
      }

      // console.log('=== stats', stats?.hasErrors(), stats?.toJson().errors?.slice(0, 1));

      if (stats?.hasErrors()) {
        reject(new ComlyDebuggableError('Compilation failed', makeWebpackStatsDebug(stats)));
      }

      resolve(stats as Stats);
    });
  });
}

interface StatsDebug {
  errors: {
    moduleName: string
    message: string
  }[]
}

function makeWebpackStatsDebug(stats: Stats): StatsDebug {
  const errors = stats.toJson().errors?.slice(0, 3);
  return {
    errors: (errors ?? []).map(({ moduleName, message }: StatsError) => ({
      moduleName: moduleName ?? '',
      message,
    })),
  };
}

function resolveWebpackConfig(args: Params): Configuration {
  return webpackConfig(resolveWebpackConfigPaths(args));
}

function resolveWebpackConfigPaths(args: Params) {
  const { sourcePath, distFilepath } = args;
  const entryPath = resolveEntryFilepath(sourcePath);

  // if (!fs.existsSync(distFilepath) || !fs.statSync(distFilepath).isFile()) {
  //   throw new Error(`Dist file path is invalid: ${distFilepath}`);
  // }

  const outputPath = path.dirname(distFilepath),
    outputFilename = path.basename(distFilepath);

  return { entryPath, outputPath, outputFilename };
}

function resolveEntryFilepath(sourcePath: string): string {
  let entryFilepath = sourcePath;

  if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
    // Default to index entry point
    entryFilepath = path.join(sourcePath, 'index.ts');
  }

  if (fs.existsSync(entryFilepath)) {
    return entryFilepath;
  }

  throw new Error(`Unable to resolve entry file path: ${entryFilepath}`);
}

function writeCommonjsPackageJson(distDir: string): void {
  const packageJsonPath = path.join(distDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(packageJsonPath, JSON.stringify({ type: 'commonjs' }));
  }
}
