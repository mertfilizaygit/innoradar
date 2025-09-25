import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  AlertTriangle,
  DollarSign,
  Building2,
  Lightbulb
} from "lucide-react";
import RadarChart from "./RadarChart";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onBack: () => void;
}

const Dashboard = ({ onBack }: DashboardProps) => {
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your VC pitch deck is being generated...",
    });
  };

  // Mock data for demonstration
  const scores = [
    { category: "Tech Readiness", score: 7.2, max: 10 },
    { category: "Market Size", score: 8.5, max: 10 },
    { category: "Scalability", score: 6.8, max: 10 },
    { category: "Team Potential", score: 5.9, max: 10 },
    { category: "Competitive Edge", score: 7.8, max: 10 },
    { category: "Impact", score: 8.9, max: 10 },
  ];

  const competitors = [
    { name: "DeepMind", category: "AI Research", funding: "$1.7B" },
    { name: "Atomwise", category: "Drug Discovery", funding: "$174M" },
    { name: "Exscientia", category: "AI Pharma", funding: "$525M" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                ← Back to Input
              </Button>
              <h1 className="text-2xl font-bold text-vc-primary">Research Analysis Dashboard</h1>
            </div>
            <Button onClick={handleExport} className="bg-vc-primary hover:bg-vc-primary-light">
              <Download className="w-4 h-4 mr-2" />
              Export VC One-Pager
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-vc-primary">Research Summary</CardTitle>
                <Badge variant="secondary" className="bg-vc-success/10 text-vc-success border-vc-success/20">
                  High Potential
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold text-lg">
                "AI-Powered Protein Folding Prediction Platform"
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Revolutionary machine learning approach for predicting 3D protein structures with 95% accuracy. 
                The research introduces novel transformer architectures that significantly outperform existing methods, 
                reducing computation time from weeks to hours while maintaining high precision.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-vc-primary">Key Innovations:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Novel attention mechanism for protein sequence analysis</li>
                  <li>95% prediction accuracy across diverse protein families</li>
                  <li>1000x faster than traditional molecular dynamics simulations</li>
                  <li>Validated on 50,000+ experimental structures</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Overall Score */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-vc-primary">Investment Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-vc-success mb-2">7.4</div>
              <div className="text-sm text-muted-foreground mb-4">out of 10</div>
              <Progress value={74} className="mb-4" />
              <Badge variant="secondary" className="bg-vc-success/10 text-vc-success border-vc-success/20">
                Strong Investment Opportunity
              </Badge>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-vc-primary">Evaluation Metrics</CardTitle>
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
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-vc-primary font-semibold">{item.score}/10</span>
                      </div>
                      <Progress value={(item.score / item.max) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Concept */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-vc-primary">
                <Lightbulb className="w-5 h-5" />
                Product Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-semibold">ProteinAI Platform</h4>
                <p className="text-sm text-muted-foreground">
                  SaaS platform for pharmaceutical companies to accelerate drug discovery through 
                  AI-powered protein structure prediction.
                </p>
                <div className="space-y-2">
                  <Badge variant="outline" className="border-vc-secondary text-vc-secondary">B2B SaaS</Badge>
                  <Badge variant="outline" className="border-vc-accent text-vc-accent">API Platform</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-vc-primary">
                <TrendingUp className="w-5 h-5" />
                Market Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Addressable Market</span>
                <span className="font-bold text-vc-success">$24.8B</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Serviceable Market</span>
                <span className="font-bold">$4.2B</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Market Growth Rate</span>
                <span className="font-bold text-vc-success">15.2% CAGR</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Drug discovery market driven by increasing R&D investments and AI adoption in pharma.
              </p>
            </CardContent>
          </Card>

          {/* Competitive Landscape */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-vc-primary">
                <Building2 className="w-5 h-5" />
                Key Competitors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {competitors.map((competitor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{competitor.name}</div>
                    <div className="text-xs text-muted-foreground">{competitor.category}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">{competitor.funding}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Risks & Barriers */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-vc-primary">
                <AlertTriangle className="w-5 h-5" />
                Risks & Barriers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-vc-warning">Technical Risks</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Model validation complexity</li>
                    <li>• Computational infrastructure costs</li>
                    <li>• Training data availability</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Market Barriers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Regulatory approval processes</li>
                    <li>• Enterprise sales cycles</li>
                    <li>• Customer validation requirements</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-vc-secondary">Commercial Risks</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• IP protection challenges</li>
                    <li>• Talent acquisition costs</li>
                    <li>• Capital intensive scaling</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Trends */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-vc-primary">
                <DollarSign className="w-5 h-5" />
                Funding Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">AI Drug Discovery</span>
                  <Badge className="bg-vc-success text-white">+185%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Biotech AI</span>
                  <Badge className="bg-vc-success text-white">+142%</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Protein Analysis</span>
                  <Badge className="bg-vc-accent text-white">+67%</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                YoY funding growth in related sectors (2023 vs 2022)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;