import { useState } from 'react'

interface Props {
  onSave: (key: string) => void
}

export default function ApiKeyModal({ onSave }: Props) {
  const [value, setValue] = useState('')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter your Anthropic API key</h2>
        <p className="text-gray-500 text-sm mb-6">
          Your key is stored only in your browser's localStorage and never sent anywhere except the Anthropic API.
          Get one at{' '}
          <a
            href="https://console.anthropic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline"
          >
            console.anthropic.com
          </a>
          .
        </p>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
        />
        <button
          onClick={() => value.trim() && onSave(value.trim())}
          disabled={!value.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Save & continue
        </button>
      </div>
    </div>
  )
}
