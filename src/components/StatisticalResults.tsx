interface StatisticalTest {
  descriptor: string
  statistic: number
  pValue: number
  interpretation: string
}

interface StatisticalResultsProps {
  statistics: {
    mannWhitneyTests?: StatisticalTest[]
    summary?: {
      activeCount: number
      inactiveCount: number
      intermediateCount: number
    }
  }
}

export default function StatisticalResults({ statistics }: StatisticalResultsProps) {
  const { mannWhitneyTests = [], summary } = statistics

  const getSignificanceColor = (pValue: number) => {
    if (pValue < 0.001) return 'bg-red-100 text-red-800'
    if (pValue < 0.01) return 'bg-orange-100 text-orange-800'
    if (pValue < 0.05) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getSignificanceLabel = (pValue: number) => {
    if (pValue < 0.001) return 'Highly Significant (p < 0.001)'
    if (pValue < 0.01) return 'Very Significant (p < 0.01)'
    if (pValue < 0.05) return 'Significant (p < 0.05)'
    return 'Not Significant (p ≥ 0.05)'
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">Statistical Analysis</h3>
      
      {summary && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Dataset Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.activeCount}</div>
              <div className="text-sm text-gray-600">Active Compounds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{summary.inactiveCount}</div>
              <div className="text-sm text-gray-600">Inactive Compounds</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.intermediateCount}</div>
              <div className="text-sm text-gray-600">Intermediate Compounds</div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Mann-Whitney U Test Results</h4>
        <p className="text-sm text-gray-600 mb-4">
          Statistical tests comparing active vs inactive compounds for each Lipinski descriptor.
        </p>
        
        {mannWhitneyTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descriptor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    U Statistic
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    P-Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Significance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interpretation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mannWhitneyTests.map((test, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {test.descriptor}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {test.statistic.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {test.pValue.toExponential(3)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSignificanceColor(test.pValue)}`}>
                        {getSignificanceLabel(test.pValue)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {test.interpretation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No statistical test results available</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 mb-2">Understanding the Results</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>H₀ (Null Hypothesis):</strong> No difference between active and inactive compounds</li>
          <li>• <strong>H₁ (Alternative):</strong> Significant difference exists between groups</li>
          <li>• <strong>α = 0.05:</strong> Significance threshold (5% chance of Type I error)</li>
          <li>• <strong>p &lt; α:</strong> Reject H₀ - statistically significant difference found</li>
        </ul>
      </div>
    </div>
  )
}
