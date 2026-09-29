import React from 'react';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import styles from './annotation-editor.scss';

interface AnnotationEditorModalProps {
  src: string;
  title?: string;
  onSave: () => void;
  closeModal: () => void;
}

const AnnotationEditorModal: React.FC<AnnotationEditorModalProps> = ({ src, title, onSave, closeModal }) => {
  return (
    <>
      <ModalHeader closeModal={closeModal} title={title ?? 'Annotate image'} />
      <ModalBody className={styles.modalBody}>
        <div className={styles.editor}>
          <img src={src} alt="Annotation editor" />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button kind="primary" onClick={onSave}>
          Save
        </Button>
      </ModalFooter>
    </>
  );
};

export default AnnotationEditorModal;
