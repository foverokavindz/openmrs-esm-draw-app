import React from 'react';
import FilerobotImageEditor, { type FilerobotImageEditorConfig } from 'react-filerobot-image-editor';
import { DEFAULT_EDITOR_CONFIGS } from './annotation-editor.config';
import { useTranslation } from 'react-i18next';
import { useAnnotationEditorTranslations } from './useAnnotationEditorTranslations';

const AnnotationEditor: React.FC<FilerobotImageEditorConfig> = ({
  source,
  getCurrentImgDataFnRef,
  savingPixelRatio,
  previewPixelRatio,
  ...props
}) => {
  const { t } = useTranslation();
  const { translations, language } = useAnnotationEditorTranslations();

  return (
    <FilerobotImageEditor
      {...DEFAULT_EDITOR_CONFIGS}
      language={language}
      translations={translations}
      Text={{ ...DEFAULT_EDITOR_CONFIGS.Text, text: t('addTextHere', 'Add text here') }}
      {...props}
      source={source}
      getCurrentImgDataFnRef={getCurrentImgDataFnRef}
      savingPixelRatio={savingPixelRatio}
      previewPixelRatio={previewPixelRatio}
    />
  );
};

export default AnnotationEditor;
