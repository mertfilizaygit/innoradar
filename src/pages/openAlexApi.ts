// src/pages/openAlexApi.ts
export interface OpenAlexWork {
  id: string;
  doi?: string;
  title: string;
  abstract?: string;
  abstract_inverted_index?: any;
  publication_year: number;
  cited_by_count: number;
  authorships: {
    author: {
      id: string;
      display_name: string;
    };
    institutions: {
      id: string;
      display_name: string;
    }[];
  }[];
  primary_topic?: {
    display_name: string;
  };
  topics?: {
    id: string;
    display_name: string;
    score: number;
  }[];
  open_access?: {
    is_oa: boolean;
    oa_url?: string;
    oa_status?: string;
  };
}

export interface OpenAlexResponse {
  meta: {
    count: number;
    db_response_time_ms: number;
    page: number;
    per_page: number;
  };
  results: OpenAlexWork[];
}

class OpenAlexApiService {
  private baseUrl = 'https://api.openalex.org';

  async getMaxPlanckResearch(
    page: number = 1, 
    perPage: number = 10, 
    sortBy: string = 'cited_by_count:desc'
  ): Promise<OpenAlexResponse> {
    try {
      // Max Planck Society lineage ID: i149899117
      // Abstract'leri almak için select parametresi ekle
      const url = `${this.baseUrl}/works?filter=authorships.institutions.lineage:i149899117&sort=${sortBy}&per_page=${perPage}&page=${page}&select=id,doi,title,abstract_inverted_index,publication_year,cited_by_count,authorships,primary_topic,topics,open_access`;
      
      console.log(`🔍 Fetching Max Planck research from: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          // Add email for polite usage
          'User-Agent': 'Research Spark VC App (research-spark@example.com)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`OpenAlex API error: ${response.status} ${response.statusText}`);
      }
      
      const data: OpenAlexResponse = await response.json();
      
      // Abstract'leri inverted index'ten normal metne çevir
      data.results = data.results.map(paper => ({
        ...paper,
        abstract: this.reconstructAbstract(paper.abstract_inverted_index)
      }));
      
      console.log(`✅ Fetched ${data.results.length} research papers`);
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching Max Planck research:', error);
      throw error;
    }
  }

  async searchResearch(
    query: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<OpenAlexResponse> {
    try {
      // Encode the query properly
      const encodedQuery = encodeURIComponent(query);
      
      // Search within Max Planck papers with abstract data
      const url = `${this.baseUrl}/works?filter=authorships.institutions.lineage:i149899117&search=${encodedQuery}&per_page=${perPage}&page=${page}&select=id,doi,title,abstract_inverted_index,publication_year,cited_by_count,authorships,primary_topic,topics,open_access`;
      
      console.log(`🔍 Searching Max Planck research for "${query}": ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Research Spark VC App (research-spark@example.com)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`OpenAlex API error: ${response.status} ${response.statusText}`);
      }
      
      const data: OpenAlexResponse = await response.json();
      
      // Abstract'leri inverted index'ten normal metne çevir
      data.results = data.results.map(paper => ({
        ...paper,
        abstract: this.reconstructAbstract(paper.abstract_inverted_index)
      }));
      
      console.log(`✅ Found ${data.meta.count} matching research papers`);
      
      return data;
    } catch (error) {
      console.error('❌ Error searching Max Planck research:', error);
      throw error;
    }
  }

  // Inverted index'ten abstract'i yeniden oluştur
  private reconstructAbstract(abstractInvertedIndex: any): string | null {
    if (!abstractInvertedIndex || typeof abstractInvertedIndex !== 'object') {
      return null;
    }

    try {
      // Inverted index'i kelime pozisyonlarına çevir
      const wordPositions: { [position: number]: string } = {};
      
      for (const [word, positions] of Object.entries(abstractInvertedIndex)) {
        if (Array.isArray(positions)) {
          positions.forEach((pos: number) => {
            wordPositions[pos] = word;
          });
        }
      }
      
      // Pozisyonlara göre sırala ve birleştir
      const sortedPositions = Object.keys(wordPositions)
        .map(pos => parseInt(pos))
        .sort((a, b) => a - b);
      
      const reconstructedText = sortedPositions
        .map(pos => wordPositions[pos])
        .join(' ');
      
      return reconstructedText || null;
    } catch (error) {
      console.error('Error reconstructing abstract:', error);
      return null;
    }
  }

  // DOI üzerinden PDF'e erişim
  async getFullTextPDF(doi: string): Promise<string | null> {
    try {
      // DOI'den URL kısmını temizle (eğer varsa)
      const cleanDoi = doi.replace('https://doi.org/', '');
      
      // DOI'yi URL-encode et
      const encodedDoi = encodeURIComponent(cleanDoi);
      
      // Unpaywall API kullanarak açık erişim PDF URL'ini bul
      const unpaywallUrl = `https://api.unpaywall.org/v2/${encodedDoi}?email=research-spark@example.com`;
      
      console.log(`🔍 Fetching full text info for DOI ${cleanDoi}`);
      
      const response = await fetch(unpaywallUrl);
      
      if (!response.ok) {
        console.warn(`⚠️ Unpaywall API error: ${response.status}`);
        
        // Alternatif olarak, doğrudan DOI URL'ini döndür
        return `https://doi.org/${cleanDoi}`;
      }
      
      const data = await response.json();
      
      // Açık erişim PDF URL'i varsa döndür
      if (data.is_oa && data.best_oa_location?.url_for_pdf) {
        return data.best_oa_location.url_for_pdf;
      }
      
      // Alternatif olarak, doğrudan DOI URL'ini döndür
      return `https://doi.org/${cleanDoi}`;
    } catch (error) {
      console.error('❌ Error fetching full text PDF:', error);
      // Hata durumunda da DOI URL'ini döndür
      return `https://doi.org/${doi.replace('https://doi.org/', '')}`;
    }
  }

  // Sci-Hub üzerinden PDF URL'i oluştur (yasal olmayabilir, sadece bilgi amaçlı)
  getScihubUrl(doi: string): string {
    const cleanDoi = doi.replace('https://doi.org/', '');
    return `https://sci-hub.se/${cleanDoi}`;
  }
}

export const openAlexApi = new OpenAlexApiService();