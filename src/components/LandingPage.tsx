import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, BarChart3, Target, TrendingUp, Edit3, Loader2, Search, Calendar, MapPin, User, ArrowRight } from "lucide-react";
import { extractTextFromPDF } from "@/services/pdfExtractor";
import { fakeResearchData } from "@/data/fakeResearch";

interface LandingPageProps {
  onAnalyze: (data: { text: string; field?: string; file?: File }) => void;
  onViewFakeResearch: (researchId: string) => void;
  isAnalyzing?: boolean;
  hasValidApiKey?: boolean;
  setIsAnalyzing?: (value: boolean) => void;
}

const LandingPage = ({ onAnalyze, onViewFakeResearch, isAnalyzing, hasValidApiKey, setIsAnalyzing }: LandingPageProps) => {
  const [researchText, setResearchText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "upload">("text");
  const [isPdfProcessing, setIsPdfProcessing] = useState(false);
  const { toast } = useToast();

  const MIN_WORD_COUNT = 50;
  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleFileUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const setLoading = setIsAnalyzing || setIsPdfProcessing;
      setLoading(true);
      
      const extractedText = await extractTextFromPDF(file);
      
      if (!extractedText.trim()) {
        toast({
          title: "Empty PDF",
          description: "No text found in the PDF file.",
          variant: "destructive",
        });
        return;
      }
  
      onAnalyze({ text: extractedText, file });
    } catch (error) {
      toast({
        title: "PDF Processing Failed",
        description: "Could not extract text from PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      const setLoading = setIsAnalyzing || setIsPdfProcessing;
      setLoading(false);
    }
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
          description: `Please provide at least ${MIN_WORD_COUNT} words for better analysis.`,
          variant: "destructive",
        });
        return;
      }
      
      onAnalyze({ text: researchText });
      return;
    }
    
    toast({
      title: "Upload mode active",
      description: "Please upload a PDF to start the analysis.",
    });
  };

  const currentWordCount = getWordCount(researchText);
  const isProcessing = isAnalyzing || isPdfProcessing;

  return (
    <div 
      className="min-h-screen text-foreground relative"
      style={{
        background: `var(--gradient-hero), var(--grain-spots), var(--grain-texture)`,
        backgroundSize: '100% 100%, 200px 200px, 100% 100%',
        backgroundBlendMode: 'normal, screen, multiply'
      }}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-10 border-b border-border/20 bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="text-lg font-semibold tracking-wide">RESEARCH-AI</div>
          <div className="flex items-center gap-12 text-sm font-semibold tracking-wide">
            <span className="cursor-pointer hover:text-muted-foreground transition-colors">ANALYZE</span>
            <span className="cursor-pointer hover:text-muted-foreground transition-colors">INSIGHTS</span>
            <span className="cursor-pointer hover:text-muted-foreground transition-colors">ABOUT</span>
          </div>
        </div>
      </nav>

      {/* Hero Section - VC Criteria Kaldırıldı */}
      <div className="relative overflow-hidden bg-gradient-to-r from-vc-primary to-vc-secondary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Turn Research into Startup Insights
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            AI-powered VC analysis for scientific research commercialization. Evaluate breakthrough potential, 
            market opportunities, and investment readiness.
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
              <span>Innovation Impact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto bg-background/95 backdrop-blur-sm border-border/20 shadow-2xl">
          <CardContent className="p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Research Analysis</h2>
              <p className="text-muted-foreground text-lg">
                Submit your research for comprehensive VC-style evaluation
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex justify-center mb-8">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={inputMode === "text" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setInputMode("text")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    inputMode === "text" 
                      ? "bg-background shadow-sm" 
                      : "hover:bg-background/50"
                  }`}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Text Input
                </Button>
                <Button
                  variant={inputMode === "upload" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setInputMode("upload")}
                  className={`px-6 py-2 rounded-md transition-all ${
                    inputMode === "upload" 
                      ? "bg-background shadow-sm" 
                      : "hover:bg-background/50"
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  PDF Upload
                </Button>
              </div>
            </div>

            {/* Input Section */}
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-6">
                {inputMode === "text" ? (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Paste your research abstract here..."
                      className="min-h-[120px] resize-none border-0 border-b border-border bg-transparent text-base leading-relaxed px-0 py-4 placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                      value={researchText}
                      onChange={(e) => setResearchText(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div
                      className={`relative border border-dashed border-border/50 rounded-lg p-12 w-full text-center transition-all duration-300 cursor-pointer ${
                        dragActive ? "border-foreground bg-muted/10" : "hover:border-muted-foreground"
                      } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      onDragEnter={(e) => {
                        e.preventDefault();
                        if (!isProcessing) setDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={isProcessing ? undefined : handleDrop}
                    >
                      {isPdfProcessing ? (
                        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-vc-primary" />
                      ) : (
                        <Upload className={`w-12 h-12 mx-auto mb-4 ${
                          dragActive ? 'text-foreground' : 'text-muted-foreground'
                        }`} />
                      )}
                      <p className="text-lg font-medium mb-2">
                        {isPdfProcessing ? "Processing PDF..." : "Drop your PDF here"}
                      </p>
                      {!isPdfProcessing && (
                        <>
                          <p className="text-sm text-muted-foreground mb-4">
                            or{" "}
                            <label className="text-foreground cursor-pointer underline underline-offset-4 hover:text-foreground/80">
                              browse files
                              <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file);
                                }}
                                disabled={isProcessing}
                              />
                            </label>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports PDF files up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Scan Button */}
              <div className="mt-12 text-center">
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  disabled={
                    (inputMode === "text" && currentWordCount < MIN_WORD_COUNT) || 
                    isProcessing || 
                    !hasValidApiKey
                  }
                  className="bg-gradient-to-r from-vc-primary to-vc-secondary hover:from-vc-primary-light hover:to-vc-secondary/90 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      {isPdfProcessing ? "Processing PDF..." : "Scanning..."}
                    </>
                  ) : (
                    <>
                      <Search className="w-6 h-6 mr-3" />
                      Scan
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Research Examples */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Featured Research Analysis</h3>
            <p className="text-muted-foreground">
              Explore our comprehensive analysis of breakthrough research projects
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {fakeResearchData.map((research) => (
              <Card 
                key={research.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-background/95 backdrop-blur-sm border-border/20"
                onClick={() => onViewFakeResearch(research.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {research.field}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{research.publishedDate}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-vc-primary transition-colors">
                    {research.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {research.abstract}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{research.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-vc-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>View Analysis</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/20">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Overall Score</span>
                      <span className="font-semibold text-vc-primary">
                        {research.analysisResult.overallScore}/100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;