import { Configuration } from 'webpack';
import WebpackShebangPlugin from 'webpack-shebang-plugin';

interface Env {
  entryPath: string
  outputPath: string
  outputFilename: string
}

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      type: 'module',
    },
  },

  experiments: {
    outputModule: true,
  },

  externalsType: 'module',
  externals: [
    /^(node:)?[a-z]/,
    /^commander/,
    // /^ajv(\/.*)?$/,
    /^webpack(\/.*)?$/,
    /^schema-utils(\/.*)?$/,
    /^webpack-sources(\/.*)?$/,
    /^webpack-shebang-plugin(\/.*)?$/,
  ],

  resolve: {
    extensions: ['.ts'],
    extensionAlias: {
      '.js': ['.ts', '.js'],
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
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
