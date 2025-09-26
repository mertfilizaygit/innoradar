// src/components/MaxPlanckExplorer.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { openAlexApi, type OpenAlexWork } from "@/pages/openAlexApi";
import { ArrowLeft, ArrowRight, Search, BookOpen, Award, Calendar, Users, Loader2, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MaxPlanckExplorerProps {
  onSelectResearch: (research: string) => void;
  onClose: () => void;
}

export default function MaxPlanckExplorer({ onSelectResearch, onClose }: MaxPlanckExplorerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [papers, setPapers] = useState<OpenAlexWork[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("top-cited");
  const { toast } = useToast();

  const perPage = 10;

  // Fetch top cited papers on initial load
  useEffect(() => {
    fetchTopCitedPapers();
  }, []);

  // Fetch papers when page changes
  useEffect(() => {
    if (activeTab === "top-cited") {
      fetchTopCitedPapers();
    } else if (activeTab === "search" && searchQuery) {
      searchPapers();
    }
  }, [page]);

  const fetchTopCitedPapers = async () => {
    setIsLoading(true);
    try {
      const data = await openAlexApi.getMaxPlanckResearch(page, perPage);
      setPapers(data.results);
      setTotalResults(data.meta.count);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch research papers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchPapers = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await openAlexApi.searchResearch(searchQuery, page, perPage);
      setPapers(data.results);
      setTotalResults(data.meta.count);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search research papers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    searchPapers();
  };

  const copyAbstract = (paper: OpenAlexWork, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const text = paper.abstract || paper.title;
    
    // Otomatik olarak input alanına ekle
    onSelectResearch(text);
    
    // Clipboard'a da kopyala
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Abstract Added",
      description: "The research abstract has been added to the input field and copied to clipboard.",
    });
  };

  const goToPaper = (paper: OpenAlexWork, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (paper.doi) {
      const cleanDoi = paper.doi.replace('https://doi.org/', '');
      window.open(`https://doi.org/${cleanDoi}`, '_blank');
    } else {
      // DOI yoksa Google Scholar'da ara
      const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`;
      window.open(searchUrl, '_blank');
    }
    
    toast({
      title: "Research Opened",
      description: "The research paper has been opened in a new tab.",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-6xl mx-auto">
      <div className="p-8 border-b border-[#e2e8f0]/40">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#0f172a]">Max Planck Research Explorer</h2>
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Close
          </Button>
        </div>
        
        <Tabs defaultValue="top-cited" onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-[#f1f5f9]/80 p-1 rounded-lg">
            <TabsTrigger 
              value="top-cited"
              className="px-6 py-3 rounded-md text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8b5cf6] data-[state=active]:to-[#a855f7] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Top Cited Papers
            </TabsTrigger>
            <TabsTrigger 
              value="search"
              className="px-6 py-3 rounded-md text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8b5cf6] data-[state=active]:to-[#a855f7] data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Search Papers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="top-cited">
            <p className="text-lg text-[#64748b] mb-6">
              Showing the most cited research papers from Max Planck Society institutions.
            </p>
          </TabsContent>
          
          <TabsContent value="search">
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <Input 
                placeholder="Search Max Planck research..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg p-4 border-[#e2e8f0]/40 focus:border-[#8b5cf6] focus:ring-[#8b5cf6] bg-[#f8fafc]/60 rounded-lg"
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] text-white font-medium px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Search
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-[#8b5cf6]" />
          </div>
        ) : papers.length > 0 ? (
          <div className="space-y-6">
            {papers.map((paper) => (
              <Card key={paper.id} className="overflow-hidden hover:shadow-xl transition-shadow border-[#e2e8f0]/40 rounded-xl">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-semibold text-[#0f172a] leading-relaxed">
                        {paper.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-3 mt-2 text-base text-[#64748b]">
                        <Calendar className="w-5 h-5" />
                        {paper.publication_year}
                        <span className="mx-1">•</span>
                        <Award className="w-5 h-5" />
                        {paper.cited_by_count} citations
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-4">
                  {paper.abstract ? (
                    <p className="text-base text-[#64748b] line-clamp-3 leading-relaxed">
                      {paper.abstract}
                    </p>
                  ) : (
                    <p className="text-base text-[#64748b] italic">No abstract available</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {paper.topics?.slice(0, 3).map((topic) => (
                      <span 
                        key={topic.id} 
                        className="px-3 py-1 bg-[#8b5cf6]/10 text-[#8b5cf6] text-sm rounded-full font-medium"
                      >
                        {topic.display_name}
                      </span>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-3 border-t border-[#e2e8f0]/40 flex justify-between items-center">
                  <div className="flex items-center text-sm text-[#64748b]">
                    <Users className="w-4 h-4 mr-2" />
                    {paper.authorships[0]?.author.display_name}
                    {paper.authorships.length > 1 && ` + ${paper.authorships.length - 1} more`}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={(e) => copyAbstract(paper, e)}
                      className="bg-white border-2 border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Abstract
                    </Button>
                    
                    <Button 
                      onClick={(e) => goToPaper(paper, e)}
                      className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] text-white font-medium px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      Go to Paper
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-[#64748b]">No research papers found</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalResults > perPage && (
          <div className="flex justify-between items-center mt-8">
            <div className="text-base text-[#64748b]">
              Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, totalResults)} of {totalResults} results
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="bg-white border-2 border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </Button>
              
              <Button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * perPage >= totalResults || isLoading}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}