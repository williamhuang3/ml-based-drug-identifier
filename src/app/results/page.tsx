'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ResultsDisplay from '@/components/ResultsDisplay'
import ProgressBar from '@/components/ProgressBar'
import { ArrowLeft } from 'lucide-react'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const target = searchParams.get('target')
  const limit = searchParams.get('limit') || '1000'
  
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [taskId, setTaskId] = useState('')

  useEffect(() => {
    if (!target) {
      router.push('/')
      return
    }

    // Create abort controller to cancel request if component unmounts
    const abortController = new AbortController()

    const startAnalysis = async () => {
      setIsLoading(true)
      setError('')
      setResults(null)

      try {
        // Start the analysis and get task ID
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
        const startResponse = await fetch(`${apiUrl}/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ target, limit }),
          signal: abortController.signal,
        })

        if (!startResponse.ok) {
          throw new Error('Failed to start analysis')
        }

        const startData = await startResponse.json()
        setTaskId(startData.taskId)
        // ProgressBar will handle the polling and completion

      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An error occurred')
          setIsLoading(false)
        }
      }
    }

    startAnalysis()

    // Cleanup function to abort request if component unmounts
    return () => {
      abortController.abort()
    }
  }, [target, limit, router])

  // Handle page refresh/navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading) {
        e.preventDefault()
        e.returnValue = 'Analysis is in progress. Are you sure you want to leave?'
        return 'Analysis is in progress. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLoading])

  if (!target) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      
      <div className="max-w-4xl mx-auto">
        {/* Back button and target info */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Search
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Analysis Results for: <span className="text-blue-600">{target}</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Data limit: {limit === 'all' ? 'All available compounds' : `${parseInt(limit).toLocaleString()} compounds`}
            </p>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading state with progress bar */}
        {isLoading && (
          <ProgressBar 
            isActive={isLoading} 
            taskId={taskId}
            onComplete={(results) => {
              if (results) {
                setResults(results)
              }
              setIsLoading(false)
            }}
          />
        )}

        {/* Results */}
        {results && <ResultsDisplay results={results} />}
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
