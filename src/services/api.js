// src/services/api.js
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

// Backend route names per portal ("human" = citizen, "professional" = lawyer).
const ROUTES = {
  human: {
    summary: { query: 'query-summarizer', upload: 'upload-file-human-summarizer' },
    advice: { query: 'query-advisor', upload: 'upload-file-human-advisor' },
  },
  professional: {
    summary: { query: 'query-professional-summarizer', upload: 'upload-file-professional-summarizer' },
    advice: { query: 'query-professional-advisor', upload: 'upload-file-professional-advisor' },
  },
};

const toResult = (data) => ({
  text: data.text,
  audioUrl: data.audio_path ? `${API_BASE_URL}/${data.audio_path}` : null,
  // Non-fatal issues, e.g. a truncated document or audio that couldn't be generated
  notices: data.notices ?? [],
});

const request = async (path, options) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { accept: 'application/json', ...options.headers } });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_BASE_URL}. Make sure the FastAPI server is running.`);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const detail = typeof body.detail === 'string' ? body.detail : response.statusText;
    throw new Error(`Request failed (${response.status}): ${detail}`);
  }
  return toResult(await response.json());
};

export const analyzeText = ({ audience, mode, text, language }) =>
  request(`/${audience}/${ROUTES[audience][mode].query}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: text, language }),
  });

export const analyzeFile = ({ audience, mode, file, language }) => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  return request(`/${audience}/${ROUTES[audience][mode].upload}/?language=${encodeURIComponent(language)}`, {
    method: 'POST',
    body: formData,
  });
};
