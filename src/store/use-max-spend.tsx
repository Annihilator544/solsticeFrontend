import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserMaxSpend {
    name: string;
    total: number;
}

interface MaxSpendsState {
  spend: Record<string, { name: string; count: number; total: number }>;
  setSpend: (spends:Record<string, { name: string; count: number; total: number }>) => void;
  userMaxSpend: UserMaxSpend[];
  setUserMaxSpend: (name: string, count: number) => void;
}

export const useMaxSpend = create<MaxSpendsState>()(
  persist(
    (set) => ({
        spend: {},
        setSpend: (spends) => set({ spend: spends }),
        userMaxSpend: [],
        setUserMaxSpend: (name, total) =>
            set((state) => {
                const newData = [...state.userMaxSpend];
                const existingItemIndex = newData.findIndex((item) => item.name === name);
                if (existingItemIndex !== -1) {
                newData[existingItemIndex].total = total;
                } else {
                newData.push({ name, total });
                }
                return { userMaxSpend: newData };
            }),
    }),
    {
      name: 'MaxSpendStorage'
    }
  )
);
