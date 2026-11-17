import React, { Suspense, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonSet, InlineLoading } from '@carbon/react';
import { Workspace2, type Workspace2DefinitionProps } from '@openmrs/esm-framework';
import { type AnnotatedAttachment } from './annotation-editor-types';
import styles from './annotation-editor.workspace.scss';
import { type AnnotationEditorHandle } from './annotation-editor.component';

const AnnotationEditor = React.lazy(() => import('./annotation-editor.component'));

export interface AnnotationEditorWorkspaceProps {
  templateSrc: string;
  annotatedTemplateSrc?: string;
  annotationComments?: string;
  title?: string;
  onSave: (annotatedAttachment: AnnotatedAttachment) => void;
}

const AnnotationEditorWorkspace: React.FC<Workspace2DefinitionProps<AnnotationEditorWorkspaceProps>> = ({
  workspaceProps,
  closeWorkspace,
}) => {
  const annotationEditorRef = useRef<AnnotationEditorHandle>();
  const { t } = useTranslation();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  if (!workspaceProps) return null;

  const { templateSrc, annotatedTemplateSrc, title, onSave, annotationComments } = workspaceProps;

  const workspaceTitle = title
    ? t('annotateTitle', 'Annotate {{title}}', { title })
    : t('annotateImage', 'Annotate image');

  const handleSave = () => {
    const annotatedData = annotationEditorRef.current?.getAnnotatedData();
    if (!annotatedData) return;

    const { imageData, comments } = annotatedData;

    const mimeType = imageData.mimeType ?? 'image/png';

    onSave({
      base64Content: imageData.imageBase64 ?? imageData.imageCanvas?.toDataURL(mimeType) ?? '',
      fileName: `${title ?? imageData.name}.${imageData.extension}`,
      fileType: 'image',
      fileDescription: comments,
      status: 'uploading',
    });

    closeWorkspace({ discardUnsavedChanges: true });
  };

  return (
    <Workspace2 title={workspaceTitle} hasUnsavedChanges={hasUnsavedChanges}>
      <div className={styles.container}>
        <div className={styles.editorContainer}>
          <Suspense fallback={<InlineLoading description={t('loadingEditor', 'Loading editor…')} />}>
            <AnnotationEditor
              editorState={{
                annotationTemplateSrc: annotatedTemplateSrc || templateSrc,
                annotationComments: annotationComments,
              }}
              annotationEditorRef={annotationEditorRef}
              savingPixelRatio={1}
              previewPixelRatio={window.devicePixelRatio}
              onUnsavedChangesChange={setHasUnsavedChanges}
            />
          </Suspense>
        </div>
        <ButtonSet className={styles.controlButtons}>
          <Button kind="secondary" onClick={() => closeWorkspace()}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button kind="primary" disabled={!hasUnsavedChanges} onClick={() => handleSave()}>
            {t('save', 'Save')}
          </Button>
        </ButtonSet>
      </div>
    </Workspace2>
  );
};

export default AnnotationEditorWorkspace;
