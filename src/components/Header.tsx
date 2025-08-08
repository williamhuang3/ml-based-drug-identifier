import { Brain, TestTube, HelpCircle, BookOpen, Search, BarChart3 } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [showDocs, setShowDocs] = useState(false)

  return (
    <>
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
            <p className="text-xl text-gray-600 mb-6">
              AI-Powered Drug Discovery & Bioactivity Analysis
            </p>
          </div>
          
          {/* How to Use */}
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 max-w-4xl mx-auto mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-500" />
              How to Use DrugPredict
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">1</div>
                <Search className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-2">Search Target</h3>
                <p className="text-sm text-gray-600">
                  Enter a biological target name (e.g., "acetylcholinesterase") or ChemBL ID
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">2</div>
                <BarChart3 className="w-8 h-8 text-purple-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-2">Analyze Data</h3>
                <p className="text-sm text-gray-600">
                  View compound statistics, molecular properties, and bioactivity classifications
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">3</div>
                <Brain className="w-8 h-8 text-green-500 mb-2" />
                <h3 className="font-semibold text-gray-900 mb-2">ML Predictions</h3>
                <p className="text-sm text-gray-600">
                  Get AI-powered IC50 predictions and explore interactive visualizations
                </p>
              </div>
            </div>
          </div>

          {/* Documentation Button */}
          <button
            onClick={() => setShowDocs(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          >
            <BookOpen className="w-4 h-4" />
            Technical Documentation
          </button>
        </div>
      </header>

      {/* Documentation Modal */}
      {showDocs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <TestTube className="w-8 h-8 text-blue-500" />
                Technical Documentation
              </h2>
              <button
                onClick={() => setShowDocs(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">ChemBL Integration</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Queries the <strong>ChemBL Target Database</strong> for specific biological targets 
                    and retrieves compound activity data based on <strong>IC50 values</strong>. 
                    Supports both target names and direct ChemBL IDs.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Bioactivity Analysis</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Analyzes compounds using <strong>Lipinski Molecular Descriptors</strong> to evaluate bioactivity. 
                    Classifies compounds as:
                    <br />• <strong>Active:</strong> IC50 ≤ 1000 nM
                    <br />• <strong>Inactive:</strong> IC50 ≥ 10000 nM
                    <br />• <strong>Intermediate:</strong> Between active and inactive
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Statistical Analysis</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Performs <strong>Mann-Whitney U tests</strong> to compare molecular properties 
                    between active and inactive compounds, providing statistical significance testing.
                  </p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Machine Learning</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Uses <strong>Random Forest Regression</strong> with PaDEL molecular descriptors 
                    to predict IC50 values. Model evaluation includes R² score, RMSE, MAE, and MSE metrics.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Molecular Descriptors</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Calculates <strong>Lipinski's Rule of Five</strong> descriptors:
                    <br />• Molecular Weight (MW)
                    <br />• Lipophilicity (LogP)
                    <br />• Hydrogen Bond Donors
                    <br />• Hydrogen Bond Acceptors
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Visualizations</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Generates interactive plots including bioactivity distributions, 
                    molecular property comparisons, and ML prediction accuracy visualizations.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                <strong>Created by:</strong> William Huang | 
                <em> Inspired by Data Professor and machinelearningmastery.com</em>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
