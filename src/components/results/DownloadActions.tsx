'use client'

import { Download, FileText, Image, Database } from 'lucide-react'

interface DownloadActionsProps {
  results: any
  variant?: 'header' | 'overview'
}

export default function DownloadActions({ results, variant = 'header' }: DownloadActionsProps) {
  const downloadCSV = (data: any[], filename: string) => {
    console.log('Downloading CSV:', filename, 'Data length:', data?.length)
    
    if (!data || data.length === 0) {
      console.error('No data available for CSV download')
      alert('No data available for download')
      return
    }
    
    try {
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.csv`
      document.body.appendChild(a) // Add to DOM
      a.click()
      document.body.removeChild(a) // Remove from DOM
      window.URL.revokeObjectURL(url)
      
      console.log('CSV download completed successfully')
    } catch (error) {
      console.error('Failed to download CSV:', error)
      alert('Failed to download CSV file')
    }
  }

  const downloadImage = async (imagePath: string, filename: string) => {
    console.log('Attempting to download image:', imagePath, 'as', filename)
    
    try {
      const response = await fetch(imagePath)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`)
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a) // Add to DOM
      a.click()
      document.body.removeChild(a) // Remove from DOM
      window.URL.revokeObjectURL(url)
      
      console.log('Image downloaded successfully:', filename)
    } catch (error) {
      console.error('Failed to download image:', error)
      alert(`Failed to download image: ${filename}`)
    }
  }

  const downloadAllPlots = async () => {
    if (!results?.plots) {
      console.log('No plots available for download')
      return
    }
    
    console.log('Downloading plots:', results.plots)
    
    for (const plot of results.plots) {
      if (plot.imagePath) {
        const filename = plot.imagePath.split('/').pop() || 'plot.png'
        console.log('Downloading plot:', filename)
        await downloadImage(plot.imagePath, filename)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
  }

  const generateHTMLReport = async () => {
    console.log('Generating HTML report...', results)
    
    if (!results) {
      console.error('No results available for HTML report')
      alert('No results available for HTML report')
      return
    }
    
    try {
      // Convert images to base64 - include ALL possible plot paths
      const allPlotPaths = []
      
      // Add regular plots
      if (results?.plots) {
        allPlotPaths.push(...results.plots.map((p: any) => p.imagePath).filter(Boolean))
      }
      
      // Add ML prediction plot if it exists
      if (results?.predictions?.plotPath) {
        allPlotPaths.push(results.predictions.plotPath)
      }
      
      // Also check for the specific ML plot name
      allPlotPaths.push('/outputs/predicted_experimental_pIC50.png')
      
      console.log('Processing plot paths:', allPlotPaths)
      
      const plotsWithBase64 = await Promise.all(
        allPlotPaths.map(async (imagePath: string) => {
          try {
            const response = await fetch(imagePath)
            if (!response.ok) {
              console.warn(`Failed to fetch image: ${imagePath}`)
              return { imagePath, base64Image: null, name: imagePath.split('/').pop()?.replace('.png', '') }
            }
            
            const blob = await response.blob()
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            })
            console.log(`Successfully converted ${imagePath} to base64`)
            return { imagePath, base64Image: base64, name: imagePath.split('/').pop()?.replace('.png', '') }
          } catch (error) {
            console.error('Failed to convert image to base64:', error)
            return { imagePath, base64Image: null, name: imagePath.split('/').pop()?.replace('.png', '') }
          }
        })
      )
      
      console.log('Base64 conversion completed. Successful images:', plotsWithBase64.filter(p => p.base64Image).length)
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DrugPredict Analysis Report</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            margin: 0; 
            padding: 20px; 
            background: #f8fafc; 
        }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
        .section { padding: 30px; border-bottom: 1px solid #e5e7eb; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #bae6fd; }
        .stat-value { font-size: 2.5rem; font-weight: bold; color: #0369a1; margin-bottom: 8px; }
        .stat-label { color: #64748b; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .plot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; }
        .plot-item { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .plot-header { padding: 20px; background: #f8fafc; border-bottom: 1px solid #e5e7eb; }
        .plot-image { width: 100%; height: auto; display: block; }
        .table-container { overflow-x: auto; margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; background: white; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f8fafc; font-weight: 600; color: #374151; border-right: 1px solid #e5e7eb; }
        td { border-right: 1px solid #f3f4f6; }
        tr:nth-child(even) td { background: #f9fafb; }
        tr:hover td { background: #f0f9ff; }
        .section-title { color: #1f2937; font-size: 1.8rem; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #3b82f6; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .info-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .footer { text-align: center; padding: 20px; color: #6b7280; background: #f9fafb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 2.5rem;">DrugPredict Analysis Report</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1rem;">
                Target: ${results?.targetName || 'N/A'} (${results?.targetId || 'N/A'})
            </p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">Generated: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
            <h2 class="section-title">Analysis Overview</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${results?.totalCompounds || 0}</div>
                    <div class="stat-label">Total Compounds</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results?.activeCompounds || 0}</div>
                    <div class="stat-label">Active Compounds</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results?.inactiveCompounds || 0}</div>
                    <div class="stat-label">Inactive Compounds</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${Math.round(((results?.activeCompounds || 0) / (results?.totalCompounds || 1)) * 100)}%</div>
                    <div class="stat-label">Activity Rate</div>
                </div>
            </div>
            
            <div class="info-grid">
                <div class="info-item"><span><strong>Target:</strong></span><span>${results?.targetName || 'N/A'}</span></div>
                <div class="info-item"><span><strong>ChemBL ID:</strong></span><span>${results?.targetId || 'N/A'}</span></div>
                <div class="info-item"><span><strong>Analysis Date:</strong></span><span>${new Date().toLocaleDateString()}</span></div>
                <div class="info-item"><span><strong>Data Limit:</strong></span><span>${results?.dataLimit || 'N/A'} compounds</span></div>
            </div>
        </div>

        ${plotsWithBase64 && plotsWithBase64.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Data Visualizations</h2>
            <div class="plot-grid">
                ${plotsWithBase64.filter(plot => plot.base64Image).map((plot: any) => `
                <div class="plot-item">
                    <div class="plot-header">
                        <h3 style="margin: 0; color: #374151;">${plot.name || 'Analysis Plot'}</h3>
                        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 0.9rem;">Chemical descriptor analysis</p>
                    </div>
                    <img src="${plot.base64Image}" alt="${plot.name}" class="plot-image" />
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        ${results?.statistics ? `
        <div class="section">
            <h2 class="section-title">Statistical Analysis</h2>
            ${results.statistics.summary ? `
            <div class="stats-grid" style="margin-bottom: 30px;">
                <div class="stat-card">
                    <div class="stat-value">${results.statistics.summary.activeCount || 0}</div>
                    <div class="stat-label">Active Compounds</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results.statistics.summary.inactiveCount || 0}</div>
                    <div class="stat-label">Inactive Compounds</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${results.statistics.summary.intermediateCount || 0}</div>
                    <div class="stat-label">Intermediate Compounds</div>
                </div>
            </div>
            ` : ''}
            ${results.statistics.mannWhitneyTests ? `
            <h3 style="color: #374151; margin-bottom: 20px;">Mann-Whitney U Tests</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Descriptor</th>
                            <th>Test Statistic</th>
                            <th>P-Value</th>
                            <th>Interpretation</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.statistics.mannWhitneyTests.map((test: any) => `
                        <tr>
                            <td style="font-weight: 600;">${test.descriptor}</td>
                            <td>${test.statistic?.toLocaleString() || 'N/A'}</td>
                            <td style="font-family: monospace;">${test.pValue ? test.pValue.toExponential(3) : 'N/A'}</td>
                            <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; ${
                              test.interpretation?.includes('reject') 
                                ? 'background: #fee2e2; color: #991b1b;' 
                                : 'background: #dcfce7; color: #166534;'
                            }">${test.interpretation || 'N/A'}</span></td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            ${!results.statistics.summary && !results.statistics.mannWhitneyTests ? `
            <pre style="background: #f8fafc; padding: 20px; border-radius: 8px; overflow-x: auto; color: #374151; font-size: 0.9rem;">${JSON.stringify(results.statistics, null, 2)}</pre>
            ` : ''}
        </div>
        ` : ''}

        ${results?.predictions ? `
        <div class="section">
            <h2 class="section-title">Machine Learning Predictions</h2>
            
            <!-- ML Performance Plot -->
            ${plotsWithBase64.find(p => p.imagePath.includes('predicted_experimental')) ? `
            <div style="margin-bottom: 30px;">
                <h3 style="color: #374151; margin-bottom: 15px;">Model Performance</h3>
                <div class="plot-item" style="max-width: 600px; margin: 0 auto;">
                    <div class="plot-header">
                        <h4 style="margin: 0; color: #374151;">Experimental vs Predicted pIC50</h4>
                        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 0.9rem;">Scatter plot showing model prediction accuracy</p>
                    </div>
                    <img src="${plotsWithBase64.find(p => p.imagePath.includes('predicted_experimental'))?.base64Image}" alt="ML Predictions" class="plot-image" />
                </div>
            </div>
            ` : ''}
            
            <!-- Model Information -->
            ${results.predictions.model || results.predictions.metrics || results.predictions.modelInfo ? `
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3b82f6;">
                <h3 style="margin: 0 0 15px 0; color: #1e40af;">Model Information</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.predictions.model?.name ? `<tr><td><strong>Model</strong></td><td>${results.predictions.model.name}</td></tr>` : ''}
                            ${results.predictions.model?.algorithm || results.predictions.modelInfo?.algorithm ? `<tr><td><strong>Algorithm</strong></td><td>${results.predictions.model?.algorithm || results.predictions.modelInfo?.algorithm}</td></tr>` : ''}
                            ${results.predictions.metrics?.r2Score || results.predictions.model?.r2_score ? `<tr><td><strong>R² Score</strong></td><td>${(results.predictions.metrics?.r2Score || results.predictions.model?.r2_score)?.toFixed(3)}</td></tr>` : ''}
                            ${results.predictions.metrics?.rmse || results.predictions.model?.rmse ? `<tr><td><strong>RMSE</strong></td><td>${(results.predictions.metrics?.rmse || results.predictions.model?.rmse)?.toFixed(3)}</td></tr>` : ''}
                            ${results.predictions.metrics?.mae ? `<tr><td><strong>MAE</strong></td><td>${results.predictions.metrics.mae.toFixed(3)}</td></tr>` : ''}
                            ${results.predictions.metrics?.mse ? `<tr><td><strong>MSE</strong></td><td>${results.predictions.metrics.mse.toFixed(3)}</td></tr>` : ''}
                            ${results.predictions.model?.accuracy ? `<tr><td><strong>Accuracy</strong></td><td>${(results.predictions.model.accuracy * 100).toFixed(2)}%</td></tr>` : ''}
                            ${results.predictions.model?.features || results.predictions.modelInfo?.features ? `<tr><td><strong>Features</strong></td><td>${results.predictions.model?.features || results.predictions.modelInfo?.features} descriptors</td></tr>` : ''}
                            ${results.predictions.modelInfo?.nEstimators ? `<tr><td><strong>Estimators</strong></td><td>${results.predictions.modelInfo.nEstimators}</td></tr>` : ''}
                            ${results.predictions.model?.trainSize || results.predictions.modelInfo?.trainingSize ? `<tr><td><strong>Training Set</strong></td><td>${results.predictions.model?.trainSize || results.predictions.modelInfo?.trainingSize}${typeof (results.predictions.model?.trainSize || results.predictions.modelInfo?.trainingSize) === 'number' && (results.predictions.model?.trainSize || results.predictions.modelInfo?.trainingSize) <= 1 ? ' compounds' : '%'}</td></tr>` : ''}
                            ${results.predictions.model?.testSize || results.predictions.modelInfo?.testSize ? `<tr><td><strong>Test Set</strong></td><td>${results.predictions.model?.testSize || results.predictions.modelInfo?.testSize}${typeof (results.predictions.model?.testSize || results.predictions.modelInfo?.testSize) === 'number' && (results.predictions.model?.testSize || results.predictions.modelInfo?.testSize) <= 1 ? ' compounds' : '%'}</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
            
            <!-- Prediction Results Table -->
            ${results.predictions.results && Array.isArray(results.predictions.results) ? `
            <h3 style="color: #374151; margin-bottom: 20px;">Prediction Results (Top 20)</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Compound ID</th>
                            <th>Predicted Class</th>
                            <th>Confidence</th>
                            <th>Actual Class</th>
                            <th>Match</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.predictions.results.slice(0, 20).map((pred: any) => `
                        <tr>
                            <td style="font-family: monospace; font-size: 0.9rem;">${pred.id || pred.compound_id || pred.compound || 'N/A'}</td>
                            <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; ${
                              (pred.predicted === 'active' || pred.predicted_class === 'active' || pred.predicted > 6.5)
                                ? 'background: #dcfce7; color: #166534;' 
                                : 'background: #fee2e2; color: #991b1b;'
                            }">${pred.predicted || pred.predicted_class || (pred.predicted > 6.5 ? 'Active' : 'Inactive') || 'N/A'}</span></td>
                            <td>${pred.confidence ? (pred.confidence * 100).toFixed(1) + '%' : 'N/A'}</td>
                            <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; ${
                              (pred.actual === 'active' || pred.actual_class === 'active' || pred.actual > 6.5)
                                ? 'background: #dcfce7; color: #166534;' 
                                : 'background: #fee2e2; color: #991b1b;'
                            }">${pred.actual || pred.actual_class || (pred.actual > 6.5 ? 'Active' : 'Inactive') || 'N/A'}</span></td>
                            <td>${(pred.predicted === pred.actual || pred.predicted_class === pred.actual_class || Math.abs(pred.predicted - pred.actual) < 0.5) ? '✅' : '❌'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            <!-- Top Predictions Table (if different structure) -->
            ${results.predictions.topPredictions && Array.isArray(results.predictions.topPredictions) ? `
            <h3 style="color: #374151; margin-bottom: 20px;">Sample Predictions</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Compound</th>
                            <th>Actual pIC50</th>
                            <th>Predicted pIC50</th>
                            <th>Error</th>
                            <th>Performance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.predictions.topPredictions.slice(0, 20).map((pred: any) => `
                        <tr>
                            <td style="font-family: monospace; font-size: 0.9rem;">${pred.compound || 'N/A'}</td>
                            <td>${pred.actual?.toFixed(3) || 'N/A'}</td>
                            <td>${pred.predicted?.toFixed(3) || 'N/A'}</td>
                            <td style="color: ${Math.abs(pred.error || 0) < 0.5 ? '#166534' : '#991b1b'};">
                                ${pred.error ? (pred.error > 0 ? '+' : '') + pred.error.toFixed(3) : 'N/A'}
                            </td>
                            <td>${Math.abs(pred.error || 0) < 0.5 ? '✅ Good' : '❌ Poor'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            <!-- Fallback: Convert any remaining JSON to table -->
            ${!results.predictions.model && !results.predictions.results && !results.predictions.topPredictions && !results.predictions.metrics && !results.predictions.modelInfo ? `
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
                <h3 style="color: #374151; margin-bottom: 15px;">Raw Prediction Data</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Property</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(results.predictions).map(([key, value]: [string, any]) => `
                            <tr>
                                <td style="font-weight: 600;">${key}</td>
                                <td>${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}</td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${results?.compounds && results.compounds.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Compound Analysis Data</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">Showing first 100 compounds out of ${results.compounds.length} total</p>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ChemBL ID</th>
                            <th>Classification</th>
                            <th>IC50 (nM)</th>
                            <th>pIC50</th>
                            <th>MW (g/mol)</th>
                            <th>LogP</th>
                            <th>H Donors</th>
                            <th>H Acceptors</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.compounds.slice(0, 100).map((compound: any) => `
                        <tr>
                            <td style="font-family: monospace; font-size: 0.9rem;">${compound.molecule_chembl_id || compound.id || 'N/A'}</td>
                            <td><span style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; ${
                              compound.bioactivity_class === 'active' || compound.classification === 'active' 
                                ? 'background: #dcfce7; color: #166534;' 
                                : compound.bioactivity_class === 'inactive' || compound.classification === 'inactive'
                                ? 'background: #fee2e2; color: #991b1b;' 
                                : 'background: #fef3c7; color: #92400e;'
                            }">${compound.bioactivity_class || compound.classification || 'N/A'}</span></td>
                            <td>${compound.standard_value || compound.ic50 ? Number(compound.standard_value || compound.ic50).toFixed(2) : 'N/A'}</td>
                            <td>${compound.pIC50 || compound.pic50 ? Number(compound.pIC50 || compound.pic50).toFixed(2) : 'N/A'}</td>
                            <td>${compound.MW || compound.mw ? Number(compound.MW || compound.mw).toFixed(2) : 'N/A'}</td>
                            <td>${compound.LogP || compound.logp ? Number(compound.LogP || compound.logp).toFixed(2) : 'N/A'}</td>
                            <td>${compound.NumHDonors || compound.hdonors || 'N/A'}</td>
                            <td>${compound.NumHAcceptors || compound.hacceptors || 'N/A'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${results.compounds.length > 100 ? '<p style="color: #6b7280; font-style: italic; margin-top: 15px;">Note: Download CSV for complete compound dataset</p>' : ''}
        </div>
        ` : ''}

        <div class="footer">
            <p>Generated by <strong>DrugPredict</strong> - AI-Powered Drug Discovery Platform</p>
            <p style="font-size: 0.9rem; margin-top: 5px;">Report generated on ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `
    
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `drugpredict-report-${results?.targetName || 'analysis'}.html`
    document.body.appendChild(a) // Add to DOM
    a.click()
    document.body.removeChild(a) // Remove from DOM
    window.URL.revokeObjectURL(url)
    
    console.log('HTML report generated successfully')
    } catch (error) {
      console.error('Failed to generate HTML report:', error)
      alert('Failed to generate HTML report')
    }
  }

  if (variant === 'header') {
    return (
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => downloadCSV(results?.compounds || [], `compounds-${results?.targetName || 'data'}`)}
            className="flex items-center gap-3 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 px-4 py-3 rounded-lg transition-all text-sm group"
            disabled={!results?.compounds}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full group-hover:bg-green-200">
              <Download className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Compound Data</div>
              <div className="text-xs text-gray-600">CSV format</div>
            </div>
          </button>
          
          <button
            onClick={downloadAllPlots}
            className="flex items-center gap-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all text-sm group"
            disabled={!results?.plots}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full group-hover:bg-blue-200">
              <Download className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">All Plots</div>
              <div className="text-xs text-gray-600">PNG images</div>
            </div>
          </button>
          
          <button
            onClick={generateHTMLReport}
            className="flex items-center gap-3 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 px-4 py-3 rounded-lg transition-all text-sm group"
            disabled={!results}
          >
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full group-hover:bg-purple-200">
              <Download className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Full Report</div>
              <div className="text-xs text-gray-600">HTML format</div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Download className="w-5 h-5 text-blue-600" />
        Download Results
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => downloadCSV(results?.compounds || [], `compounds-${results?.targetName || 'data'}`)}
          className="flex items-center gap-3 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 px-4 py-3 rounded-lg transition-all text-sm group"
          disabled={!results?.compounds}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full group-hover:bg-green-200">
            <Download className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">Compound Data</div>
            <div className="text-xs text-gray-600">CSV format</div>
          </div>
        </button>
        
        <button
          onClick={downloadAllPlots}
          className="flex items-center gap-3 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all text-sm group"
          disabled={!results?.plots}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full group-hover:bg-blue-200">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">All Plots</div>
            <div className="text-xs text-gray-600">PNG images</div>
          </div>
        </button>
        
        <button
          onClick={generateHTMLReport}
          className="flex items-center gap-3 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 px-4 py-3 rounded-lg transition-all text-sm group"
          disabled={!results}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full group-hover:bg-purple-200">
            <Download className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-900">Full Report</div>
            <div className="text-xs text-gray-600">HTML format</div>
          </div>
        </button>
      </div>
    </div>
  )
}
