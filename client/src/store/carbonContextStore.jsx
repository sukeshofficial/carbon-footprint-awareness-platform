import React, { createContext, useContext, useState, useCallback } from 'react';
import carbonContextApi from '../services/carbonContextApi';

const CarbonContextContext = createContext(null);

export const CarbonContextProvider = ({ children }) => {
  const [responses, setResponses] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await carbonContextApi.getOnboardingQuestions();
      setQuestions(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch questions');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await carbonContextApi.getMyResponses();
      setResponses(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch responses');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStep = async (stepKey, stepData) => {
    setLoading(true);
    try {
      const response = await carbonContextApi.updateOnboardingStep(stepKey, stepData);
      setResponses(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update step');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const skipStep = async (stepKey) => {
    setLoading(true);
    try {
      const response = await carbonContextApi.skipOnboardingStep(stepKey);
      setResponses(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to skip step');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const response = await carbonContextApi.completeOnboarding();
      setResponses(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete onboarding');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    responses,
    questions,
    loading,
    error,
    fetchQuestions,
    fetchResponses,
    updateStep,
    skipStep,
    completeOnboarding,
    isComplete: responses?.draftStatus === 'completed',
  };

  return (
    <CarbonContextContext.Provider value={value}>
      {children}
    </CarbonContextContext.Provider>
  );
};

export const useCarbonContext = () => {
  const context = useContext(CarbonContextContext);
  if (!context) {
    throw new Error('useCarbonContext must be used within a CarbonContextProvider');
  }
  return context;
};
