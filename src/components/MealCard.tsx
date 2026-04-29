import { useState } from 'react'

export interface Meal {
  name: string
  why_it_works: string
  recipe: string[]
}

interface Props {
  meal: Meal
  index: number
}

export default function MealCard({ meal, index }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-1 block">
              Meal {index + 1}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{meal.name}</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{meal.why_it_works}</p>
      </div>
      <div className="border-t border-gray-100">
        <button
          onClick={() => setOpen(!open)}
          className="w-full text-left px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-50 transition-colors flex items-center justify-between"
        >
          {open ? 'Hide recipe' : 'Show recipe'}
          <span className="text-gray-400">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <ol className="px-5 pb-5 space-y-1.5 list-decimal list-inside">
            {meal.recipe.map((step, i) => (
              <li key={i} className="text-sm text-gray-700">
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
