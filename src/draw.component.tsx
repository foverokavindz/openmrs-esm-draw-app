import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Layer, Tile } from '@carbon/react';
import styles from './draw.scss';
import { showModal } from '@openmrs/esm-framework';

const Draw: React.FC = () => {
  const { t } = useTranslation();

  const launchEditor = () => {
    const dispose = showModal('annotation-editor-modal', {
      size: 'lg',
      src: '#',
      title: 'Image Annotation Editor',
      onSave: () => dispose(),
      closeModal: () => dispose(),
    });
  };

  return (
    <div className={styles.container}>
      <Layer>
        <Tile className={styles.tile}>
          <h1 className={styles.heading}>{t('drawHeading', 'Draw')}</h1>
          <p className={styles.content}>{t('drawDescription', 'Welcome to the Draw page.')}</p>
        </Tile>
        <Button onClick={launchEditor}>{t('openAnnotation', 'Open annotation')} </Button>
      </Layer>
    </div>
  );
};

export default Draw;
