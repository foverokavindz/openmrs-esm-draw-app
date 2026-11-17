import React, { type MutableRefObject, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import FilerobotImageEditor, {
  type getCurrentImgDataFunction,
  type FilerobotImageEditorConfig,
} from 'react-filerobot-image-editor';
import { Button } from '@carbon/react';
import { DEFAULT_EDITOR_CONFIGS } from './annotation-editor.config';
import { useTranslation } from 'react-i18next';
import { useAnnotationEditorTranslations } from './useAnnotationEditorTranslations';
import AnnotationComments from './annotation-comments.component';
import ClearAllAnnotationsConfirmationModal from './clear-all-annotations-confirmation.modal';
import styles from './annotation-editor.component.scss';

interface AnnotatedData {
  imageData: ReturnType<getCurrentImgDataFunction>['imageData'];
  comments: string;
}

export interface AnnotationEditorHandle {
  getAnnotatedData: () => AnnotatedData | undefined;
}

interface AnnotationEditorProps extends Omit<FilerobotImageEditorConfig, 'source' | 'getCurrentImgDataFnRef'> {
  editorState: {
    annotationTemplateSrc: FilerobotImageEditorConfig['source'];
    annotationComments?: string;
  };
  annotationEditorRef: MutableRefObject<AnnotationEditorHandle | undefined>;
  onUnsavedChangesChange?: (hasUnsavedChanges: boolean) => void;
}

const AnnotationEditor: React.FC<AnnotationEditorProps> = ({
  editorState,
  savingPixelRatio,
  previewPixelRatio,
  annotationEditorRef,
  onUnsavedChangesChange,
  ...props
}) => {
  const { t } = useTranslation();
  const { translations, language } = useAnnotationEditorTranslations();
  const [editorKey, setEditorKey] = useState<number>(1);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const getCurrentImgDataFnRef = useRef<getCurrentImgDataFunction>();
  const annotationCommentsRef = useRef<HTMLTextAreaElement>(null);
  const hasUnsavedChangesRef = useRef(false);
  const newAnnotationCountRef = useRef(0);

  const savedComments = editorState.annotationComments ?? '';

  useImperativeHandle(
    annotationEditorRef,
    () => ({
      getAnnotatedData: () => {
        const getImgData = getCurrentImgDataFnRef.current;
        if (!getImgData) return undefined;
        return { imageData: getImgData({}).imageData, comments: annotationCommentsRef.current?.value ?? '' };
      },
    }),
    [],
  );
  const textToolConfig = useMemo(
    () => ({ ...DEFAULT_EDITOR_CONFIGS.Text, text: t('addTextHere', 'Add text here') }),
    [t],
  );

  const reportUnsavedChanges = useCallback(() => {
    const comments = annotationCommentsRef.current?.value ?? '';
    hasUnsavedChangesRef.current = newAnnotationCountRef.current > 0 || comments !== savedComments;
    onUnsavedChangesChange?.(hasUnsavedChangesRef.current);
  }, [onUnsavedChangesChange, savedComments]);

  const handleEditorModify = useCallback<NonNullable<FilerobotImageEditorConfig['onModify']>>(
    (designState) => {
      newAnnotationCountRef.current = Object.keys(designState.annotations ?? {}).length;
      reportUnsavedChanges();
    },
    [reportUnsavedChanges],
  );

  const handleClearAll = (shouldClearComments: boolean) => {
    // adding new editor key to File robot editor will remount again and it clear all annotations, undo/redo history as well
    setEditorKey((prev) => prev + 1);
    newAnnotationCountRef.current = 0;
    if (shouldClearComments && annotationCommentsRef.current) {
      annotationCommentsRef.current.value = '';
    }
    reportUnsavedChanges();
  };

  const handleClearAllConfirm = (shouldClearComments: boolean) => {
    handleClearAll(shouldClearComments);
    setIsClearAllModalOpen(false);
  };

  return (
    <>
      <div className={styles.editorWrapper}>
        <Button
          className={styles.clearAllButton}
          kind="danger--tertiary"
          size="sm"
          disabled={!hasUnsavedChangesRef.current}
          onClick={() => setIsClearAllModalOpen(true)}
        >
          {t('clearAll', 'Clear all')}
        </Button>

        <FilerobotImageEditor
          key={editorKey}
          {...DEFAULT_EDITOR_CONFIGS}
          language={language}
          translations={translations}
          Text={textToolConfig}
          {...props}
          source={editorState.annotationTemplateSrc}
          getCurrentImgDataFnRef={getCurrentImgDataFnRef}
          savingPixelRatio={savingPixelRatio}
          previewPixelRatio={previewPixelRatio}
          onModify={handleEditorModify}
        />

        <AnnotationComments ref={annotationCommentsRef} value={savedComments} onChange={reportUnsavedChanges} />
      </div>

      <ClearAllAnnotationsConfirmationModal
        open={isClearAllModalOpen}
        onClose={() => setIsClearAllModalOpen(false)}
        onConfirm={handleClearAllConfirm}
      />
    </>
  );
};

export default AnnotationEditor;
