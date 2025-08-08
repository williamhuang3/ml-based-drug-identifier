interface Compound {
  id: string
  smiles: string
  ic50: number
  pic50: number
  classification: 'active' | 'inactive' | 'intermediate'
  mw: number
  logp: number
  hdonors: number
  hacceptors: number
}

interface CompoundTableProps {
  compounds: Compound[]
}

export default function CompoundTable({ compounds }: CompoundTableProps) {
  if (!compounds || compounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No compound data available</p>
      </div>
    )
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-gray-900">Compound Analysis</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ChemBL ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IC50 (nM)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                pIC50
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                MW
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LogP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                H Donors
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                H Acceptors
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {compounds.slice(0, 50).map((compound, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                  {compound.id}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClassificationColor(compound.classification)}`}>
                    {compound.classification}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {compound.ic50.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {compound.pic50.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {compound.mw.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {compound.logp.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {compound.hdonors}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {compound.hacceptors}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {compounds.length > 50 && (
        <p className="text-sm text-gray-500 text-center">
          Showing first 50 of {compounds.length} compounds
        </p>
      )}
    </div>
  )
}
