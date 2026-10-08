import { typecheckPlugin } from '@jgoz/esbuild-plugin-typecheck';
import { build } from 'esbuild';
import { sync } from 'glob';

/**
 * Build typescript application into CommonJS
 * @type {BuildStep}
 */
const buildApp = (buildConfig) => {
  return build({
    entryPoints: sync(buildConfig.app.entryPoints),
    outdir: buildConfig.app.outDir,
    bundle: false,
    sourcemap: true,
    platform: 'node',
    format: 'cjs',
    plugins: [typecheckPlugin()],
  });
};

/**
 * @param {BuildConfig} buildConfig
 * @returns {Promise}
 */
export default (buildConfig) => {
  process.stderr.write('\u{1b}[1m\u{2728} Building app...\u{1b}[0m\n');

  return buildApp(buildConfig);
};
