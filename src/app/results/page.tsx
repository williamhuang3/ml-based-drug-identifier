'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ResultsDisplay from '@/components/ResultsDisplay'
import ProgressBar from '@/components/ProgressBar'
import { ArrowLeft } from 'lucide-react'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const target = searchParams.get('target')
  const limit = searchParams.get('limit') || '1000'
  
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState('')
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
      setCurrentStep('')

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
        const newTaskId = startData.taskId
        setTaskId(newTaskId)

        // Poll for progress updates
        const pollProgress = async () => {
          try {
            const progressResponse = await fetch(`${apiUrl}/progress/${newTaskId}`, {
              signal: abortController.signal,
            })

            if (!progressResponse.ok) {
              throw new Error('Failed to get progress')
            }

            const progressData = await progressResponse.json()
            
            if (!abortController.signal.aborted) {
              setCurrentStep(progressData.currentStep)
              
              if (progressData.status === 'complete' && progressData.results) {
                setResults(progressData.results)
                setIsLoading(false)
              } else if (progressData.status === 'error') {
                setError(progressData.message)
                setIsLoading(false)
              } else {
                // Continue polling
                setTimeout(pollProgress, 1000)
              }
            }
          } catch (err) {
            if (!abortController.signal.aborted) {
              setError(err instanceof Error ? err.message : 'Progress check failed')
              setIsLoading(false)
            }
          }
        }

        // Start polling
        setTimeout(pollProgress, 1000)

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
        {isLoading && <ProgressBar isActive={isLoading} currentStep={currentStep} />}

        {/* Results */}
        {results && <ResultsDisplay results={results} />}
      </div>
    </div>
  )
}
