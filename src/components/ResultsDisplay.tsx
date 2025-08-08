'use client'

import { useState } from 'react'
import CompoundTable from './CompoundTable'
import StatisticalResults from './StatisticalResults'
import PlotGallery from './PlotGallery'
import PredictionResults from './PredictionResults'

interface ResultsDisplayProps {
  results: any
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'compounds', label: 'Compounds', icon: '🧪' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
    { id: 'plots', label: 'Visualizations', icon: '📉' },
    { id: 'predictions', label: 'ML Predictions', icon: '🤖' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Analysis Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {results?.totalCompounds || 0}
                </div>
                <div className="text-sm text-gray-600">Total Compounds</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {results?.activeCompounds || 0}
                </div>
                <div className="text-sm text-gray-600">Active Compounds</div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {results?.inactiveCompounds || 0}
                </div>
                <div className="text-sm text-gray-600">Inactive Compounds</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Target Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Target:</strong> {results?.targetName || 'N/A'}</p>
                <p><strong>ChemBL ID:</strong> {results?.targetId || 'N/A'}</p>
                <p><strong>Analysis Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compounds' && <CompoundTable compounds={results?.compounds || []} />}
        {activeTab === 'statistics' && <StatisticalResults statistics={results?.statistics || {}} />}
        {activeTab === 'plots' && <PlotGallery plots={results?.plots || []} />}
        {activeTab === 'predictions' && <PredictionResults predictions={results?.predictions || {}} />}
      </div>
    </div>
  )
}
