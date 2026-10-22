import React from 'react';
import FilerobotImageEditor, { type FilerobotImageEditorConfig, TABS, TOOLS } from 'react-filerobot-image-editor';

const defaultThemeOverrideConfigs = {
  palette: {
    'bg-secondary': 'var(--omrs-color-bg-high-contrast, #ffffff)',
    'bg-primary-active': 'var(--brand-primary-10, #d9fbfb)',
    'accent-primary': 'var(--brand-03, #007d79)',
    'accent-primary-active': 'var(--brand-01, #005d5d)',
    'icons-primary': 'var(--omrs-color-ink-medium-contrast, #525252)',
    'icons-secondary': 'var(--omrs-color-ink-low-contrast, #8d8d8d)',
    'txt-primary': 'var(--omrs-color-ink-high-contrast, #161616)',
    'txt-secondary': 'var(--omrs-color-ink-medium-contrast, #525252)',
    'borders-primary': 'var(--omrs-color-bg-lowest-contrast, #e0e0e0)',
    'borders-secondary': 'var(--omrs-color-bg-lowest-contrast, #e0e0e0)',
  },
  typography: { fontFamily: 'inherit' },
};

const DEFAULT_SHAPE_CONFIGS = {
  fill: 'transparent',
  stroke: '#ff0000',
  strokeWidth: 2,
};

const DEFAULT_EDITOR_CONFIGS: Partial<FilerobotImageEditorConfig> = {
  defaultSavedImageName: 'annotation',
  defaultSavedImageType: 'png',
  theme: { defaultThemeOverrideConfigs },
  annotationsCommon: DEFAULT_SHAPE_CONFIGS,
  Text: { fontSize: 16, align: 'center', lineHeight: 1.2, letterSpacing: 0, text: 'Add text here' },
  Arrow: { strokeWidth: DEFAULT_SHAPE_CONFIGS.strokeWidth },
  tabsIds: [TABS.ANNOTATE],
  defaultTabId: TABS.ANNOTATE,
  defaultToolId: TOOLS.PEN,
  avoidChangesNotSavedAlertOnLeave: false,
  removeSaveButton: true,
};

const AnnotationEditor: React.FC<FilerobotImageEditorConfig> = ({
  source,
  getCurrentImgDataFnRef,
  savingPixelRatio,
  previewPixelRatio,
  ...props
}) => {
  return (
    <FilerobotImageEditor
      {...DEFAULT_EDITOR_CONFIGS}
      {...props}
      source={source}
      getCurrentImgDataFnRef={getCurrentImgDataFnRef}
      savingPixelRatio={savingPixelRatio}
      previewPixelRatio={previewPixelRatio}
    />
  );
};

export default AnnotationEditor;
