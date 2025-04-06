import { PaymentInfo } from '@/components/table/columns';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TableDataState {
  tableData: PaymentInfo[];
  setTableData: (state: PaymentInfo[]) => void;
}

export const useTableData = create<TableDataState>()(
  persist(
    (set) => ({
      tableData: [],
      setTableData: (state) => set({ tableData: state }),
    }),
    {
      name: 'TableDataStorage',
    }
  )
);
