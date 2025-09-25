import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";
import FakeResearchDashboard from "@/components/FakeResearchDashboard";
import ApiKeySetup from "@/components/ApiKeySetup";
import { useClaudeApi } from "@/hooks/useClaudeApi";
import { type AnalysisResult } from "@/services/claudeApi";
import { fakeResearchData } from "@/data/fakeResearch";
import { Button } from "@/components/ui/button";
import { Key, Loader2 } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard" | "fake-research">("landing");
  const [analysisData, setAnalysisData] = useState<{
    text: string;
    field?: string;
    file?: File;
  } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedFakeResearch, setSelectedFakeResearch] = useState<string | null>(null);
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

  // Debug effect - API key durumunu takip et
  useEffect(() => {
    console.log("🔑 API Key State Changed:", {
      hasApiKey: !!apiKey,
      isValidKey,
      isTestingKey,
      isAnalyzing,
      apiKeyLength: apiKey?.length || 0,
      apiKeyPrefix: apiKey?.substring(0, 10) || 'none'
    });
  }, [apiKey, isValidKey, isTestingKey, isAnalyzing]);

  // API key'i otomatik set et
  useEffect(() => {
    const providedKey = "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";
    if (!apiKey && providedKey) {
      console.log("🔧 Setting provided API key...");
      setApiKey(providedKey);
    }
  }, [apiKey, setApiKey]);

  const handleAnalyze = async (data: { text: string; field?: string; file?: File }) => {
    console.log("🚀 Starting analysis with data:", {
      hasText: !!data.text,
      textLength: data.text?.length || 0,
      field: data.field,
      hasFile: !!data.file
    });

    // Check if API key is configured
    if (!apiKey || !isValidKey) {
      console.error("❌ API key not configured or invalid");
      setShowApiKeySetup(true);
      return;
    }

    if (!data.text || data.text.trim().length === 0) {
      console.error("❌ No text provided for analysis");
      return;
    }

    // Reset states
    setAnalysisData(data);
    setAnalysisResult(null);
    setCurrentView("landing");
    
    try {
      console.log("📝 Analyzing text:", data.text.substring(0, 100) + "...");
      const result = await analyzeResearch(data.text, data.field);
      
      if (result && result.marketAnalysis && result.technicalFeasibility && 
          result.commercialPotential && result.teamAndExecution) {
        console.log("🎯 Valid result received, setting state and switching to dashboard");
        setAnalysisResult(result);
        setTimeout(() => {
          setCurrentView("dashboard");
        }, 100);
      } else {
        console.error("❌ Analysis returned incomplete result:", result);
      }
    } catch (error) {
      console.error("💥 Analysis failed:", error);
      setAnalysisResult(null);
      setCurrentView("landing");
    }
  };

  const handleViewFakeResearch = (researchId: string) => {
    setSelectedFakeResearch(researchId);
    setCurrentView("fake-research");
  };

  const handleBackToLanding = () => {
    console.log("🔙 Going back to landing page");
    setCurrentView("landing");
    setAnalysisData(null);
    setAnalysisResult(null);
    setSelectedFakeResearch(null);
  };

  // Show loading state while analyzing
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Analyzing Research...</h2>
          <p className="text-slate-600">AI is processing your research abstract</p>
          <p className="text-sm text-slate-500">This may take 10-30 seconds</p>
        </div>
      </div>
    );
  }

  // Show fake research dashboard
  if (currentView === "fake-research" && selectedFakeResearch) {
    const researchItem = fakeResearchData.find(item => item.id === selectedFakeResearch);
    if (!researchItem) {
      setCurrentView("landing");
      return null;
    }

    return (
      <FakeResearchDashboard 
        onBack={handleBackToLanding}
        researchItem={researchItem}
      />
    );
  }

  // Show real analysis dashboard
  if (currentView === "dashboard") {
    if (!analysisResult) {
      console.error("❌ CRITICAL: Trying to show dashboard without analysisResult, forcing back to landing");
      setCurrentView("landing");
      return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-600">Error: No analysis results available</p>
            <Button onClick={() => setCurrentView("landing")}>Back to Landing</Button>
          </div>
        </div>
      );
    }

    return (
      <Dashboard 
        onBack={handleBackToLanding} 
        analysisResult={analysisResult}
        analysisData={analysisData}
      />
    );
  }

  // Show landing page
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
          onViewFakeResearch={handleViewFakeResearch}
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