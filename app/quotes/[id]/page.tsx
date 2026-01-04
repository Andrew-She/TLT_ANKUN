'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, Phone, Mail, Truck } from 'lucide-react';
import { Quote } from '@/lib/types';
import { getQuoteById } from '@/lib/data/storage';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const quoteData = getQuoteById(id);

    if (!quoteData) {
      router.push('/quotes');
      return;
    }

    setQuote(quoteData);
    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!quote) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/quotes"
            className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Quotes</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Shipment: {quote.id}
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Reference: {quote.reference || 'N/A'}
              </p>
            </div>

            <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold rounded-lg transition-colors shadow-md">
              📄 Request LTL Quote
            </button>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Pickup & Delivery', active: true },
              { num: 2, label: 'Items & Liability', active: false },
              { num: 3, label: 'Review & Ship', active: false },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step.active
                        ? 'bg-yellow-400 text-zinc-900'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {step.num}
                  </div>
                  <span className="text-sm mt-2 text-zinc-700 dark:text-zinc-300">
                    {step.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className="w-full h-0.5 bg-zinc-200 dark:bg-zinc-700 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Carrier */}
        {quote.selectedCarrier && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Truck className="w-12 h-12 text-yellow-400" />
                <div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    CONTAINS {quote.totals.totalPieces} ACCESSORIAL(S)
                  </div>
                  <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    {quote.selectedCarrier.carrierName}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {quote.pickup.address.city}, {quote.pickup.address.state} {quote.pickup.address.zipCode}
                    {' → '}
                    {quote.delivery.address.city}, {quote.delivery.address.state} {quote.delivery.address.zipCode}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    ${quote.selectedCarrier.totalCost}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {quote.selectedCarrier.carrierCode} | {quote.selectedCarrier.serviceType}
                  </div>
                </div>
                <button className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  Show Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PICKUP and DESTINATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* PICKUP */}
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              PICKUP
            </h2>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Date
              </label>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">PICKUP DATE</div>
                  <div className="font-medium">{formatDate(quote.pickup.date)}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">PICKUP START</div>
                  <div className="font-medium">{quote.pickup.timeStart || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">PICKUP END</div>
                  <div className="font-medium">{quote.pickup.timeEnd || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Address
                </label>
                <button className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-white dark:hover:bg-zinc-800">
                  📖 Address Book
                </button>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg space-y-2">
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">SEARCH ADDRESS/COMPANY NAME</div>
                  <div className="font-medium">{quote.pickup.address.companyName}</div>
                </div>

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">ADDRESS LINE 1</div>
                  <div className="font-medium">{quote.pickup.address.addressLine1}</div>
                </div>

                {quote.pickup.address.addressLine2 && (
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">ADDRESS LINE 2</div>
                    <div className="font-medium">{quote.pickup.address.addressLine2}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">CITY/STATE/ZIP</div>
                  <div className="font-medium">
                    {quote.pickup.address.city}, {quote.pickup.address.state} {quote.pickup.address.zipCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Contact Information
              </label>

              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">PHONE NUMBER</div>
                    <div className="font-medium">
                      {quote.pickup.contact.phoneCountryCode} {quote.pickup.contact.phoneNumber}
                    </div>
                  </div>

                  {quote.pickup.contact.extension && (
                    <div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">EXTENSION</div>
                      <div className="font-medium">{quote.pickup.contact.extension}</div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">CONTACT NAME</div>
                  <div className="font-medium">{quote.pickup.contact.contactName}</div>
                </div>

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">EMAIL ADDRESS</div>
                  <div className="font-medium">{quote.pickup.contact.email}</div>
                </div>

                {quote.pickup.contact.fax && (
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">FAX</div>
                    <div className="font-medium text-xs">{quote.pickup.contact.fax}</div>
                  </div>
                )}

                {quote.pickup.contact.notes && (
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">NOTES</div>
                    <div className="font-medium">{quote.pickup.contact.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DESTINATION */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              DESTINATION
            </h2>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Date
              </label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">DELIVERY START</div>
                  <div className="font-medium">{quote.delivery.timeStart || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">DELIVERY END</div>
                  <div className="font-medium">{quote.delivery.timeEnd || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Address
                </label>
                <button className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-white dark:hover:bg-zinc-800">
                  📖 Address Book
                </button>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg space-y-2">
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">SEARCH ADDRESS/COMPANY NAME</div>
                  <div className="font-medium">{quote.delivery.address.companyName}</div>
                </div>

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">ADDRESS LINE 1</div>
                  <div className="font-medium">{quote.delivery.address.addressLine1}</div>
                </div>

                {quote.delivery.address.addressLine2 && (
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">ADDRESS LINE 2</div>
                    <div className="font-medium">{quote.delivery.address.addressLine2}</div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">CITY/STATE/ZIP</div>
                  <div className="font-medium">
                    {quote.delivery.address.city}, {quote.delivery.address.state} {quote.delivery.address.zipCode}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Contact Information
              </label>

              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">PHONE NUMBER</div>
                    <div className="font-medium">
                      {quote.delivery.contact.phoneCountryCode} {quote.delivery.contact.phoneNumber}
                    </div>
                  </div>

                  {quote.delivery.contact.extension && (
                    <div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">EXTENSION</div>
                      <div className="font-medium">{quote.delivery.contact.extension}</div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">CONTACT NAME</div>
                  <div className="font-medium">{quote.delivery.contact.contactName}</div>
                </div>

                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">EMAIL ADDRESS</div>
                  <div className="font-medium">{quote.delivery.contact.email}</div>
                </div>

                {quote.delivery.contact.notes && (
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">NOTES</div>
                    <div className="font-medium">{quote.delivery.contact.notes}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
            Items
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">UNITS</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">HANDLING UNIT</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">PIECES</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">WEIGHT</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">L×W×H</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">CLASS</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">NMFC</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {quote.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-3">1</td>
                    <td className="px-3 py-3">{item.handlingUnit}</td>
                    <td className="px-3 py-3">{item.pieces}</td>
                    <td className="px-3 py-3">{item.weight} {item.weightUnit}</td>
                    <td className="px-3 py-3">
                      {item.length}×{item.width}×{item.height} {item.dimensionUnit}
                    </td>
                    <td className="px-3 py-3">{item.freightClass || 'N/A'}</td>
                    <td className="px-3 py-3">{item.nmfc || 'N/A'}</td>
                    <td className="px-3 py-3">{item.description || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 flex gap-6 text-sm">
            <div>
              <span className="text-zinc-600 dark:text-zinc-400">Total linear feet:</span>
              <span className="ml-2 font-medium">{quote.totals.totalLinearFeet} ft</span>
            </div>
            <div>
              <span className="text-zinc-600 dark:text-zinc-400">Total weight:</span>
              <span className="ml-2 font-medium">{quote.totals.totalWeight} lb</span>
            </div>
          </div>
        </div>

        {/* Carrier Quotes */}
        {quote.carrierQuotes && quote.carrierQuotes.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              Available Carrier Quotes
            </h2>

            <div className="space-y-3">
              {quote.carrierQuotes.map((carrier, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <div className="flex-1">
                    <div className="font-medium text-zinc-900 dark:text-zinc-50">
                      {carrier.carrierName}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {carrier.carrierCode} | {carrier.serviceType}
                      {carrier.transitDays && ` | ${carrier.transitDays} days`}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      ${carrier.totalCost}
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      Rate: ${carrier.rate} + Acc: ${carrier.accessorials}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
            Clear Address
          </button>
          <button className="px-6 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
            Check Address
          </button>
          <button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold rounded-lg transition-colors shadow-md">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
