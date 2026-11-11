import webpack, { Configuration } from 'webpack';

interface Env {
  entryPath: string
  outputPath: string
  outputFilename: string
}

export default (env: Env): Configuration => ({
  mode: 'production' as 'production',
  target: 'node',

  entry: {
    main: env.entryPath,
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
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      entryOnly: true,
      stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
    }),
  ],
});
