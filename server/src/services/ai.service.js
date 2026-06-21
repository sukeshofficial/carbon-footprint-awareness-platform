import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Service to interact with OpenRouter API for generating AI insights.
 */
class AIService {
  constructor() {
    this.apiKey = config.ai.openRouterKey;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = config.ai.model;
  }

  async generateCarbonInsights(estimationData, normalizedInputs) {
    if (!this.apiKey) {
      logger.warn('[AIService] OpenRouter API key missing. Skipping AI insights.');
      return null;
    }

    const messages = this._buildPrompt(estimationData, normalizedInputs);

    try {
      logger.info(
        `[AIService] Requesting insights for totalCO2=${estimationData.totalMonthlyCO2}kg`,
      );
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          response_format: { type: 'json_object' },
        },
        { headers: this._headers(), timeout: 30000 },
      );

      const content = response.data.choices[0].message.content;
      logger.info('[AIService] Successfully generated insights');
      return JSON.parse(content);
    } catch (error) {
      logger.error(
        '[AIService] Failed to generate AI insights:',
        error.response?.data || error.message,
      );
      return null;
    }
  }

  async streamCarbonInsights(estimationData, normalizedInputs, res) {
    if (!this.apiKey) {
      logger.warn('[AIService] OpenRouter API key missing for stream.');
      res.write(`data: ${JSON.stringify({ error: 'AI service unavailable' })}\n\n`);
      res.end();
      return;
    }

    const messages = this._buildPrompt(estimationData, normalizedInputs);

    try {
      logger.info(
        `[AIService] Starting insights stream for totalCO2=${estimationData.totalMonthlyCO2}kg`,
      );
      const response = await axios.post(
        this.apiUrl,
        { model: this.model, messages, stream: true },
        { headers: this._headers(), responseType: 'stream', timeout: 30000 },
      );

      let buffer = '';

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter((l) => l.trim());
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;

          const dataString = line.slice(5).trim();
          if (dataString === '[DONE]') {
            this._handleStreamEnd(buffer, res);
            return;
          }

          try {
            const parsed = JSON.parse(dataString);
            const token = parsed.choices?.[0]?.delta?.content || '';
            if (token) {
              buffer += token;
              res.write(`data: ${JSON.stringify({ token })}\n\n`);
            }
          } catch (err) {
            logger.debug('[AIService] Skipping malformed stream chunk:', err.message);
          }
        }
      });

      response.data.on('error', (err) => {
        logger.error('[AIService] Stream data error:', err.message);
        res.write(`data: ${JSON.stringify({ error: 'Connection interrupted' })}\n\n`);
        res.end();
      });
    } catch (error) {
      logger.error('[AIService] Stream setup failed:', error.response?.data || error.message);
      res.write(`data: ${JSON.stringify({ error: 'Failed to initialize AI stream' })}\n\n`);
      res.end();
    }
  }

  _handleStreamEnd(buffer, res) {
    try {
      // Try to parse the complete buffer as JSON insights
      const parsed = JSON.parse(buffer);
      res.write(`data: ${JSON.stringify({ done: true, insights: parsed })}\n\n`);
    } catch (error) {
      console.warn('Failed to parse stream chunk:', error.message);

      // If it's not JSON (e.g. partial or plain text), just signal completion
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    }
    res.end();
  }

  _headers() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'HTTP-Referer': config.urls.frontend,
      'X-Title': 'Carbon Coach AI',
      'Content-Type': 'application/json',
    };
  }

  _buildPrompt(estimationData, normalizedInputs) {
    const {
      totalMonthlyCO2,
      topSource,
      severityLevel,
      transportCO2,
      foodCO2,
      energyCO2,
      shoppingCO2,
    } = estimationData;
    return [
      {
        role: 'system',
        content: `You are "Carbon Coach", a premium AI sustainability expert.
Your goal is to provide 3 actionable, highly impactful, and personalized tips to reduce a user's carbon footprint.
Be encouraging, professional, and data-driven.
Format your response as a JSON object with this structure:
{
  "explanation": "A concise 2-sentence explanation of why their footprint is at this level.",
  "tips": [
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." },
    { "title": "...", "description": "..." }
  ],
  "encouragement": "A short, inspiring closing sentence."
}`,
      },
      {
        role: 'user',
        content: `Calculate insights for this carbon footprint:
- Total Monthly CO2: ${(totalMonthlyCO2 || 0).toFixed(2)} kg
- Top Source: ${topSource}
- Severity: ${severityLevel}
- Breakdown: Transport: ${(transportCO2 || 0).toFixed(2)}kg, Food: ${(foodCO2 || 0).toFixed(
          2,
        )}kg, Energy: ${(energyCO2 || 0).toFixed(2)}kg, Shopping: ${(shoppingCO2 || 0).toFixed(2)}kg
- Primary transport: ${normalizedInputs?.primaryMode || 'unknown'}, Diet: ${normalizedInputs?.dietType || 'unknown'
          }

Respond ONLY with the JSON object.`,
      },
    ];
  }
}

export default new AIService();
