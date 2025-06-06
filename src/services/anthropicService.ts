
interface AnthropicMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AnthropicResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export class AnthropicService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateGovUKComponents(userPrompt: string): Promise<string> {
    const systemPrompt = `You are an expert in GOV.UK Design System components. Generate specific component configurations based on user requests.

Available GOV.UK component types:
- button: { text: string, variant: 'primary' | 'secondary' | 'warning' }
- input: { label: string, name: string, required?: boolean, placeholder?: string, hint?: string }
- textarea: { label: string, name: string, required?: boolean, placeholder?: string, hint?: string }
- radios: { label: string, name: string, options: string[], required?: boolean }
- checkboxes: { label: string, name: string, options: string[], required?: boolean }

Return ONLY a JSON array of component configurations. No explanations or markdown.

Examples:
For "contact form": [{"type":"input","props":{"label":"Full name","name":"full-name","required":true}},{"type":"input","props":{"label":"Email address","name":"email","required":true}},{"type":"textarea","props":{"label":"Message","name":"message","required":true}},{"type":"button","props":{"text":"Send message","variant":"primary"}}]

For "feedback survey": [{"type":"radios","props":{"label":"How satisfied were you with this service?","name":"satisfaction","required":true,"options":["Very satisfied","Satisfied","Neither satisfied nor dissatisfied","Dissatisfied","Very dissatisfied"]}},{"type":"button","props":{"text":"Submit feedback","variant":"primary"}}]`;

    const messages: AnthropicMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: AnthropicResponse = await response.json();
      return data.content[0]?.text || '';
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }
}
