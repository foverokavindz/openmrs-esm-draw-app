import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useAnnotationEditorTranslations = () => {
  const { t, i18n } = useTranslation();

  const translations = useMemo(
    () => ({
      // Tabs
      annotateTabLabel: t('annotate', 'Annotate'),
      tabsMenu: t('menu', 'Menu'),

      // Annotate tools
      textTool: t('text', 'Text'),
      imageTool: t('image', 'Image'),
      rectangleTool: t('rectangle', 'Rectangle'),
      ellipseTool: t('ellipse', 'Ellipse'),
      polygonTool: t('polygon', 'Polygon'),
      penTool: t('pen', 'Pen'),
      lineTool: t('line', 'Line'),
      arrowTool: t('arrow', 'Arrow'),

      // Top bar
      undoTitle: t('undoLastOperation', 'Undo last operation'),
      redoTitle: t('redoLastOperation', 'Redo last operation'),
      resetOperations: t('resetAllOperations', 'Reset/delete all operations'),
      showImageTitle: t('showOriginalImage', 'Show original image'),
      imageDimensionsHoverTitle: t('savedImageSize', 'Saved image size (width x height)'),
      zoomInTitle: t('zoomIn', 'Zoom in'),
      zoomOutTitle: t('zoomOut', 'Zoom out'),
      toggleZoomMenuTitle: t('toggleZoomMenu', 'Toggle zoom menu'),
      fitSize: t('fitSize', 'Fit size'),
      actualSize: t('actualSize', 'Actual size (100%)'),

      // Options shared by all shapes
      stroke: t('stroke', 'Stroke'),
      opacity: t('opacity', 'Opacity'),
      transparency: t('transparency', 'Transparency'),
      shadow: t('shadow', 'Shadow'),
      position: t('position', 'Position'),
      horizontal: t('horizontal', 'Horizontal'),
      vertical: t('vertical', 'Vertical'),
      blur: t('blur', 'Blur'),

      // Shape-specific options
      cornerRadius: t('cornerRadius', 'Corner radius'),
      sides: t('sides', 'Sides'),

      // Text tool options
      fontFamily: t('fontFamily', 'Font family'),
      size: t('size', 'Size'),
      textAlignment: t('textAlignment', 'Text alignment'),
      textSpacings: t('textSpacings', 'Text spacings'),
      letterSpacing: t('letterSpacing', 'Letter spacing'),
      lineHeight: t('lineHeight', 'Line height'),

      // Image tool options
      addImage: t('addImage', '+ Add image'),
      addImageTitle: t('selectImageToAdd', 'Select image to add...'),
      uploadImage: t('uploadImage', 'Upload image'),
      fromGallery: t('fromGallery', 'From gallery'),
      importing: t('importing', 'Importing...'),
      uploadImageError: t('uploadImageError', 'Error while uploading the image.'),
      areNotImages: t('areNotImages', 'are not images'),
      isNotImage: t('isNotImage', 'is not an image'),
      toBeUploaded: t('toBeUploaded', 'to be uploaded'),

      // Dialogs and feedback
      warning: t('warning', 'Warning'),
      cancel: t('cancel', 'Cancel'),
      confirm: t('confirm', 'Confirm'),
      apply: t('apply', 'Apply'),
      changesLoseWarningHint: t(
        'changesLoseWarningHint',
        'If you press the "reset" button, your changes will be lost. Would you like to continue?',
      ),
      discardChangesWarningHint: t(
        'discardChangesWarningHint',
        'If you close this, your last change will not be saved.',
      ),
      invalidImageError: t('invalidImageError', 'Invalid image provided.'),
    }),
    [t],
  );

  return { translations, language: i18n.language };
};
