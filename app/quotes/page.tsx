'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus } from 'lucide-react';
import { Quote } from '@/lib/types';
import { getAllQuotes, initializeSampleData } from '@/lib/data/storage';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: '12/19/2025',
    end: '01/07/2026'
  });

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();

    // Load quotes from localStorage
    const loadedQuotes = getAllQuotes();
    setQuotes(loadedQuotes);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `Created ${diffMins} minutes ago on ${formatDate(dateString)}`;
      }
      return `Created ${diffHours} hour${diffHours > 1 ? 's' : ''} ago on ${formatDate(dateString)}`;
    }
    return `Created ${diffDays} day${diffDays > 1 ? 's' : ''} ago on ${formatDate(dateString)}`;
  };

  const filteredQuotes = quotes.filter(quote => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      quote.customerName.toLowerCase().includes(searchLower) ||
      (quote.reference && quote.reference.toLowerCase().includes(searchLower)) ||
      quote.pickup.address.city.toLowerCase().includes(searchLower) ||
      quote.delivery.address.city.toLowerCase().includes(searchLower) ||
      (quote.selectedCarrier && quote.selectedCarrier.carrierCode.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Saved Quotes
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                已保存的报价列表 ({quotes.length} quotes)
              </p>
            </div>
            <Link
              href="/quotes/new"
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold rounded-lg transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Quote</span>
            </Link>
          </div>

          {/* Filters Bar */}
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="FILTER QUOTES BY CARRIER OR LOCATION..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">DATE RANGE</span>
                <input
                  type="text"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <span className="text-zinc-600 dark:text-zinc-400">-</span>
                <input
                  type="text"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>

                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Clear All
                </button>

                <button className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
                  Save Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Pickup Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Load
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Carrier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {filteredQuotes.map((quote, index) => {
                  // Get highest freight class
                  const freightClasses = quote.items
                    .map(item => item.freightClass)
                    .filter(fc => fc && fc !== '');
                  const highestClass = freightClasses.length > 0
                    ? freightClasses.sort((a, b) => parseFloat(b!) - parseFloat(a!))[0]
                    : 'N/A';

                  return (
                    <tr
                      key={index}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                      onClick={() => window.location.href = `/quotes/${quote.id}`}
                    >
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {quote.customerName}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {getRelativeTime(quote.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                        {quote.reference || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                        {formatDate(quote.pickup.date)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-zinc-900 dark:text-zinc-50">
                          {quote.pickup.address.city}, {quote.pickup.address.state}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {quote.pickup.address.zipCode}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-zinc-900 dark:text-zinc-50">
                          {quote.delivery.address.city}, {quote.delivery.address.state}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {quote.delivery.address.zipCode}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-zinc-900 dark:text-zinc-50">
                          CLASS {highestClass}
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                          {quote.totals.totalWeight.toFixed(2)}lb
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                        {quote.selectedCarrier?.carrierCode || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                        {quote.createdBy}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400">
                {quotes.length === 0
                  ? 'No quotes yet. Create your first quote!'
                  : 'No quotes found matching your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
