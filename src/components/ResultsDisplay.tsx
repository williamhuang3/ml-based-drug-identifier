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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header with Download Options */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <DownloadActions results={results} variant="header" />
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab results={results} />}
        {activeTab === 'compounds' && <CompoundTable compounds={results?.compounds || []} />}
        {activeTab === 'statistics' && <StatisticalResults statistics={results?.statistics || {}} />}
        {activeTab === 'plots' && <PlotGallery plots={results?.plots || []} />}
        {activeTab === 'predictions' && <PredictionResults predictions={results?.predictions || {}} />}
      </div>
    </div>
  )
}
