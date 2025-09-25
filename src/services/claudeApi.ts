interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

interface AnalysisResult {
  marketAnalysis: {
    score: number;
    summary: string;
    marketSize: string;
    competition: string;
    trends: string[];
  };
  technicalFeasibility: {
    score: number;
    summary: string;
    complexity: string;
    timeToMarket: string;
    risks: string[];
  };
  commercialPotential: {
    score: number;
    summary: string;
    revenueModel: string;
    scalability: string;
    barriers: string[];
  };
  teamAndExecution: {
    score: number;
    summary: string;
    expertise: string;
    resources: string;
    recommendations: string[];
  };
  overallScore: number;
  investmentRecommendation: string;
  keyInsights: string[];
  nextSteps: string[];
}

class ClaudeApiService {
  private apiKey: string;
  private baseUrl = '/api/anthropic/v1/messages'; // Proxy kullanıyoruz

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true' // ✅ Bu header gerekli!
    };
  }

  private createVCAnalysisPrompt(researchText: string, field?: string): string {
    const fieldContext = field ? `Research Field: ${field}\n\n` : '';
    
    return `You are a senior venture capital analyst with 15+ years of experience evaluating research commercialization opportunities. Analyze the following research abstract for startup and investment potential.

${fieldContext}Research Abstract:
${researchText}

Provide a comprehensive VC-style analysis in the following JSON format (return ONLY valid JSON, no additional text):

{
  "marketAnalysis": {
    "score": [0-100],
    "summary": "Brief market assessment (2-3 sentences)",
    "marketSize": "Estimated market size and growth potential",
    "competition": "Competitive landscape analysis",
    "trends": ["trend1", "trend2", "trend3"]
  },
  "technicalFeasibility": {
    "score": [0-100],
    "summary": "Technical viability assessment (2-3 sentences)",
    "complexity": "Implementation complexity level",
    "timeToMarket": "Estimated development timeline",
    "risks": ["risk1", "risk2", "risk3"]
  },
  "commercialPotential": {
    "score": [0-100],
    "summary": "Commercial viability assessment (2-3 sentences)",
    "revenueModel": "Potential business models",
    "scalability": "Scalability assessment",
    "barriers": ["barrier1", "barrier2", "barrier3"]
  },
  "teamAndExecution": {
    "score": [0-100],
    "summary": "Team and execution assessment (2-3 sentences)",
    "expertise": "Required expertise and team composition",
    "resources": "Resource requirements",
    "recommendations": ["rec1", "rec2", "rec3"]
  },
  "overallScore": [0-100],
  "investmentRecommendation": "STRONG BUY / BUY / HOLD / WEAK / PASS",
  "keyInsights": ["insight1", "insight2", "insight3", "insight4"],
  "nextSteps": ["step1", "step2", "step3", "step4"]
}

Scoring Guidelines:
- 90-100: Exceptional opportunity, clear path to unicorn status
- 80-89: Strong opportunity with high growth potential
- 70-79: Good opportunity with moderate risks
- 60-69: Average opportunity, needs significant work
- 50-59: Below average, major concerns
- 0-49: Poor opportunity, not recommended

Focus on:
- Market timing and size
- Technical differentiation and IP potential
- Business model viability
- Competitive advantages
- Scalability factors
- Risk assessment
- Capital requirements
- Exit potential`;
  }

  async analyzeResearch(researchText: string, field?: string): Promise<AnalysisResult> {
    if (!this.apiKey) {
      throw new Error('Claude API key is required');
    }

    if (!researchText.trim()) {
      throw new Error('Research text is required');
    }

    console.log('🔗 Making API request to:', this.baseUrl);
    console.log('🔑 Using API key:', this.apiKey.substring(0, 20) + '...');

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 4000,
          messages: [{
            role: 'user',
            content: this.createVCAnalysisPrompt(researchText, field)
          }]
        })
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(`Claude API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data: ClaudeResponse = await response.json();
      console.log('✅ Raw API Response:', data);
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from Claude API');
      }

      const analysisText = data.content[0].text.trim();
      console.log('📝 Analysis text received:', analysisText.substring(0, 200) + '...');
      
      // Parse JSON response
      try {
        const analysis: AnalysisResult = JSON.parse(analysisText);
        
        // Validate required fields
        if (!analysis.marketAnalysis || !analysis.technicalFeasibility || 
            !analysis.commercialPotential || !analysis.teamAndExecution) {
          throw new Error('Incomplete analysis structure');
        }

        console.log('✅ Successfully parsed analysis:', {
          hasMarketAnalysis: !!analysis.marketAnalysis,
          hasTechnicalFeasibility: !!analysis.technicalFeasibility,
          hasCommercialPotential: !!analysis.commercialPotential,
          hasTeamAndExecution: !!analysis.teamAndExecution,
          overallScore: analysis.overallScore
        });

        return analysis;
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Raw response:', analysisText);
        throw new Error('Failed to parse analysis results. Please try again.');
      }

    } catch (error) {
      console.error('Claude API Error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to analyze research. Please check your connection and try again.');
    }
  }

  // Test API key validity
  async testApiKey(): Promise<boolean> {
    try {
      console.log('🧪 Testing API key...');
      console.log('🔗 Request URL:', this.baseUrl);
      console.log('🔑 API Key format check:', {
        length: this.apiKey.length,
        startsWithCorrectPrefix: this.apiKey.startsWith('sk-ant-api03-'),
        firstChars: this.apiKey.substring(0, 15),
        lastChars: this.apiKey.substring(this.apiKey.length - 10)
      });

      const requestBody = {
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{
          role: 'user',
          content: 'Test'
        }]
      };

      const headers = this.getHeaders();
      console.log('📤 Request body:', requestBody);
      console.log('📤 Request headers:', {
        ...headers,
        'x-api-key': headers['x-api-key'].substring(0, 20) + '...'
      });

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      console.log('🧪 Test response status:', response.status);
      console.log('🧪 Test response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🧪 Test response error:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          console.error('🧪 Parsed error:', errorJson);
        } catch {
          console.error('🧪 Could not parse error as JSON');
        }
      } else {
        console.log('🎉 API key test successful!');
      }

      const isValid = response.ok;
      console.log('🧪 API key is valid:', isValid);
      return isValid;
    } catch (error) {
      console.error('🧪 API key test failed:', error);
      return false;
    }
  }
}

export { ClaudeApiService, type AnalysisResult };