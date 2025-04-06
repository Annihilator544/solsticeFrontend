import { PaymentInfo } from '@/components/table/columns';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface filteredDataState {
  filteredData: PaymentInfo[];
  setFilteredData: (state: PaymentInfo[]) => void;
}

export const usefilteredData = create<filteredDataState>()(
  persist(
    (set) => ({
      filteredData: [],
      setFilteredData: (state) => set({ filteredData: state }),
    }),
    {
      name: 'filteredDataStorage',
    }
  )
);
