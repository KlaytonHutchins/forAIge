interface Props {
  value: string
  onChange: (v: string) => void
}

export default function IngredientInput({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        What's in your fridge?
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. chicken breast, garlic, lemon, spinach, olive oil..."
        rows={3}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <p className="text-xs text-gray-400 mt-1">Comma-separated or just type naturally.</p>
    </div>
  )
}
