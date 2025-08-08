'use client'

import { useEffect, useState } from 'react'
import { Database, Filter, Tags, Calculator, BarChart3, ImageIcon, Brain, CheckCircle } from 'lucide-react'

interface ProgressStep {
  id: string
  label: string
  description: string
  duration: number // in seconds
  icon: React.ReactNode
}

interface ProgressBarProps {
  isActive: boolean
  currentStep?: string
  onComplete?: () => void
}

const ANALYSIS_STEPS: ProgressStep[] = [
  {
    id: 'retrieving',
    label: 'Retrieving Data',
    description: 'Searching ChemBL database for target compounds...',
    duration: 8,
    icon: <Database className="w-5 h-5" />
  },
  {
    id: 'preprocessing',
    label: 'Preprocessing',
    description: 'Cleaning and filtering compound data...',
    duration: 3,
    icon: <Filter className="w-5 h-5" />
  },
  {
    id: 'labeling',
    label: 'Compound Labeling',
    description: 'Classifying compounds by bioactivity...',
    duration: 2,
    icon: <Tags className="w-5 h-5" />
  },
  {
    id: 'descriptors',
    label: 'Calculating Descriptors',
    description: 'Computing molecular properties and Lipinski descriptors...',
    duration: 5,
    icon: <Calculator className="w-5 h-5" />
  },
  {
    id: 'analysis',
    label: 'Statistical Analysis',
    description: 'Performing Mann-Whitney U tests and statistical comparisons...',
    duration: 3,
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    id: 'plotting',
    label: 'Generating Plots',
    description: 'Creating visualization plots and charts...',
    duration: 4,
    icon: <ImageIcon className="w-5 h-5" />
  },
  {
    id: 'ml',
    label: 'Machine Learning',
    description: 'Training Random Forest model and making predictions...',
    duration: 8,
    icon: <Brain className="w-5 h-5" />
  },
  {
    id: 'finalizing',
    label: 'Finalizing Results',
    description: 'Compiling analysis results and preparing output...',
    duration: 2,
    icon: <CheckCircle className="w-5 h-5" />
  }
]

export default function ProgressBar({ isActive, currentStep, onComplete }: ProgressBarProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!isActive) {
      setCurrentStepIndex(0)
      setProgress(0)
      setElapsedTime(0)
      return
    }

    let interval: NodeJS.Timeout

    // Simulate progress through steps
    const startTime = Date.now()
    
    interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      setElapsedTime(elapsed)

      let totalDuration = 0
      let currentDuration = 0
      let stepIndex = 0

      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        const step = ANALYSIS_STEPS[i]
        if (elapsed >= totalDuration && elapsed < totalDuration + step.duration) {
          stepIndex = i
          currentDuration = elapsed - totalDuration
          break
        }
        totalDuration += step.duration
        if (i === ANALYSIS_STEPS.length - 1) {
          // If we're past all steps, stay on the last one
          stepIndex = i
          currentDuration = step.duration
        }
      }

      setCurrentStepIndex(stepIndex)

      // Calculate overall progress
      const totalExpectedDuration = ANALYSIS_STEPS.reduce((sum, step) => sum + step.duration, 0)
      const overallProgress = Math.min((elapsed / totalExpectedDuration) * 100, 95) // Cap at 95% until actual completion
      setProgress(overallProgress)

    }, 100) // Update every 100ms for smooth animation

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, onComplete])

  // Handle external step updates (if provided)
  useEffect(() => {
    if (currentStep) {
      const stepIndex = ANALYSIS_STEPS.findIndex(step => step.id === currentStep)
      if (stepIndex !== -1) {
        setCurrentStepIndex(stepIndex)
      }
    }
  }, [currentStep])

  if (!isActive) {
    return null
  }

  const currentStepData = ANALYSIS_STEPS[currentStepIndex]
  const totalSteps = ANALYSIS_STEPS.length

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Analyzing Target Data
        </h2>
        <p className="text-gray-600 text-lg">
          This may take a few minutes depending on the dataset size...
        </p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
            Overall Progress
          </span>
          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
            {currentStepIndex + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {currentStepData.label}
            </h3>
            <p className="text-sm text-gray-600">
              {currentStepData.description}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="text-blue-500">
              {currentStepData.icon}
            </div>
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>

      {/* Step Timeline */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          Analysis Steps ({currentStepIndex + 1} of {totalSteps})
        </h4>
        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, index) => (
            <div 
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                index < currentStepIndex 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-sm' 
                  : index === currentStepIndex 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-2 border-blue-300 shadow-md scale-[1.02]' 
                    : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index < currentStepIndex 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : index === currentStepIndex 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <div className="flex-1 flex items-center gap-3">
                <div className={`transition-colors duration-300 ${
                  index < currentStepIndex 
                    ? 'text-green-600' 
                    : index === currentStepIndex 
                      ? 'text-blue-600' 
                      : 'text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold">
                    {step.label}
                  </span>
                  <div className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              {index === currentStepIndex && (
                <div className="flex items-center gap-2">
                  <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="animate-pulse w-2 h-2 bg-blue-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                  <div className="animate-pulse w-2 h-2 bg-blue-300 rounded-full" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
              {index < currentStepIndex && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Elapsed */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm bg-gray-50 p-4 rounded-xl">
          <span className="text-gray-600 font-medium flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Time elapsed:
          </span>
          <span className="font-bold text-gray-800 text-lg font-mono bg-white px-3 py-1 rounded-lg shadow-sm">
            {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toFixed(0).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  )
}
