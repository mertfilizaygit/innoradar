// src/services/pdfExtractor.ts - Basit çözüm
export const extractTextFromPDF = async (file: File): Promise<string> => {
    // Şimdilik basit text extraction
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const text = reader.result as string;
          // PDF'den basic text çıkarma
          const cleanText = text
            .replace(/[^\x20-\x7E\s\n\r]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (cleanText.length < 20) {
            reject(new Error('No readable text found in PDF'));
          } else {
            resolve(cleanText.substring(0, 5000)); // İlk 5000 karakter
          }
        } catch (error) {
          reject(new Error('Failed to process PDF'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsText(file);
    });
  };