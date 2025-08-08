import { Database, Calculator, BarChart3, Brain, TestTube } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-100"></div>
        {/* Inner spinning ring */}
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 absolute top-0 left-0" style={{ animationDuration: '1s' }}></div>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <TestTube className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Compounds</h3>
        <p className="text-gray-600 mb-6">
          Running comprehensive analysis on your target compounds...
        </p>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-700 bg-blue-50 p-3 rounded-lg">
            <Database className="w-5 h-5 text-blue-500 animate-pulse" />
            <span>Querying ChemBL database for target compounds</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 bg-purple-50 p-3 rounded-lg">
            <Calculator className="w-5 h-5 text-purple-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span>Calculating molecular descriptors and properties</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 bg-green-50 p-3 rounded-lg">
            <BarChart3 className="w-5 h-5 text-green-500 animate-pulse" style={{ animationDelay: '1s' }} />
            <span>Performing statistical analysis and comparisons</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700 bg-orange-50 p-3 rounded-lg">
            <Brain className="w-5 h-5 text-orange-500 animate-pulse" style={{ animationDelay: '1.5s' }} />
            <span>Training machine learning models and predictions</span>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          This process typically takes 2-5 minutes depending on dataset size
        </div>
      </div>
    </div>
  )
}
