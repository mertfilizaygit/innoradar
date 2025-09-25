import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { type AnalysisResult } from "@/services/claudeApi";

import { 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle,
  DollarSign,
  Building2,
  Lightbulb,
  ArrowLeft
} from "lucide-react";
import RadarChart from "./RadarChart";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface DashboardProps {
  onBack: () => void;
  analysisResult: AnalysisResult;
  analysisData: {
    text: string;
    field?: string;
    file?: File;
  } | null;
}

const Dashboard = ({ onBack, analysisResult, analysisData }: DashboardProps) => {
  const { toast } = useToast();

  // Debug logs
  useEffect(() => {
    console.log("Dashboard rendered with analysisResult:", analysisResult);
    console.log("analysisData:", analysisData);
    
    if (!analysisResult) {
      console.error("❌ analysisResult is undefined! This should not happen.");
    } else {
      console.log("✅ analysisResult is valid:", {
        marketAnalysis: !!analysisResult.marketAnalysis,
        technicalFeasibility: !!analysisResult.technicalFeasibility,
        commercialPotential: !!analysisResult.commercialPotential,
        teamAndExecution: !!analysisResult.teamAndExecution,
        overallScore: analysisResult.overallScore,
        investmentRecommendation: analysisResult.investmentRecommendation
      });
    }
  }, [analysisResult, analysisData]);

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your VC pitch deck is being generated...",
    });
  };

  // Convert API scores from 0-100 to 0-10 scale for display
  const normalizeScore = (score: number): number => {
    return parseFloat((score / 10).toFixed(1));
  };

  // Get investment recommendation badge variant
  const getRecommendationVariant = (recommendation: string): string => {
    const rec = recommendation.toLowerCase();
    if (rec.includes("strong buy")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (rec.includes("buy")) return "bg-green-100 text-green-700 border-green-200";
    if (rec.includes("hold")) return "bg-amber-100 text-amber-700 border-amber-200";
    if (rec.includes("weak")) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200"; // PASS
  };

  // Get overall score text variant
  const getScoreVariant = (score: number): string => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 70) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  // Get a title from the research text (first 50 chars)
  const getResearchTitle = (): string => {
    if (!analysisData?.text) return "Research Analysis";
    const text = analysisData.text.trim();
    const firstLine = text.split('\n')[0];
    return firstLine.length > 50 ? `${firstLine.substring(0, 50)}...` : firstLine;
  };

  // analysisResult undefined ise hata göster
  if (!analysisResult) {
    console.error("❌ CRITICAL: analysisResult is undefined");
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Analysis Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              No analysis results available. Please go back and try analyzing your research again.
            </p>
            <Button onClick={onBack} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Input
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare radar chart data from analysis result
  const scores = [
    { category: "Market Size", score: normalizeScore(analysisResult.marketAnalysis?.score || 0), max: 10 },
    { category: "Tech Readiness", score: normalizeScore(analysisResult.technicalFeasibility?.score || 0), max: 10 },
    { category: "Scalability", score: normalizeScore(analysisResult.commercialPotential?.score || 0), max: 10 },
    { category: "Team Potential", score: normalizeScore(analysisResult.teamAndExecution?.score || 0), max: 10 },
    { category: "Impact", score: normalizeScore(analysisResult.overallScore || 0), max: 10 },
  ];

  console.log("🎯 Rendering dashboard with valid data:", {
    hasMarketAnalysis: !!analysisResult.marketAnalysis,
    hasTechnicalFeasibility: !!analysisResult.technicalFeasibility,
    hasCommercialPotential: !!analysisResult.commercialPotential,
    hasTeamAndExecution: !!analysisResult.teamAndExecution,
    scoresCalculated: scores.length
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/30 shadow-sm sticky top-0 z-10 relative">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="group border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                Back to Input
              </Button>
              <h1 className="text-2xl font-bold text-slate-800">Research Analysis Dashboard</h1>
            </div>
            <Button 
              onClick={handleExport} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export VC One-Pager
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Card */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-slate-800">Research Summary</CardTitle>
                <Badge variant="secondary" className={getRecommendationVariant(analysisResult.investmentRecommendation || "HOLD")}>
                  {analysisResult.investmentRecommendation || "HOLD"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg text-slate-800">
                "{getResearchTitle()}"
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {analysisResult.marketAnalysis?.summary || "Market analysis summary not available."}
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-slate-800">Key Insights:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-slate-600">
                  {analysisResult.keyInsights && analysisResult.keyInsights.length > 0 ? (
                    analysisResult.keyInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))
                  ) : (
                    <li>No key insights available.</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps (replacing Investment Score) */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-vc-primary">Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisResult.nextSteps && analysisResult.nextSteps.length > 0 ? (
                analysisResult.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="bg-indigo-100 text-indigo-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-slate-700">{step}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No next steps available.</p>
              )}
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-slate-800">Evaluation Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <RadarChart scores={scores} />
                </div>
                <div className="space-y-4">
                  {scores.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-slate-700">{item.category}</span>
                        <span className="text-sm text-indigo-600 font-semibold">{item.score}/10</span>
                      </div>
                      <Progress value={(item.score / item.max) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Concept */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Lightbulb className="w-5 h-5" />
                Product Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Commercial Opportunity</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {analysisResult.commercialPotential?.summary || "Commercial potential summary not available."}
                </p>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-slate-700">Potential Revenue Model</h5>
                  <p className="text-sm text-slate-600">
                    {analysisResult.commercialPotential?.revenueModel || "Revenue model not specified."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <TrendingUp className="w-5 h-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Market Size</span>
                <span className="font-bold text-emerald-600">
                  {analysisResult.marketAnalysis?.marketSize || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Scalability</span>
                <span className="font-bold text-slate-800">
                  {analysisResult.commercialPotential?.scalability || "N/A"}
                </span>
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-slate-700">Market Trends</h5>
                <ul className="text-xs text-slate-500 space-y-1">
                  {analysisResult.marketAnalysis?.trends && analysisResult.marketAnalysis.trends.length > 0 ? (
                    analysisResult.marketAnalysis.trends.map((trend, index) => (
                      <li key={index}>• {trend}</li>
                    ))
                  ) : (
                    <li>• No market trends available</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Landscape */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Building2 className="w-5 h-5" />
                Competition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-medium text-sm text-slate-800 mb-2">Competitive Landscape</div>
                <div className="text-sm text-slate-600">
                  {analysisResult.marketAnalysis?.competition || "Competitive analysis not available."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risks & Barriers */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <AlertTriangle className="w-5 h-5" />
                Risks & Barriers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-600">Technical Risks</h4>
                  <ul className="text-sm text-slate-600 space-y-1 leading-relaxed">
                    {analysisResult.technicalFeasibility?.risks && analysisResult.technicalFeasibility.risks.length > 0 ? (
                      analysisResult.technicalFeasibility.risks.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))
                    ) : (
                      <li>• No technical risks identified</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Market Barriers</h4>
                  <ul className="text-sm text-slate-600 space-y-1 leading-relaxed">
                    {analysisResult.commercialPotential?.barriers && analysisResult.commercialPotential.barriers.length > 0 ? (
                      analysisResult.commercialPotential.barriers.map((barrier, index) => (
                        <li key={index}>• {barrier}</li>
                      ))
                    ) : (
                      <li>• No market barriers identified</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-indigo-600">Team Recommendations</h4>
                  <ul className="text-sm text-slate-600 space-y-1 leading-relaxed">
                    {analysisResult.teamAndExecution?.recommendations && analysisResult.teamAndExecution.recommendations.length > 0 ? (
                      analysisResult.teamAndExecution.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))
                    ) : (
                      <li>• No team recommendations available</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team & Execution */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Users className="w-5 h-5" />
                Team & Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                {analysisResult.teamAndExecution?.summary || "Team and execution analysis not available."}
              </p>
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-slate-700">Required Expertise</h5>
                <p className="text-sm text-slate-600">
                  {analysisResult.teamAndExecution?.expertise || "Expertise requirements not specified."}
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-slate-700">Resources</h5>
                <p className="text-sm text-slate-600">
                  {analysisResult.teamAndExecution?.resources || "Resource requirements not specified."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;