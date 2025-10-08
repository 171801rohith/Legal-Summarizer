// src/services/summarization.js
import { summarizeDocument, uploadAndSummarizeFile } from './api';
import { extractKeySections } from '../utils/fileParser';

// Enhanced summarization that uses real backend
// src/services/summarization.js

export const generateSummary = async (text, languageCode = 'eng') => {
  const API_URL = 'http://127.0.0.1:8000/human/query-summarizer/';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text,
        language: languageCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching from FastAPI backend:', error);
    throw error;
  }
};

// Mock fallback function (keep your existing mock as backup)
const generateMockSummary = async (text) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const summary = generateIntelligentSummary(text);
  const keySections = extractKeySections(text);
  
  return {
    summary,
    keySections,
    reductionPercentage: calculateReductionPercentage(text, summary)
  };
};

// Keep your existing helper functions
const generateIntelligentSummary = (text) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  const priorityPatterns = [
    /(court|hon'ble|justice|judge).*(holds|finds|concludes|orders|directs)/i,
    /(therefore|accordingly|in conclusion|as a result)/i,
    /(petitioner|appellant|respondent).*(submits|contends|argues)/i,
    /(section|article|act|rule)\s+\d+/i,
    /(appeal|writ petition|civil suit|criminal case)/i,
    /(allowed|dismissed|disposed|quashed)/i
  ];
  
  const scoredSentences = sentences.map(sentence => {
    let score = 0;
    priorityPatterns.forEach(pattern => {
      if (pattern.test(sentence)) {
        score += 1;
      }
    });
    
    if (sentence.length > 100) score += 0.5;
    
    return { sentence, score };
  });
  
  const topSentences = scoredSentences
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.sentence.trim());
  
  if (topSentences.length === 0) {
    return sentences
      .filter(s => s.length > 50)
      .slice(0, 5)
      .map(s => s.trim())
      .join('. ') + '.';
  }
  
  return topSentences.join('. ') + '.';
};

const calculateReductionPercentage = (original, summary) => {
  const originalWords = original.split(/\s+/).length;
  const summaryWords = summary.split(/\s+/).length;
  return Math.round(((originalWords - summaryWords) / originalWords) * 100);
};

export const processDocument = async (file) => {
  return 'Document processed successfully';
};