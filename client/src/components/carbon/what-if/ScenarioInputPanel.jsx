/**
 * ScenarioInputPanel.jsx
 * Dynamic input controls rendered from the selected template's inputs definition.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Sliders } from 'lucide-react';

export default function ScenarioInputPanel({
  template,
  inputPayload,
  onUpdateInput,
}) {
  if (!template) return null;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Sliders className="w-4 h-4" />
        </div>

        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100">
            Customize Scenario
          </h3>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Adjust parameters
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {template.inputs.map((input) => {
          const value = inputPayload[input.key] ?? input.default;

          return (
            <div key={input.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  {input.label}
                </label>

                <span className="text-sm font-black text-primary tabular-nums">
                  {value}
                  {input.key === 'reductionPercentage' ? '%' : ''}
                </span>
              </div>

              {input.type === 'slider' && (
                <>
                  <input
                    type="range"
                    min={input.min}
                    max={input.max}
                    value={value}
                    onChange={(e) =>
                      onUpdateInput(input.key, Number(e.target.value))
                    }
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-zinc-700 accent-primary"
                  />

                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                    <span>{input.min}</span>
                    <span>{input.max}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

ScenarioInputPanel.propTypes = {
  template: PropTypes.shape({
    inputs: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['slider']).isRequired,
        min: PropTypes.number,
        max: PropTypes.number,
        default: PropTypes.number,
      })
    ),
  }),
  inputPayload: PropTypes.objectOf(PropTypes.number),
  onUpdateInput: PropTypes.func,
};

ScenarioInputPanel.defaultProps = {
  template: null,
  inputPayload: {},
  onUpdateInput: () => { },
};