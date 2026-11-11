import { Configuration } from 'webpack';
import WebpackShebangPlugin from 'webpack-shebang-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface Env {
  entryPath: string
  outputPath: string
  outputFilename: string
}

// @ts-ignore
const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('=== _dirname', __dirname);

export default (env: Env): Configuration => ({
  mode: 'production' as 'production',
  target: 'node',

  entry: {
    main: env.entryPath,
    // main: "./src/index.ts",
  },

  output: {
    path: env.outputPath,
    filename: env.outputFilename,
    library: {
      type: 'commonjs2',
    },
  },

  externalsType: 'commonjs',
  externals: [
    /^(node:)?[a-z]/,
  ],

  resolve: {
    extensions: ['.ts', '.js'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    // tsconfig: './binCli/tsconfig.json',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        // exclude: /node_modules/,
        options: {
          compilerOptions: {
            module: 'nodenext',
            moduleResolution: 'nodenext',
          },
        },
      },
    ],
  },

  plugins: [
    new WebpackShebangPlugin(),
    // new webpack.DefinePlugin({
    //   "process.env.OBIT_BUILD_META": JSON.stringify({
    //     isLocalRepo: env.isLocalRepo === 'true',
    //     branch: env.branch,
    //   }),
    // }),
  ],
});
