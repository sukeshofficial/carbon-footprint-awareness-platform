import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WhatIfProvider, useWhatIf } from '../whatIfStore';
import * as whatIfApi from '../../services/whatIfApi';

// Mock the API
vi.mock('../../services/whatIfApi', () => ({
  getScenarioTemplates: vi.fn(),
  previewScenario: vi.fn(),
  saveScenario: vi.fn(),
  getMyScenarios: vi.fn(),
}));

const TestComponent = () => {
  const {
    templates,
    fetchTemplates,
    selectTemplate,
    selectedTemplate,
    runPreview,
    previewResult,
    previewing
  } = useWhatIf();


  return (
    <div>
      <button onClick={fetchTemplates}>Fetch Templates</button>
      <div data-testid="templates-count">{templates.length}</div>

      <button onClick={() => selectTemplate({ id: 't1', title: 'T1', inputs: [{ key: 'k1', default: 10 }] })}>
        Select Template
      </button>
      {selectedTemplate && <div data-testid="selected-title">{selectedTemplate.title}</div>}

      <button onClick={() => runPreview('t1', { k1: 20 })}>Run Preview</button>
      {previewing && <div>Previewing...</div>}
      {previewResult && <div data-testid="preview-impact">{previewResult.impact}</div>}
    </div>
  );
};

describe('WhatIfContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches templates correctly', async () => {
    vi.mocked(whatIfApi.getScenarioTemplates).mockResolvedValueOnce({ data: [{ id: '1', title: 'Test Template' }] });

    render(
      <WhatIfProvider>
        <TestComponent />
      </WhatIfProvider>
    );

    const fetchBtn = screen.getByText(/Fetch Templates/i);
    await act(async () => {
      fetchBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('templates-count').textContent).toBe('1');
    });
    expect(whatIfApi.getScenarioTemplates).toHaveBeenCalled();
  });

  it('selects template and sets default inputs', async () => {
    render(
      <WhatIfProvider>
        <TestComponent />
      </WhatIfProvider>
    );

    const selectBtn = screen.getByText(/Select Template/i);
    await act(async () => {
      selectBtn.click();
    });

    expect(screen.getByTestId('selected-title').textContent).toBe('T1');
  });

  it('runs preview and updates result', async () => {
    vi.mocked(whatIfApi.previewScenario).mockResolvedValueOnce({ data: { impact: '50kg' } });

    render(
      <WhatIfProvider>
        <TestComponent />
      </WhatIfProvider>
    );

    const previewBtn = screen.getByText(/Run Preview/i);
    await act(async () => {
      previewBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('preview-impact').textContent).toBe('50kg');
    });
    expect(whatIfApi.previewScenario).toHaveBeenCalledWith('t1', { k1: 20 });
  });
});
