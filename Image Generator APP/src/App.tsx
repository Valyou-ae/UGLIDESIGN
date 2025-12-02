
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GeneratedImage, VariationCount, QualityLevel, PromptAnalysis, DetectedTextInfo, TextStyleIntent } from './types';
import * as Gemini from './services/geminiService';
import { refineImage, REFINER_PRESETS } from './services/refinerService';
import { qualityLearning } from './services/qualityLearningService';
import { STYLE_PRESETS, QUALITY_PRESETS, ASPECT_RATIOS } from './services/geminiService';
import LiveBrainstorm from './components/LiveBrainstorm';
import KnowledgeBaseModal from './components/KnowledgeBaseModal';
import {
  Wand2, Upload, Image as ImageIcon, Download, Copy, Keyboard, Zap, AlertCircle, Check,
  ChevronDown, SlidersHorizontal, Sparkles, BookOpen, Star, Loader2, Pencil, X,
  Maximize2, ImagePlus, RefreshCw, KeyRound
} from 'lucide-react';

type GenerationStage = 'idle' | 'preview' | 'final';

const TEXT_STYLE_INTENTS: { key: TextStyleIntent, label: string, description: string }[] = [
  { key: 'subtle', label: 'Subtle', description: 'Small, non-distracting text.' },
  { key: 'integrated', label: 'Integrated', description: 'Physically part of the scene.' },
  { key: 'bold', label: 'Bold', description: 'A dominant, central feature.' },
  { key: 'cinematic', label: 'Cinematic', description: 'A clean, movie-poster style title.' },
];

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---

  // Primary Inputs
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof STYLE_PRESETS | 'auto'>('auto');
  const [selectedQuality, setSelectedQuality] = useState<QualityLevel>('draft');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<keyof typeof ASPECT_RATIOS>('1:1');
  const [referenceImage, setReferenceImage] = useState<{ url: string, base64Data: string, mimeType: string } | null>(null);

  // Advanced Settings
  const [enableRefiner, setEnableRefiner] = useState(true);
  const [useCuratedSelection, setUseCuratedSelection] = useState(true);
  const [processText, setProcessText] = useState(true);

  // Generation & Results
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<GenerationStage>('idle');
  const [generatedVariations, setGeneratedVariations] = useState<Array<GeneratedImage>>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0);
  const [numberOfVariations, setNumberOfVariations] = useState<VariationCount>(1);
  const [userRating, setUserRating] = useState(0);
  const [draftProgress, setDraftProgress] = useState<{ count: number; total: number } | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);


  // Iterative Editing (Draft Mode)
  const [focusedDraft, setFocusedDraft] = useState<GeneratedImage | null>(null);
  const [iterativeEditPrompt, setIterativeEditPrompt] = useState('');
  const [isIterating, setIsIterating] = useState(false);
  const [textStyleIntent, setTextStyleIntent] = useState<TextStyleIntent>('integrated');


  // UI State
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'style' | 'quality' | 'variations' | 'aspect' | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showEnhanceModal, setShowEnhanceModal] = useState<{ image: GeneratedImage } | null>(null);
  const [isKeyReady, setIsKeyReady] = useState(false);


  // Refs
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const remixInputRef = useRef<HTMLInputElement>(null);
  const initialAnalysisRef = useRef<{ prompt: string; analysis: PromptAnalysis; textInfo: DetectedTextInfo[] } | null>(null);
  const lastGenerationData = useRef<{ enhancedPrompt: string, metadata: any } | null>(null);

  // --- API KEY MANAGEMENT ---
  // Fix: Use window.aistudio to check for API key selection as required by some models.
  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
        setIsKeyReady(true);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setIsKeyReady(true); // Assume success as per guidelines
    } else {
      showNotification('API Key selection is not available in this environment.', 'error');
    }
  };

  const handleApiPermissionError = (error: Error) => {
    const errorMessage = error.message || 'An unexpected error occurred.';
    if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('API key expired')) {
      showNotification('Permission denied. Please select a valid API key from a project with billing enabled.', 'error');
      setIsKeyReady(false); // Reset key state to re-trigger selection
    } else {
      showNotification(errorMessage, 'error');
    }
  }


  // --- HELPER & UTILITY FUNCTIONS ---

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const downloadImage = useCallback((imageToDownload: GeneratedImage | null, format: 'png' | 'jpeg' | 'webp' = 'png', quality: number = 0.92) => {
    if (!imageToDownload?.base64Data || !imageToDownload.mimeType) {
      showNotification('No image data to download.', 'error');
      return;
    }

    const url = `data:${imageToDownload.mimeType};base64,${imageToDownload.base64Data}`;
    const link = document.createElement('a');
    link.download = `generated-image-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`;

    if (format === 'png' && imageToDownload.mimeType === 'image/png') {
      link.href = url;
      link.click();
    } else {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (format === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        link.href = canvas.toDataURL(`image/${format}`, quality);
        link.click();
      };
      img.src = url;
    }
  }, [showNotification]);


  const copyImageToClipboard = useCallback(async () => {
    const imageToCopy = generatedVariations[selectedVariationIndex];
    if (!imageToCopy?.base64Data) return;
    const url = `data:${imageToCopy.mimeType};base64,${imageToCopy.base64Data}`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showNotification('Image copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy image:', err);
      showNotification('Failed to copy image. Try downloading instead.', 'error');
    }
  }, [generatedVariations, selectedVariationIndex, showNotification]);

  const selectVariation = useCallback((index: number) => {
    if (index < 0 || index >= generatedVariations.length) return;
    setSelectedVariationIndex(index);
    setUserRating(0); // Reset rating for new variation
  }, [generatedVariations.length]);


  // --- CORE GENERATION LOGIC ---

  const runFinalGeneration = useCallback(async (
    inputs: { prompt: string; analysis: PromptAnalysis; textInfo: DetectedTextInfo[] },
    compositionalReference?: GeneratedImage,
    qualityOverride?: QualityLevel,
    progressCallback: (message: string) => void = () => { }
  ) => {
    const { analysis, textInfo } = inputs;
    const finalQuality = (qualityOverride && qualityOverride !== 'draft') ? qualityOverride :
      (selectedQuality !== 'draft') ? selectedQuality : 'standard';

    progressCallback('Choosing final style...');
    const startTime = Date.now();

    // Simplified refiner preset selection
    let chosenPreset: keyof typeof REFINER_PRESETS = 'photorealistic'; // default
    if (enableRefiner) {
      if (selectedStyle === 'cinematic') {
        chosenPreset = 'cinematic';
      } else if (STYLE_PRESETS[selectedStyle as keyof typeof STYLE_PRESETS]?.isPhotorealistic) {
        chosenPreset = 'photorealistic';
      } else if (selectedStyle !== 'auto') {
        chosenPreset = 'artistic';
      }
    }

    progressCallback('Enhancing prompt for final generation...');
    let stylePrompt = await Gemini.enhanceStyle(
      inputs.prompt,
      analysis,
      textInfo,
      selectedStyle,
      finalQuality,
      { finalText: compositionalReference?.finalText, finalBackground: compositionalReference?.finalBackground, textStyleIntent: compositionalReference?.textStyleIntent },
      compositionalReference ? { base64Data: compositionalReference.base64Data! } : undefined
    );

    lastGenerationData.current = {
      enhancedPrompt: stylePrompt,
      metadata: { analysis, selectedStyle, selectedQuality: finalQuality, refinerPreset: chosenPreset, enableRefiner, useCuratedSelection }
    };

    let negativePromptTextInfo: DetectedTextInfo[] = textInfo;
    if (compositionalReference?.finalText !== undefined) {
      negativePromptTextInfo = compositionalReference.finalText ? [{ text: compositionalReference.finalText, placement: 'center', fontStyle: 'modern', fontSize: 'medium', physicalProperties: { material: '', lightingInteraction: '', surfaceTexture: '', environmentalInteraction: '', perspectiveAndDepth: '' } }] : [];
    }
    const negativePrompt = Gemini.getNegativePrompts(analysis, negativePromptTextInfo, selectedStyle);
    const finalReferenceImage = compositionalReference || referenceImage;

    progressCallback('Generating final image...');
    const rawImageResults = await Gemini.generateImage(stylePrompt, textInfo, finalReferenceImage ? { base64Data: finalReferenceImage.base64Data!, mimeType: finalReferenceImage.mimeType! } : undefined, selectedAspectRatio, negativePrompt, numberOfVariations, useCuratedSelection, finalQuality, progressCallback);

    if (!rawImageResults || rawImageResults.length === 0) throw new Error("Failed to generate final image.");

    progressCallback('Applying post-processing...');
    let finalImageResults: GeneratedImage[];
    if (enableRefiner) {
      finalImageResults = await Promise.all(rawImageResults.map(async (result) => {
        const refinedBase64 = await refineImage(result.base64Data!, { preset: chosenPreset });
        return {
          ...result,
          prompt: stylePrompt,
          base64Data: refinedBase64,
          url: `data:image/png;base64,${refinedBase64}`,
          mimeType: 'image/png' // The refiner always outputs PNG
        };
      }));
    } else {
      finalImageResults = rawImageResults;
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    showNotification(`Final images generated in ${elapsed}s`, 'success');

    setGeneratedVariations(finalImageResults);
    setSelectedVariationIndex(0);
    setGenerationStage('final');
  }, [enableRefiner, selectedStyle, selectedAspectRatio, numberOfVariations, useCuratedSelection, referenceImage, selectedQuality, showNotification]);

  const handleGenerate = useCallback(async (newPrompt?: string) => {
    const currentPrompt = newPrompt || prompt;
    if (!currentPrompt) return;

    setIsGenerating(true);
    setGeneratedVariations([]);
    setUserRating(0);
    setGenerationStage('idle');
    setFocusedDraft(null);
    setDraftProgress(null);
    setGenerationMessage('Analyzing prompt...');

    try {
      const startTime = Date.now();
      const { textInfo, analysis } = await Gemini.performInitialAnalysis(currentPrompt, processText);
      initialAnalysisRef.current = { prompt: currentPrompt, analysis, textInfo };

      if (selectedQuality === 'draft' || newPrompt) {
        setGenerationStage('preview');
        setGenerationMessage('Creating style prompt for drafts...');
        const stylePrompt = await Gemini.enhanceStyle(currentPrompt, analysis, textInfo, selectedStyle, 'draft');
        const negativePrompt = Gemini.getNegativePrompts(analysis, textInfo, selectedStyle);

        setDraftProgress({ count: 0, total: 4 });
        setGenerationMessage('Generating draft 1 of 4...');
        const onDraftGenerated = (image: GeneratedImage, index: number, total: number) => {
          setGeneratedVariations(prev => [...prev, image]);
          setDraftProgress({ count: index + 1, total });
          if (index + 1 < total) {
            setGenerationMessage(`Generating draft ${index + 2} of ${total}...`);
          }
        };

        const rawImageResults = await Gemini.generateImage(
          stylePrompt, textInfo, referenceImage ?? undefined, selectedAspectRatio, negativePrompt, 4, false, 'draft', undefined, onDraftGenerated
        );

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        if (rawImageResults?.length > 0) {
          showNotification(`4 new drafts generated in ${elapsed}s`, 'success');
        } else {
          throw new Error("Failed to generate preview images.");
        }
      } else {
        await runFinalGeneration(initialAnalysisRef.current, undefined, undefined, setGenerationMessage);
      }
    } catch (error) {
      console.error(error);
      handleApiPermissionError(error as Error);
    } finally {
      setIsGenerating(false);
      setDraftProgress(null);
      setGenerationMessage(null);
    }
  }, [prompt, selectedQuality, selectedStyle, referenceImage, selectedAspectRatio, runFinalGeneration, showNotification, processText]);

  const handleExecuteEnhance = useCallback(async (imageToEnhance: GeneratedImage, quality: QualityLevel) => {
    if (!imageToEnhance || isGenerating) return;
    setIsGenerating(true);
    setGenerationMessage('Preparing final enhancement...');

    try {
      let analysisInput = initialAnalysisRef.current;
      if (!analysisInput) {
        setGenerationMessage('Initial context lost. Re-analyzing prompt...');
        const { textInfo, analysis } = await Gemini.performInitialAnalysis(imageToEnhance.prompt, processText);
        analysisInput = { prompt: imageToEnhance.prompt, analysis, textInfo };
        initialAnalysisRef.current = analysisInput;
      }

      setShowEnhanceModal(null);
      setFocusedDraft(null);
      setIsZoomed(false);
      setGeneratedVariations([]);
      setDraftProgress(null);

      await runFinalGeneration(analysisInput, imageToEnhance, quality, setGenerationMessage);
    } catch (error) {
      console.error("Enhance Error:", error);
      handleApiPermissionError(error as Error);
    } finally {
      setIsGenerating(false);
      setGenerationMessage(null);
    }
  }, [isGenerating, runFinalGeneration, showNotification, processText]);


  const handleUpdateDraft = useCallback(async () => {
    if (!focusedDraft || !iterativeEditPrompt || isIterating) return;
    setIsIterating(true);
    try {
      let newFinalText: string | undefined = focusedDraft.finalText;
      let newTextStyleIntent: TextStyleIntent | undefined = focusedDraft.textStyleIntent;

      const lowerEditPrompt = iterativeEditPrompt.toLowerCase();
      const isTextEdit = lowerEditPrompt.includes('add') || lowerEditPrompt.includes('change') || lowerEditPrompt.includes('write') || lowerEditPrompt.includes('remove') || lowerEditPrompt.includes('no text');

      if (isTextEdit) {
        newTextStyleIntent = textStyleIntent; // Capture the user's selected intent
        if (lowerEditPrompt.includes('remove text') || lowerEditPrompt.includes('no text')) {
          newFinalText = '';
        } else {
          // We let the iterative agent extract the text, just pass the intent
        }
      }

      const newPrompt = await Gemini.generateIterativeEditPrompt(focusedDraft.prompt, iterativeEditPrompt, textStyleIntent);
      setIterativeEditPrompt('');

      // The new prompt from the agent now has the detailed text instruction based on intent.
      // We still need to run the analysis on it to get structured data for negative prompts.
      const { textInfo: textInfoForUpdate } = await Gemini.performInitialAnalysis(newPrompt, processText);
      if (textInfoForUpdate.length > 0 && textInfoForUpdate[0].text) {
        newFinalText = textInfoForUpdate[0].text;
      }


      const rawImageResults = await Gemini.generateImage(
        newPrompt,
        textInfoForUpdate,
        focusedDraft.base64Data && focusedDraft.mimeType ? { base64Data: focusedDraft.base64Data, mimeType: focusedDraft.mimeType } : undefined,
        selectedAspectRatio, undefined, 1, false, 'draft'
      );

      if (rawImageResults?.length > 0) {
        const newDraft: GeneratedImage = {
          ...rawImageResults[0],
          prompt: newPrompt,
          finalText: newFinalText,
          finalBackground: focusedDraft.finalBackground,
          textStyleIntent: newTextStyleIntent,
        };
        setFocusedDraft(newDraft);
      } else {
        showNotification('Could not update draft.', 'error');
      }
    } catch (error) {
      console.error("Iterative Edit Error:", error);
      handleApiPermissionError(error as Error);
    } finally {
      setIsIterating(false);
    }
  }, [focusedDraft, iterativeEditPrompt, isIterating, selectedAspectRatio, showNotification, textStyleIntent, processText]);


  // --- EVENT HANDLERS & SIDE EFFECTS ---

  const handleRating = useCallback((rating: number) => {
    if (!lastGenerationData.current || !generatedVariations[selectedVariationIndex]) return;
    const currentImage = generatedVariations[selectedVariationIndex];
    setUserRating(rating);

    qualityLearning.trackGeneration(
      lastGenerationData.current.enhancedPrompt,
      rating,
      currentImage.scores?.overall ?? 0,
      lastGenerationData.current.metadata
    );
    showNotification(`Thanks for your feedback!`, 'success');
  }, [generatedVariations, selectedVariationIndex, showNotification]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, type: 'remix' | 'reference') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];

      if (type === 'remix') {
        setPrompt("Analyzing image...");
        const analysis = await Gemini.analyzeImage(base64Data, file.type);
        setPrompt(analysis);
        showNotification('Image analyzed!', 'success');
      } else {
        setReferenceImage({ url: base64String, base64Data: base64Data, mimeType: file.type });
        showNotification('Reference image added', 'info');
      }
    };
    reader.readAsDataURL(file);
    event.target.value = ''; // Reset file input
  }, [showNotification]);

  const handleEditFinalImage = useCallback((image: GeneratedImage) => {
    if (!image) return;
    setIsZoomed(false);
    setFocusedDraft(image);
    setGenerationStage('preview');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if typing in an input field.
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Allow Cmd/Ctrl+Enter for submission
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (focusedDraft && iterativeEditPrompt && !isIterating) handleUpdateDraft();
          else if (!focusedDraft && prompt && !isGenerating) handleGenerate();
        }
        return;
      }

      const currentImage = generatedVariations[selectedVariationIndex];

      // Global Shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (prompt && !isGenerating) handleGenerate();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's' && generatedVariations.length > 0) {
        e.preventDefault();
        downloadImage(currentImage, 'png');
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c' && generatedVariations.length > 0 && !window.getSelection()?.toString()) {
        e.preventDefault();
        copyImageToClipboard();
      } else if (e.key === 'Escape') {
        setActiveDropdown(null);
        setFocusedDraft(null);
        setShowDownloadMenu(false);
        setShowKeyboardShortcuts(false);
        setShowKnowledgeBase(false);
        setShowEnhanceModal(null);
        setIsZoomed(false);
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowKeyboardShortcuts(s => !s);
      }

      // Variation Navigation (only in final, multi-variation view)
      if (generatedVariations.length > 1 && generationStage === 'final') {
        if (e.key === 'ArrowLeft') selectVariation(selectedVariationIndex - 1);
        else if (e.key === 'ArrowRight') selectVariation(selectedVariationIndex + 1);
        else if (e.key >= '1' && e.key <= '4') {
          const index = parseInt(e.key) - 1;
          if (index < generatedVariations.length) selectVariation(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, isGenerating, generatedVariations, selectedVariationIndex, focusedDraft, iterativeEditPrompt, isIterating, handleGenerate, handleUpdateDraft, copyImageToClipboard, downloadImage, selectVariation]);

  // --- RENDER ---

  const currentImage = generatedVariations[selectedVariationIndex];

  if (!isKeyReady) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-center p-8">
        <div className="max-w-md">
          <KeyRound className="w-12 h-12 text-primary-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">API Key Required</h1>
          <p className="text-slate-400 mb-8">
            This app uses advanced Google AI models. Please select an API key from a project with billing enabled to continue.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20"
          >
            Select API Key
          </button>
          <p className="text-xs text-slate-500 mt-6">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">
              Learn more about billing
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 max-w-7xl mx-auto flex flex-col">
      {/* --- Overlays & Modals --- */}
      {(activeDropdown || showDownloadMenu) && <div className="fixed inset-0 z-10" onClick={() => { setActiveDropdown(null); setShowDownloadMenu(false); }} />}
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideDown ${notification.type === 'success' ? 'bg-green-600' : notification.type === 'error' ? 'bg-red-600' : 'bg-slate-700'} text-white`}>
          {notification.type === 'success' ? <Check className="w-5 h-5" /> : notification.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}
      {showKnowledgeBase && <KnowledgeBaseModal onClose={() => setShowKnowledgeBase(false)} />}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowKeyboardShortcuts(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-md w-full animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><Keyboard className="w-6 h-6 text-primary-400" />Keyboard Shortcuts</h2>
              <button onClick={() => setShowKeyboardShortcuts(false)} className="p-2 -mr-2 hover:bg-slate-800 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {/* Shortcut list content would go here */}
          </div>
        </div>
      )}
      {showEnhanceModal && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setShowEnhanceModal(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Select Final Quality</h2>
            <p className="text-slate-400 mb-6">Higher quality takes longer to generate.</p>
            <div className="space-y-3">
              {Object.entries(QUALITY_PRESETS).filter(([k]) => k !== 'draft').map(([key, preset]) => (
                <button key={key} onClick={() => handleExecuteEnhance(showEnhanceModal.image, key as QualityLevel)} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition">
                  <span className="text-2xl">{preset.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{preset.name}</p>
                    <p className="text-sm text-slate-400">{preset.description}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setShowEnhanceModal(null)} className="w-full mt-6 text-center py-2 text-slate-400 hover:text-white">Cancel</button>
          </div>
        </div>
      )}
      {focusedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-8 animate-in fade-in" onClick={() => setFocusedDraft(null)}>
          <div className="relative flex flex-col gap-4 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setFocusedDraft(null)} className="absolute -top-4 -right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full z-50"><X className="w-6 h-6" /></button>

            <div className="relative w-full rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-square">
              {isIterating && <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"><Loader2 className="w-8 h-8 text-white animate-spin" /></div>}
              <img src={focusedDraft.url} alt="Focused draft" className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col gap-4 w-full">
              {iterativeEditPrompt.toLowerCase().includes('text') && (
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-700">
                  <label className="text-xs font-semibold text-slate-400 mb-2 block">Text Style Intent</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {TEXT_STYLE_INTENTS.map(intent => (
                      <button
                        key={intent.key}
                        onClick={() => setTextStyleIntent(intent.key)}
                        title={intent.description}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${textStyleIntent === intent.key
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                      >
                        {intent.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="relative">
                <textarea value={iterativeEditPrompt} onChange={(e) => setIterativeEditPrompt(e.target.value)} placeholder="Describe your changes... e.g., 'change the man to a woman', 'add text: Happy Birthday'" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 pr-36 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500 outline-none resize-none h-14" />
                <button onClick={handleUpdateDraft} disabled={isIterating || !iterativeEditPrompt} className="absolute top-1/2 right-3 -translate-y-1/2 px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 disabled:opacity-50 flex items-center gap-2 text-sm">
                  <RefreshCw className={`w-4 h-4 ${isIterating ? 'animate-spin' : ''}`} />
                  Update
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    downloadImage(focusedDraft, 'png');
                    showNotification('Draft downloaded', 'success');
                  }}
                  disabled={isIterating || isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 transition-colors"
                  title="Download this draft image"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Draft</span>
                </button>
                <button onClick={() => setShowEnhanceModal({ image: focusedDraft })} disabled={isIterating || isGenerating} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-500 active:scale-95 disabled:bg-slate-800 disabled:text-slate-500 transition-colors">
                  <Sparkles className="w-5 h-5" />
                  <span>Enhance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isZoomed && currentImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in">
          <button onClick={() => setIsZoomed(false)} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-50"><X className="w-6 h-6" /></button>
          <div className="relative w-full h-full flex items-center justify-center" onClick={() => setIsZoomed(false)}>
            <img src={currentImage.url} alt="Full size" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-8 flex gap-4" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowEnhanceModal({ image: currentImage })} className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-900 rounded-full font-bold hover:bg-white shadow-lg"><Sparkles className="w-5 h-5" /><span>Enhance</span></button>
              <button onClick={() => downloadImage(currentImage, 'png')} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 shadow-lg"><Download className="w-5 h-5" /><span>Download</span></button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="mb-8 flex items-center gap-3 border-b border-slate-800 pb-6">
        <div className="p-3 bg-primary-600 rounded-lg shadow-lg shadow-primary-500/20"><Wand2 className="w-6 h-6 text-white" /></div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quad-Agent Image Studio</h1>
          <p className="text-slate-400 text-sm">Powered by Gemini & Imagen</p>
        </div>
      </header>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button onClick={() => setShowKnowledgeBase(true)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700" title="Knowledge Base"><BookOpen className="w-5 h-5" /></button>
        <button onClick={() => setShowKeyboardShortcuts(true)} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700" title="Keyboard Shortcuts (?)"><Keyboard className="w-5 h-5" /></button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col gap-8">
        {/* --- Input & Controls Panel --- */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl z-20">
          <div className="relative">
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your imagination..." className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 pr-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary-500 outline-none resize-none h-24" />
            <div className="absolute top-3 right-3"><LiveBrainstorm onIdeaAccepted={setPrompt} currentPrompt={prompt} /></div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input type="file" ref={remixInputRef} onChange={(e) => handleFileUpload(e, 'remix')} className="hidden" accept="image/*" />
              <button onClick={() => remixInputRef.current?.click()} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-800" title="Upload image to analyze"><Upload className="w-4 h-4" /><span>Remix</span></button>
              <input type="file" ref={referenceInputRef} onChange={(e) => handleFileUpload(e, 'reference')} className="hidden" accept="image/*" />
              <button onClick={() => referenceInputRef.current?.click()} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${referenceImage ? 'text-primary-400 bg-primary-900/20 border-primary-500/50' : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'}`} title="Use image as visual reference"><ImagePlus className="w-4 h-4" /><span>Reference</span></button>
              {referenceImage && <button onClick={() => setReferenceImage(null)} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800"><X className="w-4 h-4" /></button>}
              <button onClick={() => setShowAdvanced(s => !s)} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border ${showAdvanced ? 'bg-slate-700 text-white border-slate-600' : 'text-slate-400 hover:text-white hover:bg-slate-800 border-transparent'}`} title="Advanced Settings"><SlidersHorizontal className="w-4 h-4" /></button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Parameter dropdowns would go here */}
              <button onClick={() => handleGenerate()} disabled={!prompt || isGenerating} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed bg-primary-600 text-white hover:bg-primary-500 active:scale-95">
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                <span>{generationStage === 'preview' ? 'New Drafts' : 'Generate'}</span>
              </button>
            </div>
          </div>

          {showAdvanced && (
            <div className="mt-4 space-y-4 animate-fadeIn p-4 bg-slate-850 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label htmlFor="refiner-toggle" className="flex flex-col cursor-pointer">
                  <span className="text-sm font-medium text-slate-200">Enable Master Refiner</span>
                  <span className="text-xs text-slate-500">Apply cinematic post-processing.</span>
                </label>
                <button type="button" onClick={() => setEnableRefiner(!enableRefiner)} className={`${enableRefiner ? 'bg-primary-600' : 'bg-slate-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-850`} role="switch" aria-checked={enableRefiner}>
                  <span aria-hidden="true" className={`${enableRefiner ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="curation-toggle" className="flex flex-col cursor-pointer">
                  <span className="text-sm font-medium text-slate-200">Use AI Curation</span>
                  <span className="text-xs text-slate-500">Generate a larger batch and select the best results. Slower.</span>
                </label>
                <button type="button" onClick={() => setUseCuratedSelection(!useCuratedSelection)} className={`${useCuratedSelection ? 'bg-primary-600' : 'bg-slate-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-850`} role="switch" aria-checked={useCuratedSelection}>
                  <span aria-hidden="true" className={`${useCuratedSelection ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="text-toggle" className="flex flex-col cursor-pointer">
                  <span className="text-sm font-medium text-slate-200">Process Text in Prompt</span>
                  <span className="text-xs text-slate-500">Allow AI to detect and render text. Turn off to prevent errors.</span>
                </label>
                <button type="button" onClick={() => setProcessText(!processText)} className={`${processText ? 'bg-primary-600' : 'bg-slate-700'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-850`} role="switch" aria-checked={processText}>
                  <span aria-hidden="true" className={`${processText ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- Canvas & Results --- */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm z-10">
            <h2 className="font-semibold flex items-center gap-2"><ImageIcon className="w-5 h-5 text-primary-400" />Canvas</h2>
            {generationStage === 'final' && currentImage && (
              <div className="flex gap-2 relative">
                <button onClick={() => handleEditFinalImage(currentImage)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Edit"><Pencil className="w-5 h-5" /></button>
                <div className="w-px h-6 bg-slate-700 mx-1 self-center" />
                <button onClick={() => setIsZoomed(true)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Zoom View"><Maximize2 className="w-5 h-5" /></button>
                <button onClick={copyImageToClipboard} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Copy Image"><Copy className="w-5 h-5" /></button>
                <button onClick={() => setShowDownloadMenu(s => !s)} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300" title="Download Image"><Download className="w-5 h-5" /></button>
                {showDownloadMenu && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-20 animate-slideDown">
                    <button onClick={() => { downloadImage(currentImage, 'png'); setShowDownloadMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-700 rounded-t-lg">Save as PNG</button>
                    <button onClick={() => { downloadImage(currentImage, 'jpeg'); setShowDownloadMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-700">Save as JPEG</button>
                    <button onClick={() => { downloadImage(currentImage, 'webp'); setShowDownloadMenu(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-slate-700 rounded-b-lg">Save as WEBP</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] bg-slate-950 flex flex-col items-center justify-center p-8 gap-4">
            {isGenerating && generatedVariations.length === 0 && !(generationStage === 'preview') ? (
              <div className="text-center text-slate-400 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-semibold text-lg">{generationMessage || 'Generating...'}</p>
              </div>
            ) : generatedVariations.length === 0 && !isGenerating ? (
              <div className="text-center text-slate-600">
                <div className="w-24 h-24 border-4 border-slate-800 border-dashed rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 opacity-50" />
                </div>
                <p>Your imagination, visualized.</p>
              </div>
            ) : generationStage === 'preview' && !focusedDraft ? (
              <div className="text-center w-full">
                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
                  {generatedVariations.map((variation, index) => (
                    <div key={variation.url} onClick={() => setFocusedDraft(variation)} className="relative group aspect-square rounded-lg bg-slate-800 cursor-pointer overflow-hidden">
                      <img src={variation.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-white font-semibold flex items-center gap-2">
                          <Pencil className="w-4 h-4" />
                          <span>Edit & Enhance</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(variation, 'png');
                            showNotification('Draft downloaded', 'success');
                          }}
                          className="absolute bottom-3 right-3 p-2 bg-slate-700/80 text-white rounded-full hover:bg-slate-600 transition"
                          title="Download Draft"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - generatedVariations.length) }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
                    </div>
                  ))}
                </div>
                {isGenerating && draftProgress && draftProgress.count < draftProgress.total && (
                  <p className="text-sm text-slate-400 mt-4">{generationMessage || `Generating draft ${draftProgress.count + 1} of ${draftProgress.total}...`}</p>
                )}
                {generatedVariations.length > 0 && <p className="text-xs text-slate-500 mt-4">Choose a preview to start editing or download.</p>}
              </div>
            ) : currentImage && (
              <>
                <div className={`relative w-full max-w-xl rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 ${ASPECT_RATIOS[selectedAspectRatio].label === 'Portrait' ? 'aspect-[9/16] max-w-sm' : ASPECT_RATIOS[selectedAspectRatio].label === 'Tall' ? 'aspect-[3/4] max-w-md' : 'aspect-square'}`}>
                  <img src={currentImage.url} alt="Generated Content" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-center gap-2 text-slate-400 mt-4">
                  <p className="text-sm">Rate this result:</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => handleRating(star)} className={`p-1.5 rounded-full transition-all ${star <= userRating ? 'text-yellow-400 scale-110' : 'text-slate-600 hover:text-yellow-500 hover:scale-110'}`}>
                        <Star className={`w-6 h-6 ${star <= userRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  {currentImage.scores && <p className="text-xs text-slate-500 mt-1">AI Quality Score: {currentImage.scores.overall.toFixed(1)}/10</p>}
                </div>
              </>
            )}
          </div>

          {generatedVariations.length > 1 && generationStage === 'final' && (
            <div className="flex justify-center gap-2 p-4 bg-slate-900 border-t border-slate-800">
              {generatedVariations.map((variation, index) => (
                <button key={variation.url} onClick={() => selectVariation(index)} className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${selectedVariationIndex === index ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-slate-900 scale-105' : 'opacity-60 hover:opacity-100'}`}>
                  <img src={variation.url} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 flex items-center justify-center ${selectedVariationIndex === index ? 'bg-primary-500/20' : 'bg-black/40'}`}>
                    <span className="text-xs font-bold text-white drop-shadow-lg">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="mt-12 pt-6 border-t border-slate-800 text-center text-slate-600 text-sm">
        <p>Quad-Agent Image Studio • <button onClick={() => setShowKeyboardShortcuts(true)} className="text-slate-500 hover:text-primary-400">Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs mx-1">?</kbd> for shortcuts</button></p>
      </footer>
    </div>
  );
};

export default App;
