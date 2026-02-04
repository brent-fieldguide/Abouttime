import { create } from 'zustand';

// Story specification that gets sent to the API
const initialStorySpec = {
  mainCharacter: {
    type: null,
    name: '',
    description: '',
    traits: [],
  },
  sidekick: null,
  setting: {
    location: null,
    era: null,
  },
  theme: null,
  conflict: null,
  endingMood: null,
  artStyle: null,
  colorPalette: null,
  pageCount: 8,
};

// App phases/screens
export const PHASES = {
  WELCOME: 'welcome',
  CHARACTER_TYPE: 'character_type',
  CHARACTER_NAME: 'character_name',
  CHARACTER_TRAITS: 'character_traits',
  SIDEKICK: 'sidekick',
  LOCATION: 'location',
  TIME_ERA: 'time_era',
  THEME: 'theme',
  CONFLICT: 'conflict',
  ENDING_MOOD: 'ending_mood',
  ART_STYLE: 'art_style',
  COLOR_PALETTE: 'color_palette',
  STORY_LENGTH: 'story_length',
  REVIEW: 'review',
  GENERATING: 'generating',
  APPROVAL: 'approval',
  VIEWING: 'viewing',
  EXPORT: 'export',
};

// Phase order for progress tracking
export const PHASE_ORDER = [
  PHASES.WELCOME,
  PHASES.CHARACTER_TYPE,
  PHASES.CHARACTER_NAME,
  PHASES.CHARACTER_TRAITS,
  PHASES.SIDEKICK,
  PHASES.LOCATION,
  PHASES.TIME_ERA,
  PHASES.THEME,
  PHASES.CONFLICT,
  PHASES.ENDING_MOOD,
  PHASES.ART_STYLE,
  PHASES.COLOR_PALETTE,
  PHASES.STORY_LENGTH,
  PHASES.REVIEW,
];

export const useStoryStore = create((set, get) => ({
  // Current phase
  phase: PHASES.WELCOME,

  // Story specification (user choices)
  storySpec: { ...initialStorySpec },

  // Generated content
  characterDesign: null,
  generatedStory: null,
  generatedImages: [],

  // Generation state
  isGenerating: false,
  generationProgress: {
    step: '',
    current: 0,
    total: 0,
  },
  generationError: null,

  // Parent mode
  parentModeActive: false,

  // Author name for PDF
  authorName: '',

  // Actions
  setPhase: (phase) => set({ phase }),

  nextPhase: () => {
    const currentIndex = PHASE_ORDER.indexOf(get().phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      set({ phase: PHASE_ORDER[currentIndex + 1] });
    }
  },

  prevPhase: () => {
    const currentIndex = PHASE_ORDER.indexOf(get().phase);
    if (currentIndex > 0) {
      set({ phase: PHASE_ORDER[currentIndex - 1] });
    }
  },

  goToPhase: (phase) => set({ phase }),

  // Update story spec
  updateStorySpec: (updates) =>
    set((state) => ({
      storySpec: {
        ...state.storySpec,
        ...updates,
      },
    })),

  updateMainCharacter: (updates) =>
    set((state) => ({
      storySpec: {
        ...state.storySpec,
        mainCharacter: {
          ...state.storySpec.mainCharacter,
          ...updates,
        },
      },
    })),

  updateSidekick: (sidekick) =>
    set((state) => ({
      storySpec: {
        ...state.storySpec,
        sidekick,
      },
    })),

  updateSetting: (updates) =>
    set((state) => ({
      storySpec: {
        ...state.storySpec,
        setting: {
          ...state.storySpec.setting,
          ...updates,
        },
      },
    })),

  // Generation state
  setGenerating: (isGenerating) => set({ isGenerating }),

  setGenerationProgress: (progress) =>
    set({ generationProgress: progress }),

  setGenerationError: (error) => set({ generationError: error }),

  setCharacterDesign: (design) => set({ characterDesign: design }),

  setGeneratedStory: (story) => set({ generatedStory: story }),

  setGeneratedImages: (images) => set({ generatedImages: images }),

  updateGeneratedImage: (pageNumber, imageSrc) =>
    set((state) => ({
      generatedImages: state.generatedImages.map((img) =>
        img.pageNumber === pageNumber ? { ...img, imageSrc } : img
      ),
    })),

  // Parent mode
  toggleParentMode: () =>
    set((state) => ({ parentModeActive: !state.parentModeActive })),

  setAuthorName: (name) => set({ authorName: name }),

  // Reset
  resetStory: () =>
    set({
      phase: PHASES.WELCOME,
      storySpec: { ...initialStorySpec },
      characterDesign: null,
      generatedStory: null,
      generatedImages: [],
      isGenerating: false,
      generationProgress: { step: '', current: 0, total: 0 },
      generationError: null,
      authorName: '',
    }),

  // Get progress percentage
  getProgressPercentage: () => {
    const currentIndex = PHASE_ORDER.indexOf(get().phase);
    if (currentIndex === -1) return 100;
    return Math.round((currentIndex / (PHASE_ORDER.length - 1)) * 100);
  },
}));
