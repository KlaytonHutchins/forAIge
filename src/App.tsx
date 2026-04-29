import { useState, useEffect } from 'react'
import ApiKeyModal from './components/ApiKeyModal'
import IngredientInput from './components/IngredientInput'
import PreferenceToggles from './components/PreferenceToggles'
import MealCard, { type Meal } from './components/MealCard'

const API_KEY_STORAGE = 'foraige_api_key'

export default function App() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(API_KEY_STORAGE) ?? '')
  const [ingredients, setIngredients] = useState('')
  const [preferences, setPreferences] = useState<string[]>([])
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (apiKey) localStorage.setItem(API_KEY_STORAGE, apiKey)
  }, [apiKey])

  async function getSuggestions() {
    if (!ingredients.trim()) return
    setLoading(true)
    setError('')
    setMeals([])

    const prefText = preferences.length > 0 ? preferences.join(', ') : 'none'
    const prompt = `You are a creative chef assistant. The user has these ingredients available: ${ingredients}.
Their dietary preferences: ${prefText}.

Suggest exactly 3 meals they can make. For each meal, provide:
1. Meal name
2. Why it works with the ingredients they have
3. A simple step-by-step recipe

Format your response as JSON with this structure:
{
  "meals": [
    {
      "name": "...",
      "why_it_works": "...",
      "recipe": ["step 1", "step 2", ...]
    }
  ]
}

Return only valid JSON, no other text.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error?.message ?? `API error ${res.status}`)
      }

      const data = await res.json()
      const text: string = data.content[0].text
      // Strip markdown code fences if present
      const clean = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim()
      const parsed = JSON.parse(clean)
      setMeals(parsed.meals)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!apiKey && <ApiKeyModal onSave={setApiKey} />}

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <header className="max-w-2xl mx-auto pt-10 pb-6 px-4 text-center">
          <h1 className="text-4xl font-black text-green-800 tracking-tight">🌿 ForAIge</h1>
          <p className="text-gray-500 mt-1 text-sm">From forgotten ingredients to tonight's dinner.</p>
          {apiKey && (
            <button
              onClick={() => {
                localStorage.removeItem(API_KEY_STORAGE)
                setApiKey('')
              }}
              className="mt-3 text-xs text-gray-400 hover:text-red-400 underline"
            >
              Change API key
            </button>
          )}
        </header>

        <main className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
            <IngredientInput value={ingredients} onChange={setIngredients} />
            <PreferenceToggles selected={preferences} onChange={setPreferences} />
            <button
              onClick={getSuggestions}
              disabled={loading || !ingredients.trim() || !apiKey}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {loading ? 'Finding meals…' : 'Find meals'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center text-gray-400 text-sm py-8 animate-pulse">
              Asking Claude to raid your fridge…
            </div>
          )}

          {meals.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                3 meal ideas for you
              </h2>
              {meals.map((meal, i) => (
                <MealCard key={i} meal={meal} index={i} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
