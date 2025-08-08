interface OverviewTabProps {
  results: any
}

export default function OverviewTab({ results }: OverviewTabProps) {
  return (
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
          <p><strong>Data Limit:</strong> {results?.dataLimit || 'N/A'} compounds</p>
        </div>
      </div>
    </div>
  )
}
