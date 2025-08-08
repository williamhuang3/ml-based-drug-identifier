interface Plot {
  name: string
  description: string
  imagePath: string
  type: 'box' | 'scatter' | 'bar' | 'regression'
}

interface PlotGalleryProps {
  plots: Plot[]
}

export default function PlotGallery({ plots }: PlotGalleryProps) {
  const defaultPlots = [
    {
      name: 'Bioactivity Class Distribution',
      description: 'Count of compounds by bioactivity classification',
      imagePath: '/assets/plot_bioactivity_class.png',
      type: 'bar' as const
    },
    {
      name: 'Molecular Weight vs LogP',
      description: 'Scatter plot showing relationship between molecular weight and lipophilicity',
      imagePath: '/assets/plot_MW_vs_LogP.png',
      type: 'scatter' as const
    },
    {
      name: 'IC50 Distribution',
      description: 'Box plot comparing pIC50 values between active and inactive compounds',
      imagePath: '/assets/plot_ic50.png',
      type: 'box' as const
    },
    {
      name: 'Molecular Weight Distribution',
      description: 'Box plot showing molecular weight differences by bioactivity class',
      imagePath: '/assets/plot_MW.png',
      type: 'box' as const
    },
    {
      name: 'LogP Distribution',
      description: 'Box plot of lipophilicity (LogP) by bioactivity classification',
      imagePath: '/assets/plot_LogP.png',
      type: 'box' as const
    },
    {
      name: 'Hydrogen Donors',
      description: 'Distribution of hydrogen bond donors by bioactivity class',
      imagePath: '/assets/plot_NumHDonors.png',
      type: 'box' as const
    },
    {
      name: 'Hydrogen Acceptors',
      description: 'Distribution of hydrogen bond acceptors by bioactivity class',
      imagePath: '/assets/plot_NumHAcceptors.png',
      type: 'box' as const
    },
    {
      name: 'Predicted vs Experimental pIC50',
      description: 'Random Forest regression results showing predicted vs actual pIC50 values',
      imagePath: '/assets/predicted_experimental_pIC50.png',
      type: 'regression' as const
    }
  ]

  const plotsToShow = plots.length > 0 ? plots : defaultPlots

  const getPlotIcon = (type: string) => {
    switch (type) {
      case 'bar': return '📊'
      case 'scatter': return '🔵'
      case 'box': return '📦'
      case 'regression': return '📈'
      default: return '📉'
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900">Data Visualizations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plotsToShow.map((plot, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-50 flex items-center justify-center">
              <img
                src={plot.imagePath}
                alt={plot.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling!.classList.remove('hidden')
                }}
              />
              <div className="hidden flex-col items-center justify-center text-gray-400">
                <div className="text-4xl mb-2">{getPlotIcon(plot.type)}</div>
                <p className="text-sm">Plot will appear here</p>
                <p className="text-xs text-gray-500 mt-1">Run analysis to generate</p>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                <span className="mr-2">{getPlotIcon(plot.type)}</span>
                {plot.name}
              </h4>
              <p className="text-sm text-gray-600">{plot.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 rounded-lg p-4">
        <h5 className="font-semibold text-yellow-900 mb-2">📊 Visualization Guide</h5>
        <div className="text-sm text-yellow-800 space-y-1">
          <p><strong>Box Plots:</strong> Show median, quartiles, and outliers for each bioactivity class</p>
          <p><strong>Scatter Plots:</strong> Reveal relationships between molecular descriptors</p>
          <p><strong>Bar Charts:</strong> Display frequency distributions across categories</p>
          <p><strong>Regression Plots:</strong> Show model performance and prediction accuracy</p>
        </div>
      </div>
    </div>
  )
}
