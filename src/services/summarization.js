// src/services/summarization.js
import { extractKeySections } from '../utils/fileParser'

// Improved mock summarization that simulates AI behavior
export const generateSummary = async (text) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Extract key information using rule-based approach
    const summary = generateIntelligentSummary(text);
    const keySections = extractKeySections(text);
    
    return {
      summary,
      keySections,
      reductionPercentage: calculateReductionPercentage(text, summary)
    };
  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error('Failed to generate summary');
  }
}

const generateIntelligentSummary = (text) => {
  // Extract sentences with legal significance
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Priority patterns for legal documents
  const priorityPatterns = [
    /(court|hon'ble|justice|judge).*(holds|finds|concludes|orders|directs)/i,
    /(therefore|accordingly|in conclusion|as a result)/i,
    /(petitioner|appellant|respondent).*(submits|contends|argues)/i,
    /(section|article|act|rule)\s+\d+/i,
    /(appeal|writ petition|civil suit|criminal case)/i,
    /(allowed|dismissed|disposed|quashed)/i
  ];
  
  // Score sentences based on legal relevance
  const scoredSentences = sentences.map(sentence => {
    let score = 0;
    priorityPatterns.forEach(pattern => {
      if (pattern.test(sentence)) {
        score += 1;
      }
    });
    
    // Bonus for longer sentences (more context)
    if (sentence.length > 100) score += 0.5;
    
    return { sentence, score };
  });
  
  // Sort by score and take top sentences
  const topSentences = scoredSentences
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(item => item.sentence.trim());
  
  // If no high-scoring sentences, fall back to first few meaningful sentences
  if (topSentences.length === 0) {
    return sentences
      .filter(s => s.length > 50)
      .slice(0, 5)
      .map(s => s.trim())
      .join('. ') + '.';
  }
  
  return topSentences.join('. ') + '.';
}

const calculateReductionPercentage = (original, summary) => {
  const originalWords = original.split(/\s+/).length;
  const summaryWords = summary.split(/\s+/).length;
  return Math.round(((originalWords - summaryWords) / originalWords) * 100);
}

export const processDocument = async (file) => {
  return 'Document processed successfully';
}