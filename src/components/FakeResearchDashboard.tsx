import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle,
  DollarSign,
  Building2,
  Lightbulb,
  ArrowLeft,
  CheckCircle,
  BarChart3,
  Calendar,
  MapPin,
  User
} from "lucide-react";
import RadarChart from "./RadarChart";
import { useToast } from "@/hooks/use-toast";
import { type FakeResearchItem } from "@/data/fakeResearch";

interface FakeResearchDashboardProps {
  onBack: () => void;
  researchItem: FakeResearchItem;
}

const FakeResearchDashboard = ({ onBack, researchItem }: FakeResearchDashboardProps) => {
  const { toast } = useToast();

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

  // Prepare radar chart data from analysis result
  const scores = [
    { category: "Market Size", score: normalizeScore(researchItem.analysisResult.marketAnalysis?.score || 0), max: 10 },
    { category: "Tech Readiness", score: normalizeScore(researchItem.analysisResult.technicalFeasibility?.score || 0), max: 10 },
    { category: "Scalability", score: normalizeScore(researchItem.analysisResult.commercialPotential?.score || 0), max: 10 },
    { category: "Team Potential", score: normalizeScore(researchItem.analysisResult.teamAndExecution?.score || 0), max: 10 },
    { category: "Impact", score: normalizeScore(researchItem.analysisResult.overallScore || 0), max: 10 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="group border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
                Back to Research
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Research Analysis Dashboard</h1>
            </div>
            <Button 
              onClick={handleExport} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export VC One-Pager
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Research Summary - Full Width */}
          <Card className="lg:col-span-4 shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-900">Research Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{researchItem.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{researchItem.institution}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{researchItem.publishedDate}</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg text-gray-900 mb-3">
                {researchItem.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {researchItem.abstract}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {researchItem.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="space-y-2 mt-6">
                <h4 className="font-medium text-gray-900">Key Insights:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                  {researchItem.analysisResult.keyInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps - Modern Design */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {researchItem.analysisResult.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-lg border border-blue-100">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Evaluation Metrics - Fixed Layout */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Evaluation Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="h-72 flex items-center justify-center">
                  <RadarChart scores={scores} />
                </div>
                <div className="space-y-4">
                  {scores.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                          {item.score}/10
                        </span>
                      </div>
                      <Progress value={(item.score / item.max) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis - Improved Layout */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <BarChart3 className="w-5 h-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/80 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">Market Size</span>
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-base text-green-700">
                    {researchItem.analysisResult.marketAnalysis?.marketSize}
                  </div>
                </div>
                
                <div className="bg-white/80 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">Scalability</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-700">
                    {researchItem.analysisResult.commercialPotential?.scalability}
                  </div>
                </div>

                <div className="bg-white/80 p-4 rounded-lg border border-green-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <div className="text-sm font-bold text-gray-900">Market Trends</div>
                  </h5>
                  <div className="space-y-2">
                    {researchItem.analysisResult.marketAnalysis?.trends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{trend}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competition - Improved Layout */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <Building2 className="w-5 h-5" />
                Competition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/80 p-4 rounded-lg border border-purple-200">
                <div className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Competitive Landscape
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {researchItem.analysisResult.marketAnalysis?.competition}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Concept */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Product Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Commercial Opportunity</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {researchItem.analysisResult.commercialPotential?.summary}
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Potential Revenue Model</h5>
                  <p className="text-sm text-gray-700">
                    {researchItem.analysisResult.commercialPotential?.revenueModel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team & Execution */}
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Users className="w-5 h-5 text-indigo-500" />
                Team & Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {researchItem.analysisResult.teamAndExecution?.summary}
              </p>
              <div className="space-y-3">
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Required Expertise</h5>
                  <p className="text-sm text-gray-700">
                    {researchItem.analysisResult.teamAndExecution?.expertise}
                  </p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-1">Resources</h5>
                  <p className="text-sm text-gray-700">
                    {researchItem.analysisResult.teamAndExecution?.resources}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risks & Barriers */}
          <Card className="lg:col-span-4 shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Risks & Barriers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-600 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Technical Risks
                  </h4>
                  <div className="space-y-2">
                    {researchItem.analysisResult.technicalFeasibility?.risks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Market Barriers
                  </h4>
                  <div className="space-y-2">
                    {researchItem.analysisResult.commercialPotential?.barriers.map((barrier, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        {barrier}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team Recommendations
                  </h4>
                  <div className="space-y-2">
                    {researchItem.analysisResult.teamAndExecution?.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FakeResearchDashboard;
