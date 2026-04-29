const OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Low-carb'] as const

interface Props {
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function PreferenceToggles({ selected, onChange }: Props) {
  function toggle(option: string) {
    onChange(
      selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option]
    )
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Dietary preferences <span className="font-normal text-gray-400">(optional)</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selected.includes(opt)
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
