import { Brain, Database, TestTube, BarChart3, Target, Zap, Users, Award } from 'lucide-react'

export default function Header() {
  return (
    <header className="text-center py-16">
      <div className="inline-block">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-black text-gray-900 mb-2">
            <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text">
              Drug
            </span>
            <span className="text-gray-900">Predict</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-700 mb-6">
            <Brain className="w-8 h-8 text-blue-500" />
            <span>AI-Powered Drug Discovery</span>
            <TestTube className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        {/* Feature Icons */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
            <Database className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-800">ChemBL Data</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-800">IC50 Analysis</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
            <Target className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-800">Target Discovery</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl">
            <Zap className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-800">ML Prediction</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Database className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">ChemBL Integration</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Queries the <strong>ChemBL Target Database</strong> for specific biological targets 
                    and retrieves compound activity data based on <strong>IC50 values</strong>.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <TestTube className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Bioactivity Analysis</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Analyzes compounds using <strong>Lipinski Molecular Descriptors</strong> to evaluate bioactivity, 
                    comparing active (IC50 ≤ 1000) and inactive (IC50 ≥ 10000) groups.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Machine Learning</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Uses <strong>Random Forest Regression</strong> with PaDEL descriptors to predict IC50 values 
                    without experimental determination.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Cost-Effective Discovery</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Reduces costs and increases accessibility of drug discovery data through 
                    computational prediction methods.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span><strong>Created by:</strong> William Huang</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4" />
              <span><em>Inspired by Data Professor and machinelearningmastery.com</em></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
