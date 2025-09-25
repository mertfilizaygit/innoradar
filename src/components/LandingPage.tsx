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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/10"></div>
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
              <span>Growth Potential</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-10">
              {/* Mode Toggle */}
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setInputMode("text")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      inputMode === "text"
                        ? "bg-white text-indigo-600 shadow-md"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    Paste Abstract
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      inputMode === "upload"
                        ? "bg-white text-indigo-600 shadow-md"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </button>
                </div>
              </div>

              {/* Input Content */}
              <div className="space-y-8">
                {inputMode === "text" ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                      <h3 className="text-2xl font-semibold text-slate-800">Research Abstract</h3>
                    </div>
                    <Textarea
                      placeholder="Paste your research abstract, paper summary, or key findings here...

Example: Novel machine learning approach for protein folding prediction achieving 95% accuracy across diverse protein families..."
                      className="min-h-[280px] resize-none border-2 focus:border-indigo-500 transition-all duration-300 text-base leading-relaxed p-6 rounded-xl"
                      value={researchText}
                      onChange={(e) => setResearchText(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <p className={`text-sm ${
                        currentWordCount >= MIN_WORD_COUNT 
                          ? "text-emerald-600" 
                          : "text-amber-600"
                      }`}>
                        {currentWordCount} / {MIN_WORD_COUNT} words minimum
                      </p>
                      {currentWordCount >= MIN_WORD_COUNT && (
                        <div className="flex items-center gap-1 text-emerald-600 text-sm">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          Ready for analysis
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                      <h3 className="text-2xl font-semibold text-slate-800">Upload Research Paper</h3>
                    </div>
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all duration-300 ${
                        dragActive
                          ? "border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 scale-[1.02]"
                          : "border-slate-300 hover:border-purple-400 hover:bg-slate-50/50"
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
                        <Upload className={`w-20 h-20 mx-auto mb-6 transition-colors ${
                          dragActive ? 'text-purple-600' : 'text-slate-400'
                        }`} />
                        <h4 className="text-xl font-medium mb-3 text-slate-800">
                          Drop your research paper here
                        </h4>
                        <p className="text-slate-600 mb-6 text-base">
                          Drag & drop your PDF, or{" "}
                          <label className="text-purple-600 cursor-pointer hover:underline font-medium transition-colors">
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
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                          <FileText className="w-4 h-4" />
                          <span>PDF files only • Max 20MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Field Selection */}
                <div className="space-y-6 p-8 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <label className="text-xl font-semibold text-slate-800 block">
                        Application Area
                      </label>
                      <span className="text-sm text-slate-600">(Optional - helps improve analysis accuracy)</span>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Select the industry where the end product will operate. This helps our AI provide more targeted market analysis and competitive insights.
                  </p>
                  <Select value={selectedField} onValueChange={setSelectedField}>
                    <SelectTrigger className="h-12 border-2 focus:border-indigo-500 bg-white text-base rounded-lg">
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
                <div className="text-center pt-6">
                  <Button
                    onClick={handleAnalyze}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] rounded-xl"
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    Analyze Research Potential
                  </Button>
                  <p className="text-sm text-slate-600 mt-4">
                    Get comprehensive VC-style analysis in under 30 seconds
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;