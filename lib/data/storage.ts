import { Quote, CarrierQuote } from '../types';
import { CARRIERS, calculateFreightRate, calculateDistance } from './carriers';

const STORAGE_KEY = 'freight_quotes';

// 获取所有询价单
export function getAllQuotes(): Quote[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing quotes from localStorage:', e);
    return [];
  }
}

// 根据ID获取询价单
export function getQuoteById(id: string): Quote | null {
  const quotes = getAllQuotes();
  return quotes.find(q => q.id === id) || null;
}

// 保存询价单
export function saveQuote(quote: Quote): void {
  const quotes = getAllQuotes();
  const existingIndex = quotes.findIndex(q => q.id === quote.id);

  if (existingIndex >= 0) {
    // 更新现有询价单
    quotes[existingIndex] = quote;
  } else {
    // 添加新询价单
    quotes.unshift(quote);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// 删除询价单
export function deleteQuote(id: string): void {
  const quotes = getAllQuotes();
  const filtered = quotes.filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

// 生成唯一ID
export function generateQuoteId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}-${random}`;
}

// 生成承运商报价
export function generateCarrierQuotes(quote: Quote): CarrierQuote[] {
  const { pickup, delivery, items, totals } = quote;

  // 计算距离
  const distance = calculateDistance(
    pickup.address.zipCode,
    delivery.address.zipCode
  );

  // 收集所有附加服务
  const accessorialServices: string[] = [];
  if (pickup.services.liftgatePickup) accessorialServices.push('liftgatePickup');
  if (pickup.services.residentialPickup) accessorialServices.push('residentialPickup');
  if (pickup.services.limitedAccessPickup) accessorialServices.push('limitedAccessPickup');
  if (delivery.services.liftgateDelivery) accessorialServices.push('liftgateDelivery');
  if (delivery.services.residentialDelivery) accessorialServices.push('residentialDelivery');
  if (delivery.services.limitedAccessDelivery) accessorialServices.push('limitedAccessDelivery');
  if (delivery.services.deliveryAppointment) accessorialServices.push('deliveryAppointment');
  if (delivery.services.notifyConsignee) accessorialServices.push('notifyConsignee');
  if (delivery.services.hazardousMaterial) accessorialServices.push('hazardousMaterial');

  // 获取最高运费等级
  const freightClasses = items
    .map(item => item.freightClass)
    .filter(fc => fc && fc !== '');

  const highestClass = freightClasses.length > 0
    ? freightClasses.sort((a, b) => parseFloat(b!) - parseFloat(a!))[0]!
    : '100';

  // 为每个承运商生成报价
  const carrierQuotes: CarrierQuote[] = CARRIERS
    .filter(carrier => carrier.active)
    .map(carrier => {
      const baseRate = calculateFreightRate(
        carrier,
        distance,
        totals.totalWeight,
        highestClass,
        accessorialServices
      );

      // 计算附加服务费用
      const accessorialCost = accessorialServices.length * 50; // 简化计算

      // 燃油附加费（约15%）
      const fuelSurcharge = baseRate * 0.15;

      const totalCost = baseRate + fuelSurcharge;

      // 预估运输天数
      const transitDays = Math.ceil(distance / 500) + 1; // 假设每天500英里

      return {
        carrierId: carrier.id,
        carrierName: carrier.name,
        carrierCode: carrier.code,
        serviceType: 'STANDARD RATE',
        rate: Math.round(baseRate * 100) / 100,
        transitDays,
        accessorials: Math.round(accessorialCost * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost); // 按价格排序

  return carrierQuotes;
}

// 初始化示例数据
export function initializeSampleData(): void {
  const existing = getAllQuotes();
  if (existing.length > 0) return; // 如果已有数据，不初始化

  const sampleQuotes: Quote[] = [
    {
      id: '229936-P1-001',
      customerId: 'cust001',
      customerName: 'ANKUN USA',
      reference: '60112795247',
      status: 'quoted',
      pickup: {
        date: '2026-01-02',
        timeStart: '13:00',
        timeEnd: '16:30',
        address: {
          companyName: 'AnkunUSA Inc.',
          addressLine1: '13215 Marlay Ave',
          city: 'Fontana',
          state: 'CA',
          zipCode: '92337',
          country: 'United States',
        },
        contact: {
          phoneNumber: '626-267-6130',
          phoneCountryCode: 'US (+1)',
          contactName: 'Lucy He',
          email: 'office@ankunusa.com',
          fax: 'WF9403-112-08/7475-9255458',
        },
        services: {
          residentialPickup: false,
          liftgatePickup: false,
          limitedAccessPickup: false,
        },
      },
      delivery: {
        timeStart: '08:00',
        timeEnd: '17:00',
        address: {
          companyName: 'Customer Inc.',
          addressLine1: '1234 Main St',
          city: 'Madera',
          state: 'CA',
          zipCode: '93636',
          country: 'United States',
        },
        contact: {
          phoneNumber: '555-123-4567',
          phoneCountryCode: 'US (+1)',
          contactName: 'John Doe',
          email: 'john@customer.com',
        },
        services: {
          deliveryAppointment: true,
          residentialDelivery: false,
          notifyConsignee: false,
          limitedAccessDelivery: false,
          liftgateDelivery: false,
          hazardousMaterial: false,
        },
      },
      items: [
        {
          handlingUnit: 'Pallet',
          pieces: 1,
          weight: 100,
          weightUnit: 'lbs',
          length: 48,
          width: 40,
          height: 50,
          dimensionUnit: 'in',
          freightClass: '65',
          description: 'General freight',
          density: 1.8,
        },
      ],
      itemOptions: {
        stackable: false,
        hazmat: false,
        used: false,
        machinery: false,
      },
      totals: {
        totalWeight: 100,
        totalLinearFeet: 4,
        totalPieces: 1,
      },
      createdAt: new Date('2026-01-02T10:00:00').toISOString(),
      createdBy: 'Allen Long',
      updatedAt: new Date('2026-01-02T10:00:00').toISOString(),
    },
  ];

  // 为示例数据生成承运商报价
  sampleQuotes.forEach(quote => {
    quote.carrierQuotes = generateCarrierQuotes(quote);
    quote.selectedCarrier = quote.carrierQuotes[0]; // 选择最便宜的
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleQuotes));
}
