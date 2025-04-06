import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'
import { useCategoryData } from '@/store/use-category-data' // Adjust path as needed

// Sub-component for adding a new keyword to a category
const AddKeywordRow: React.FC<{ onAdd: (keyword: string) => void }> = ({ onAdd }) => {
  const [keyword, setKeyword] = useState('')

  const handleAdd = () => {
    if (!keyword.trim()) return
    onAdd(keyword)
    setKeyword('')
  }

  return (
    <div className="flex space-x-2 mt-3">
      <Input
        placeholder="Add keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd()
        }}
      />
      <Button variant="secondary" onClick={handleAdd}>
        Add Keyword
      </Button>
    </div>
  )
}

const CategoryConfig: React.FC = () => {
  // 1) Get category data and setter from your Zustand store
  const { categoryData, setCategoryData, setChanged } = useCategoryData()

  // Local state for creating a brand-new category
  const [newCategory, setNewCategory] = useState('')
  // For exporting the config as a JSON string

  // 2) Handlers for modifying the store

  const handleAddCategory = () => {
    if (!newCategory.trim()) return
    // Add the new category to the existing config
    setCategoryData({
      ...categoryData,
      [newCategory.toLowerCase()]: [],
    })
    setChanged(true)
    setNewCategory('')
  }

  const handleRemoveCategory = (cat: string) => {
    const updated = { ...categoryData }
    delete updated[cat]
    setCategoryData(updated)
    setChanged(true)
  }

  const handleAddKeyword = (cat: string, keyword: string) => {
    if (!keyword.trim()) return
    setCategoryData({
      ...categoryData,
      [cat]: [...(categoryData[cat] || []), keyword.toLowerCase()],
    })
    setChanged(true)
  }

  const handleRemoveKeyword = (cat: string, kw: string) => {
    setCategoryData({
      ...categoryData,
      [cat]: categoryData[cat].filter((item) => item !== kw),
    })
    setChanged(true)
  }

  // 3) Render UI

  return (
    <Card className="max-w-2xl overflow-x-scroll  mx-auto mt-8">
      <CardHeader>
        <CardTitle>Transaction Category Config</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Existing categories */}
        {Object.entries(categoryData).map(([cat, keywords]) => (
          <div key={cat} className="border p-3 rounded space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm uppercase">{cat}</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveCategory(cat)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            <div className="ml-2">
              {keywords.map((kw) => (
                <div
                  key={kw}
                  className="flex items-center justify-between bg-muted p-2 mb-1 rounded"
                >
                  <span className="text-sm">{kw}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveKeyword(cat, kw)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            {/* Add a new keyword row */}
            <AddKeywordRow onAdd={(newKeyword) => handleAddKeyword(cat, newKeyword)} />
          </div>
        ))}

        {/* Add a new category */}
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Label htmlFor="newCategory">New Category</Label>
            <Input
              id="newCategory"
              value={newCategory}
              placeholder="e.g. travel"
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default CategoryConfig
