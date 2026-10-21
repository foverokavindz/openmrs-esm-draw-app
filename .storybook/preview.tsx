import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { Preview } from 'storybook-react-rsbuild';
import en from '../translations/en.json';
import '@carbon/styles/css/styles.css';

// Components call `useTranslation()`, which needs an initialised i18n instance.
// The app shell normally provides one; in Storybook we set up a minimal one
// backed by the module's own English translations.
i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en } },
  interpolation: { escapeValue: false },
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="cds--layer-one" style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
