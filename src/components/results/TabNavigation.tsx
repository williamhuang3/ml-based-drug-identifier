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
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <IconComponent className="inline w-4 h-4 mr-2" />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
