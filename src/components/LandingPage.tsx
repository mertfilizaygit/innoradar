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
    <div className="min-h-screen bg-[var(--gradient-hero)] relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-80 animate-pulse"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-vc-primary/20 to-vc-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-vc-accent/20 to-vc-accent/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-vc-success/15 to-vc-success/5 rounded-full blur-xl animate-pulse delay-2000"></div>
      
      {/* Main Content Container */}
      <div className="relative w-full max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tight">
            Research to
            <span className="block bg-gradient-to-r from-vc-primary via-vc-accent to-vc-success bg-clip-text text-transparent animate-pulse">
              Startup Gold
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform scientific breakthroughs into venture-ready opportunities with AI-powered analysis.
          </p>
          
          <div className="flex items-center justify-center gap-8 text-muted-foreground/80 mb-12">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 rounded-lg bg-vc-primary/10 group-hover:bg-vc-primary/20 transition-colors">
                <BarChart3 className="w-5 h-5 text-vc-primary" />
              </div>
              <span className="group-hover:text-foreground transition-colors">Market Analysis</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 rounded-lg bg-vc-accent/10 group-hover:bg-vc-accent/20 transition-colors">
                <Target className="w-5 h-5 text-vc-accent" />
              </div>
              <span className="group-hover:text-foreground transition-colors">Risk Assessment</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-2 rounded-lg bg-vc-success/10 group-hover:bg-vc-success/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-vc-success" />
              </div>
              <span className="group-hover:text-foreground transition-colors">Investment Score</span>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <Card className="border border-border/50 bg-card/80 backdrop-blur-xl shadow-[var(--shadow-card)] overflow-hidden group hover:shadow-[var(--shadow-glow)] transition-all duration-700">
          <div className="absolute inset-0 bg-[var(--gradient-glass)] opacity-50"></div>
          <CardContent className="p-8 relative">
            {/* Text Input Section */}
            <div className="space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[var(--gradient-primary)] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-[var(--shadow-glow)]">1</div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-vc-primary to-vc-accent bg-clip-text text-transparent">Research Input</h3>
                </div>
              </div>

              {/* Text Area */}
              <div className="relative">
                <Textarea
                  placeholder="Enter your research abstract or breakthrough findings...

Example: Revolutionary quantum computing approach achieving 99.9% fidelity in multi-qubit operations, enabling practical quantum advantage in cryptography and optimization problems..."
                  className="min-h-[200px] resize-none border-2 border-border/50 focus:border-vc-primary/70 bg-muted/30 backdrop-blur-sm transition-all duration-500 text-base leading-relaxed p-6 rounded-2xl shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-card)] focus:bg-muted/50 focus:shadow-[var(--shadow-glow)] placeholder:text-muted-foreground/60"
                  value={researchText}
                  onChange={(e) => setResearchText(e.target.value)}
                />
                <div className="absolute top-4 right-4 text-xs text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                  {researchText.length}/100 min
                </div>
              </div>

              {/* OR Divider */}
              <div className="relative py-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-6 py-2 text-sm font-medium text-muted-foreground/80 rounded-full border border-border/50 backdrop-blur-sm">
                    OR UPLOAD PDF
                  </span>
                </div>
              </div>

              {/* File Upload */}
              <div
                className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-700 cursor-pointer group ${
                  dragActive
                    ? "border-vc-accent bg-gradient-to-br from-vc-accent/20 to-vc-primary/10 scale-[1.02] shadow-[var(--shadow-accent-glow)]"
                    : "border-border/50 hover:border-vc-primary/60 hover:bg-gradient-to-br hover:from-vc-primary/5 hover:to-vc-accent/5 hover:shadow-[var(--shadow-card)]"
                } backdrop-blur-sm bg-muted/20`}
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
                <div className={`transition-all duration-500 ${dragActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-vc-primary/20 to-vc-accent/20 flex items-center justify-center transition-all duration-500 ${
                    dragActive ? 'shadow-[var(--shadow-accent-glow)]' : 'group-hover:shadow-[var(--shadow-glow)]'
                  }`}>
                    <Upload className={`w-10 h-10 transition-all duration-300 ${
                      dragActive ? 'text-vc-accent animate-bounce' : 'text-vc-primary group-hover:text-vc-accent'
                    }`} />
                  </div>
                  <h4 className="text-xl font-bold mb-3 bg-gradient-to-r from-vc-primary to-vc-accent bg-clip-text text-transparent">
                    Drop Research Paper
                  </h4>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Drag & drop your PDF, or{" "}
                    <label className="text-vc-accent cursor-pointer hover:text-vc-success font-semibold transition-colors underline decoration-2 underline-offset-4">
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
                  <div className="flex items-center justify-center gap-3 text-muted-foreground/80">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span>PDF only</span>
                    </div>
                    <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
                    <span>Max 20MB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div className="mt-12 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[var(--gradient-success)] rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-[var(--shadow-glow)]">2</div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-vc-success to-vc-accent bg-clip-text text-transparent">
                      Target Industry
                    </h3>
                    <span className="text-sm text-muted-foreground/70">(Optional - enhances precision)</span>
                  </div>
                </div>
              </div>
              
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="h-16 border-2 border-border/50 focus:border-vc-success/70 bg-muted/30 backdrop-blur-sm text-lg rounded-2xl shadow-[var(--shadow-glass)] hover:shadow-[var(--shadow-card)] transition-all duration-500 focus:bg-muted/50 focus:shadow-[var(--shadow-glow)]">
                  <SelectValue placeholder="Select target industry for enhanced analysis..." />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-2 border-border/50 rounded-2xl shadow-[var(--shadow-lg)]">
                  <SelectItem value="ai" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">🤖 AI & Machine Learning</SelectItem>
                  <SelectItem value="biotech" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">🧬 Biotechnology</SelectItem>
                  <SelectItem value="energy" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">⚡ Energy & Power Systems</SelectItem>
                  <SelectItem value="materials" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">🔬 Materials Science</SelectItem>
                  <SelectItem value="quantum" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">⚛️ Quantum Technology</SelectItem>
                  <SelectItem value="space" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">🚀 Space Technology</SelectItem>
                  <SelectItem value="climate" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">🌱 Climate Tech</SelectItem>
                  <SelectItem value="other" className="text-base py-3 hover:bg-vc-primary/10 focus:bg-vc-primary/10">📊 Other Industries</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Analyze Button */}
            <div className="mt-16 text-center">
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="relative group bg-[var(--gradient-primary)] hover:bg-[var(--gradient-accent)] text-white px-12 py-6 text-xl font-bold shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-glow)] transition-all duration-700 transform hover:scale-[1.05] rounded-2xl border border-vc-primary/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[var(--gradient-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="font-black tracking-wide">Launch Analysis</span>
                </div>
              </Button>
              <p className="text-lg text-muted-foreground/70 mt-6 font-medium">
                Advanced VC-grade insights in <span className="text-vc-accent font-bold">30 seconds</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;