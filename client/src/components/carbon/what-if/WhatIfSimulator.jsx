/**
 * WhatIfSimulator.jsx
 * Main What-If Scenario Simulator UI component.
 * Integrates into the existing dashboard layout alongside other sections.
 */

import React, { useEffect, useCallback } from 'react';
import { Sparkles, Loader2, ChevronLeft, RotateCcw } from 'lucide-react';
import { useWhatIf } from '../../../store/whatIfStore';
import ScenarioCard from './ScenarioCard';
import ScenarioInputPanel from './ScenarioInputPanel';
import ScenarioResultCard from './ScenarioResultCard';
import { toast } from 'sonner';

export default function WhatIfSimulator() {
  const {
    templates,
    selectedTemplate,
    inputPayload,
    previewResult,
    loading,
    previewing,
    error,
    fetchTemplates,
    selectTemplate,
    updateInput,
    runPreview,
    saveCurrentScenario,
    clearPreview,
  } = useWhatIf();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleSelectTemplate = useCallback(
    (template) => {
      selectTemplate(template);
    },
    [selectTemplate]
  );

  const handlePreview = useCallback(async () => {
    if (!selectedTemplate) return;
    await runPreview(selectedTemplate.id, inputPayload);
  }, [selectedTemplate, inputPayload, runPreview]);

  const handleSave = useCallback(async () => {
    if (!selectedTemplate) return;
    const result = await saveCurrentScenario(selectedTemplate.id, inputPayload);
    if (result) {
      toast.success('Scenario saved!', {
        description: `"${selectedTemplate.title}" has been added to your saved scenarios.`,
      });
    }
  }, [selectedTemplate, inputPayload, saveCurrentScenario]);

  // Group templates by type for organized display
  const grouped = templates.reduce((acc, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t);
    return acc;
  }, {});

  const typeLabels = {
    transport: '🚌 Transport',
    food: '🥗 Food',
    energy: '⚡ Energy',
    shopping: '📦 Shopping',
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-8 md:p-10 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50">What-If Simulator</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
              Test lifestyle changes before you commit
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10">
        {!selectedTemplate ? (
          /* Template browser */
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Pick a scenario to simulate. We'll estimate how much CO₂ you could save before you make any real change.
            </p>
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type}>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                  {typeLabels[type] ?? type}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((template) => (
                    <ScenarioCard
                      key={template.id}
                      template={template}
                      isSelected={selectedTemplate?.id === template.id}
                      onClick={handleSelectTemplate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Selected scenario workspace */
          <div className="space-y-5">
            {/* Back button */}
            <button
              onClick={clearPreview}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              All Scenarios
            </button>

            {/* Selected template header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
                {selectedTemplate.title}
              </h3>
              <button
                onClick={clearPreview}
                className="text-muted-foreground hover:text-foreground transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>

            {/* Inputs */}
            <ScenarioInputPanel
              template={selectedTemplate}
              inputPayload={inputPayload}
              onUpdateInput={updateInput}
            />

            {/* Simulate button */}
            <button
              onClick={handlePreview}
              disabled={previewing}
              className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {previewing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Simulating…</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Simulate Impact</>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 p-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Result */}
            {previewResult && (
              <ScenarioResultCard
                result={previewResult}
                onSave={handleSave}
                isSaving={loading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
