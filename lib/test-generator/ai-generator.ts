/**
 * AI-Powered Test Generation
 * Uses OpenAI API / GitHub Models API to generate actual test implementations
 */

export interface AITestGeneratorConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AITestContext {
  componentName: string;
  scenario: string;
  type: 'acceptance' | 'happy' | 'edge' | 'error' | 'accessibility';
  props?: string;
  events?: string;
  userStory?: string;
  acceptanceCriteria?: string[];
}

/**
 * Generate a test implementation using AI
 */
export async function generateTestWithAI(
  context: AITestContext,
  config: AITestGeneratorConfig = {}
): Promise<string | null> {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY || process.env.GITHUB_TOKEN;

  if (!apiKey) {
    console.warn('⚠️  No API key found. Falling back to scaffold generation.');
    return null;
  }

  try {
    const prompt = buildPrompt(context);
    const testCode = await callAI(prompt, apiKey, config);
    return testCode;
  } catch (error) {
    console.error('❌ AI generation failed:', (error as Error).message);
    return null;
  }
}

/**
 * Build the prompt for AI test generation
 */
function buildPrompt(context: AITestContext): string {
  const { componentName, scenario, type, props, events, userStory, acceptanceCriteria } = context;

  const typeLabel: Record<typeof type, string> = {
    acceptance: 'Acceptance Criteria',
    happy: 'Happy Path',
    edge: 'Edge Case',
    error: 'Error Handling',
    accessibility: 'Accessibility'
  };

  let prompt = `Generate a Vue 3 component test using Vitest and Testing Library.

Component: ${componentName}
Test Type: ${typeLabel[type]}
Scenario: ${scenario}
`;

  if (userStory) {
    prompt += `\nUser Story: ${userStory}`;
  }

  if (props) {
    prompt += `\nProps: ${props}`;
  }

  if (events) {
    prompt += `\nEvents: ${events}`;
  }

  if (acceptanceCriteria && acceptanceCriteria.length > 0) {
    prompt += `\nAcceptance Criteria:\n${acceptanceCriteria.map(c => `- ${c}`).join('\n')}`;
  }

  prompt += `

Requirements:
- Use Testing Library queries (prefer getByRole, getByLabelText, getByText)
- Use user-event for interactions (from render() return value)
- Include proper async/await handling
- Write clear, descriptive assertions
- Follow accessibility-first testing practices
- Use Arrange/Act/Assert pattern with comments
- Return ONLY the test implementation code (the it() block content)
- Do NOT include the it() declaration itself, only the test body
- Do NOT include surrounding describe() blocks
- Start with // Arrange comment
- Use proper TypeScript types

Example format:
// Arrange
const { user } = render(${componentName}, {
  props: { /* props here */ }
});

// Act
await user.click(screen.getByRole('button', { name: /submit/i }));

// Assert
expect(screen.getByText('Success!')).toBeInTheDocument();

Generate the test implementation:`;

  return prompt;
}

/**
 * Call the AI API to generate test code
 */
async function callAI(
  prompt: string,
  apiKey: string,
  config: AITestGeneratorConfig
): Promise<string> {
  const model = config.model || 'gpt-4o-mini';
  const maxTokens = config.maxTokens || 500;
  const temperature = config.temperature || 0.3;

  // Try GitHub Models API first (if using GITHUB_TOKEN)
  if (apiKey.startsWith('ghp_') || apiKey.startsWith('ghs_')) {
    return await callGitHubModels(prompt, apiKey, model, maxTokens, temperature);
  }

  // Otherwise use OpenAI API
  return await callOpenAI(prompt, apiKey, model, maxTokens, temperature);
}

/**
 * Call GitHub Models API
 */
async function callGitHubModels(
  prompt: string,
  token: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are an expert Vue.js test engineer. Generate clean, maintainable test code following Testing Library and TDD best practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: model,
      max_tokens: maxTokens,
      temperature: temperature
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub Models API error: ${response.status} - ${error}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return extractTestCode(data.choices[0].message.content);
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  prompt: string,
  apiKey: string,
  model: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert Vue.js test engineer. Generate clean, maintainable test code following Testing Library and TDD best practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return extractTestCode(data.choices[0].message.content);
}

/**
 * Extract clean test code from AI response
 */
function extractTestCode(response: string): string {
  // Remove markdown code blocks if present
  let code = response.trim();

  // Remove ```typescript or ```javascript markers
  code = code.replace(/^```(?:typescript|javascript|ts|js)?\n/gm, '');
  code = code.replace(/\n```$/g, '');

  // If the AI included the it() wrapper despite instructions, extract the body
  const itMatch = code.match(/it\([^,]+,\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{([\s\S]*)\}\s*\);?$/);
  if (itMatch) {
    code = itMatch[1].trim();
  }

  return code.trim();
}

/**
 * Validate API configuration
 */
export function validateAIConfig(config: AITestGeneratorConfig = {}): {
  valid: boolean;
  message: string;
  provider?: 'openai' | 'github';
} {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY || process.env.GITHUB_TOKEN;

  if (!apiKey) {
    return {
      valid: false,
      message: 'No API key found. Set OPENAI_API_KEY or GITHUB_TOKEN environment variable.'
    };
  }

  if (apiKey.startsWith('ghp_') || apiKey.startsWith('ghs_')) {
    return {
      valid: true,
      message: 'GitHub Models API configured',
      provider: 'github'
    };
  }

  if (apiKey.startsWith('sk-')) {
    return {
      valid: true,
      message: 'OpenAI API configured',
      provider: 'openai'
    };
  }

  return {
    valid: false,
    message: 'Invalid API key format. Expected OpenAI key (sk-...) or GitHub token (ghp_...)'
  };
}
