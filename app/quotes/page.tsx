'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus } from 'lucide-react';

interface Quote {
  id: string;
  customer: string;
  reference: string;
  pickupDate: string;
  origin: string;
  originZip: string;
  destination: string;
  destinationZip: string;
  load: string;
  weight: string;
  carrier: string;
  createdBy: string;
  createdDate: string;
}

export default function QuotesPage() {
  const [dateRange, setDateRange] = useState({
    start: '12/19/2025',
    end: '01/07/2026'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - 根据截图的数据
  const [quotes] = useState<Quote[]>([
    {
      id: '229936-P1',
      customer: 'ANKUN USA',
      reference: '60112795247',
      pickupDate: '1/2/2026',
      origin: 'Fontana, CA',
      originZip: '92337',
      destination: 'Madera, CA',
      destinationZip: '93636',
      load: 'CLASS 65',
      weight: '59.28lb',
      carrier: 'DDPP',
      createdBy: 'Allen Long',
      createdDate: 'Created an hour ago on 1/2/2026'
    },
    {
      id: '229936-P1',
      customer: 'ANKUN USA',
      reference: '60112768669',
      pickupDate: '12/30/2025',
      origin: 'Rincon, CA',
      originZip: '91426',
      destination: 'Roswell, GA',
      destinationZip: '30078',
      load: 'CLASS 125',
      weight: '76.84lb',
      carrier: 'AVRT',
      createdBy: 'Laura Posada',
      createdDate: 'Created 3 days ago on 12/30/2025'
    },
    {
      id: '229936-P1',
      customer: 'ANKUN USA',
      reference: '60112768666',
      pickupDate: '12/30/2025',
      origin: 'Perris, CA',
      originZip: '92571',
      destination: 'San Francisco, CA',
      destinationZip: '94112',
      load: 'CLASS 100',
      weight: '60.00lb',
      carrier: 'RDFS',
      createdBy: 'Laura Posada',
      createdDate: 'Created 3 days ago on 12/30/2025'
    },
    {
      id: '229936-P1',
      customer: 'ANKUN USA',
      reference: '60112768661',
      pickupDate: '12/30/2025',
      origin: 'Perris, CA',
      originZip: '92571',
      destination: 'San Jose, CA',
      destinationZip: '95111',
      load: 'CLASS 125',
      weight: '110.00lb',
      carrier: 'ABFS',
      createdBy: 'Laura Posada',
      createdDate: 'Created 3 days ago on 12/30/2025'
    },
  ]);

  const filteredQuotes = quotes.filter(quote =>
    quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.reference.includes(searchTerm) ||
    quote.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                已保存的报价列表
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

                <button className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
                  Clear All
                </button>

                <button className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
                  Search
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
                {filteredQuotes.map((quote, index) => (
                  <tr
                    key={index}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {quote.customer}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {quote.createdDate}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                      {quote.reference}
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                      {quote.pickupDate}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-zinc-900 dark:text-zinc-50">
                        {quote.origin}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {quote.originZip}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-zinc-900 dark:text-zinc-50">
                        {quote.destination}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {quote.destinationZip}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-zinc-900 dark:text-zinc-50">
                        {quote.load}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {quote.weight}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                      {quote.carrier}
                    </td>
                    <td className="px-4 py-4 text-sm text-zinc-900 dark:text-zinc-50">
                      {quote.createdBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400">
                No quotes found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
