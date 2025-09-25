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
    <div 
      className="min-h-screen text-foreground relative"
      style={{
        background: `var(--gradient-hero), var(--grain-texture)`,
        backgroundBlendMode: 'overlay'
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

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              RESEARCH TO
              <br />
              VENTURE
              <br />
              INTELLIGENCE.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Transform scientific breakthroughs into actionable venture insights. 
              AI-powered analysis for the innovation economy.
            </p>
          </div>

          {/* Input Section */}
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-6">
              <Textarea
                placeholder="Paste your research abstract or upload PDF below..."
                className="min-h-[120px] resize-none border-0 border-b border-border bg-transparent text-base leading-relaxed px-0 py-4 placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
                value={researchText}
                onChange={(e) => setResearchText(e.target.value)}
              />
              
              <div className="flex items-center justify-center">
                <div
                  className={`relative border border-dashed border-border/50 rounded-none p-8 w-full text-center transition-all duration-300 cursor-pointer ${
                    dragActive ? "border-foreground bg-muted/10" : "hover:border-muted-foreground"
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
                  <Upload className={`w-6 h-6 mx-auto mb-3 ${
                    dragActive ? 'text-foreground' : 'text-muted-foreground'
                  }`} />
                  <p className="text-sm text-muted-foreground">
                    DROP PDF OR{" "}
                    <label className="text-foreground cursor-pointer underline underline-offset-4">
                      BROWSE FILES
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
                </div>
              </div>

              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="h-12 border-0 border-b border-border bg-transparent rounded-none focus:ring-0 focus:border-foreground">
                  <SelectValue placeholder="SELECT INDUSTRY (OPTIONAL)" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="ai">AI & MACHINE LEARNING</SelectItem>
                  <SelectItem value="biotech">BIOTECHNOLOGY</SelectItem>
                  <SelectItem value="energy">ENERGY & POWER</SelectItem>
                  <SelectItem value="materials">MATERIALS SCIENCE</SelectItem>
                  <SelectItem value="quantum">QUANTUM TECHNOLOGY</SelectItem>
                  <SelectItem value="space">SPACE TECHNOLOGY</SelectItem>
                  <SelectItem value="climate">CLIMATE TECH</SelectItem>
                  <SelectItem value="other">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-8">
              <Button
                onClick={handleAnalyze}
                className="w-full bg-foreground text-background hover:bg-muted-foreground font-semibold py-4 px-8 transition-colors tracking-wider"
                size="lg"
              >
                ANALYZE RESEARCH
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;