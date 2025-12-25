/**
 * Generation Performance Configuration
 * 
 * Tune these settings to optimize generation speed vs quality
 */

export const GENERATION_CONFIG = {
  // Timeout settings (milliseconds)
  TIMEOUTS: {
    GUEST: 20000,        // 20 seconds for guest users
    DRAFT: 30000,        // 30 seconds for draft quality
    PREMIUM: 45000,      // 45 seconds for premium quality
    ANALYSIS: 5000,      // 5 seconds for prompt analysis
    ENHANCEMENT: 10000,  // 10 seconds for prompt enhancement
  },

  // Parallel processing limits
  CONCURRENCY: {
    MAX_PARALLEL_GENERATIONS: 4,  // Max images to generate in parallel
    MAX_BATCH_SIZE: 4,             // Max images per batch request
  },

  // Cache settings
  CACHE: {
    ENABLE_PROMPT_CACHE: true,     // Cache prompt analysis results
    ENABLE_ENHANCEMENT_CACHE: true, // Cache prompt enhancements
    PROMPT_CACHE_TTL: 3600,        // 1 hour
    ENHANCEMENT_CACHE_TTL: 1800,   // 30 minutes
  },

  // Optimization flags
  OPTIMIZATIONS: {
    SKIP_ANALYSIS_FOR_SIMPLE_PROMPTS: true,      // Skip analysis for prompts < 50 chars
    SKIP_ENHANCEMENT_FOR_SIMPLE_PROMPTS: true,   // Skip enhancement for simple prompts
    USE_FAST_TRACK_FOR_GUESTS: true,             // Use fast-track for guest generations
    DISABLE_THINKING_MODE: true,                 // Disable thinking for faster generation
    PARALLEL_BATCH_GENERATION: true,             // Generate batch images in parallel
  },

  // Model selection
  MODELS: {
    DRAFT: "gemini-2.0-flash-exp-image-generation",
    PREMIUM: "gemini-2.0-flash-thinking-exp-1219-image-generation",
    ANALYSIS: "gemini-2.0-flash-exp",
    ENHANCEMENT: "gemini-2.0-flash-exp",
  },

  // Quality vs Speed tradeoffs
  QUALITY_SETTINGS: {
    DRAFT: {
      temperature: 1.0,              // Higher = faster but less consistent
      thinkingBudget: 0,             // Disable thinking
      skipAnalysis: true,            // Skip prompt analysis
      skipEnhancement: false,        // Keep enhancement for quality
    },
    PREMIUM: {
      temperature: 0.9,              // Slightly lower for better quality
      thinkingBudget: 0,             // Still disable for speed
      skipAnalysis: false,           // Keep analysis
      skipEnhancement: false,        // Keep enhancement
    },
  },

  // Rate limiting and queuing
  RATE_LIMITING: {
    ENABLE_QUEUE: true,              // Queue requests when rate limited
    MAX_QUEUE_SIZE: 100,             // Max queued requests
    QUEUE_TIMEOUT: 60000,            // 60 seconds max wait in queue
    RETRY_ATTEMPTS: 3,               // Retry failed generations
    RETRY_DELAY: 1000,               // 1 second between retries
  },

  // Monitoring and metrics
  MONITORING: {
    ENABLE_METRICS: true,            // Track generation performance
    LOG_SLOW_GENERATIONS: true,      // Log generations > threshold
    SLOW_GENERATION_THRESHOLD: 15000, // 15 seconds
    METRICS_RETENTION_MINUTES: 60,   // Keep metrics for 1 hour
  },
};

/**
 * Get timeout for a specific generation type
 */
export function getGenerationTimeout(
  qualityLevel: "draft" | "premium",
  isGuest: boolean = false
): number {
  if (isGuest) return GENERATION_CONFIG.TIMEOUTS.GUEST;
  return qualityLevel === "premium" 
    ? GENERATION_CONFIG.TIMEOUTS.PREMIUM 
    : GENERATION_CONFIG.TIMEOUTS.DRAFT;
}

/**
 * Check if optimization should be applied
 */
export function shouldSkipAnalysis(prompt: string): boolean {
  return GENERATION_CONFIG.OPTIMIZATIONS.SKIP_ANALYSIS_FOR_SIMPLE_PROMPTS 
    && prompt.length < 50;
}

/**
 * Check if enhancement should be skipped
 */
export function shouldSkipEnhancement(prompt: string, qualityLevel: "draft" | "premium"): boolean {
  if (qualityLevel === "premium") return false; // Never skip for premium
  return GENERATION_CONFIG.OPTIMIZATIONS.SKIP_ENHANCEMENT_FOR_SIMPLE_PROMPTS 
    && prompt.length < 50;
}

/**
 * Get model configuration for quality level
 */
export function getModelConfig(qualityLevel: "draft" | "premium") {
  return GENERATION_CONFIG.QUALITY_SETTINGS[qualityLevel.toUpperCase() as "DRAFT" | "PREMIUM"];
}

/**
 * Export for environment-based overrides
 */
export function loadConfigFromEnv(): void {
  // Allow environment variables to override defaults
  if (process.env.GENERATION_TIMEOUT_DRAFT) {
    GENERATION_CONFIG.TIMEOUTS.DRAFT = parseInt(process.env.GENERATION_TIMEOUT_DRAFT);
  }
  if (process.env.GENERATION_TIMEOUT_PREMIUM) {
    GENERATION_CONFIG.TIMEOUTS.PREMIUM = parseInt(process.env.GENERATION_TIMEOUT_PREMIUM);
  }
  if (process.env.MAX_PARALLEL_GENERATIONS) {
    GENERATION_CONFIG.CONCURRENCY.MAX_PARALLEL_GENERATIONS = parseInt(process.env.MAX_PARALLEL_GENERATIONS);
  }
  if (process.env.DISABLE_THINKING_MODE === 'false') {
    GENERATION_CONFIG.OPTIMIZATIONS.DISABLE_THINKING_MODE = false;
  }
}

// Load config on module initialization
loadConfigFromEnv();
