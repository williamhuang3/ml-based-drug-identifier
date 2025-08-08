interface OverviewTabProps {
  results: any
}

export default function OverviewTab({ results }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Analysis Overview</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            {results?.totalCompounds || 0}
          </div>
          <div className="text-sm text-gray-600">Total Compounds</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
            {results?.activeCompounds || 0}
          </div>
          <div className="text-sm text-gray-600">Active Compounds</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
            {results?.inactiveCompounds || 0}
          </div>
          <div className="text-sm text-gray-600">Inactive Compounds</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Target Information</h4>
        <div className="space-y-2 text-sm text-gray-800">
          <p><strong className="text-gray-900">Target:</strong> <span className="text-gray-700">{results?.targetName || 'N/A'}</span></p>
          <p><strong className="text-gray-900">ChemBL ID:</strong> <span className="text-gray-700 font-mono">{results?.targetId || 'N/A'}</span></p>
          <p><strong className="text-gray-900">Analysis Date:</strong> <span className="text-gray-700">{new Date().toLocaleDateString()}</span></p>
          <p><strong className="text-gray-900">Data Limit:</strong> <span className="text-gray-700">{results?.dataLimit || 'N/A'} compounds</span></p>
        </div>
      </div>
    </div>
  )
}
