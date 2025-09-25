import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, BarChart3, Target, TrendingUp, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LandingPageProps {
  onAnalyze: (data: { text: string; field?: string; file?: File }) => void;
}

const LandingPage = ({ onAnalyze }: LandingPageProps) => {
  const [researchText, setResearchText] = useState("");
  const [selectedField, setSelectedField] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
  const { toast } = useToast();

  const MIN_WORD_COUNT = 50;
  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

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
    if (inputMode === "text") {
      if (!researchText.trim()) {
        toast({
          title: "Missing research abstract",
          description: "Please provide a research abstract to analyze.",
          variant: "destructive",
        });
        return;
      }
      
      const wordCount = getWordCount(researchText);
      if (wordCount < MIN_WORD_COUNT) {
        toast({
          title: "Text too short",
          description: `Please provide at least ${MIN_WORD_COUNT} words for better analysis. Current: ${wordCount} words.`,
          variant: "destructive",
        });
        return;
      }
      
      onAnalyze({ text: researchText, field: selectedField });
      return;
    }
    
    toast({
      title: "Upload mode active",
      description: "Please upload a PDF to start the analysis.",
    });
  };

  const currentWordCount = getWordCount(researchText);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-vc-primary to-vc-secondary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Turn Research into Startup Insights
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-10">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Text Input */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-vc-primary rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <h3 className="text-2xl font-semibold text-vc-primary">Research Abstract</h3>
                  </div>
                  <Textarea
                    placeholder="Paste your research abstract, paper summary, or key findings here...

Example: Novel machine learning approach for protein folding prediction achieving 95% accuracy across diverse protein families..."
                    className="min-h-[240px] resize-none border-2 focus:border-vc-secondary transition-all duration-300 text-base leading-relaxed p-4"
                    value={researchText}
                    onChange={(e) => setResearchText(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum 100 characters recommended for best analysis results
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-vc-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h3 className="text-2xl font-semibold text-vc-primary">Upload PDF</h3>
                  </div>
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-vc-secondary bg-gradient-to-br from-vc-accent/20 to-vc-secondary/10 scale-[1.02]"
                        : "border-muted-foreground/30 hover:border-vc-secondary/60 hover:bg-muted/20"
                    }`}
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
              <div className="mt-12 space-y-6 p-8 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-vc-accent rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <label className="text-xl font-semibold text-vc-primary block">
                      Application Area
                    </label>
                    <span className="text-sm text-muted-foreground">(Optional - helps improve analysis accuracy)</span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Select the industry where the end product will operate. This helps our AI provide more targeted market analysis and competitive insights.
                </p>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="h-12 border-2 focus:border-vc-secondary bg-white text-base">
                    <SelectValue placeholder="Choose the target application area..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2">
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
              <div className="mt-12 text-center">
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  className="bg-gradient-to-r from-vc-primary to-vc-secondary hover:from-vc-primary-light hover:to-vc-secondary/90 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <FileText className="w-6 h-6 mr-3" />
                  Analyze Research Potential
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
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