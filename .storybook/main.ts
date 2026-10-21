import { mergeRsbuildConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import type { StorybookConfig } from 'storybook-react-rsbuild';

const config: StorybookConfig = {
  framework: 'storybook-react-rsbuild',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  rsbuildFinal: (config) =>
    mergeRsbuildConfig(config, {
      plugins: [pluginReact(), pluginSass()],
      output: {
        // O3 modules import plain `.scss` files as CSS modules (that's how
        // `openmrs/default-rspack-config` is set up), so mirror that here.
        // Stylesheets shipped by dependencies stay global.
        cssModules: {
          auto: (resourcePath) => !resourcePath.includes('node_modules'),
        },
      },
    }),
};

export default config;
