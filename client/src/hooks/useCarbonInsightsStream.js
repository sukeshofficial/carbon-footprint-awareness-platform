import { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const useCarbonInsightsStream = (estimation) => {
  const [streamedToken, setStreamedToken] = useState('');
  const [streamedInsights, setStreamedInsights] = useState(null);
  const [streamingDone, setStreamingDone] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const esRef = useRef(null);

  useEffect(() => {
    if (!estimation) return;
    if (streamedInsights) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setIsStreaming(true);
    setStreamedToken('');
    setStreamError(false);

    const controller = new AbortController();

    fetch(`${API_BASE}/carbon-estimation/me/insights/stream`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let rawBuffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          rawBuffer += decoder.decode(value, { stream: true });

          const lines = rawBuffer.split('\n');
          rawBuffer = lines.pop();

          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]') { setStreamingDone(true); continue; }
            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                setStreamedToken(prev => prev + parsed.token);
              }
              if (parsed.done && parsed.insights) {
                setStreamedInsights(parsed.insights);
                setStreamingDone(true);
              }
              if (parsed.error) {
                setStreamError(true);
              }
            } catch (_) { /* skip */ }
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Stream error:', err);
          setStreamError(true);
        }
      })
      .finally(() => setIsStreaming(false));

    esRef.current = controller;
    return () => controller.abort();
  }, [estimation]); // eslint-disable-line

  const resetStream = () => {
    setStreamedInsights(null);
    setStreamedToken('');
    setStreamingDone(false);
    setStreamError(false);
  };

  return {
    streamedToken,
    streamedInsights,
    streamingDone,
    streamError,
    isStreaming,
    resetStream,
  };
};
