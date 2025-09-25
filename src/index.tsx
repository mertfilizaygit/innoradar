import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import ApiKeySetup from "@/components/ApiKeySetup";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { type AnalysisResult } from "@/services/claudeApi";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [analysisData, setAnalysisData] = useState<{
    text: string;
    field?: string;
    file?: File;
  } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  const {
    apiKey,
    setApiKey,
    isValidKey,
    isTestingKey,
    isAnalyzing,
    analyzeResearch,
    testApiKey,
    clearApiKey,
  } = useClaudeApi();

  const handleAnalyze = async (data: { text: string; field?: string; file?: File }) => {
    // Check if API key is configured
    if (!apiKey || !isValidKey) {
      setShowApiKeySetup(true);
      return;
    }

    setAnalysisData(data);
    
    try {
      if (data.text) {
        const result = await analyzeResearch(data.text, data.field);
        if (result) {
          setAnalysisResult(result);
          setCurrentView("dashboard");
        }
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setAnalysisData(null);
    setAnalysisResult(null);
  };

  if (currentView === "dashboard" && analysisResult) {
    return (
      <Dashboard 
        onBack={handleBackToLanding} 
        analysisResult={analysisResult}
        analysisData={analysisData}
      />
    );
  }

  return (
    <>
      <div className="relative">
        {/* API Key Status */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant={isValidKey ? "default" : "outline"}
            size="sm"
            onClick={() => setShowApiKeySetup(true)}
            className={`flex items-center gap-2 ${
              isValidKey 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "border-orange-500 text-orange-600"
            }`}
          >
            <Key className="w-4 h-4" />
            {isValidKey ? "API Connected" : "Setup API Key"}
          </Button>
        </div>

        <LandingPage 
          onAnalyze={handleAnalyze} 
          isAnalyzing={isAnalyzing}
          hasValidApiKey={isValidKey}
        />
      </div>

      <ApiKeySetup
        isOpen={showApiKeySetup}
        onClose={() => setShowApiKeySetup(false)}
        currentApiKey={apiKey}
        onSetApiKey={setApiKey}
        onTestApiKey={testApiKey}
        isValidKey={isValidKey}
        isTestingKey={isTestingKey}
        onClearApiKey={clearApiKey}
      />
    </>
  );
};

export default Index;