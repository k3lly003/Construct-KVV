'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { searchService } from '@/app/services/searchService';
import { Search, X, Package, Wrench, PenTool, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { getFallbackImage } from '@/app/utils/imageUtils';
import { useRouter } from 'next/navigation';

interface GlobalSearchProps {
  onResultSelect?: (result: any, type: string) => void;
  className?: string;
  placeholder?: string;
  showTypeFilters?: boolean;
}

interface SearchResult {
  products: { data: any[]; total: number };
  services: { data: any[]; total: number };
  designs: { data: any[]; total: number };
  portfolios: { data: any[]; total: number };
  summary: { totalResults: number; query: string };
}

export default function GlobalSearch({ 
  onResultSelect, 
  className = '',
  placeholder = 'Search products, services, designs, portfolios...',
  showTypeFilters = true
}: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['products', 'services', 'designs', 'portfolios']);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setResults(null);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get auth token if available
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') || undefined : undefined;

        const response = await searchService.globalSearch({
          query: debouncedQuery,
          types: selectedTypes.join(','),
          limit: 5, // Show 5 results per type
        }, token);

        setResults(response.data);
        setIsOpen(true);
      } catch (err: any) {
        setError(err.message || 'Search failed');
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, selectedTypes]);

  const handleResultClick = (result: any, type: string) => {
    if (onResultSelect) {
      onResultSelect(result, type);
    } else {
      // Default navigation
      switch (type) {
        case 'product':
          router.push(`/product/${result.id}`);
          break;
        case 'service':
          router.push(`/services/${result.id}`);
          break;
        case 'design':
          router.push(`/design-marketplace/${result.id}`);
          break;
        case 'portfolio':
          router.push(`/portfolios/${result.id}`);
          break;
      }
    }
    setIsOpen(false);
    setQuery('');
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
  };

  const entityTypes = [
    { id: 'products', label: 'Products', icon: Package, color: 'bg-blue-100 text-blue-800' },
    { id: 'services', label: 'Services', icon: Wrench, color: 'bg-green-100 text-green-800' },
    { id: 'designs', label: 'Designs', icon: PenTool, color: 'bg-purple-100 text-purple-800' },
    { id: 'portfolios', label: 'Portfolios', icon: Briefcase, color: 'bg-amber-100 text-amber-800' },
  ];

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results) setIsOpen(true);
          }}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Type Filters */}
      {showTypeFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {entityTypes.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => toggleType(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTypes.includes(id)
                  ? `${color} border-2 border-current`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {isOpen && (
        <Card className="absolute z-50 w-full mt-2 max-h-[600px] overflow-y-auto shadow-lg">
          <CardHeader className="sticky top-0 bg-white z-10 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {loading ? 'Searching...' : results ? `Found ${results.summary.totalResults} results` : 'Search'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                <span className="ml-2 text-gray-600">Searching...</span>
              </div>
            )}

            {error && (
              <div className="p-6 text-center text-red-600">
                <p className="font-medium">Error loading results</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && results && (
              <div className="divide-y">
                {/* Products Section */}
                {results.products.total > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Products ({results.products.total})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.products.data.map((product: any) => (
                        <button
                          key={product.id}
                          onClick={() => handleResultClick(product, 'product')}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          {product.thumbnailUrl && (
                            <Image
                              src={getFallbackImage(product.thumbnailUrl, 'product')}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-gray-500 truncate">{product.description}</p>
                            <p className="text-sm font-semibold text-amber-600 mt-1">{product.price} Rwf</p>
                          </div>
                        </button>
                      ))}
                      {results.products.total > results.products.data.length && (
                        <Link
                          href={`/product?search=${encodeURIComponent(debouncedQuery)}`}
                          className="block text-center text-sm text-amber-600 hover:text-amber-700 font-medium py-2"
                        >
                          View all {results.products.total} products →
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Services Section */}
                {results.services.total > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">Services ({results.services.total})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.services.data.map((service: any) => (
                        <button
                          key={service.id}
                          onClick={() => handleResultClick(service, 'service')}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-medium text-gray-900">{service.title}</p>
                          <p className="text-sm text-gray-500">{service.description}</p>
                          <Badge variant="outline" className="mt-1">{service.category}</Badge>
                        </button>
                      ))}
                      {results.services.total > results.services.data.length && (
                        <Link
                          href={`/services?search=${encodeURIComponent(debouncedQuery)}`}
                          className="block text-center text-sm text-amber-600 hover:text-amber-700 font-medium py-2"
                        >
                          View all {results.services.total} services →
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Designs Section */}
                {results.designs.total > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <PenTool className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Designs ({results.designs.total})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.designs.data.map((design: any) => (
                        <button
                          key={design.id}
                          onClick={() => handleResultClick(design, 'design')}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          {design.images?.[0] && (
                            <Image
                              src={design.images[0]}
                              alt={design.title}
                              width={50}
                              height={50}
                              className="rounded object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{design.title}</p>
                            <p className="text-sm text-gray-500 truncate">{design.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{design.category}</Badge>
                              <p className="text-sm font-semibold text-purple-600">${design.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                      {results.designs.total > results.designs.data.length && (
                        <Link
                          href={`/design-marketplace?search=${encodeURIComponent(debouncedQuery)}`}
                          className="block text-center text-sm text-amber-600 hover:text-amber-700 font-medium py-2"
                        >
                          View all {results.designs.total} designs →
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Portfolios Section */}
                {results.portfolios.total > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-5 w-5 text-amber-600" />
                      <h3 className="font-semibold text-gray-900">Portfolios ({results.portfolios.total})</h3>
                    </div>
                    <div className="space-y-2">
                      {results.portfolios.data.map((portfolio: any) => (
                        <button
                          key={portfolio.id}
                          onClick={() => handleResultClick(portfolio, 'portfolio')}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-medium text-gray-900">{portfolio.title}</p>
                          <p className="text-sm text-gray-500">{portfolio.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{portfolio.category}</Badge>
                            {portfolio.location && (
                              <span className="text-xs text-gray-500">{portfolio.location}</span>
                            )}
                          </div>
                        </button>
                      ))}
                      {results.portfolios.total > results.portfolios.data.length && (
                        <Link
                          href={`/portfolios?search=${encodeURIComponent(debouncedQuery)}`}
                          className="block text-center text-sm text-amber-600 hover:text-amber-700 font-medium py-2"
                        >
                          View all {results.portfolios.total} portfolios →
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {results.summary.totalResults === 0 && (
                  <div className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

