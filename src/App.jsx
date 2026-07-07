import React, { useState, useRef } from 'react';
import { translations } from './utils/translations';

export default function App() {
  const [lang, setLang] = useState('en');
  const [screen, setScreen] = useState('category'); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null); 
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showVoicePreview, setShowVoicePreview] = useState(false);
  const [currentRefId, setCurrentRefId] = useState('');

  const recognitionRef = useRef(null);
  const t = translations[lang];

  const generateReferenceId = () => {
    return 'POTENS-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result); 
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser environment.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition; 
    
    recognition.lang = lang === 'en' ? 'en-US' : 'mr-IN';
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      setInterimTranscript('');
      setShowVoicePreview(false);
      recognition.start();

      recognition.onresult = (event) => {
        const textResult = event.results[0][0].transcript;
        setInterimTranscript(textResult);
        setShowVoicePreview(true);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const acceptTranscription = () => {
    setDescription((prev) => (prev ? `${prev} ${interimTranscript}` : interimTranscript));
    setInterimTranscript('');
    setShowVoicePreview(false);
  };

  const discardTranscription = () => {
    setInterimTranscript('');
    setShowVoicePreview(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const refId = generateReferenceId();
    const payload = {
      id: refId,
      category: selectedCategory,
      description: description,
      photo: photo, 
      timestamp: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('potens_civic_records') || '[]');
    existing.push(payload);
    localStorage.setItem('potens_civic_records', JSON.stringify(existing));

    setCurrentRefId(refId);
    setScreen('confirmation');
  };

  const restartWorkflow = () => {
    setSelectedCategory('');
    setDescription('');
    setPhoto(null);
    setCurrentRefId('');
    setScreen('category');
  };

  return (
    <div className="app-containerweb">
      <div className="glow-1"></div>
      <div className="glow-2"></div>

      {/* Expanded Desktop Glass Board */}
      <div className="glass-board">
        <header className="app-header">
          <div className="logo-area">
            <span className="status-dot-pulse"></span>
            <span className="status-dot"></span>
            <h1 className="header-title">{t.title}</h1>
          </div>
          <button 
            type="button"
            onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
            className="lang-toggle-btn"
          >
            {lang === 'en' ? 'मराठी' : 'English'}
          </button>
        </header>

        <main className="app-main">
          {/* SCREEN 1: Category Selection Grid Layout */}
          {screen === 'category' && (
            <div className="fade-in-content content-flex-layout">
              <div className="heading-group text-center">
                <h2 className="main-heading">{t.categoryTitle}</h2>
                <p className="sub-heading">Select an infrastructure classification below to begin your audit report statement.</p>
              </div>

              {/* Grid mapping structure */}
              <div className="category-grid-layout">
                {Object.keys(t.categories).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    className={`category-item-btn ${selectedCategory === key ? 'active' : ''}`}
                  >
                    <span className="category-text">{t.categories[key]}</span>
                    <div className="custom-radio-outer">
                      {selectedCategory === key && <span className="custom-radio-inner"></span>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="action-spacer web-centered-action">
                <button
                  type="button"
                  disabled={!selectedCategory}
                  onClick={() => setScreen('details')}
                  className="primary-submit-btn max-width-action-btn"
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 2: Dual Column Desktop Form Split */}
          {screen === 'details' && (
            <form onSubmit={handleSubmit} className="fade-in-content form-layout">
              <div className="selected-badge-banner">
                <div>
                  <span className="badge-mini-label">{t.labels.category}</span>
                  <span className="badge-value-text">{t.categories[selectedCategory]}</span>
                </div>
                <button type="button" onClick={() => setScreen('category')} className="inline-change-btn">
                  Change Category
                </button>
              </div>

              {/* Web Grid Form Splitting Layout Columns */}
              <div className="web-form-columns">
                
                {/* Left Form Column */}
                <div className="form-column-left">
                  <div className="input-field-group">
                    <label className="field-label-tag">{t.labels.details}</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t.placeholderDetails}
                      rows={8}
                      className="custom-textarea"
                      required
                    />
                  </div>
                </div>

                {/* Right Form Column */}
                <div className="form-column-right">
                  <div className="input-field-group">
                    <label className="field-label-tag">{t.labels.optionalVoice}</label>
                    {!showVoicePreview ? (
                      !isListening ? (
                        <button type="button" onClick={handleVoiceInput} className="voice-action-trigger-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                          {t.voiceStart}
                        </button>
                      ) : (
                        <button type="button" onClick={stopVoiceRecording} className="voice-action-trigger-btn listening-active">
                          <div className="stop-square-indicator"></div>
                          {t.voiceListening} (Click to Stop)
                        </button>
                      )
                    ) : (
                      <div className="voice-preview-review-card">
                        <div className="review-card-header">
                          <span className="review-badge-tag">{lang === 'en' ? 'Review Transcription' : 'भाषांतर तपासा'}</span>
                          <div className="review-btn-cluster">
                            <button type="button" onClick={discardTranscription} className="discard-icon-btn">✕</button>
                            <button type="button" onClick={acceptTranscription} className="save-mini-action-btn">✓ Save</button>
                          </div>
                        </div>
                        <p className="transcription-preview-quote">"{interimTranscript}"</p>
                      </div>
                    )}
                  </div>

                  <div className="input-field-group" style={{ marginTop: '16px' }}>
                    <label className="field-label-tag">{lang === 'en' ? 'Visual Evidence (Photo)' : 'फोटो पुरावा'}</label>
                    <div className="photo-upload-container">
                      <input type="file" accept="image/*" id="photo-capture" onChange={handlePhotoUpload} className="hidden-file-input" />
                      <label htmlFor="photo-capture" className="photo-upload-clickable-area web-expanded-dropzone">
                        <div className="clickable-left-content">
                          <div className="photo-icon-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                          </div>
                          <span className="upload-prompt-text">{lang === 'en' ? 'Upload or Capture Image File' : 'फाइल जोडा किंवा फोटो काढा'}</span>
                        </div>
                        <div className="clickable-right-content">
                          {photo ? <img src={photo} alt="Preview" className="photo-preview-thumbnail" /> : <span className="optional-badge">Optional</span>}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              <div className="form-button-row desktop-action-row">
                <button type="button" onClick={() => setScreen('category')} className="secondary-back-btn web-action-sizing">
                  {t.back}
                </button>
                <button type="submit" disabled={!description.trim()} className="primary-submit-btn web-action-sizing">
                  {t.submit}
                </button>
              </div>
            </form>
          )}

          {/* SCREEN 3: Expanded Ledger Confirmation Ticket */}
          {screen === 'confirmation' && (
            <div className="fade-in-content confirmation-layout web-centered-container">
              <div className="success-icon-wrapper">
                <div className="success-ping-ring"></div>
                <div className="success-icon-badge">✓</div>
              </div>

              <div className="heading-group text-center">
                <h2 className="main-heading text-center">{t.confirmationTitle}</h2>
                <p className="sub-heading text-center">
                  Infrastructure Classification Asset: <span className="highlight-category-text">{t.categories[selectedCategory]}</span>
                </p>
              </div>

              <div className="voucher-reference-container desktop-voucher-sizing">
                <div className="voucher-top-border-accent"></div>
                <span className="voucher-mini-title">{t.referenceId}</span>
                <span className="voucher-token-id">{currentRefId}</span>
              </div>

              <div className="action-spacer" style={{ width: '100%', maxWidth: '340px' }}>
                <button type="button" onClick={restartWorkflow} className="secondary-back-btn full-width">
                  {t.homeButton}
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <span className="footer-system-text">Enterprise Web Core Environment</span>
          <div className="footer-status-cluster">
            <span className="pulse-green-dot"></span>
            <span className="footer-system-text text-bright">Secure Ledger Sync Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
}