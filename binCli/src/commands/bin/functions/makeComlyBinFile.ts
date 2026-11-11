import * as fs from 'node:fs';
import * as path from 'node:path';
import webpack, { Configuration, Stats, StatsError } from 'webpack';
import { Nodelog } from '../../../../../src/lib/Nodelog.js';
import webpackConfig from '../../../../webpack/webpack.config.js';
import { DebuggableError } from '../../../../../src/index.js';

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

  // Compile
  await runWebpack(webpackConfig).then((stats: Stats) => {
    this.log.log('Compiled in: %dms', stats?.toJson().time);
  });

  // Make dist bin file executable
  await fs.promises.chmod(args.distFilepath, 0o755);

  this.log.log('Made bin file executable');
}

/*** Private ***/

function runWebpack(config: Configuration): Promise<Stats> {
  return new Promise<Stats>((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err);
      }

      // console.log('=== stats', stats?.hasErrors(), stats?.toJson().errors?.slice(0, 1));

      if (stats?.hasErrors()) {
        // console.log('=== stats', stats.toJson());
        reject(new DebuggableError('Compilation failed', makeWebpackStatsDebug(stats)));
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
  const errors = stats.toJson().errors;
  return {
    errors: (errors ?? []).map(({ moduleName, message }: StatsError) => ({
      moduleName: moduleName ?? '',
      message,
    })),
  };
}

function resolveWebpackConfig(args: Params): Configuration {
  return webpackConfig(resolveWebpackConfigEnvArgs(args));
}

function resolveWebpackConfigEnvArgs(args: Params) {
  const { sourcePath, distFilepath } = args;
  const entryPath = resolveEntryFilepath(sourcePath);
  const outputPath = path.dirname(distFilepath),
    outputFilename = path.basename(distFilepath);

  return { entryPath, outputPath, outputFilename };
}

function resolveEntryFilepath(sourcePath: string): string {
  let entryFilepath = sourcePath;

  if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
    // Default to index entry point
    entryFilepath = path.join(sourcePath, 'index.tx');
  }

  if (fs.existsSync(entryFilepath)) {
    return entryFilepath;
  }

  throw new Error(`Unable to resolve entry file path: ${entryFilepath}`);
}
