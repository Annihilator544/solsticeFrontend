import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface categoryDataState {
  categoryData: CategoriesConfig;
  changed: boolean;
  setChanged: (state:boolean) => void;
  setCategoryData: (state: CategoriesConfig) => void;
}

interface CategoriesConfig {
    [category: string]: string[];
  }

export const useCategoryData = create<categoryDataState>()(
  persist(
    (set) => ({
      categoryData: {
        "food": [
          "zomato", "eatclub", "swiggy", "food", "restaurant",
          "domino", "pizza", "mcdonald", "kfc"
        ],
        "bills": [
            "bill", "electricity", "gas", "recharge", "academy",
            "education", "insurance", "loan", "water", "broadband", "wifi"
        ],
        "leisure": [
            "movie", "theatre", "ticket", "pvr", "game", "bowling",
            "club", "netflix", "prime", "hotstar", "spotify"
        ],
        "travel": [
            "uber", "ola", "irctc", "makemytrip", "goibibo", "flight",
            "booking", "airbnb", "hotel"
        ],
        "shopping": [
            "amazon", "flipkart", "myntra", "snapdeal", "nykaa",
            "tatacliq", "store"
        ],
        "merchant": [
            "private limited", "enterprise", "enterprises", "merchant", "biz"
        ],
        "other": [
            "other", "miscellaneous", "misc", "miscelleneous"
        ]
      },
      changed: false,
      setChanged: (state:boolean) => set({ changed: state }),
      setCategoryData: (state) => set({ categoryData: state }),
    }),
    {
      name: 'categoryDataStorage',
    }
  )
);
