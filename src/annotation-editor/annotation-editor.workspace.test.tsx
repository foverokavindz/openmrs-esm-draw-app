import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type Workspace2DefinitionProps } from '@openmrs/esm-framework';
import AnnotationEditorWorkspace, { type AnnotationEditorWorkspaceProps } from './annotation-editor.workspace';

const mockGetCurrentImgData = vi.fn(() => ({
  imageData: {
    name: 'annotation',
    extension: 'png',
    mimeType: 'image/png',
    imageBase64: 'data:image/png;base64,abc123',
  },
}));

vi.mock('./annotation-editor.component', () => ({
  default: ({ getCurrentImgDataFnRef }: { getCurrentImgDataFnRef: { current: unknown } }) => {
    getCurrentImgDataFnRef.current = mockGetCurrentImgData;
    return <div data-testid="annotation-editor" />;
  },
}));

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

  it('passes the annotated image to onSave and closes the workspace when Save is clicked', async () => {
    const user = userEvent.setup();
    const { onSave, closeWorkspace } = renderWorkspace();
    await screen.findByTestId('annotation-editor');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockGetCurrentImgData).toHaveBeenCalledWith({});
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({
      base64Content: 'data:image/png;base64,abc123',
      fileName: 'annotation.png',
      fileType: 'image',
      fileDescription: '',
      status: 'uploading',
    });
    expect(closeWorkspace).toHaveBeenCalledWith({ discardUnsavedChanges: true });
  });
});
