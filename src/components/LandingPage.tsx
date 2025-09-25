import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, BarChart3, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LandingPageProps {
  onAnalyze: (data: { text: string; field?: string; file?: File }) => void;
}

const LandingPage = ({ onAnalyze }: LandingPageProps) => {
  const [researchText, setResearchText] = useState("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    onAnalyze({ text: "", field: selectedField, file });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!researchText.trim()) {
      toast({
        title: "Missing research abstract",
        description: "Please provide a research abstract to analyze.",
        variant: "destructive",
      });
      return;
    }
    onAnalyze({ text: researchText, field: selectedField });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Mesh */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-60"></div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-vc-primary/90 via-vc-secondary/85 to-vc-accent/80 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-32 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            Turn Research into
            <span className="block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Startup Insights
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/85 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered VC analysis for scientific research commercialization. Evaluate startup potential, 
            market opportunities, and investment readiness in minutes.
          </p>
          <div className="flex items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>Market Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <span>Risk Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>Investment Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <CardContent className="p-12 relative">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Text Input */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-vc-primary to-vc-primary-light rounded-xl flex items-center justify-center text-white font-bold shadow-lg">1</div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-vc-primary to-vc-secondary bg-clip-text text-transparent">Research Abstract</h3>
                  </div>
                  <Textarea
                    placeholder="Paste your research abstract, paper summary, or key findings here...

Example: Novel machine learning approach for protein folding prediction achieving 95% accuracy across diverse protein families..."
                    className="min-h-[280px] resize-none border-2 border-muted/40 focus:border-vc-secondary/60 bg-white/60 backdrop-blur-sm transition-all duration-500 text-base leading-relaxed p-6 rounded-xl shadow-inner hover:shadow-lg focus:bg-white/80"
                    value={researchText}
                    onChange={(e) => setResearchText(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum 100 characters recommended for best analysis results
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-vc-secondary to-vc-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg">2</div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-vc-secondary to-vc-accent bg-clip-text text-transparent">Upload PDF</h3>
                  </div>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 ${
                      dragActive
                        ? "border-vc-secondary bg-gradient-to-br from-vc-accent/30 to-vc-secondary/20 scale-[1.03] shadow-2xl shadow-vc-secondary/20"
                        : "border-muted-foreground/20 hover:border-vc-secondary/60 hover:bg-gradient-to-br hover:from-white/50 hover:to-vc-primary/5 hover:shadow-xl"
                    } backdrop-blur-sm bg-white/30`}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <div className={`transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`}>
                      <Upload className={`w-16 h-16 mx-auto mb-6 transition-colors ${
                        dragActive ? 'text-vc-secondary' : 'text-muted-foreground'
                      }`} />
                      <h4 className="text-lg font-medium mb-3 text-vc-primary">
                        Drop your research paper here
                      </h4>
                      <p className="text-muted-foreground mb-6 text-base">
                        Drag & drop your PDF, or{" "}
                        <label className="text-vc-secondary cursor-pointer hover:underline font-medium transition-colors">
                          browse files
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                          />
                        </label>
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>PDF files only • Max 20MB</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* OR Separator */}
                  <div className="flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border"></div>
                    <span className="text-sm font-medium text-muted-foreground bg-background px-3 py-1 rounded-full border">
                      OR
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border"></div>
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    Use either text input or file upload - both methods work equally well
                  </p>
                </div>
              </div>

              {/* Field Selection */}
              <div className="mt-16 space-y-8 p-10 bg-gradient-to-r from-white/40 to-white/20 rounded-2xl border border-white/30 backdrop-blur-sm shadow-inner">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-vc-accent to-vc-success rounded-xl flex items-center justify-center text-white font-bold shadow-lg">3</div>
                  <div>
                    <label className="text-3xl font-bold bg-gradient-to-r from-vc-accent to-vc-success bg-clip-text text-transparent block">
                      Application Area
                    </label>
                    <span className="text-base text-muted-foreground/80">(Optional - helps improve analysis accuracy)</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Select the industry where the end product will operate. This helps our AI provide more targeted market analysis and competitive insights.
                </p>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="h-14 border-2 border-muted/40 focus:border-vc-secondary/60 bg-white/60 backdrop-blur-sm text-base rounded-xl shadow-inner hover:shadow-lg transition-all duration-300 focus:bg-white/80">
                    <SelectValue placeholder="Choose the target application area..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/30 rounded-xl shadow-2xl">
                    <SelectItem value="ai">🤖 AI & Machine Learning</SelectItem>
                    <SelectItem value="biotech">🧬 Biotechnology</SelectItem>
                    <SelectItem value="energy">⚡ Energy & Power Systems</SelectItem>
                    <SelectItem value="materials">🔬 Materials Science</SelectItem>
                    <SelectItem value="quantum">⚛️ Quantum Technology</SelectItem>
                    <SelectItem value="space">🚀 Space Technology</SelectItem>
                    <SelectItem value="climate">🌱 Climate Tech</SelectItem>
                    <SelectItem value="other">📊 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Analyze Button */}
              <div className="mt-16 text-center">
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  className="bg-gradient-to-r from-vc-primary via-vc-secondary to-vc-accent hover:from-vc-primary-light hover:via-vc-secondary/90 hover:to-vc-accent/90 text-white px-16 py-6 text-xl font-bold shadow-2xl hover:shadow-[var(--shadow-glow)] transition-all duration-500 transform hover:scale-[1.05] rounded-2xl border border-white/20"
                >
                  <FileText className="w-7 h-7 mr-4" />
                  Analyze Research Potential
                </Button>
                <p className="text-base text-muted-foreground/80 mt-6 font-medium">
                  Get comprehensive VC-style analysis in under 30 seconds
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;