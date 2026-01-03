'use client';

import { useState, useEffect } from 'react';

interface FreightItem {
  handlingUnit: string;
  pieces: string;
  weight: string;
  weightUnit: string;
  length: string;
  width: string;
  height: string;
  dimensionUnit: string;
  freightClass: string;
  nmfc: string;
  description: string;
  density?: number;
}

export default function FreightQuoteForm() {
  const [pickupDate, setPickupDate] = useState('');
  const [pickupZip, setPickupZip] = useState('');
  const [pickupCountry, setPickupCountry] = useState('United States');
  const [destinationZip, setDestinationZip] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('United States');

  // Pickup Accessorial Services
  const [residentialPickup, setResidentialPickup] = useState(false);
  const [liftgatePickup, setLiftgatePickup] = useState(false);
  const [limitedAccessPickup, setLimitedAccessPickup] = useState(false);
  const [showMorePickupServices, setShowMorePickupServices] = useState(false);

  // Destination Accessorial Services
  const [deliveryAppointment, setDeliveryAppointment] = useState(false);
  const [residentialDelivery, setResidentialDelivery] = useState(false);
  const [notifyConsignee, setNotifyConsignee] = useState(false);
  const [limitedAccessDelivery, setLimitedAccessDelivery] = useState(false);
  const [liftgateDelivery, setLiftgateDelivery] = useState(false);
  const [hazardousMaterial, setHazardousMaterial] = useState(false);
  const [showMoreDestServices, setShowMoreDestServices] = useState(false);

  // Items
  const [items, setItems] = useState<FreightItem[]>([
    {
      handlingUnit: 'Pallet',
      pieces: '1',
      weight: '',
      weightUnit: 'lbs',
      length: '',
      width: '',
      height: '',
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

  // Calculate density for each item
  const calculateDensity = (item: FreightItem) => {
    const weight = parseFloat(item.weight);
    const length = parseFloat(item.length);
    const width = parseFloat(item.width);
    const height = parseFloat(item.height);

    if (!weight || !length || !width || !height) return 0;

    const volume = (length * width * height) / 1728; // Convert cubic inches to cubic feet
    return parseFloat((weight / volume).toFixed(2));
  };

  // Calculate totals
  const getTotalWeight = () => {
    return items.reduce((total, item) => {
      const weight = parseFloat(item.weight) || 0;
      const pieces = parseInt(item.pieces) || 1;
      return total + (weight * pieces);
    }, 0).toFixed(2);
  };

  const getTotalLinearFeet = () => {
    return items.reduce((total, item) => {
      const length = parseFloat(item.length) || 0;
      const pieces = parseInt(item.pieces) || 1;
      return total + ((length / 12) * pieces); // Convert inches to feet
    }, 0).toFixed(1);
  };

  const addItem = () => {
    setItems([...items, {
      handlingUnit: 'Pallet',
      pieces: '1',
      weight: '',
      weightUnit: 'lbs',
      length: '',
      width: '',
      height: '',
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

  const updateItem = (index: number, field: keyof FreightItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value as never;

    // Recalculate density
    if (['weight', 'length', 'width', 'height'].includes(field)) {
      newItems[index].density = calculateDensity(newItems[index]);
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const quoteData = {
      pickup: {
        date: pickupDate,
        zipCode: pickupZip,
        country: pickupCountry,
        services: {
          residentialPickup,
          liftgatePickup,
          limitedAccessPickup,
        }
      },
      destination: {
        zipCode: destinationZip,
        country: destinationCountry,
        services: {
          deliveryAppointment,
          residentialDelivery,
          notifyConsignee,
          limitedAccessDelivery,
          liftgateDelivery,
          hazardousMaterial,
        }
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
      }
    };

    console.log('Quote Request:', quoteData);

    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('报价请求已提交！您将在24小时内收到报价。');
    setIsSubmitting(false);
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
        {/* PICKUP and DESTINATION - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PICKUP Section */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              PICKUP
            </h2>

            {/* Pickup Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                PICKUP DATE *
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Address
                </label>
                <button
                  type="button"
                  className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  📖 Address Book
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1 text-zinc-600 dark:text-zinc-400">
                    PICKUP ZIP CODE *
                  </label>
                  <input
                    type="text"
                    value={pickupZip}
                    onChange={(e) => setPickupZip(e.target.value)}
                    placeholder="91768"
                    required
                    pattern="\d{5}"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1 text-zinc-600 dark:text-zinc-400">
                    COUNTRY
                  </label>
                  <select
                    value={pickupCountry}
                    onChange={(e) => setPickupCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Accessorial Services */}
            <div>
              <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">
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
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Residential Pickup</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liftgatePickup}
                    onChange={(e) => setLiftgatePickup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Lift Gate Pickup</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={limitedAccessPickup}
                    onChange={(e) => setLimitedAccessPickup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Limited Access Pickup</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => setShowMorePickupServices(!showMorePickupServices)}
                className="mt-3 px-4 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                + More Services
              </button>
            </div>
          </div>

          {/* DESTINATION Section */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 sm:p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              DESTINATION
            </h2>

            {/* Address */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Address
                </label>
                <button
                  type="button"
                  className="px-3 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  📖 Address Book
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1 text-zinc-600 dark:text-zinc-400">
                    DESTINATION ZIP CODE *
                  </label>
                  <input
                    type="text"
                    value={destinationZip}
                    onChange={(e) => setDestinationZip(e.target.value)}
                    placeholder="94341"
                    required
                    pattern="\d{5}"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-xs mb-1 text-zinc-600 dark:text-zinc-400">
                    COUNTRY
                  </label>
                  <select
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Accessorial Services */}
            <div>
              <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">
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
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Delivery Appointment</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={residentialDelivery}
                    onChange={(e) => setResidentialDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Residential Delivery</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyConsignee}
                    onChange={(e) => setNotifyConsignee(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Notify Consignee</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={limitedAccessDelivery}
                    onChange={(e) => setLimitedAccessDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Limited Access Delivery</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liftgateDelivery}
                    onChange={(e) => setLiftgateDelivery(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Lift Gate Delivery</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hazardousMaterial}
                    onChange={(e) => setHazardousMaterial(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">Hazardous Material</span>
                </label>
              </div>

              <button
                type="button"
                onClick={() => setShowMoreDestServices(!showMoreDestServices)}
                className="mt-3 px-4 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                + More Services
              </button>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Items
            </h2>
          </div>

          {/* Item Type Tags */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStackable(!stackable)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                stackable
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
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
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
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
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
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
                  : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              Machinery
            </button>
          </div>

          {/* Items Table */}
          {items.map((item, index) => (
            <div key={index} className="p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 gap-3 min-w-[800px]">
                  <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    <div className="col-span-1">UNITS</div>
                    <div className="col-span-2">HANDLING UNIT</div>
                    <div className="col-span-1">PIECES</div>
                    <div className="col-span-1">WEIGHT</div>
                    <div className="col-span-1">LENGTH</div>
                    <div className="col-span-1">WIDTH</div>
                    <div className="col-span-1">HEIGHT</div>
                    <div className="col-span-1">CLASS</div>
                    <div className="col-span-1">NMFC</div>
                    <div className="col-span-2">DESCRIPTION</div>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-1">
                      <input
                        type="text"
                        value="1"
                        disabled
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div className="col-span-2">
                      <select
                        value={item.handlingUnit}
                        onChange={(e) => updateItem(index, 'handlingUnit', e.target.value)}
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      >
                        <option>Pallet</option>
                        <option>Crate</option>
                        <option>Carton</option>
                        <option>Skid</option>
                        <option>Drum</option>
                        <option>Roll</option>
                      </select>
                    </div>

                    <div className="col-span-1">
                      <input
                        type="number"
                        value={item.pieces}
                        onChange={(e) => updateItem(index, 'pieces', e.target.value)}
                        min="1"
                        required
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div className="col-span-1">
                      <div className="flex">
                        <input
                          type="number"
                          value={item.weight}
                          onChange={(e) => updateItem(index, 'weight', e.target.value)}
                          placeholder="100"
                          min="1"
                          required
                          className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-l bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        />
                        <select
                          value={item.weightUnit}
                          onChange={(e) => updateItem(index, 'weightUnit', e.target.value)}
                          className="px-1 py-2 text-xs border-l-0 border border-zinc-300 dark:border-zinc-700 rounded-r bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        >
                          <option>lbs</option>
                          <option>kg</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <input
                        type="number"
                        value={item.length}
                        onChange={(e) => updateItem(index, 'length', e.target.value)}
                        placeholder="48"
                        min="1"
                        required
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div className="col-span-1">
                      <input
                        type="number"
                        value={item.width}
                        onChange={(e) => updateItem(index, 'width', e.target.value)}
                        placeholder="40"
                        min="1"
                        required
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div className="col-span-1">
                      <div className="flex">
                        <input
                          type="number"
                          value={item.height}
                          onChange={(e) => updateItem(index, 'height', e.target.value)}
                          placeholder="50"
                          min="1"
                          required
                          className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-l bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        />
                        <select
                          value={item.dimensionUnit}
                          onChange={(e) => updateItem(index, 'dimensionUnit', e.target.value)}
                          className="px-1 py-2 text-xs border-l-0 border border-zinc-300 dark:border-zinc-700 rounded-r bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        >
                          <option>in</option>
                          <option>cm</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <select
                        value={item.freightClass}
                        onChange={(e) => updateItem(index, 'freightClass', e.target.value)}
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
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

                    <div className="col-span-1">
                      <input
                        type="text"
                        value={item.nmfc}
                        onChange={(e) => updateItem(index, 'nmfc', e.target.value)}
                        placeholder=""
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="货物描述"
                        className="w-full px-2 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                      />
                    </div>
                  </div>

                  {item.density ? (
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      Density: {item.density} lb/ft³
                    </div>
                  ) : null}
                </div>
              </div>

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
            className="px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            + Add Package
          </button>
        </div>

        {/* Totals */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Total linear feet:</span>
            <span className="ml-2 text-zinc-900 dark:text-zinc-50">{getTotalLinearFeet()} ft</span>
          </div>
          <div>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Total weight:</span>
            <span className="ml-2 text-zinc-900 dark:text-zinc-50">{getTotalWeight()} lb</span>
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
