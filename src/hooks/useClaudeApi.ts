import { useState, useCallback, useEffect } from 'react';
import { ClaudeApiService, type AnalysisResult } from '@/services/claudeApi';
import { useToast } from '@/hooks/use-toast';

interface UseClaudeApiReturn {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  isValidKey: boolean;
  isTestingKey: boolean;
  isAnalyzing: boolean;
  analyzeResearch: (text: string, field?: string) => Promise<AnalysisResult | null>;
  testApiKey: (key: string) => Promise<boolean>;
  clearApiKey: () => void;
}

export const useClaudeApi = (): UseClaudeApiReturn => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isValidKey, setIsValidKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem('claude_api_key');
    if (savedKey) {
      setApiKeyState(savedKey);
      testApiKeyInternal(savedKey);
    }
  }, []);

  const setApiKey = useCallback((key: string) => {
    const trimmedKey = key.trim();
    setApiKeyState(trimmedKey);
    
    if (trimmedKey) {
      localStorage.setItem('claude_api_key', trimmedKey);
      testApiKeyInternal(trimmedKey);
    } else {
      localStorage.removeItem('claude_api_key');
      setIsValidKey(false);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState(null);
    setIsValidKey(false);
    localStorage.removeItem('claude_api_key');
    toast({
      title: "API Key Cleared",
      description: "Your Claude API key has been removed.",
    });
  }, [toast]);

  const testApiKeyInternal = async (key: string) => {
    if (!key.trim()) {
      setIsValidKey(false);
      return;
    }

    setIsTestingKey(true);
    try {
      const service = new ClaudeApiService(key);
      const isValid = await service.testApiKey();
      setIsValidKey(isValid);
      
      if (!isValid) {
        toast({
          title: "Invalid API Key",
          description: "The provided Claude API key is not valid.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsValidKey(false);
      toast({
        title: "API Key Test Failed",
        description: "Could not validate the API key.",
        variant: "destructive",
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const testApiKey = useCallback(async (key: string): Promise<boolean> => {
    setIsTestingKey(true);
    try {
      const service = new ClaudeApiService(key);
      const isValid = await service.testApiKey();
      
      if (isValid) {
        toast({
          title: "API Key Valid",
          description: "Your Claude API key is working correctly!",
        });
      } else {
        toast({
          title: "Invalid API Key",
          description: "The provided Claude API key is not valid.",
          variant: "destructive",
        });
      }
      
      return isValid;
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not test the API key.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTestingKey(false);
    }
  }, [toast]);

  const analyzeResearch = useCallback(async (
    text: string, 
    field?: string
  ): Promise<AnalysisResult | null> => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please provide your Claude API key to analyze research.",
        variant: "destructive",
      });
      return null;
    }

    if (!isValidKey) {
      toast({
        title: "Invalid API Key",
        description: "Your API key is not valid. Please update it.",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    try {
      const service = new ClaudeApiService(apiKey);
      const result = await service.analyzeResearch(text, field);
      
      toast({
        title: "Analysis Complete",
        description: "Your research has been successfully analyzed!",
      });
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [apiKey, isValidKey, toast]);

  return {
    apiKey,
    setApiKey,
    isValidKey,
    isTestingKey,
    isAnalyzing,
    analyzeResearch,
    testApiKey,
    clearApiKey,
  };
};