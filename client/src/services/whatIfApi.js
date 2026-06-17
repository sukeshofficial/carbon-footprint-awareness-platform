/**
 * whatIfApi.js
 * API client for the What-If Scenario Simulator endpoints.
 */

import api from './api';

const BASE = '/what-if';

/** Get all available scenario templates */
export const getScenarioTemplates = async () => {
  const response = await api.get(`${BASE}/scenarios`);
  return response.data;
};

/**
 * Preview a scenario impact without saving.
 * @param {string} templateId
 * @param {object} inputPayload - e.g., { daysPerWeek: 4 }
 */
export const previewScenario = async (templateId, inputPayload = {}) => {
  const response = await api.post(`${BASE}/scenarios/preview`, { templateId, inputPayload });
  return response.data;
};

/**
 * Save a scenario to the user's history.
 * @param {string} templateId
 * @param {object} inputPayload
 */
export const saveScenario = async (templateId, inputPayload = {}) => {
  const response = await api.post(`${BASE}/scenarios`, { templateId, inputPayload });
  return response.data;
};

/** Get the authenticated user's saved scenarios */
export const getMyScenarios = async () => {
  const response = await api.get(`${BASE}/scenarios/me`);
  return response.data;
};

/** Get a single saved scenario by ID */
export const getScenarioById = async (id) => {
  const response = await api.get(`${BASE}/scenarios/${id}`);
  return response.data;
};

export default {
  getScenarioTemplates,
  previewScenario,
  saveScenario,
  getMyScenarios,
  getScenarioById,
};
