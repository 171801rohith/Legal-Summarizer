// src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:8000';

export const summarizeDocument = async (text, language = 'eng') => {
  try {
    const response = await fetch(`${API_BASE_URL}/human/query-summarizer/`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: text,
        language: language
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling summarization API:', error);
    throw new Error('Failed to connect to summarization service. Please try again.');
  }
};

// For file uploads (if your backend supports it)
export const uploadAndSummarizeFile = async (file, language = 'eng') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const response = await fetch(`${API_BASE_URL}/human/file-summarizer/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload and process file. Please try again.');
  }
};