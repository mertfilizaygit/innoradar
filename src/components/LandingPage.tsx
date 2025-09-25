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
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-40"></div>
      
      {/* Main Content Container */}
      <div className="relative w-full max-w-3xl mx-auto px-8 py-16">
        {/* Hero Section - Minimal */}
        <div className="text-center mb-20 space-y-8">
          <h1 className="text-4xl md:text-6xl font-light text-foreground tracking-wide leading-tight">
            Research
            <span className="block font-normal bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
            Transform scientific research into actionable venture insights with precision AI analysis.
          </p>
        </div>

        {/* Input Card - Minimal */}
        <Card className="border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <CardContent className="p-12 space-y-12">
            {/* Text Input Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-foreground">Input</h3>

              <Textarea
                placeholder="Enter your research abstract or key findings...

Example: Novel machine learning approach for protein folding prediction achieving 95% accuracy across diverse protein families..."
                className="min-h-[180px] resize-none border border-border focus:border-foreground bg-input transition-all duration-300 text-base leading-relaxed p-4 rounded-lg placeholder:text-muted-foreground/50"
                value={researchText}
                onChange={(e) => setResearchText(e.target.value)}
              />

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 py-1 text-xs text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              <div
                className={`relative border border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? "border-foreground bg-muted/50"
                    : "border-border hover:border-muted-foreground"
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
                <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${
                  dragActive ? 'text-foreground' : 'text-muted-foreground'
                }`} />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop PDF or{" "}
                  <label className="text-foreground cursor-pointer hover:underline">
                    browse
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
                <p className="text-xs text-muted-foreground/60">Max 20MB</p>
              </div>
            </div>

            {/* Field Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-foreground">Industry Focus</h3>
              <p className="text-sm text-muted-foreground">Optional - improves analysis precision</p>
              
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="h-12 border border-border focus:border-foreground bg-input transition-all duration-300">
                  <SelectValue placeholder="Select target industry..." />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-lg">
                  <SelectItem value="ai">AI & Machine Learning</SelectItem>
                  <SelectItem value="biotech">Biotechnology</SelectItem>
                  <SelectItem value="energy">Energy & Power</SelectItem>
                  <SelectItem value="materials">Materials Science</SelectItem>
                  <SelectItem value="quantum">Quantum Technology</SelectItem>
                  <SelectItem value="space">Space Technology</SelectItem>
                  <SelectItem value="climate">Climate Tech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Analyze Button */}
            <div className="pt-8 text-center">
              <Button
                onClick={handleAnalyze}
                className="bg-foreground text-background hover:bg-muted-foreground px-8 py-3 font-medium transition-all duration-300 rounded-lg"
              >
                Analyze Research
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Get insights in seconds
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;