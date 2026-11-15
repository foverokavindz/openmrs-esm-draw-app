const config = require('openmrs/default-rspack-config');
const path = require('path');

// The 244 KiB asset-size budget rspack warns about isn't meaningful for O3
// modules: framework + Carbon design system push every bundle past it, so the
// hint just adds noise on every build. Disable it.
config.overrides.performance = { hints: false };

// react-konva (used by Filerobot) depends on react-reconciler. In dev mode, rspack resolves
// the reconciler's development build, which expects React's dev-only internals. The app shell
// shares the production build of React, so the dev reconciler crashes at runtime
// ("Cannot read properties of undefined (reading 'isBatchingLegacy')").
// Force the production reconciler so it matches the shell's React. Production builds already
// use it, so this only affects the dev server.
const reconcilerDir = path.dirname(require.resolve('react-reconciler/package.json'));

config.additionalConfig.resolve = {
  alias: {
    'react-reconciler$': path.join(reconcilerDir, 'cjs/react-reconciler.production.min.js'),
    'react-reconciler/constants.js': path.join(reconcilerDir, 'cjs/react-reconciler-constants.production.min.js'),
  },
};

module.exports = config;
