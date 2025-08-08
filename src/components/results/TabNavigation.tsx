import { BarChart3, Beaker, TrendingUp, LineChart, Brain } from 'lucide-react'

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'compounds', label: 'Compounds', icon: Beaker },
  { id: 'statistics', label: 'Statistics', icon: TrendingUp },
  { id: 'plots', label: 'Visualizations', icon: LineChart },
  { id: 'predictions', label: 'ML Predictions', icon: Brain }
]

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <nav className="flex space-x-2 sm:space-x-8 px-4 sm:px-6 min-w-max">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.label === 'Overview' ? 'Over' : 
                 tab.label === 'Compounds' ? 'Comp' :
                 tab.label === 'Statistics' ? 'Stats' :
                 tab.label === 'Visualizations' ? 'Plots' : 'ML'}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
