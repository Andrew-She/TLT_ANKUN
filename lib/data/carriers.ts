import { Carrier } from '../types';

// 承运商数据库（模拟真实的货运公司）
export const CARRIERS: Carrier[] = [
  {
    id: 'ddpp',
    name: 'DEDICATED DELIVERY PROFESSIONALS, INC.',
    code: 'DDPP',
    scac: 'DDPP',
    services: ['LTL', 'Truckload', 'Expedited'],
    baseRatePerMile: 2.5,
    minimumCharge: 150,
    active: true,
  },
  {
    id: 'avrt',
    name: 'Averitt Express',
    code: 'AVRT',
    scac: 'AVRT',
    services: ['LTL', 'Truckload', 'Expedited', 'International'],
    baseRatePerMile: 2.3,
    minimumCharge: 140,
    active: true,
  },
  {
    id: 'rdfs',
    name: 'Roadrunner Freight Systems',
    code: 'RDFS',
    scac: 'RDFS',
    services: ['LTL', 'Truckload'],
    baseRatePerMile: 2.1,
    minimumCharge: 130,
    active: true,
  },
  {
    id: 'abfs',
    name: 'ABF Freight',
    code: 'ABFS',
    scac: 'ABFS',
    services: ['LTL', 'Truckload', 'Expedited'],
    baseRatePerMile: 2.4,
    minimumCharge: 145,
    active: true,
  },
  {
    id: 'odfl',
    name: 'Old Dominion Freight Line',
    code: 'ODFL',
    scac: 'ODFL',
    services: ['LTL', 'Expedited'],
    baseRatePerMile: 2.6,
    minimumCharge: 160,
    active: true,
  },
  {
    id: 'xpo',
    name: 'XPO Logistics',
    code: 'XPO',
    scac: 'XPOL',
    services: ['LTL', 'Truckload', 'Expedited', 'International'],
    baseRatePerMile: 2.4,
    minimumCharge: 150,
    active: true,
  },
  {
    id: 'fedex',
    name: 'FedEx Freight',
    code: 'FXFE',
    scac: 'FXFE',
    services: ['LTL', 'Expedited', 'International'],
    baseRatePerMile: 2.7,
    minimumCharge: 165,
    active: true,
  },
  {
    id: 'estes',
    name: 'Estes Express Lines',
    code: 'EXLA',
    scac: 'EXLA',
    services: ['LTL', 'Truckload', 'Expedited'],
    baseRatePerMile: 2.3,
    minimumCharge: 140,
    active: true,
  },
  {
    id: 'rlc',
    name: 'R+L Carriers',
    code: 'RLC',
    scac: 'RETL',
    services: ['LTL', 'Expedited'],
    baseRatePerMile: 2.2,
    minimumCharge: 135,
    active: true,
  },
  {
    id: 'saia',
    name: 'Saia LTL Freight',
    code: 'SAIA',
    scac: 'SAIA',
    services: ['LTL', 'Expedited'],
    baseRatePerMile: 2.5,
    minimumCharge: 155,
    active: true,
  },
];

// 根据距离和重量计算运费的简单算法
export function calculateFreightRate(
  carrier: Carrier,
  distance: number, // 英里
  weight: number, // 磅
  freightClass: string,
  accessorialServices: string[]
): number {
  // 基础运费 = 距离 * 每英里费率
  let baseRate = distance * (carrier.baseRatePerMile || 2.0);

  // 应用最低收费
  if (baseRate < (carrier.minimumCharge || 100)) {
    baseRate = carrier.minimumCharge || 100;
  }

  // 重量系数
  const weightFactor = weight / 1000; // 每1000磅
  baseRate *= (1 + weightFactor * 0.1);

  // 运费等级系数
  const classMultipliers: { [key: string]: number } = {
    '50': 0.8,
    '55': 0.85,
    '60': 0.9,
    '65': 0.95,
    '70': 1.0,
    '77.5': 1.05,
    '85': 1.1,
    '92.5': 1.15,
    '100': 1.2,
    '110': 1.25,
    '125': 1.3,
    '150': 1.4,
    '175': 1.5,
    '200': 1.6,
    '250': 1.75,
    '300': 1.9,
    '400': 2.1,
    '500': 2.3,
  };

  const classMultiplier = classMultipliers[freightClass] || 1.0;
  baseRate *= classMultiplier;

  // 附加服务费用
  let accessorialCost = 0;
  const accessorialRates: { [key: string]: number } = {
    liftgatePickup: 75,
    liftgateDelivery: 75,
    residentialPickup: 85,
    residentialDelivery: 85,
    limitedAccessPickup: 65,
    limitedAccessDelivery: 65,
    deliveryAppointment: 50,
    notifyConsignee: 25,
    hazardousMaterial: 150,
  };

  accessorialServices.forEach(service => {
    accessorialCost += accessorialRates[service] || 0;
  });

  // 总费用
  const total = baseRate + accessorialCost;

  // 添加一些随机变化（±5%）使每个承运商的报价略有不同
  const variance = 1 + (Math.random() * 0.1 - 0.05);

  return Math.round(total * variance * 100) / 100;
}

// 计算两个邮编之间的大致距离（简化版本）
export function calculateDistance(zip1: string, zip2: string): number {
  // 这是一个非常简化的距离计算
  // 实际应用中应该使用真实的地理位置API
  const zipDiff = Math.abs(parseInt(zip1) - parseInt(zip2));

  // 粗略估算：每个邮编差异约等于10-50英里
  return Math.min(zipDiff * 15 + Math.random() * 100, 3000);
}
