'use client';

import { useState } from 'react';

interface FreightItem {
  length: string;
  width: string;
  height: string;
  weight: string;
  quantity: string;
}

export default function FreightQuoteForm() {
  const [originZip, setOriginZip] = useState('');
  const [destinationZip, setDestinationZip] = useState('');
  const [items, setItems] = useState<FreightItem[]>([
    { length: '', width: '', height: '', weight: '', quantity: '1' }
  ]);
  const [liftgatePickup, setLiftgatePickup] = useState(false);
  const [liftgateDelivery, setLiftgateDelivery] = useState(false);
  const [insidePickup, setInsidePickup] = useState(false);
  const [insideDelivery, setInsideDelivery] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { length: '', width: '', height: '', weight: '', quantity: '1' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof FreightItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const quoteData = {
      originZip,
      destinationZip,
      items,
      options: {
        liftgatePickup,
        liftgateDelivery,
        insidePickup,
        insideDelivery,
        scheduledDate
      }
    };

    console.log('Quote Request:', quoteData);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert('报价请求已提交！您将在24小时内收到报价。');
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
        货运报价申请
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ZIP Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              起始地 ZIP Code *
            </label>
            <input
              type="text"
              value={originZip}
              onChange={(e) => setOriginZip(e.target.value)}
              placeholder="例如: 10001"
              required
              pattern="\d{5}"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              目的地 ZIP Code *
            </label>
            <input
              type="text"
              value={destinationZip}
              onChange={(e) => setDestinationZip(e.target.value)}
              placeholder="例如: 90001"
              required
              pattern="\d{5}"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
            />
          </div>
        </div>

        {/* Freight Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              货物信息
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              + 添加货物
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="p-4 border border-zinc-300 dark:border-zinc-700 rounded-lg space-y-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                  货物 #{index + 1}
                </h3>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    删除
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-sm mb-1 text-zinc-700 dark:text-zinc-300">
                    长度 (英寸) *
                  </label>
                  <input
                    type="number"
                    value={item.length}
                    onChange={(e) => updateItem(index, 'length', e.target.value)}
                    placeholder="48"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-zinc-700 dark:text-zinc-300">
                    宽度 (英寸) *
                  </label>
                  <input
                    type="number"
                    value={item.width}
                    onChange={(e) => updateItem(index, 'width', e.target.value)}
                    placeholder="40"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-zinc-700 dark:text-zinc-300">
                    高度 (英寸) *
                  </label>
                  <input
                    type="number"
                    value={item.height}
                    onChange={(e) => updateItem(index, 'height', e.target.value)}
                    placeholder="48"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-zinc-700 dark:text-zinc-300">
                    重量 (磅) *
                  </label>
                  <input
                    type="number"
                    value={item.weight}
                    onChange={(e) => updateItem(index, 'weight', e.target.value)}
                    placeholder="500"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 text-zinc-700 dark:text-zinc-300">
                    数量 *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    placeholder="1"
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            附加服务
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center space-x-3 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <input
                type="checkbox"
                checked={liftgatePickup}
                onChange={(e) => setLiftgatePickup(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-zinc-900 dark:text-zinc-50">取货时使用升降尾板 (Liftgate Pickup)</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <input
                type="checkbox"
                checked={liftgateDelivery}
                onChange={(e) => setLiftgateDelivery(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-zinc-900 dark:text-zinc-50">送货时使用升降尾板 (Liftgate Delivery)</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <input
                type="checkbox"
                checked={insidePickup}
                onChange={(e) => setInsidePickup(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-zinc-900 dark:text-zinc-50">室内取货 (Inside Pickup)</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border border-zinc-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <input
                type="checkbox"
                checked={insideDelivery}
                onChange={(e) => setInsideDelivery(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-zinc-900 dark:text-zinc-50">室内送货 (Inside Delivery)</span>
            </label>
          </div>
        </div>

        {/* Scheduled Date */}
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            预约日期 (可选)
          </label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full md:w-auto px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isSubmitting ? '提交中...' : '申请报价'}
        </button>
      </form>
    </div>
  );
}
