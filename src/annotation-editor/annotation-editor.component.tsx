import React from 'react';
import FilerobotImageEditor, { type FilerobotImageEditorConfig } from 'react-filerobot-image-editor';
import { DEFAULT_EDITOR_CONFIGS } from './annotation-editor.config';
import AnnotationNotes from './annotation-notes.component';
import styles from './annotation-editor.component.scss';

interface AnnotationEditorProps extends FilerobotImageEditorConfig {
  annotationNotesRef: React.RefObject<HTMLTextAreaElement>;
  annotationNotes?: string;
}

const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
  source,
  getCurrentImgDataFnRef,
  savingPixelRatio,
  previewPixelRatio,
  annotationNotesRef,
  annotationNotes,
  ...props
}) => {
  return (
    <div className={styles.editorWrapper}>
      <FilerobotImageEditor
        {...DEFAULT_EDITOR_CONFIGS}
        {...props}
        source={source}
        getCurrentImgDataFnRef={getCurrentImgDataFnRef}
        savingPixelRatio={savingPixelRatio}
        previewPixelRatio={previewPixelRatio}
      />

      <AnnotationNotes ref={annotationNotesRef} value={annotationNotes} />
    </div>
  );
};

export default AnnotationEditor;
