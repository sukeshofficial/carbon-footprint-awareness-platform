import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import * as carbonEstimationApi from '../services/carbonEstimationApi';

const CarbonEstimationContext = createContext(null);

export const CarbonEstimationProvider = ({ children }) => {
  const [estimation, setEstimation] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  const fetchMyEstimation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await carbonEstimationApi.getMyEstimation();
      setEstimation(response.data);
      setIsFetched(true);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch carbon estimation';
      setError(message);
      setIsFetched(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLatestInsights = useCallback(async () => {
    if (!estimation || estimation.aiInsights) return;

    setLoadingInsights(true);
    try {
      const response = await carbonEstimationApi.getLatestInsights();
      setEstimation(prev => ({ ...prev, aiInsights: response.data }));
      return response.data;
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      return null;
    } finally {
      setLoadingInsights(false);
    }
  }, [estimation]);

  const recalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await carbonEstimationApi.recalculateEstimation();
      setEstimation(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to recalculate estimation';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await carbonEstimationApi.getEstimationHistory();
      setHistory(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch estimation history';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      estimation,
      history,
      loading,
      loadingInsights,
      error,
      isFetched,
      fetchMyEstimation,
      fetchLatestInsights,
      recalculate,
      fetchHistory,
    }),
    [
      estimation,
      history,
      loading,
      loadingInsights,
      error,
      isFetched,
      fetchMyEstimation,
      fetchLatestInsights,
      fetchHistory,
    ]
  );

  return (
    <CarbonEstimationContext.Provider value={value}>
      {children}
    </CarbonEstimationContext.Provider>
  );
};

CarbonEstimationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCarbonEstimation = () => {
  const context = useContext(CarbonEstimationContext);
  if (!context) {
    throw new Error('useCarbonEstimation must be used within a CarbonEstimationProvider');
  }
  return context;
};
