import axios from 'axios';

/**
 * Service to interact with OpenRouter API for generating AI insights.
 */
class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.model = 'openai/gpt-oss-120b:free';
    // this.model = 'nvidia/nemotron-3-ultra-550b-a55b:free';
  }

  async generateCarbonInsights(estimationData, normalizedInputs) {
    if (!this.apiKey) {
      console.warn('[AIService] OpenRouter API key missing. Skipping AI insights.');
      return null;
    }

    const prompt = this._buildPrompt(estimationData, normalizedInputs);

    try {
      const response = await axios.post(
        this.apiUrl,
        { model: this.model, messages: prompt, response_format: { type: 'json_object' } },
        { headers: this._headers() }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('[AIService] Failed to generate AI insights:', error.response?.data || error.message);
      return null;
    }
  }

  async streamCarbonInsights(estimationData, normalizedInputs, res) {
    if (!this.apiKey) {
      res.write(`data: ${JSON.stringify({ error: 'AI key missing' })}\n\n`);
      res.end();
      return;
    }

    const prompt = this._buildPrompt(estimationData, normalizedInputs);

    try {
      const response = await axios.post(
        this.apiUrl,
        { model: this.model, messages: prompt, stream: true },
        { headers: this._headers(), responseType: 'stream' }
      );

      let buffer = '';

      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(l => l.trim());
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (data === '[DONE]') {
            res.write(`data: [DONE]\n\n`);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content || '';
            if (token) {
              buffer += token;
              res.write(`data: ${JSON.stringify({ token })}\n\n`);
            }
          } catch (_) { /* skip malformed */ }
        }
      });

      response.data.on('end', () => {
        // Try to persist parsed insights after stream completes
        try {
          const parsed = JSON.parse(buffer);
          res.write(`data: ${JSON.stringify({ done: true, insights: parsed })}\n\n`);
        } catch (_) {
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        }
        res.end();
      });

      response.data.on('error', (err) => {
        console.error('[AIService] Stream error:', err.message);
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        res.end();
      });
    } catch (error) {
      console.error('[AIService] Stream setup failed:', error.response?.data || error.message);
      res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`);
      res.end();
    }
  }

  _headers() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': 'https://carbon-coach-ai.example.com',
      'X-Title': 'Carbon Coach AI',
      'Content-Type': 'application/json',
    };
  }

  _buildPrompt(estimationData, normalizedInputs) {
    const { totalMonthlyCO2, topSource, severityLevel, transportCO2, foodCO2, energyCO2, shoppingCO2 } = estimationData;
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
}`
      },
      {
        role: 'user',
        content: `Calculate insights for this carbon footprint:
- Total Monthly CO2: ${(totalMonthlyCO2 || 0).toFixed(2)} kg
- Top Source: ${topSource}
- Severity: ${severityLevel}
- Breakdown: Transport: ${(transportCO2 || 0).toFixed(2)}kg, Food: ${(foodCO2 || 0).toFixed(2)}kg, Energy: ${(energyCO2 || 0).toFixed(2)}kg, Shopping: ${(shoppingCO2 || 0).toFixed(2)}kg
- Primary transport: ${normalizedInputs?.primaryMode || 'unknown'}, Diet: ${normalizedInputs?.dietType || 'unknown'}

Respond ONLY with the JSON object.`
      }
    ];
  }
}

export default new AIService();
