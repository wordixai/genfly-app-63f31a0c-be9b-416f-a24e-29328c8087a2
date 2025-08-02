import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  characterId: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  registeredAt: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  unlocked: boolean;
}

export interface Activity {
  id: string;
  day: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'quiz' | 'puzzle' | 'story' | 'craft' | 'song';
  completed: boolean;
  unlocked: boolean;
  reward?: string;
  position: { x: number; y: number };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface AppState {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  
  // Game state
  currentDay: number;
  activities: Activity[];
  characters: Character[];
  selectedCharacter: Character | null;
  achievements: Achievement[];
  
  // UI state
  scrollPosition: number;
  isRegistering: boolean;
  showCharacterSelection: boolean;
  currentActivity: Activity | null;
  
  // Actions
  setUser: (user: User) => void;
  logout: () => void;
  selectCharacter: (character: Character) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
  completeActivity: (activityId: string) => void;
  setScrollPosition: (position: number) => void;
  unlockNextDay: () => void;
  addAchievement: (achievement: Achievement) => void;
  setShowCharacterSelection: (show: boolean) => void;
  setCurrentActivity: (activity: Activity | null) => void;
}

const generateActivities = (): Activity[] => {
  const activities: Activity[] = [];
  const activityTypes: Activity['type'][] = ['quiz', 'puzzle', 'story', 'craft', 'song'];
  
  for (let day = 1; day <= 30; day++) {
    activities.push({
      id: `day-${day}`,
      day,
      title: `Rā ${day} - ${getActivityTitle(day)}`,
      description: getActivityDescription(day),
      difficulty: 'beginner', // Will be set based on user selection
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      completed: false,
      unlocked: day === 1, // Only first day unlocked initially
      position: {
        x: (day - 1) * 300 + 200, // Horizontal spacing
        y: 50 + Math.sin(day * 0.5) * 30, // Gentle wave pattern
      },
    });
  }
  
  return activities;
};

const getActivityTitle = (day: number): string => {
  const titles = [
    'Te Tiriti o Waitangi', 'Māori Alphabet', 'Traditional Greetings', 'Family Words',
    'Numbers in Te Reo', 'Colours of Aotearoa', 'Traditional Foods', 'Sacred Mountains',
    'Rivers and Lakes', 'Ocean Stories', 'Bird Life', 'Forest Wisdom',
    'Traditional Crafts', 'Weaving Patterns', 'Carving Stories', 'Music and Songs',
    'Dance Movements', 'Legends of Maui', 'Creation Stories', 'Land and Sea',
    'Seasons and Weather', 'Traditional Games', 'Healing Plants', 'Star Navigation',
    'Fishing Methods', 'Garden Knowledge', 'Tribal Histories', 'Modern Māori',
    'Language Preservation', 'Cultural Celebration'
  ];
  return titles[day - 1] || `Day ${day} Adventure`;
};

const getActivityDescription = (day: number): string => {
  return `Discover the rich heritage and knowledge of Day ${day}. Complete this activity to unlock cultural wisdom and earn rewards on your journey.`;
};

const defaultCharacters: Character[] = [
  {
    id: 'kaea',
    name: 'Kaea',
    description: 'A young warrior with courage and determination',
    avatar: '🏹',
    unlocked: true,
  },
  {
    id: 'aroha',
    name: 'Aroha',
    description: 'A wise healer who understands the land',
    avatar: '🌿',
    unlocked: true,
  },
  {
    id: 'rangi',
    name: 'Rangi',
    description: 'A navigator who reads the stars',
    avatar: '⭐',
    unlocked: true,
  },
  {
    id: 'moana',
    name: 'Moana',
    description: 'A guardian of the ocean and its creatures',
    avatar: '🌊',
    unlocked: false, // Unlocked after completing 5 activities
  },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      currentDay: 1,
      activities: generateActivities(),
      characters: defaultCharacters,
      selectedCharacter: null,
      achievements: [],
      scrollPosition: 0,
      isRegistering: false,
      showCharacterSelection: false,
      currentActivity: null,

      // Actions
      setUser: (user: User) => set({ 
        user, 
        isAuthenticated: true,
        showCharacterSelection: !user.characterId 
      }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        selectedCharacter: null,
        showCharacterSelection: false 
      }),

      selectCharacter: (character: Character) => set((state) => ({ 
        selectedCharacter: character,
        showCharacterSelection: false,
        user: state.user ? {
          ...state.user,
          characterId: character.id
        } : null
      })),

      updateActivity: (activityId: string, updates: Partial<Activity>) => set((state) => ({
        activities: state.activities.map(activity =>
          activity.id === activityId ? { ...activity, ...updates } : activity
        )
      })),

      completeActivity: (activityId: string) => set((state) => {
        const updatedActivities = state.activities.map(activity => {
          if (activity.id === activityId) {
            return { ...activity, completed: true };
          }
          return activity;
        });

        // Unlock next activity
        const currentActivity = state.activities.find(a => a.id === activityId);
        if (currentActivity) {
          const nextDay = currentActivity.day + 1;
          const nextActivity = updatedActivities.find(a => a.day === nextDay);
          if (nextActivity && !nextActivity.unlocked) {
            nextActivity.unlocked = true;
          }
        }

        return { 
          activities: updatedActivities,
          currentDay: Math.max(state.currentDay, (currentActivity?.day || 0) + 1)
        };
      }),

      setScrollPosition: (position: number) => set({ scrollPosition: position }),

      unlockNextDay: () => set((state) => ({
        currentDay: Math.min(state.currentDay + 1, 30)
      })),

      addAchievement: (achievement: Achievement) => set((state) => ({
        achievements: [...state.achievements, { ...achievement, unlockedAt: new Date().toISOString() }]
      })),

      setShowCharacterSelection: (show: boolean) => set({ showCharacterSelection: show }),

      setCurrentActivity: (activity: Activity | null) => set({ currentActivity: activity }),
    }),
    {
      name: 'maori-adventure-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activities: state.activities,
        selectedCharacter: state.selectedCharacter,
        achievements: state.achievements,
        currentDay: state.currentDay,
      }),
    }
  )
);