'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Quote, FreightItem as FreightItemType } from '@/lib/types';
import { saveQuote, generateQuoteId, generateCarrierQuotes } from '@/lib/data/storage';

export default function FreightQuoteFormEnhanced() {
  const router = useRouter();

  // Pickup Information
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTimeStart, setPickupTimeStart] = useState('');
  const [pickupTimeEnd, setPickupTimeEnd] = useState('');
  const [pickupCompany, setPickupCompany] = useState('');
  const [pickupAddress1, setPickupAddress1] = useState('');
  const [pickupAddress2, setPickupAddress2] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [pickupZip, setPickupZip] = useState('');
  const [pickupCountry, setPickupCountry] = useState('United States');

  const [pickupPhone, setPickupPhone] = useState('');
  const [pickupPhoneCode, setPickupPhoneCode] = useState('US (+1)');
  const [pickupExtension, setPickupExtension] = useState('');
  const [pickupContactName, setPickupContactName] = useState('');
  const [pickupEmail, setPickupEmail] = useState('');
  const [pickupFax, setPickupFax] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');

  // Delivery Information
  const [deliveryTimeStart, setDeliveryTimeStart] = useState('');
  const [deliveryTimeEnd, setDeliveryTimeEnd] = useState('');
  const [deliveryCompany, setDeliveryCompany] = useState('');
  const [deliveryAddress1, setDeliveryAddress1] = useState('');
  const [deliveryAddress2, setDeliveryAddress2] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryZip, setDeliveryZip] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('United States');

  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryPhoneCode, setDeliveryPhoneCode] = useState('US (+1)');
  const [deliveryExtension, setDeliveryExtension] = useState('');
  const [deliveryContactName, setDeliveryContactName] = useState('');
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Services
  const [residentialPickup, setResidentialPickup] = useState(false);
  const [liftgatePickup, setLiftgatePickup] = useState(false);
  const [limitedAccessPickup, setLimitedAccessPickup] = useState(false);

  const [deliveryAppointment, setDeliveryAppointment] = useState(false);
  const [residentialDelivery, setResidentialDelivery] = useState(false);
  const [notifyConsignee, setNotifyConsignee] = useState(false);
  const [limitedAccessDelivery, setLimitedAccessDelivery] = useState(false);
  const [liftgateDelivery, setLiftgateDelivery] = useState(false);
  const [hazardousMaterial, setHazardousMaterial] = useState(false);

  // Items
  const [items, setItems] = useState<FreightItemType[]>([
    {
      handlingUnit: 'Pallet',
      pieces: 1,
      weight: 0,
      weightUnit: 'lbs',
      length: 0,
      width: 0,
      height: 0,
      dimensionUnit: 'in',
      freightClass: '',
      nmfc: '',
      description: '',
    }
  ]);

  const [stackable, setStackable] = useState(false);
  const [hazmat, setHazmat] = useState(false);
  const [used, setUsed] = useState(false);
  const [machinery, setMachinery] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  const calculateDensity = (item: FreightItemType) => {
    if (!item.weight || !item.length || !item.width || !item.height) return 0;
    const volume = (item.length * item.width * item.height) / 1728;
    return parseFloat((item.weight / volume).toFixed(2));
  };

  const getTotalWeight = () => {
    return items.reduce((total, item) => {
      return total + (item.weight * item.pieces);
    }, 0);
  };

  const getTotalLinearFeet = () => {
    return items.reduce((total, item) => {
      return total + ((item.length / 12) * item.pieces);
    }, 0);
  };

  const getTotalPieces = () => {
    return items.reduce((total, item) => total + item.pieces, 0);
  };

  const addItem = () => {
    setItems([...items, {
      handlingUnit: 'Pallet',
      pieces: 1,
      weight: 0,
      weightUnit: 'lbs',
      length: 0,
      width: 0,
      height: 0,
      dimensionUnit: 'in',
      freightClass: '',
      nmfc: '',
      description: '',
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof FreightItemType, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (['weight', 'length', 'width', 'height'].includes(field)) {
      newItems[index].density = calculateDensity(newItems[index]);
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quote: Quote = {
        id: generateQuoteId(),
        customerId: 'cust001',
        customerName: 'ANKUN USA',
        reference: reference || undefined,
        status: 'quoted',

        pickup: {
          date: pickupDate,
          timeStart: pickupTimeStart || undefined,
          timeEnd: pickupTimeEnd || undefined,
          address: {
            companyName: pickupCompany,
            addressLine1: pickupAddress1,
            addressLine2: pickupAddress2 || undefined,
            city: pickupCity,
            state: pickupState,
            zipCode: pickupZip,
            country: pickupCountry,
          },
          contact: {
            phoneNumber: pickupPhone,
            phoneCountryCode: pickupPhoneCode,
            extension: pickupExtension || undefined,
            contactName: pickupContactName,
            email: pickupEmail,
            fax: pickupFax || undefined,
            notes: pickupNotes || undefined,
          },
          services: {
            residentialPickup,
            liftgatePickup,
            limitedAccessPickup,
          },
        },

        delivery: {
          timeStart: deliveryTimeStart || undefined,
          timeEnd: deliveryTimeEnd || undefined,
          address: {
            companyName: deliveryCompany,
            addressLine1: deliveryAddress1,
            addressLine2: deliveryAddress2 || undefined,
            city: deliveryCity,
            state: deliveryState,
            zipCode: deliveryZip,
            country: deliveryCountry,
          },
          contact: {
            phoneNumber: deliveryPhone,
            phoneCountryCode: deliveryPhoneCode,
            extension: deliveryExtension || undefined,
            contactName: deliveryContactName,
            email: deliveryEmail,
            notes: deliveryNotes || undefined,
          },
          services: {
            deliveryAppointment,
            residentialDelivery,
            notifyConsignee,
            limitedAccessDelivery,
            liftgateDelivery,
            hazardousMaterial,
          },
        },

        items,
        itemOptions: {
          stackable,
          hazmat,
          used,
          machinery,
        },

        totals: {
          totalWeight: getTotalWeight(),
          totalLinearFeet: getTotalLinearFeet(),
          totalPieces: getTotalPieces(),
        },

        createdAt: new Date().toISOString(),
        createdBy: 'Allen Long',
        updatedAt: new Date().toISOString(),
      };

      // Generate carrier quotes
      quote.carrierQuotes = generateCarrierQuotes(quote);
      quote.selectedCarrier = quote.carrierQuotes[0]; // Select cheapest

      // Save to localStorage
      saveQuote(quote);

      // Navigate to quote detail page
      router.push(`/quotes/${quote.id}`);
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('保存失败，请重试');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          New Quote: ANKUN USA
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          货运报价申请 - Freight Quote Request
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reference Number */}
        <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Reference Number (Optional)
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Your reference number"
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
          />
        </div>

        {/* PICKUP and DESTINATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PICKUP Section */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              PICKUP
            </h2>

            {/* Pickup Date & Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Date & Time *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="col-span-3 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="time"
                  value={pickupTimeStart}
                  onChange={(e) => setPickupTimeStart(e.target.value)}
                  placeholder="Start"
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="time"
                  value={pickupTimeEnd}
                  onChange={(e) => setPickupTimeEnd(e.target.value)}
                  placeholder="End"
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Address *
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={pickupCompany}
                  onChange={(e) => setPickupCompany(e.target.value)}
                  placeholder="Company Name"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="text"
                  value={pickupAddress1}
                  onChange={(e) => setPickupAddress1(e.target.value)}
                  placeholder="Address Line 1"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="text"
                  value={pickupAddress2}
                  onChange={(e) => setPickupAddress2(e.target.value)}
                  placeholder="Address Line 2 (Optional)"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder="City"
                    required
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                  <input
                    type="text"
                    value={pickupState}
                    onChange={(e) => setPickupState(e.target.value)}
                    placeholder="State"
                    required
                    maxLength={2}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                  <input
                    type="text"
                    value={pickupZip}
                    onChange={(e) => setPickupZip(e.target.value)}
                    placeholder="ZIP"
                    required
                    pattern="\d{5}"
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Contact Information *
              </label>
              <div className="space-y-2">
                <input
                  type="tel"
                  value={pickupPhone}
                  onChange={(e) => setPickupPhone(e.target.value)}
                  placeholder="Phone Number"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="text"
                  value={pickupContactName}
                  onChange={(e) => setPickupContactName(e.target.value)}
                  placeholder="Contact Name"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="email"
                  value={pickupEmail}
                  onChange={(e) => setPickupEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Accessorial Services
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={residentialPickup}
                    onChange={(e) => setResidentialPickup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Residential Pickup</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liftgatePickup}
                    onChange={(e) => setLiftgatePickup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Lift Gate Pickup</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={limitedAccessPickup}
                    onChange={(e) => setLimitedAccessPickup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Limited Access Pickup</span>
                </label>
              </div>
            </div>
          </div>

          {/* DESTINATION Section */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              DESTINATION
            </h2>

            {/* Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Delivery Time (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={deliveryTimeStart}
                  onChange={(e) => setDeliveryTimeStart(e.target.value)}
                  placeholder="Start"
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="time"
                  value={deliveryTimeEnd}
                  onChange={(e) => setDeliveryTimeEnd(e.target.value)}
                  placeholder="End"
                  className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Address *
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={deliveryCompany}
                  onChange={(e) => setDeliveryCompany(e.target.value)}
                  placeholder="Company Name"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="text"
                  value={deliveryAddress1}
                  onChange={(e) => setDeliveryAddress1(e.target.value)}
                  placeholder="Address Line 1"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="text"
                  value={deliveryAddress2}
                  onChange={(e) => setDeliveryAddress2(e.target.value)}
                  placeholder="Address Line 2 (Optional)"
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="City"
                    required
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                  <input
                    type="text"
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    placeholder="State"
                    required
                    maxLength={2}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                  <input
                    type="text"
                    value={deliveryZip}
                    onChange={(e) => setDeliveryZip(e.target.value)}
                    placeholder="ZIP"
                    required
                    pattern="\d{5}"
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Contact Information *
              </label>
              <div className="space-y-2">
                <input
                  type="tel"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  placeholder="Phone Number"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="text"
                  value={deliveryContactName}
                  onChange={(e) => setDeliveryContactName(e.target.value)}
                  placeholder="Contact Name"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
                <input
                  type="email"
                  value={deliveryEmail}
                  onChange={(e) => setDeliveryEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                Accessorial Services
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deliveryAppointment}
                    onChange={(e) => setDeliveryAppointment(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Delivery Appointment</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={residentialDelivery}
                    onChange={(e) => setResidentialDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Residential Delivery</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyConsignee}
                    onChange={(e) => setNotifyConsignee(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Notify Consignee</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={limitedAccessDelivery}
                    onChange={(e) => setLimitedAccessDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Limited Access Delivery</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liftgateDelivery}
                    onChange={(e) => setLiftgateDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Lift Gate Delivery</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hazardousMaterial}
                    onChange={(e) => setHazardousMaterial(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">Hazardous Material</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Items
          </h2>

          {/* Item Type Tags */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStackable(!stackable)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                stackable
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Stackable
            </button>
            <button
              type="button"
              onClick={() => setHazmat(!hazmat)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                hazmat
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Hazmat
            </button>
            <button
              type="button"
              onClick={() => setUsed(!used)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                used
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Used
            </button>
            <button
              type="button"
              onClick={() => setMachinery(!machinery)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                machinery
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Machinery
            </button>
          </div>

          {/* Items */}
          {items.map((item, index) => (
            <div key={index} className="p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs mb-1">Handling Unit</label>
                  <select
                    value={item.handlingUnit}
                    onChange={(e) => updateItem(index, 'handlingUnit', e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  >
                    <option>Pallet</option>
                    <option>Crate</option>
                    <option>Carton</option>
                    <option>Skid</option>
                    <option>Drum</option>
                    <option>Roll</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs mb-1">Pieces *</label>
                  <input
                    type="number"
                    value={item.pieces}
                    onChange={(e) => updateItem(index, 'pieces', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Weight (lbs) *</label>
                  <input
                    type="number"
                    value={item.weight || ''}
                    onChange={(e) => updateItem(index, 'weight', parseFloat(e.target.value) || 0)}
                    min="1"
                    required
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Length (in) *</label>
                  <input
                    type="number"
                    value={item.length || ''}
                    onChange={(e) => updateItem(index, 'length', parseFloat(e.target.value) || 0)}
                    min="1"
                    required
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Width (in) *</label>
                  <input
                    type="number"
                    value={item.width || ''}
                    onChange={(e) => updateItem(index, 'width', parseFloat(e.target.value) || 0)}
                    min="1"
                    required
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1">Height (in) *</label>
                  <input
                    type="number"
                    value={item.height || ''}
                    onChange={(e) => updateItem(index, 'height', parseFloat(e.target.value) || 0)}
                    min="1"
                    required
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs mb-1">Freight Class</label>
                  <select
                    value={item.freightClass}
                    onChange={(e) => updateItem(index, 'freightClass', e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  >
                    <option value="">--</option>
                    <option>50</option>
                    <option>55</option>
                    <option>60</option>
                    <option>65</option>
                    <option>70</option>
                    <option>77.5</option>
                    <option>85</option>
                    <option>92.5</option>
                    <option>100</option>
                    <option>110</option>
                    <option>125</option>
                    <option>150</option>
                    <option>175</option>
                    <option>200</option>
                    <option>250</option>
                    <option>300</option>
                    <option>400</option>
                    <option>500</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs mb-1">NMFC</label>
                  <input
                    type="text"
                    value={item.nmfc}
                    onChange={(e) => updateItem(index, 'nmfc', e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="货物描述"
                    className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>

              {item.density ? (
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  Density: {item.density} lb/ft³
                </div>
              ) : null}

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-3 text-sm text-red-600 hover:text-red-700"
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            + Add Package
          </button>
        </div>

        {/* Totals */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="font-medium">Total linear feet:</span>
            <span className="ml-2">{getTotalLinearFeet().toFixed(1)} ft</span>
          </div>
          <div>
            <span className="font-medium">Total weight:</span>
            <span className="ml-2">{getTotalWeight().toFixed(2)} lb</span>
          </div>
          <div>
            <span className="font-medium">Total pieces:</span>
            <span className="ml-2">{getTotalPieces()}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-400 text-zinc-900 font-semibold rounded-lg transition-colors shadow-md"
          >
            {isSubmitting ? '提交中...' : 'Get Quote'}
          </button>
        </div>
      </form>
    </div>
  );
}
