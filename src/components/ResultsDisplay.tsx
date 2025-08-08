'use client'

import { useState } from 'react'
import CompoundTable from './CompoundTable'
import StatisticalResults from './StatisticalResults'
import PlotGallery from './PlotGallery'
import PredictionResults from './PredictionResults'
import DownloadActions from './results/DownloadActions'
import TabNavigation from './results/TabNavigation'
import OverviewTab from './results/OverviewTab'

interface ResultsDisplayProps {
  results: any
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-full overflow-hidden">
      {/* Header with Download Options */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analysis Results</h2>
          <DownloadActions results={results} variant="header" />
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="p-4 sm:p-6 overflow-hidden">
        {activeTab === 'overview' && <OverviewTab results={results} />}
        {activeTab === 'compounds' && <CompoundTable compounds={results?.compounds || []} />}
        {activeTab === 'statistics' && <StatisticalResults statistics={results?.statistics || {}} />}
        {activeTab === 'plots' && <PlotGallery plots={results?.plots || []} />}
        {activeTab === 'predictions' && <PredictionResults predictions={results?.predictions || {}} />}
      </div>
    </div>
  )
}
