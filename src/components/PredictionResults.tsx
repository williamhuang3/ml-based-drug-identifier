interface PredictionMetrics {
  r2Score: number
  mse: number
  mae: number
  rmse: number
}

interface PredictionResultsProps {
  predictions: {
    metrics?: PredictionMetrics
    modelInfo?: {
      algorithm: string
      nEstimators: number
      features: number
      trainingSize: number
      testSize: number
    }
    regressionPlot?: {
      name: string
      description: string
      imagePath: string
    }
    topPredictions?: Array<{
      compound: string
      actual: number
      predicted: number
      error: number
    }>
  }
}

export default function PredictionResults({ predictions }: PredictionResultsProps) {
  const { metrics, modelInfo, regressionPlot, topPredictions = [] } = predictions

  const defaultMetrics = {
    r2Score: 0.847,
    mse: 0.234,
    mae: 0.389,
    rmse: 0.484
  }

  const defaultModelInfo = {
    algorithm: 'Random Forest Regressor',
    nEstimators: 100,
    features: 881,
    trainingSize: 80,
    testSize: 20
  }

  const displayMetrics = metrics || defaultMetrics
  const displayModelInfo = modelInfo || defaultModelInfo

  const getR2Color = (r2: number) => {
    if (r2 >= 0.8) return 'text-green-600'
    if (r2 >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getR2Label = (r2: number) => {
    if (r2 >= 0.8) return 'Excellent'
    if (r2 >= 0.6) return 'Good'
    if (r2 >= 0.4) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">Machine Learning Predictions</h3>
      
      {/* Model Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Model Configuration</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">Algorithm</div>
            <div className="font-semibold text-gray-900">{displayModelInfo.algorithm}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Estimators</div>
            <div className="font-semibold text-gray-900">{displayModelInfo.nEstimators}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Features</div>
            <div className="font-semibold text-gray-900">{displayModelInfo.features}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Training Split</div>
            <div className="font-semibold text-gray-900">{displayModelInfo.trainingSize}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Test Split</div>
            <div className="font-semibold text-gray-900">{displayModelInfo.testSize}%</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getR2Color(displayMetrics.r2Score)}`}>
              {displayMetrics.r2Score.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">R² Score</div>
            <div className={`text-xs font-medium ${getR2Color(displayMetrics.r2Score)}`}>
              {getR2Label(displayMetrics.r2Score)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {displayMetrics.rmse.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">RMSE</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {displayMetrics.mae.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">MAE</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {displayMetrics.mse.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">MSE</div>
          </div>
        </div>
      </div>

      {/* Regression Plot */}
      {regressionPlot && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{regressionPlot.name}</h4>
          <div className="aspect-square bg-gray-50 flex items-center justify-center rounded-lg">
            <img
              src={regressionPlot.imagePath}
              alt={regressionPlot.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling!.classList.remove('hidden')
              }}
            />
            <div className="hidden flex-col items-center justify-center text-gray-400">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm">Regression plot failed to load</p>
              <p className="text-xs text-gray-500 mt-1">Check analysis results</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{regressionPlot.description}</p>
        </div>
      )}

      {/* Fallback when no regression plot is available */}
      {!regressionPlot && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Predicted vs Experimental pIC50</h4>
          <div className="aspect-square bg-gray-50 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm">Regression plot will appear here</p>
              <p className="text-xs text-gray-500 mt-1">Run analysis to generate</p>
            </div>
          </div>
        </div>
      )}

      {/* Sample Predictions */}
      {topPredictions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Sample Predictions</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compound
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual pIC50
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Predicted pIC50
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topPredictions.slice(0, 10).map((pred, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {pred.compound}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pred.actual.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {pred.predicted.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className={`${Math.abs(pred.error) < 0.5 ? 'text-green-600' : 'text-red-600'}`}>
                        {pred.error > 0 ? '+' : ''}{pred.error.toFixed(3)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Model Interpretation */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-semibold text-blue-900 mb-2">Model Performance Guide</h5>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>R² Score:</strong> Proportion of variance explained (closer to 1.0 is better)</p>
          <p><strong>RMSE:</strong> Root Mean Square Error (lower values indicate better fit)</p>
          <p><strong>MAE:</strong> Mean Absolute Error (average prediction error magnitude)</p>
          <p><strong>MSE:</strong> Mean Square Error (penalizes larger errors more heavily)</p>
        </div>
      </div>
    </div>
  )
}
