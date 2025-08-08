'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Search, X, Target, Dna, Beaker, Database, Microscope, TestTube } from 'lucide-react'

interface Suggestion {
  id: string
  name: string
  organism: string
  type: string
  description: string
}

interface SearchFormProps {
  onSearch: (target: string) => void
  isLoading: boolean
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const router = useRouter()
  const [target, setTarget] = useState('')
  const [dataLimit, setDataLimit] = useState('1000')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Helper function to get appropriate icon for target type
  const getTargetIcon = (targetType: string) => {
    const type = targetType.toLowerCase()
    if (type.includes('enzyme') || type.includes('protein')) {
      return <Beaker className="w-4 h-4 text-blue-500" />
    } else if (type.includes('receptor')) {
      return <Target className="w-4 h-4 text-green-500" />
    } else if (type.includes('channel')) {
      return <Dna className="w-4 h-4 text-purple-500" />
    } else if (type.includes('kinase')) {
      return <TestTube className="w-4 h-4 text-orange-500" />
    } else {
      return <Microscope className="w-4 h-4 text-gray-500" />
    }
  }

  const searchTargets = useCallback(async (query: string) => {
    console.log('searchTargets called with:', query)
    try {
      setIsSearching(true)
      console.log('Set isSearching to true')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
      const response = await fetch(`${apiUrl}/targets/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      console.log('API Response:', data)
      
      // Handle the correct response format from our Flask API
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions)
        setShowSuggestions(data.suggestions.length > 0)
        console.log('Setting suggestions:', data.suggestions.length, 'items')
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Failed to search targets:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsSearching(false)
      console.log('Set isSearching to false')
    }
  }, [])

  // Debounced search for suggestions
  useEffect(() => {
    console.log('useEffect triggered, target:', target, 'length:', target.length)
    
    // Don't show autocomplete when main search is running
    if (isLoading) {
      setIsTyping(false)
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    if (target.length >= 2) {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }
    
    const timeoutId = setTimeout(() => {
      if (target.length >= 2 && !isLoading) {
        console.log('Calling searchTargets with:', target)
        searchTargets(target)
      } else {
        console.log('Target too short, clearing suggestions')
        setSuggestions([])
        setShowSuggestions(false)
      }
      setIsTyping(false)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [target, searchTargets, isLoading])

  // Clear autocomplete when main search starts
  useEffect(() => {
    if (isLoading) {
      setSuggestions([])
      setShowSuggestions(false)
      setIsSearching(false)
      setIsTyping(false)
      setSelectedIndex(-1)
    }
  }, [isLoading])

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (target.trim()) {
      setShowSuggestions(false)
      setSuggestions([])
      router.push(`/results?target=${encodeURIComponent(target.trim())}&limit=${encodeURIComponent(dataLimit)}`)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setTarget(suggestion.name)
    setShowSuggestions(false)
    setSuggestions([])
    setSelectedIndex(-1)
    // Use the target ID if available, otherwise fall back to name
    const targetParam = suggestion.id ? suggestion.id : suggestion.name
    router.push(`/results?target=${encodeURIComponent(targetParam)}&limit=${encodeURIComponent(dataLimit)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          const selectedSuggestion = suggestions[selectedIndex]
          setTarget(selectedSuggestion.name)
          setShowSuggestions(false)
          setSuggestions([])
          setSelectedIndex(-1)
          // Use the target ID if available, otherwise fall back to name
          const targetParam = selectedSuggestion.id ? selectedSuggestion.id : selectedSuggestion.name
          router.push(`/results?target=${encodeURIComponent(targetParam)}&limit=${encodeURIComponent(dataLimit)}`)
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const clearInput = () => {
    setTarget('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const popularTargets = [
    { name: 'Acetylcholinesterase', id: 'CHEMBL220', description: 'Cholinergic enzyme (Alzheimer\'s target)', type: 'enzyme', organism: 'Homo sapiens' },
    { name: 'Serotonin transporter', id: 'CHEMBL228', description: 'SSRI target (Prozac, antidepressants)', type: 'transporter', organism: 'Homo sapiens' },
    { name: 'Cannabinoid receptor CB1', id: 'CHEMBL218', description: 'Neuromodulatory GPCR', type: 'receptor', organism: 'Homo sapiens' },
    { name: 'Histone deacetylase 4', id: 'CHEMBL1868', description: 'Epigenetic regulator', type: 'enzyme', organism: 'Homo sapiens' },
    { name: 'Beta-secretase 1', id: 'CHEMBL1985', description: 'BACE1 (Alzheimer\'s target)', type: 'enzyme', organism: 'Homo sapiens' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Search for Drug Targets</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
            Target Name or ChemBL ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => target.length >= 2 && setShowSuggestions(true)}
              placeholder="e.g., EGFR, Dopamine D2 receptor, Acetylcholinesterase"
              className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
              disabled={isLoading}
              autoComplete="off"
            />
            {target && !isLoading && (
              <button
                type="button"
                onClick={clearInput}
                className="absolute inset-y-0 right-0 pr-3 flex items-center group"
              >
                <X className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            )}
            {(isSearching || isTyping) && !isLoading && (
              <div className="absolute inset-y-0 right-10 pr-3 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-y-0 right-3 pr-3 flex items-center">
                <Database className="h-5 w-5 text-blue-500 animate-pulse" />
              </div>
            )}
          </div>

          {/* Suggestions Dropdown - show if we have any suggestions and not loading */}
          {suggestions.length > 0 && !isLoading && (
            <div 
              ref={suggestionsRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto backdrop-blur-sm"
              style={{ top: '100%' }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-150 ${
                    index === selectedIndex 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm' 
                      : 'hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTargetIcon(suggestion.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{suggestion.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {suggestion.organism}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {suggestion.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono bg-gray-50 px-2 py-1 rounded inline-block">
                        {suggestion.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Data Limit Selection */}
        <div>
          <label htmlFor="dataLimit" className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Database className="w-4 h-4 mr-2 text-blue-500" />
            Number of Compounds to Retrieve
          </label>
          <div className="relative">
            <select
              id="dataLimit"
              value={dataLimit}
              onChange={(e) => setDataLimit(e.target.value)}
              disabled={isLoading}
              className="w-full py-4 px-4 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 bg-white shadow-sm hover:shadow-md focus:shadow-lg appearance-none"
            >
              <option value="500">500 compounds (Fast • ~1-2 minutes)</option>
              <option value="1000">1,000 compounds (Recommended • ~2-3 minutes)</option>
              <option value="2000">2,000 compounds (Comprehensive • ~4-5 minutes)</option>
              <option value="5000">5,000 compounds (Extensive • ~8-10 minutes)</option>
              <option value="all">All available compounds (Maximum • 10+ minutes)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <Beaker className="w-3 h-3 mr-1" />
            Larger datasets provide more comprehensive analysis but take longer to process
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !target.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing Target Data...</span>
            </>
          ) : (
            <>
              <TestTube className="w-5 h-5" />
              <span>Start Drug Analysis</span>
            </>
          )}
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-blue-500" />
          <h4 className="text-xl font-bold text-gray-900">Popular Drug Targets</h4>
        </div>
        <p className="text-gray-600 mb-6">
          Start with these well-studied therapeutic targets to explore drug discovery data
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularTargets.map((popularTarget) => (
            <button
              key={popularTarget.id}
              onClick={() => {
                // Use ChemBL ID for more accurate targeting
                router.push(`/results?target=${encodeURIComponent(popularTarget.id)}&limit=${encodeURIComponent(dataLimit)}`)
              }}
              disabled={isLoading}
              className="group text-left p-5 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTargetIcon(popularTarget.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-700 transition-colors">
                    {popularTarget.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {popularTarget.description}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {popularTarget.organism}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {popularTarget.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {popularTarget.id}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
