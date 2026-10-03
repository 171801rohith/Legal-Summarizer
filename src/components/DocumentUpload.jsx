import React, { useState } from "react";
import { Upload, FileText, Loader, AlertCircle, Languages, ChevronDown, CheckCircle } from "lucide-react";
import { analyzeFile, analyzeText } from "../services/api";
import "./DocumentUpload.css";

const LANGUAGES = [
  { label: "English", code: "eng" },
  { label: "Hindi", code: "hin" },
  { label: "Kannada", code: "kan" },
  { label: "Tamil", code: "tam" },
  { label: "Telugu", code: "tel" },
  { label: "Malayalam", code: "mal" },
];

const COPY = {
  human: {
    title: "Upload Legal Document",
    subtitle: "Get AI-powered summaries of your legal documents",
    placeholder: "Paste Indian court judgment or legal document text here...",
  },
  professional: {
    title: "Legal Document Analysis",
    subtitle: "Upload or paste a document for AI-powered insights",
    placeholder: "Paste complete legal document text here...",
  },
};

// Sent to the backend for OCR/extraction; .txt is read in the browser instead.
const UPLOAD_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MIN_TEXT_LENGTH = 50;

const DocumentUpload = ({ audience, onDocumentProcessed, onResult, isLoading, setIsLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [draft, setDraft] = useState("");
  const [documentText, setDocumentText] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const copy = COPY[audience];
  const isReady = Boolean(uploadedFile || documentText);

  const loadText = (text, name) => {
    if (text.trim().length < MIN_TEXT_LENGTH) {
      setError("Text appears too short for meaningful analysis. Please provide more content.");
      return;
    }
    setDocumentText(text.trim());
    setUploadedFile(null);
    setFileName(name);
    onDocumentProcessed(text.trim());
    setError("");
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError("File size too large. Please upload files smaller than 10MB.");
      return;
    }

    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (extension === ".txt") {
      const text = await file.text();
      setDraft(text);
      loadText(text, file.name);
    } else if (UPLOAD_EXTENSIONS.includes(extension)) {
      setDraft("");
      setDocumentText("");
      setUploadedFile(file);
      setFileName(file.name);
      onDocumentProcessed("");
      setError("");
    } else {
      setError("Unsupported file type. Please upload a PDF, PNG, JPG, or TXT file.");
    }
  };

  const handleGenerate = async (mode) => {
    setIsLoading(true);
    setError("");
    try {
      const request = { audience, mode, language: language.code };
      const result = uploadedFile
        ? await analyzeFile({ ...request, file: uploadedFile })
        : await analyzeText({ ...request, text: documentText });
      onResult(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    handleDrag(e);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleChange = (e) => {
    handleFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const clearDocument = () => {
    setDraft("");
    setDocumentText("");
    setUploadedFile(null);
    setFileName("");
    setError("");
    onDocumentProcessed("");
    onResult(null);
  };

  const generateButton = (mode, label) => (
    <button
      onClick={() => handleGenerate(mode)}
      disabled={isLoading || !isReady}
      className="action-button summary-button"
    >
      {isLoading ? (
        <><Loader className="loading-spinner" /> Analyzing...</>
      ) : (
        <><FileText className="button-icon" /> {label}</>
      )}
    </button>
  );

  return (
    <div className="component-card">
      <div className="upload-header">
        <div className="header-left">
          <FileText className="header-icon" />
          <div>
            <h2 className="upload-title">{copy.title}</h2>
            <p className="upload-subtitle">{copy.subtitle}</p>
          </div>
        </div>
        <div className="audio-controls">
          <div className="language-dropdown">
            <button
              className="language-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title={`Response language: ${language.label}`}
            >
              <Languages size={18} />
              <ChevronDown size={14} />
            </button>
            {isDropdownOpen && (
              <div className="language-menu">
                <div className="language-menu-content">
                  <p className="language-menu-title">Response Language</p>
                  {LANGUAGES.map((option) => (
                    <button
                      key={option.code}
                      className={`language-option ${language.code === option.code ? "selected" : ""}`}
                      onClick={() => {
                        setLanguage(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option.label}
                      {language.code === option.code && <span className="checkmark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-state">
          <AlertCircle className="error-icon" />
          <p className="error-text">{error}</p>
        </div>
      )}

      {isReady && (
        <div className="document-status">
          <div className="status-success">
            <CheckCircle className="status-icon" />
            <div className="status-content">
              <p className="status-title">Document Ready for Analysis</p>
              <p className="status-subtitle">
                {fileName} {documentText && `(${documentText.split(/\s+/).length} words)`}
                <button onClick={clearDocument} className="clear-btn">Clear</button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="upload-content">
        <div
          className={`upload-area ${dragActive ? "drag-active" : ""} ${error ? "has-error" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="upload-icon" />
          <div className="upload-text">
            <p className="upload-main-text">Drop your legal document here</p>
            <p className="upload-subtext">PDF, PNG, JPG, or TXT (Max 10MB)</p>
          </div>
          <input
            type="file"
            id="file-upload"
            className="file-input"
            accept={[...UPLOAD_EXTENSIONS, ".txt"].join(",")}
            onChange={handleChange}
            disabled={isLoading}
          />
          <label htmlFor="file-upload" className={`file-label ${isLoading ? "disabled" : ""}`}>
            <Upload className="label-icon" />
            Choose File
          </label>
        </div>

        <div className="divider"><span>or</span></div>

        <div className="text-input-section">
          <label htmlFor="text-input" className="text-input-label">Paste Legal Text Content</label>
          <textarea
            id="text-input"
            className="text-input"
            placeholder={copy.placeholder}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setError("");
            }}
            rows="6"
          />
          <div className="button-container">
            <button onClick={() => loadText(draft, "Pasted Text")} disabled={isLoading} className="action-button load-button">
              <CheckCircle className="button-icon" />
              Load Text
            </button>
            {generateButton("summary", "Generate Summary")}
            {generateButton("advice", "Generate Advice")}
          </div>
          {isLoading && (
            <p className="loading-hint">
              Answers come from a local model and can take a few minutes. Long documents are summarised
              in parts and translation adds more time, so these can take 10 minutes or longer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
