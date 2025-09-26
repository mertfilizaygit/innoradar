import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Upload, AlertCircle, CheckCircle, Beaker, FileText, Download, Star, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fakeResearchData } from "@/data/fakeResearch";
import MaxPlanckExplorer from "./MaxPlanckExplorer";

// Minimum word count for validation
const MIN_WORD_COUNT = 10;

interface LandingPageProps {
  onAnalyze: (data: { text: string; field?: string; file?: File }) => void;
  onViewFakeResearch: (researchId: string) => void;
  isAnalyzing: boolean;
  hasValidApiKey: boolean;
}

const LandingPage = ({ 
  onAnalyze, 
  onViewFakeResearch,
  isAnalyzing,
  hasValidApiKey
}: LandingPageProps) => {
  const [text, setText] = useState("");
  const [field, setField] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [showMaxPlanckExplorer, setShowMaxPlanckExplorer] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Reset error when text or file changes
  useEffect(() => {
    setError("");
  }, [text, file]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 300; // Maximum height before scrolling
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [text]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowMaxPlanckExplorer(false);
      }
    };

    if (showMaxPlanckExplorer) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMaxPlanckExplorer]);

  // Helper function to get word count
  const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // PDF text extraction function with alternative approach
  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Import pdfjs-dist dynamically
      const pdfjsLib = await import('pdfjs-dist');
      
      // Try different worker sources
      const workerSources = [
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      ];

      // Set worker source with fallback
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + ' ';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF text extraction failed:', error);
      
      // Fallback: Try to read as text if PDF parsing fails
      try {
        const text = await readTextFile(file);
        if (text.trim()) {
          toast({
            title: "PDF parsing failed, but text extracted",
            description: "File was processed as text instead of PDF.",
          });
          return text;
        }
      } catch (textError) {
        console.error('Text fallback also failed:', textError);
      }
      
      throw new Error('Failed to extract text from PDF. The file might be image-based or corrupted. Please try a different file or use text input.');
    }
  };

  // Text file reading function
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };
      reader.readAsText(file);
    });
  };

  const handleAnalyze = async () => {
    // Validate input based on mode
    if (inputMode === "text") {
      const wordCount = getWordCount(text);
      if (wordCount < MIN_WORD_COUNT) {
        setError(`Research abstract must be at least ${MIN_WORD_COUNT} words (currently ${wordCount})`);
        return;
      }
      
      if (!text.trim()) {
        setError("Please enter a research abstract");
        return;
      }
      
      onAnalyze({ text, field });
    } else {
      if (!file) {
        setError("Please upload a PDF or text file");
        return;
      }

      setIsProcessingFile(true);
      setError("");

      try {
        let extractedText = "";
        
        if (file.type === 'application/pdf') {
          toast({
            title: "Processing PDF...",
            description: "Extracting text from your PDF file.",
          });
          extractedText = await extractTextFromPDF(file);
        } else if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
          extractedText = await readTextFile(file);
        } else {
          // Try to read as text anyway for .doc, .docx etc
          try {
            extractedText = await readTextFile(file);
          } catch {
            throw new Error("Unsupported file type. Please use PDF or text files.");
          }
        }

        if (!extractedText.trim()) {
          throw new Error("No text could be extracted from the file. The file might be empty or image-based.");
        }

        const wordCount = getWordCount(extractedText);
        if (wordCount < MIN_WORD_COUNT) {
          setError(`Extracted text must be at least ${MIN_WORD_COUNT} words (currently ${wordCount})`);
          setIsProcessingFile(false);
          return;
        }

        toast({
          title: "File Processed Successfully!",
          description: `Extracted ${wordCount} words from your file.`,
        });

        // Send extracted text for analysis
        onAnalyze({ text: extractedText, field, file });
        
      } catch (error) {
        console.error('File processing error:', error);
        setError(error instanceof Error ? error.message : "Failed to process file");
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type - be more permissive
      const fileType = selectedFile.type;
      const fileName = selectedFile.name.toLowerCase();
      
      if (fileType !== 'application/pdf' && 
          !fileType.startsWith('text/') && 
          !fileName.endsWith('.txt') && 
          !fileName.endsWith('.doc') && 
          !fileName.endsWith('.docx')) {
        setError("Only PDF, TXT, DOC, and DOCX files are supported");
        setFile(null);
        e.target.value = '';
        return;
      }
      
      setFile(selectedFile);
      setError("");
      
      toast({
        title: "File Selected",
        description: `${selectedFile.name} has been selected for analysis`,
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile) {
      // Check file type - be more permissive
      const fileType = droppedFile.type;
      const fileName = droppedFile.name.toLowerCase();
      
      if (fileType !== 'application/pdf' && 
          !fileType.startsWith('text/') && 
          !fileName.endsWith('.txt') && 
          !fileName.endsWith('.doc') && 
          !fileName.endsWith('.docx')) {
        setError("Only PDF, TXT, DOC, and DOCX files are supported");
        return;
      }
      
      setFile(droppedFile);
      setError("");
      
      toast({
        title: "File Dropped",
        description: `${droppedFile.name} has been selected for analysis`,
      });
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 pt-4">
  <h1 className="text-5xl mb-4 flex items-center justify-center font-sans tracking-tight">
    <span className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent mr-1 font-bold leading-none">
    INNO
    </span>
    <span className="text-[#0f172a] font-light leading-none">
    RADAR
    </span>
  </h1>
            <h2 className="text-2xl font-semibold text-[#0f172a] mb-3">
              Turn Research into Startup Insights
            </h2>
            <p className="text-base text-[#64748b]">
              AI-powered VC analysis for scientific research commercialization.
            </p>
          </div>

          {/* Main Card */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl mb-32">
            <CardHeader className="text-center pt-8 pb-6">
              <CardTitle className="text-2xl font-semibold text-[#0f172a] mb-2">Research Analysis</CardTitle>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {/* Toggle Buttons */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#f1f5f9] p-1 rounded-lg inline-flex gap-1">
                  <Button
                    type="button"
                    onClick={() => setInputMode("text")}
                    className={`px-6 py-2 rounded-md transition-all flex items-center text-sm font-medium ${
                      inputMode === "text" 
                        ? "bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-sm" 
                        : "text-[#64748b] hover:text-[#0f172a] bg-transparent hover:bg-white/70"
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Text Input
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setInputMode("file")}
                    className={`px-6 py-2 rounded-md transition-all flex items-center text-sm font-medium ${
                      inputMode === "file" 
                        ? "bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-sm" 
                        : "text-[#64748b] hover:text-[#0f172a] bg-transparent hover:bg-white/70"
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF Upload
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowMaxPlanckExplorer(true)}
                    className="px-6 py-2 rounded-md transition-all flex items-center text-sm font-medium text-[#64748b] hover:text-[#0f172a] bg-transparent hover:bg-white/70"
                  >
                    <Beaker className="w-4 h-4 mr-2" />
                    Browse Max Planck Research
                  </Button>
                </div>
              </div>

              {/* Input Content */}
              <div className="mb-6">
                {inputMode === "text" ? (
                  <div className="space-y-3">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Paste your research abstract here..."
                      className="min-h-[120px] max-h-[300px] resize-none border-[#e2e8f0] focus:border-[#8b5cf6] focus:ring-[#8b5cf6] bg-[#f8fafc] text-sm p-4 rounded-lg overflow-y-auto"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <div className="text-sm text-[#64748b] text-right">
                      {getWordCount(text)} words (minimum {MIN_WORD_COUNT} required)
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      error ? 'border-red-300 bg-red-50' : 'border-[#8b5cf6]/30 bg-[#f8fafc] hover:bg-[#f1f5f9]'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleBrowseClick}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleFileChange}
                    />
                    
                    <Upload className="w-10 h-10 text-[#8b5cf6] mx-auto mb-3" />
                    
                    {file ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-[#16a34a]">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium text-sm">File selected</span>
                        </div>
                        <p className="text-sm text-[#64748b]">{file.name}</p>
                        {isProcessingFile && (
                          <p className="text-xs text-[#8b5cf6]">Processing file...</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[#0f172a]">
                          Drag & drop your file here or click to browse
                        </p>
                        <p className="text-xs text-[#64748b]">
                          Supports PDF, TXT, DOC, and DOCX files
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}
              
              {/* Scan Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleAnalyze}
                  className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] text-white font-medium py-2 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm"
                  disabled={isAnalyzing || !hasValidApiKey || isProcessingFile}
                >
                  {isProcessingFile ? "Processing..." : isAnalyzing ? "Analyzing..." : "Scan"}
                </Button>
              </div>
              
              {!hasValidApiKey && (
                <p className="text-sm text-amber-600 text-center flex items-center justify-center gap-2 mt-3">
                  <AlertCircle className="w-4 h-4" />
                  Please set up your API key to analyze research
                </p>
              )}
            </CardContent>
          </Card>

          {/* Earlier Analyses */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#0f172a] text-center mb-8">
              Earlier Analyses
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {fakeResearchData.map((research) => (
                <Card 
                  key={research.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/95 backdrop-blur-sm border-0 shadow-md"
                  onClick={() => onViewFakeResearch(research.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-full">
                        {research.field}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-sm text-[#0f172a] mb-2 line-clamp-2">
                      {research.title}
                    </h4>
                    
                    <div className="flex items-center gap-4 text-xs text-[#64748b] mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {research.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(research.publishedDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-[#0f172a]">
                          {research.analysisResult.overallScore}/100
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-[#8b5cf6] hover:text-[#7c3aed] hover:bg-[#8b5cf6]/10 text-xs"
                      >
                        View Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Max Planck Explorer Modal */}
      {showMaxPlanckExplorer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8 z-50">
          <div ref={modalRef} className="w-full max-w-7xl max-h-[90vh] overflow-auto">
            <MaxPlanckExplorer
              onSelectResearch={(research) => {
                setText(research);
                setShowMaxPlanckExplorer(false);
              }}
              onClose={() => setShowMaxPlanckExplorer(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;