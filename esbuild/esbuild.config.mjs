import fs from 'node:fs';
import path from 'node:path';

import { glob } from 'glob';

import buildApp from './app.config.mjs';
import buildAssets from './assets.config.mjs';

const cwd = process.cwd();

/**
 * Configuration for build steps
 * @type {BuildConfig}
 */
const buildConfig = {
  isProduction: process.env.NODE_ENV === 'production',

  app: {
    outDir: path.join(cwd, 'dist'),
    entryPoints: glob
      .sync([path.join(cwd, '*.ts'), path.join(cwd, 'server/**/*.ts')])
      .filter((file) => !file.endsWith('.test.ts'))
      .filter((file) => !file.endsWith('.config.ts')),
    copy: [
      {
        from: path.join(cwd, 'server/views/**/*'),
        to: path.join(cwd, 'dist/views'),
      },
      {
        from: path.join(cwd, 'server/locales/**/*'),
        to: path.join(cwd, 'dist/locales'),
      },
    ],
    clear: path.join(cwd, 'dist/**/*'),
  },

  assets: {
    outDir: path.join(cwd, 'dist/assets'),
    entryPoints: glob.sync([path.join(cwd, 'assets/js/index.js'), path.join(cwd, 'assets/scss/application.scss')]),
    copy: [
      {
        from: path.join(cwd, 'assets/**/!(*.js|*.scss)'),
        to: path.join(cwd, 'dist/assets'),
      },
    ],
  },
};

const asList = (value) => (Array.isArray(value) ? value : [value]);

const clearOutput = (patterns) => {
  for (const pattern of asList(patterns)) {
    for (const match of glob.sync(pattern, { absolute: true, dot: true })) {
      fs.rmSync(match, { recursive: true, force: true });
    }
  }
};

const copyFiles = (assets) => {
  for (const asset of assets) {
    for (const rawFrom of asList(asset.from)) {
      const startFragment = path.parse(rawFrom).dir.replace('/**', '');

      for (const file of glob.sync(rawFrom, { absolute: true, nodir: true })) {
        const preservedDirStructure = file.split(startFragment)[1] ?? '';

        for (const baseToPath of asList(asset.to)) {
          const destination = path.extname(baseToPath)
            ? path.resolve(baseToPath)
            : path.resolve(baseToPath, preservedDirStructure.slice(1));

          fs.mkdirSync(path.dirname(destination), { recursive: true });
          fs.copyFileSync(file, destination);
        }
      }
    }
  }
};

const main = () => {
  clearOutput(buildConfig.app.clear);

  Promise.all([buildApp(buildConfig), buildAssets(buildConfig)])
    .then(() => {
      copyFiles(buildConfig.app.copy);
      copyFiles(buildConfig.assets.copy);
    })
    .catch((e) => {
      process.stderr.write(`${e}\n`);
      process.exit(1);
    });
};

main();
