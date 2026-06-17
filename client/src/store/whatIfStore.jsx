/**
 * whatIfStore.jsx
 * React Context and hook for What-If Scenario Simulator state management.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import * as whatIfApi from '../services/whatIfApi';

const WhatIfContext = createContext(null);

export const WhatIfProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [inputPayload, setInputPayload] = useState({});
  const [previewResult, setPreviewResult] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTemplates = useCallback(async () => {
    try {
      const response = await whatIfApi.getScenarioTemplates();
      setTemplates(response.data || []);
    } catch (err) {
      console.error('[WhatIfStore] Failed to fetch templates:', err);
    }
  }, []);

  const selectTemplate = useCallback((template) => {
    setSelectedTemplate(template);
    // Reset inputs to defaults from template
    const defaults = {};
    (template?.inputs || []).forEach((inp) => {
      defaults[inp.key] = inp.default;
    });
    setInputPayload(defaults);
    setPreviewResult(null);
  }, []);

  const updateInput = useCallback((key, value) => {
    setInputPayload((prev) => ({ ...prev, [key]: value }));
  }, []);

  const runPreview = useCallback(async (templateId, payload) => {
    setPreviewing(true);
    setError(null);
    try {
      const response = await whatIfApi.previewScenario(templateId, payload);
      setPreviewResult(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Preview failed. Please try again.';
      setError(message);
      return null;
    } finally {
      setPreviewing(false);
    }
  }, []);

  const saveCurrentScenario = useCallback(async (templateId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await whatIfApi.saveScenario(templateId, payload);
      setSavedScenarios((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Save failed. Please try again.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyScenarios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await whatIfApi.getMyScenarios();
      setSavedScenarios(response.data || []);
    } catch (err) {
      console.error('[WhatIfStore] Failed to fetch saved scenarios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPreview = useCallback(() => {
    setPreviewResult(null);
    setSelectedTemplate(null);
    setInputPayload({});
  }, []);

  const value = {
    templates,
    selectedTemplate,
    inputPayload,
    previewResult,
    savedScenarios,
    loading,
    previewing,
    error,
    fetchTemplates,
    selectTemplate,
    updateInput,
    runPreview,
    saveCurrentScenario,
    fetchMyScenarios,
    clearPreview,
  };

  return <WhatIfContext.Provider value={value}>{children}</WhatIfContext.Provider>;
};

export const useWhatIf = () => {
  const context = useContext(WhatIfContext);
  if (!context) throw new Error('useWhatIf must be used within a WhatIfProvider');
  return context;
};
