// 地址信息
export interface Address {
  companyName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// 联系信息
export interface ContactInfo {
  phoneNumber: string;
  phoneCountryCode: string;
  extension?: string;
  contactName: string;
  email: string;
  fax?: string;
  notes?: string;
}

// 货物项目
export interface FreightItem {
  handlingUnit: string;
  pieces: number;
  weight: number;
  weightUnit: string;
  length: number;
  width: number;
  height: number;
  dimensionUnit: string;
  freightClass?: string;
  nmfc?: string;
  description?: string;
  density?: number;
}

// 取货信息
export interface PickupInfo {
  date: string;
  timeStart?: string;
  timeEnd?: string;
  address: Address;
  contact: ContactInfo;
  services: {
    residentialPickup: boolean;
    liftgatePickup: boolean;
    limitedAccessPickup: boolean;
  };
}

// 送货信息
export interface DeliveryInfo {
  timeStart?: string;
  timeEnd?: string;
  address: Address;
  contact: ContactInfo;
  services: {
    deliveryAppointment: boolean;
    residentialDelivery: boolean;
    notifyConsignee: boolean;
    limitedAccessDelivery: boolean;
    liftgateDelivery: boolean;
    hazardousMaterial: boolean;
  };
}

// 承运商报价
export interface CarrierQuote {
  carrierId: string;
  carrierName: string;
  carrierCode: string;
  serviceType: string; // STANDARD RATE, EXPEDITED, etc.
  rate: number;
  transitDays?: number;
  accessorials: number;
  totalCost: number;
}

// 询价单
export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  reference?: string;
  status: 'draft' | 'quoted' | 'booked' | 'in_transit' | 'delivered' | 'cancelled';

  pickup: PickupInfo;
  delivery: DeliveryInfo;

  items: FreightItem[];
  itemOptions: {
    stackable: boolean;
    hazmat: boolean;
    used: boolean;
    machinery: boolean;
  };

  totals: {
    totalWeight: number;
    totalLinearFeet: number;
    totalPieces: number;
  };

  carrierQuotes?: CarrierQuote[];
  selectedCarrier?: CarrierQuote;

  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

// 承运商信息
export interface Carrier {
  id: string;
  name: string;
  code: string;
  scac: string;
  services: string[];
  baseRatePerMile?: number;
  minimumCharge?: number;
  active: boolean;
}

// 客户信息
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}
