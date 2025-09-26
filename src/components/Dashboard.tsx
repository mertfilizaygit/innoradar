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
  User,
  Zap,
  Network,
  AlertCircle,
  LineChart
} from "lucide-react";
import RadarChart from "./RadarChart";
import { useToast } from "@/hooks/use-toast";
import { type AnalysisResult } from "@/services/claudeApi";
import { useEffect, useState } from "react";

interface DashboardProps {
  onBack: () => void;
  analysisResult: AnalysisResult;
  researchText: string;
}

const Dashboard = ({ onBack, analysisResult, researchText }: DashboardProps) => {
  const { toast } = useToast();
  
  // Breakthrough kriterleri için state
  const [breakthroughCriteria, setBreakthroughCriteria] = useState([
    {
      id: 'market-disruption',
      title: 'Market Disruption Potential',
      description: 'Capability to create new markets or challenge existing industry paradigms',
      icon: Zap,
      checked: false,
      hoverText: 'Evaluates whether the innovation has the potential to fundamentally disrupt existing markets or create entirely new market categories.'
    },
    {
      id: 'ecosystem-catalyst',
      title: 'Innovation Ecosystem Catalyst',
      description: 'Potential to become the foundation for broader innovation networks',
      icon: Network,
      checked: false,
      hoverText: 'Assesses the innovation\'s ability to serve as a nucleus that enables and accelerates other innovations within an ecosystem.'
    },
    {
      id: 'market-failure-solution',
      title: 'Market Failure Resolution',
      description: 'Addresses significant gaps or inefficiencies in current market solutions',
      icon: AlertCircle,
      checked: false,
      hoverText: 'Determines whether the innovation tackles substantial market failures or unmet needs that existing solutions cannot adequately address.'
    }
  ]);

  // Breakthrough kriterlerini API sonuçlarına göre ayarla, ama 3'ü birden true olmasın
  useEffect(() => {
    if (analysisResult.breakthroughAssessment) {
      const { marketDisruption, ecosystemCatalyst, marketFailureSolution } = analysisResult.breakthroughAssessment;
      
      // Eğer 3'ü de true ise, birini false yap (örneğin ecosystemCatalyst)
      if (marketDisruption && ecosystemCatalyst && marketFailureSolution) {
        setBreakthroughCriteria([
          { ...breakthroughCriteria[0], checked: true },
          { ...breakthroughCriteria[1], checked: false }, // Birini false yapıyoruz
          { ...breakthroughCriteria[2], checked: true }
        ]);
      } else {
        // Normal durumda API'den gelen değerleri kullan
        setBreakthroughCriteria([
          { ...breakthroughCriteria[0], checked: marketDisruption || false },
          { ...breakthroughCriteria[1], checked: ecosystemCatalyst || false },
          { ...breakthroughCriteria[2], checked: marketFailureSolution || false }
        ]);
      }
    }
  }, [analysisResult.breakthroughAssessment]);

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
    { category: "Market Size", score: normalizeScore(analysisResult.marketAnalysis?.score || 0), max: 10 },
    { category: "Tech", score: normalizeScore(analysisResult.technicalFeasibility?.score || 0), max: 10 },
    { category: "Scalability", score: normalizeScore(analysisResult.commercialPotential?.score || 0), max: 10 },
    { category: "Team Potential", score: normalizeScore(analysisResult.teamAndExecution?.score || 0), max: 10 },
    { category: "Impact", score: normalizeScore(analysisResult.overallScore || 0), max: 10 },
  ];

  // Daha akıllı hybrid innovation detection
  const getResearchConnection = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Daha spesifik anahtar kelimeler kullanarak daha doğru eşleştirme
    const drugKeywords = ['pharmaceutical', 'drug discovery', 'molecular design', 'medicine development', 'clinical trials', 'therapeutic'];
    const climateKeywords = ['quantum climate', 'weather prediction', 'environmental modeling', 'climate data', 'atmospheric'];
    const neuralKeywords = ['neural interface', 'brain-computer', 'paralysis recovery', 'neurotechnology', 'eeg signal'];
    
    // Her kategori için kaç anahtar kelime eşleşiyor
    const drugMatches = drugKeywords.filter(keyword => lowerText.includes(keyword)).length;
    const climateMatches = climateKeywords.filter(keyword => lowerText.includes(keyword)).length;
    const neuralMatches = neuralKeywords.filter(keyword => lowerText.includes(keyword)).length;
    
    // En çok eşleşen kategoriyi seç, eşitlik durumunda None döndür
    const maxMatches = Math.max(drugMatches, climateMatches, neuralMatches);
    
    if (maxMatches === 0) {
      return { name: 'Innovation Opportunity', color: 'bg-[#8b5cf6]', borderColor: 'border-[#e2e8f0]' };
    }
    
    if (drugMatches === maxMatches && drugMatches > 0) {
      return { name: 'AI-Powered Drug Discovery', color: 'bg-green-500', borderColor: 'border-green-200' };
    }
    
    if (climateMatches === maxMatches && climateMatches > 0) {
      return { name: 'Quantum Climate Modeling', color: 'bg-blue-500', borderColor: 'border-blue-200' };
    }
    
    if (neuralMatches === maxMatches && neuralMatches > 0) {
      return { name: 'Neural Interface Technology', color: 'bg-purple-500', borderColor: 'border-purple-200' };
    }
    
    return { name: 'Innovation Opportunity', color: 'bg-[#8b5cf6]', borderColor: 'border-[#e2e8f0]' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header - Landing page ile consistent */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="border-[#8b5cf6]/20 bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 hover:border-[#8b5cf6]/30 text-[#8b5cf6] hover:text-[#7c3aed] transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analysis
              </Button>
              <h1 className="text-xl font-semibold text-[#0f172a]">Research Analysis Dashboard</h1>
            </div>
            <Button 
              onClick={handleExport} 
              className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Export One-Pager
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Research Summary - Full Width */}
          <Card className="lg:col-span-4 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl mb-4">
            <CardHeader className="pb-6 px-8 pt-8">
              <CardTitle className="text-lg text-[#0f172a]">Research Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <p className="text-[#64748b] text-sm leading-relaxed max-h-32 overflow-y-auto">
                {researchText}
              </p>
              
              <div className="space-y-4 mt-8">
                <h4 className="font-medium text-[#0f172a] text-sm">Key Insights:</h4>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#64748b]">
                  {analysisResult.keyInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Breakthrough Innovation Assessment */}
          <Card className="lg:col-span-4 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl mb-4">
            <CardHeader className="pb-6 px-8 pt-8">
              <CardTitle className="text-lg text-[#0f172a] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#8b5cf6]" />
                Breakthrough Innovation Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-sm text-[#64748b] mb-6">
                Our evaluation framework assesses breakthrough potential across three critical dimensions:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {breakthroughCriteria.map((criterion) => {
                  const IconComponent = criterion.icon;
                  return (
                    <div 
                      key={criterion.id} 
                      className="group relative"
                      title={criterion.hoverText}
                    >
                      <div className={`p-5 rounded-lg border-2 transition-all duration-200 ${
                        criterion.checked 
                          ? 'border-[#8b5cf6] bg-[#8b5cf6]/5' 
                          : 'border-[#e2e8f0] bg-[#f8fafc]'
                      } hover:shadow-md`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${
                            criterion.checked 
                              ? 'bg-[#8b5cf6] text-white' 
                              : 'bg-[#e2e8f0] text-[#64748b]'
                          }`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-medium text-sm text-[#0f172a]">
                                {criterion.title}
                              </h5>
                              {criterion.checked && (
                                <CheckCircle className="w-4 h-4 text-[#8b5cf6]" />
                              )}
                            </div>
                            <p className="text-xs text-[#64748b] leading-relaxed">
                              {criterion.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                        <div className="bg-[#0f172a] text-white text-xs rounded-lg px-3 py-2 max-w-xs text-center">
                          {criterion.hoverText}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#0f172a]"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Metrics */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="text-[#0f172a] text-base">Evaluation Metrics</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <div className="h-72 flex items-center justify-center">
                  <RadarChart scores={scores} />
                </div>
                <div className="space-y-5">
                  {scores.map((item, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-[#64748b]">{item.category}</span>
                        <span className="text-sm text-[#8b5cf6] font-medium bg-[#8b5cf6]/10 px-3 py-1 rounded-md">
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

          {/* Market Analysis */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <BarChart3 className="w-5 h-5 text-[#8b5cf6]" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-[#f8fafc] p-5 rounded-lg border border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#0f172a]">Market Size</span>
                    <DollarSign className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <div className="text-sm text-[#64748b]">
                    {analysisResult.marketAnalysis?.marketSize}
                  </div>
                </div>
                
                <div className="bg-[#f8fafc] p-5 rounded-lg border border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#0f172a]">Scalability</span>
                    <TrendingUp className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <div className="text-sm text-[#64748b]">
                    {analysisResult.commercialPotential?.scalability}
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-5 rounded-lg border border-[#e2e8f0]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#0f172a]">Market Trends</span>
                    <LineChart className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <div className="space-y-3">
                    {analysisResult.marketAnalysis?.trends.map((trend, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm text-[#64748b]">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-2 flex-shrink-0"></div>
                        <span>{trend}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competition */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <Building2 className="w-5 h-5 text-[#8b5cf6]" />
                Competition
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="bg-[#f8fafc] p-5 rounded-lg border border-[#e2e8f0]">
                <div className="font-medium text-sm text-[#0f172a] mb-4">
                  Competitive Landscape
                </div>
                <div className="text-sm text-[#64748b] leading-relaxed">
                  {analysisResult.marketAnalysis?.competition}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Concept */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <Lightbulb className="w-5 h-5 text-[#8b5cf6]" />
                Product Concept
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-6">
                <div className="bg-[#f8fafc] p-5 rounded-lg border border-[#e2e8f0]">
                  <h4 className="font-medium text-[#0f172a] text-sm mb-3">Commercial Opportunity</h4>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    {analysisResult.commercialPotential?.summary}
                  </p>
                </div>
                <div className="bg-[#f8fafc] p-5 rounded-lg border border-[#e2e8f0]">
                  <h5 className="text-sm font-medium text-[#0f172a] mb-3">Potential Revenue Model</h5>
                  <p className="text-sm text-[#64748b]">
                    {analysisResult.commercialPotential?.revenueModel}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hybrid Innovation Opportunities */}
          {analysisResult.hybridOpportunities && analysisResult.hybridOpportunities.length > 0 && (
            <Card className="lg:col-span-4 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl mt-4">
              <CardHeader className="px-8 pt-8 pb-6">
                <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                  <Lightbulb className="w-5 h-5 text-[#8b5cf6]" />
                  Hybrid Innovation Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-sm text-[#64748b] mb-8">
                  Potential synergies with our existing breakthrough research portfolio for enhanced innovation impact:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {analysisResult.hybridOpportunities.map((opportunity, index) => {
                    const connection = getResearchConnection(opportunity);

                    return (
                      <div 
                        key={index} 
                        className={`bg-[#f8fafc] p-5 rounded-lg border ${connection.borderColor} hover:shadow-md transition-all duration-200 group relative`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`${connection.color} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="mb-3">
                              <span className="text-xs font-medium text-[#64748b]">{connection.name}</span>
                            </div>
                            <p className="text-sm text-[#64748b] leading-relaxed">{opportunity}</p>
                          </div>
                        </div>
                        
                        {/* Hover tooltip for hybrid opportunities */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                          <div className="bg-[#0f172a] text-white text-xs rounded-lg px-3 py-2 max-w-xs text-center">
                            This opportunity could be combined with this previous research to create a high-potential startup venture.
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#0f172a]"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risks & Barriers */}
          <Card className="lg:col-span-4 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl mt-4">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <AlertTriangle className="w-5 h-5 text-[#8b5cf6]" />
                Risks & Barriers
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium text-[#0f172a] flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-[#8b5cf6]" />
                    Technical Risks
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.technicalFeasibility?.risks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm text-[#64748b]">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-2 flex-shrink-0"></div>
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-[#0f172a] flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-[#8b5cf6]" />
                    Market Barriers
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.commercialPotential?.barriers.map((barrier, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm text-[#64748b]">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-2 flex-shrink-0"></div>
                        {barrier}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team & Execution - Full width */}
          <Card className="lg:col-span-4 shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl mt-4">
            <CardHeader className="px-8 pt-8 pb-6">
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <Users className="w-5 h-5 text-[#8b5cf6]" />
                Team & Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0] h-full">
                    <h5 className="text-sm font-medium text-[#0f172a] mb-3">Team Assessment</h5>
                    <p className="text-sm text-[#64748b] leading-relaxed">
                      {analysisResult.teamAndExecution?.summary}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0] h-full">
                    <h5 className="text-sm font-medium text-[#0f172a] mb-2">Required Expertise</h5>
                    <p className="text-sm text-[#64748b]">
                      {analysisResult.teamAndExecution?.expertise}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0] h-full">
                    <h5 className="text-sm font-medium text-[#0f172a] mb-2">Resources</h5>
                    <p className="text-sm text-[#64748b]">
                      {analysisResult.teamAndExecution?.resources}
                    </p>
                  </div>
                </div>
              </div>
              
              {analysisResult.teamAndExecution?.recommendations && analysisResult.teamAndExecution.recommendations.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-[#0f172a] mb-3">Team Recommendations</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysisResult.teamAndExecution.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 text-sm text-[#64748b] bg-[#f8fafc] p-3 rounded-lg border border-[#e2e8f0]">
                        <div className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full mt-2 flex-shrink-0"></div>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;