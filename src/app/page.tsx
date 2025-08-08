'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowLeft, RotateCcw } from 'lucide-react'
import Header from '@/components/Header'
import SearchForm from '@/components/SearchForm'
import ResultsDisplay from '@/components/ResultsDisplay'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async (target: string) => {
    setIsLoading(true)
    setError('')
    setResults(null)

    try {
      // Call the Flask backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
      const response = await fetch(`${apiUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Show search form only when not loading and no results */}
          {!isLoading && !results && (
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          )}
          
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    Analysis Error
                  </h3>
                  <p className="text-red-700 mb-4">{error}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setError('')
                        setResults(null)
                      }}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Search
                    </button>
                    <button 
                      onClick={() => setError('')}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && <LoadingSpinner />}
          
          {results && (
            <div>
              <button 
                onClick={() => {
                  setResults(null)
                  setError('')
                }}
                className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Search
              </button>
              <ResultsDisplay results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
