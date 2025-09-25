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
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Text Input */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-vc-primary">Research Abstract</h3>
                  <Textarea
                    placeholder="Paste your research abstract here..."
                    className="min-h-[200px] resize-none border-2 focus:border-vc-secondary"
                    value={researchText}
                    onChange={(e) => setResearchText(e.target.value)}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-vc-primary">Upload PDF</h3>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-vc-secondary bg-vc-accent/20"
                        : "border-muted-foreground/25 hover:border-vc-secondary/50"
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
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Drag & drop your PDF here, or{" "}
                      <label className="text-vc-secondary cursor-pointer hover:underline">
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
                    <p className="text-sm text-muted-foreground">PDF files only, max 20MB</p>
                  </div>
                </div>
              </div>

              {/* Field Selection */}
              <div className="mt-8 space-y-4">
                <label className="text-lg font-medium text-vc-primary">
                  Application Area (Optional)
                </label>
                <p className="text-sm text-muted-foreground">
                  Where will the end product operate?
                </p>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="border-2 focus:border-vc-secondary">
                    <SelectValue placeholder="Select application area..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">AI & Machine Learning</SelectItem>
                    <SelectItem value="biotech">Biotechnology</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="materials">Materials Science</SelectItem>
                    <SelectItem value="quantum">Quantum Technology</SelectItem>
                    <SelectItem value="space">Space Technology</SelectItem>
                    <SelectItem value="climate">Climate Tech</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Analyze Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  className="bg-gradient-to-r from-vc-primary to-vc-secondary hover:from-vc-primary-light hover:to-vc-secondary/90 text-white px-8 py-3 text-lg"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Analyze Research Potential
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;