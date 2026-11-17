import { describe, it, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Workspace2, type Workspace2DefinitionProps } from '@openmrs/esm-framework';
import AnnotationEditorWorkspace, { type AnnotationEditorWorkspaceProps } from './annotation-editor.workspace';

const mockGetAnnotatedData = vi.fn(() => ({
  imageData: {
    name: 'annotation',
    extension: 'png',
    mimeType: 'image/png',
    imageBase64: 'data:image/png;base64,abc123',
  },
  comments: 'Bruising on left arm',
}));

let reportUnsavedChanges: (hasUnsavedChanges: boolean) => void;

vi.mock('./annotation-editor.component', () => ({
  default: ({
    annotationEditorRef,
    onUnsavedChangesChange,
  }: {
    annotationEditorRef: { current: unknown };
    onUnsavedChangesChange: (hasUnsavedChanges: boolean) => void;
  }) => {
    annotationEditorRef.current = { getAnnotatedData: mockGetAnnotatedData };
    reportUnsavedChanges = onUnsavedChangesChange;
    return <div data-testid="annotation-editor" />;
  },
}));

const mockWorkspace2 = vi.mocked(Workspace2);

function renderWorkspace(workspaceProps: Partial<AnnotationEditorWorkspaceProps> = {}) {
  const onSave = vi.fn();
  const closeWorkspace = vi.fn(() => Promise.resolve(true));

  const props: Workspace2DefinitionProps<AnnotationEditorWorkspaceProps> = {
    workspaceName: 'annotation-editor-workspace',
    workspaceProps: {
      templateSrc: '/images/body-diagram.png',
      onSave,
      ...workspaceProps,
    },
    closeWorkspace,
    // Required by Workspace2DefinitionProps but not used by this workspace
    launchChildWorkspace: vi.fn(() => Promise.resolve()),
    windowProps: null,
    groupProps: null,
    windowName: 'annotation-editor-window',
    isRootWorkspace: true,
    showActionMenu: false,
  };

  render(<AnnotationEditorWorkspace {...props} />);
  return { onSave, closeWorkspace };
}

describe('AnnotationEditorWorkspace', () => {
  it('shows a default title when none is given', async () => {
    renderWorkspace();

    expect(screen.getByRole('heading', { name: 'Annotate image' })).toBeInTheDocument();
    expect(await screen.findByTestId('annotation-editor')).toBeInTheDocument();
  });

  it('includes the given title in the workspace title', async () => {
    renderWorkspace({ title: 'Front Body Diagram' });

    expect(screen.getByRole('heading', { name: 'Annotate Front Body Diagram' })).toBeInTheDocument();
    await screen.findByTestId('annotation-editor');
  });

  it('disables Save, and closes without asking on Cancel, while nothing has changed', async () => {
    const user = userEvent.setup();
    const { closeWorkspace } = renderWorkspace({
      annotatedTemplateSrc: '/images/body-diagram-annotated.png',
      annotationComments: 'Bruising',
    });
    await screen.findByTestId('annotation-editor');

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
    expect(mockWorkspace2.mock.lastCall?.[0]).toMatchObject({ hasUnsavedChanges: false });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(closeWorkspace).toHaveBeenCalledWith();
  });

  it('enables Save, and has Cancel ask first, once something is drawn', async () => {
    const user = userEvent.setup();
    const { closeWorkspace } = renderWorkspace();
    await screen.findByTestId('annotation-editor');

    act(() => reportUnsavedChanges(true));

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
    // Workspace2 asks for confirmation when a workspace with unsaved changes is closed without discarding them
    expect(mockWorkspace2.mock.lastCall?.[0]).toMatchObject({ hasUnsavedChanges: true });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(closeWorkspace).toHaveBeenCalledWith();
  });

  it('passes the annotated image and comments to onSave and closes the workspace when Save is clicked', async () => {
    const user = userEvent.setup();
    const { onSave, closeWorkspace } = renderWorkspace();
    await screen.findByTestId('annotation-editor');
    act(() => reportUnsavedChanges(true));

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockGetAnnotatedData).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      base64Content: 'data:image/png;base64,abc123',
      fileName: 'annotation.png',
      fileType: 'image',
      fileDescription: 'Bruising on left arm',
      status: 'uploading',
    });
    expect(closeWorkspace).toHaveBeenCalledWith({ discardUnsavedChanges: true });
  });
});
