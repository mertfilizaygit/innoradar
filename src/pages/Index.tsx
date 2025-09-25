import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");
  const [analysisData, setAnalysisData] = useState<{
    text: string;
    field?: string;
    file?: File;
  } | null>(null);

  const handleAnalyze = (data: { text: string; field?: string; file?: File }) => {
    setAnalysisData(data);
    // Simulate processing time
    setTimeout(() => {
      setCurrentView("dashboard");
    }, 1500);
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setAnalysisData(null);
  };

  if (currentView === "dashboard") {
    return <Dashboard onBack={handleBackToLanding} />;
  }

  return <LandingPage onAnalyze={handleAnalyze} />;
};

export default Index;
