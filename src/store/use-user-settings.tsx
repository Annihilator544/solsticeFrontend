import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferencesData {
  [key: string]: string[];
}

interface UserPreferencesState {
  userPreference: UserPreferencesData;
  setUserPreference: (key: string, valueToAppend: string) => void;
}

export const useUserPreference = create<UserPreferencesState>()(
  persist(
    (set) => ({
    userPreference: {
        food: [
        ],
        bills: [
        ],
        leisure: [
        ],
        travel: [
        ],
        shopping: [
        ],
        merchant: [
        ],
        other: [
        ],
      },
      setUserPreference: (key, valueToAppend) =>
        set((state) => {
          const newData = { ...state.userPreference };
          if (!newData[key]) {
            newData[key] = [];
          }
          newData[key] = [...newData[key], valueToAppend];
          return { userPreference: newData };
        }),
    }),
    {
      name: 'UserPrefferedStorage'
    }
  )
);
