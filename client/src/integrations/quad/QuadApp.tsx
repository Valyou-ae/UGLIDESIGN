import React, { useState, useRef, useCallback } from 'react';
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
  Maximize2, ImagePlus, RefreshCw
} from 'lucide-react';

type GenerationStage = 'idle' | 'preview' | 'final';

const TEXT_STYLE_INTENTS: { key: TextStyleIntent, label: string, description: string }[] = [
  { key: 'subtle', label: 'Subtle', description: 'Small, non-distracting text.' },
  { key: 'integrated', label: 'Integrated', description: 'Physically part of the scene.' },
  { key: 'bold', label: 'Bold', description: 'A dominant, central feature.' },
  { key: 'cinematic', label: 'Cinematic', description: 'A clean, movie-poster style title.' },
];

const QuadApp: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof STYLE_PRESETS | 'auto'>('auto');
  const [selectedQuality, setSelectedQuality] = useState<QualityLevel>('draft');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<keyof typeof ASPECT_RATIOS>('1:1');
  const [referenceImage, setReferenceImage] = useState<{ url: string, base64Data: string, mimeType: string } | null>(null);

  const [enableRefiner, setEnableRefiner] = useState(true);
  const [useCuratedSelection, setUseCuratedSelection] = useState(true);
  const [processText, setProcessText] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState<GenerationStage>('idle');
  const [generatedVariations, setGeneratedVariations] = useState<Array<GeneratedImage>>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number>(0);
  const [numberOfVariations, setNumberOfVariations] = useState<VariationCount>(1);
  const [userRating, setUserRating] = useState(0);
  const [draftProgress, setDraftProgress] = useState<{ count: number; total: number } | null>(null);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);

  const [focusedDraft, setFocusedDraft] = useState<GeneratedImage | null>(null);
  const [iterativeEditPrompt, setIterativeEditPrompt] = useState('');
  const [isIterating, setIsIterating] = useState(false);
  const [textStyleIntent, setTextStyleIntent] = useState<TextStyleIntent>('integrated');

  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<'style' | 'quality' | 'variations' | 'aspect' | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showEnhanceModal, setShowEnhanceModal] = useState<{ image: GeneratedImage } | null>(null);

  const referenceInputRef = useRef<HTMLInputElement>(null);
  const initialAnalysisRef = useRef<{ prompt: string; analysis: PromptAnalysis; textInfo: DetectedTextInfo[] } | null>(null);
  const lastGenerationData = useRef<{ enhancedPrompt: string, metadata: any } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const downloadImage = useCallback((imageToDownload: GeneratedImage | null, format: 'png' | 'jpeg' | 'webp' = 'png') => {
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
        link.href = canvas.toDataURL(`image/${format}`, 0.92);
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
    setUserRating(0);
  }, [generatedVariations.length]);

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

    let chosenPreset: keyof typeof REFINER_PRESETS = 'photorealistic';
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
      compositionalReference ? { finalText: compositionalReference.finalText, finalBackground: compositionalReference.finalBackground, textStyleIntent: compositionalReference.textStyleIntent } : undefined,
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
          mimeType: 'image/png'
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
          showNotification(`${rawImageResults.length} drafts generated in ${elapsed}s`, 'success');
        } else {
          throw new Error("Failed to generate preview images.");
        }
      } else {
        await runFinalGeneration(initialAnalysisRef.current, undefined, undefined, setGenerationMessage);
      }
    } catch (error) {
      console.error(error);
      showNotification((error as Error).message || 'Generation failed', 'error');
    } finally {
      setIsGenerating(false);
      setDraftProgress(null);
      setGenerationMessage(null);
    }
  }, [prompt, selectedQuality, selectedStyle, referenceImage, selectedAspectRatio, runFinalGeneration, showNotification, processText]);

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const base64Match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (base64Match) {
        setReferenceImage({
          url: dataUrl,
          base64Data: base64Match[2],
          mimeType: base64Match[1]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const currentImage = generatedVariations[selectedVariationIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn ${
          notification.type === 'success' ? 'bg-green-600' :
          notification.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          {notification.type === 'success' ? <Check className="w-4 h-4" /> :
           notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> :
           <Sparkles className="w-4 h-4" />}
          <span className="text-sm">{notification.message}</span>
        </div>
      )}

      {showKnowledgeBase && <KnowledgeBaseModal onClose={() => setShowKnowledgeBase(false)} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Quad-Agent Image Studio
          </h1>
          <p className="text-slate-400">AI Studio Reference Implementation</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-slate-300">Prompt</label>
                <div className="flex items-center gap-2">
                  <LiveBrainstorm onIdeaAccepted={setPrompt} currentPrompt={prompt} />
                  <button
                    onClick={() => setShowKnowledgeBase(true)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                    title="Knowledge Base"
                  >
                    <BookOpen className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                data-testid="input-prompt"
              />

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'style' ? null : 'style')}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl hover:border-slate-500 transition-colors"
                    data-testid="dropdown-style"
                  >
                    <span className="text-sm">{STYLE_PRESETS[selectedStyle]?.name || 'Auto'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeDropdown === 'style' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
                      {Object.entries(STYLE_PRESETS).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => { setSelectedStyle(key as any); setActiveDropdown(null); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="font-medium text-sm">{value.name}</div>
                          <div className="text-xs text-slate-400">{value.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'quality' ? null : 'quality')}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl hover:border-slate-500 transition-colors"
                    data-testid="dropdown-quality"
                  >
                    <span className="text-sm">{QUALITY_PRESETS[selectedQuality]?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeDropdown === 'quality' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20">
                      {Object.entries(QUALITY_PRESETS).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => { setSelectedQuality(key as QualityLevel); setActiveDropdown(null); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="font-medium text-sm">{value.name}</div>
                          <div className="text-xs text-slate-400">{value.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'aspect' ? null : 'aspect')}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl hover:border-slate-500 transition-colors"
                    data-testid="dropdown-aspect"
                  >
                    <span className="text-sm">{ASPECT_RATIOS[selectedAspectRatio]?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {activeDropdown === 'aspect' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20">
                      {Object.entries(ASPECT_RATIOS).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => { setSelectedAspectRatio(key as any); setActiveDropdown(null); }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          <div className="font-medium text-sm">{value.name}</div>
                          <div className="text-xs text-slate-400">{value.ratio}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900/50 border border-slate-600 rounded-xl hover:border-slate-500 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm">Advanced</span>
                </button>
              </div>

              {showAdvanced && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableRefiner}
                      onChange={(e) => setEnableRefiner(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm">Enable Master Refiner</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={processText}
                      onChange={(e) => setProcessText(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm">Process Text in Prompts</span>
                  </label>
                </div>
              )}

              {referenceImage && (
                <div className="mt-4 relative">
                  <img src={referenceImage.url} alt="Reference" className="w-24 h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => setReferenceImage(null)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => referenceInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Reference</span>
                </button>
                <input
                  ref={referenceInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReferenceUpload}
                  className="hidden"
                />

                <button
                  onClick={() => handleGenerate()}
                  disabled={!prompt || isGenerating}
                  className="flex-[2] flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  data-testid="button-generate"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{generationMessage || 'Generating...'}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>

              {draftProgress && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Generating drafts...</span>
                    <span>{draftProgress.count} / {draftProgress.total}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${(draftProgress.count / draftProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Generated Image</h2>
                {currentImage && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyImageToClipboard}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadImage(currentImage)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      title="Zoom"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="aspect-square bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
                {currentImage ? (
                  <img
                    src={currentImage.url}
                    alt="Generated"
                    className={`max-w-full max-h-full object-contain ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'}`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    data-testid="img-generated"
                  />
                ) : (
                  <div className="text-center text-slate-500">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Your generated image will appear here</p>
                  </div>
                )}
              </div>

              {generatedVariations.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                  {generatedVariations.map((variation, index) => (
                    <button
                      key={index}
                      onClick={() => selectVariation(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedVariationIndex ? 'border-primary-500' : 'border-transparent hover:border-slate-500'
                      }`}
                    >
                      <img src={variation.url} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {currentImage && generationStage === 'preview' && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      if (initialAnalysisRef.current) {
                        setIsGenerating(true);
                        runFinalGeneration(initialAnalysisRef.current, currentImage, 'standard', setGenerationMessage)
                          .finally(() => setIsGenerating(false));
                      }
                    }}
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl transition-all disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Enhance to Final</span>
                  </button>
                  <button
                    onClick={() => handleGenerate(prompt)}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate</span>
                  </button>
                </div>
              )}

              {currentImage && (
                <div className="mt-4 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => {
                        setUserRating(star);
                        if (lastGenerationData.current) {
                          qualityLearning.trackGeneration(
                            lastGenerationData.current.enhancedPrompt,
                            star,
                            currentImage.scores?.overall || 0,
                            lastGenerationData.current.metadata
                          );
                        }
                        showNotification('Rating saved!', 'success');
                      }}
                      className="p-1 transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadApp;
