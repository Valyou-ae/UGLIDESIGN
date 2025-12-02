import { GenerationMetadata, PromptAnalysis, QualityTracker } from '../types';

/**
 * A client-side system to track which generation parameters lead to higher quality results,
 * based on user ratings and AI scores. It uses localStorage for persistence.
 */
class QualityLearningSystem {
  private readonly STORAGE_KEY = 'quad_quality_tracker';
  private readonly MAX_HISTORY_LENGTH = 200;

  /**
   * Tracks a completed generation, storing its parameters and quality scores.
   * @param enhancedPrompt The final prompt used for generation.
   * @param userRating The user's 1-5 star rating.
   * @param aiScore The AI's 1-10 quality score.
   * @param metadata The metadata associated with the generation.
   */
  public trackGeneration(
    enhancedPrompt: string,
    userRating: number,
    aiScore: number,
    metadata: GenerationMetadata
  ): void {
    const tracker: QualityTracker = {
      promptHash: this.hashString(enhancedPrompt),
      enhancedPrompt,
      userRating,
      aiScore,
      metadata
    };

    const history = this.getHistory();
    history.push(tracker);

    if (history.length > this.MAX_HISTORY_LENGTH) {
      history.shift(); // Keep history size manageable
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save quality history to localStorage", e);
    }
  }

  /**
   * Analyzes the stored history to find patterns in high-quality generations.
   * @returns An analysis object with insights on successful parameters.
   */
  public analyzePatterns() {
    const history = this.getHistory();
    if (history.length < 10) { // Require a minimum amount of data
      return { global: { bestLightingScenarios: [], bestStyles: [], avgQualityByStyle: {} }, bySubject: {} };
    }

    // Consider a generation "high quality" if user rating is 4+ or AI score is 8+
    const highQuality = history.filter(h => (h.userRating || 0) >= 4 || (h.aiScore || 0) >= 8);

    const countItems = <T>(items: T[]): Record<string, number> =>
      items.reduce((acc, item) => {
        const key = String(item).trim().toLowerCase();
        if (key) acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const getTopItems = (counter: Record<string, number>, topN = 5): string[] =>
      Object.entries(counter)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([item]) => item);

    // Global Analysis
    const lightingCounts = countItems(highQuality.map(h => h.metadata.analysis.lighting.scenario));
    const styleCounts = countItems(highQuality.map(h => h.metadata.selectedStyle));

    const qualityByStyle: Record<string, { totalScore: number, count: number }> = {};
    history.forEach(h => {
      const style = h.metadata.selectedStyle;
      const score = h.userRating ? h.userRating * 2 : (h.aiScore || 0);
      if (!qualityByStyle[style]) qualityByStyle[style] = { totalScore: 0, count: 0 };
      qualityByStyle[style].totalScore += score;
      qualityByStyle[style].count += 1;
    });

    const avgQualityByStyle = Object.fromEntries(
      Object.entries(qualityByStyle).map(([style, data]) => [style, data.count > 0 ? data.totalScore / data.count : 0])
    );

    // Per-Subject Analysis
    const bySubject: Record<string, { bestKeywords: string[] }> = {};
    const subjects: Record<string, QualityTracker[]> = {};
    highQuality.forEach(h => {
      const subject = h.metadata.analysis.subject.primary?.toLowerCase() || 'general';
      if (!subjects[subject]) subjects[subject] = [];
      subjects[subject].push(h);
    });

    const stopWords = new Set(['the', 'with', 'and', 'for', 'from', 'into', 'that', 'this', 'style', 'shot', 'image', 'quality', 'using', 'also', 'creating', 'a', 'of', 'in', 'on', 'an', 'is', 'at', 'by', 'as', 'it', 'its', 'are', 'was', 'were', 'be', 'have', 'has', 'do', 'does', 'but', 'if', 'or', 'to', 'up', 'down', 'out', 'over', 'under', 'again', 'then', 'once', 'all', 'any', 'few', 'more', 'most', 'some', 'such', 'no', 'not', 'only', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'cinematic', 'photorealistic']);

    for (const subject in subjects) {
      const subjectHistory = subjects[subject];
      const keywordCounts = countItems(subjectHistory.flatMap(h => h.enhancedPrompt.toLowerCase().match(/\b[a-z]{4,}\b/g) || []));
      stopWords.forEach(word => delete keywordCounts[word]);

      bySubject[subject] = { bestKeywords: getTopItems(keywordCounts, 20) };
    }

    return {
      global: {
        bestLightingScenarios: getTopItems(lightingCounts),
        bestStyles: getTopItems(styleCounts),
        avgQualityByStyle,
      },
      bySubject,
    };
  }

  /**
   * Optimizes a new prompt by appending successful keywords from past high-quality generations.
   * @param basePrompt The prompt to be optimized.
   * @param analysis The analysis of the original user prompt.
   * @returns An optimized prompt string.
   */
  public optimizePrompt(basePrompt: string, analysis: PromptAnalysis): string {
    const patterns = this.analyzePatterns();
    const subject = analysis.subject.primary?.toLowerCase() || 'general';
    const subjectKeywords = patterns.bySubject[subject]?.bestKeywords || [];

    if (subjectKeywords.length === 0) return basePrompt;

    let optimized = basePrompt;
    const keywordsToAdd = subjectKeywords.slice(0, 3); // Add up to 3 best keywords

    for (const keyword of keywordsToAdd) {
      if (!optimized.toLowerCase().includes(keyword)) {
        optimized += `, ${keyword}`;
      }
    }

    return optimized;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  private getHistory(): QualityTracker[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to parse quality history from localStorage", e);
      return [];
    }
  }
}

export const qualityLearning = new QualityLearningSystem();
