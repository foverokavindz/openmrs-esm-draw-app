import React, { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextArea } from '@carbon/react';
import styles from './annotation-notes.component.scss';

interface AnnotationNotesProps {
  value?: string;
}

const AnnotationNotes = forwardRef<HTMLTextAreaElement, AnnotationNotesProps>(({ value = '' }, ref) => {
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [notesLocal, setNotesLocal] = useState<string | null>(null);
  const { t } = useTranslation();

  return (
    <div className={styles.annotationDescriptionWrapper}>
      <div className={styles.annotationDescriptionButton}>
        <Button onClick={() => setIsNotesVisible(!isNotesVisible)} size="sm" kind="primary">
          {isNotesVisible ? t('hideNote', 'Hide Note') : t('note', 'Note')}
        </Button>
      </div>

      {isNotesVisible && (
        <TextArea
          ref={ref}
          className={styles.textArea}
          placeholder={t('enterYourNote', 'Enter your note...')}
          labelText=""
          defaultValue={notesLocal ?? value}
          onChange={(e) => setNotesLocal(e.target.value)}
        />
      )}
    </div>
  );
});

export default AnnotationNotes;
