import React, { Suspense, useRef } from 'react';
import { Button, ButtonSet, InlineLoading } from '@carbon/react';
import { type AnnotatedImage } from './annotation-editor-types';
import styles from './annotation-editor.scss';
import { Workspace2, type Workspace2DefinitionProps } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { type getCurrentImgDataFunction } from 'react-filerobot-image-editor';

const AnnotationEditor = React.lazy(() => import('./annotation-editor.component'));

interface AnnotationEditorWorkspaceProps {
  src: string;
  annotatedSrc?: string;
  title?: string;
  onSave: (result: AnnotatedImage) => void;
}

const AnnotationEditorWorkspace: React.FC<Workspace2DefinitionProps<AnnotationEditorWorkspaceProps>> = ({
  workspaceProps,
  closeWorkspace,
}) => {
  const getCurrentImgDataFnRef = useRef<getCurrentImgDataFunction | undefined>(undefined);
  const { t } = useTranslation();

  if (!workspaceProps) return null;

  const { src, annotatedSrc, title, onSave } = workspaceProps;

  const workSpaceTitle = title ? `${t('annotate', 'Annotate')} ${title}` : `${t('annotateImage', 'Annotate Image')}`;

  const handleSave = () => {
    const getImgData = getCurrentImgDataFnRef.current;
    if (!getImgData) return;

    const { imageData } = getImgData({ name: 'annotation', extension: 'png' });

    const mimeType = imageData.mimeType ?? 'image/png';

    onSave({
      base64Content: imageData.imageBase64 ?? imageData.imageCanvas?.toDataURL(mimeType) ?? '',
      fileName: `${imageData.name}.${imageData.extension}`,
      fileType: 'image',
      fileDescription: '',
      // status: 'uploading',
    });

    closeWorkspace({ discardUnsavedChanges: true });
  };

  return (
    <Workspace2 title={workSpaceTitle} hasUnsavedChanges={false}>
      <div className={styles.container}>
        <div className={styles.editor}>
          <Suspense fallback={<InlineLoading description={t('loadingEditor', 'Loading editor…')} />}>
            <AnnotationEditor
              source={annotatedSrc || src}
              getCurrentImgDataFnRef={getCurrentImgDataFnRef}
              savingPixelRatio={1}
              previewPixelRatio={window.devicePixelRatio}
            />
          </Suspense>
        </div>
        <ButtonSet className={styles.controlButtons}>
          <Button kind="secondary" onClick={() => closeWorkspace()}>
            {t('cancel', 'Cancel')}
          </Button>
          <Button kind="primary" onClick={() => handleSave()}>
            {t('save', 'Save')}
          </Button>
        </ButtonSet>
      </div>
    </Workspace2>
  );
};

export default AnnotationEditorWorkspace;
