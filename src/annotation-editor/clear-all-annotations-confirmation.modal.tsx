import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, ComposedModal, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import styles from './clear-all-annotations-confirmation.modal.scss';

interface ClearAllAnnotationsConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (shouldClearComments: boolean) => void;
}

const ClearAllAnnotationsConfirmationModal: React.FC<ClearAllAnnotationsConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [shouldClearComments, setShouldClearComments] = useState(false);

  const handleClose = () => {
    setShouldClearComments(false);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(shouldClearComments);
    setShouldClearComments(false);
  };

  return createPortal(
    <ComposedModal open={open} onClose={handleClose} size="sm">
      <ModalHeader title={t('clearAllAnnotations', 'Clear all annotations')} />
      <ModalBody>
        <p className={styles.description}>
          {t(
            'clearAllAnnotationsDescription',
            "Annotations added since you opened the editor will be removed. Annotations saved earlier are kept. This can't be undone.",
          )}
        </p>
        <Checkbox
          id="clear-annotation-comments"
          labelText={t('alsoClearComments', 'Also clear comments')}
          checked={shouldClearComments}
          onChange={(_, { checked }) => setShouldClearComments(checked)}
        />
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={handleClose}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" onClick={handleConfirm}>
          {t('clearAll', 'Clear all')}
        </Button>
      </ModalFooter>
    </ComposedModal>,
    document.body,
  );
};

export default ClearAllAnnotationsConfirmationModal;
