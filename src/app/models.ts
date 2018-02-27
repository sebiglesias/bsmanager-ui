export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  password: string;
  taxNum: string;
  address: string;
  birthday: Date;
  email: string;
  telephone: string;
  admin: boolean;
}

export interface FormattedUser {
  id: string;
  name: string;
  taxNum: string;
  address: string;
  birthday: string;
  email: string;
  telephone: string;
  groups: string;
  stores: string;
}

export interface Product {
  id?: number;
  code: string;
  name: string;
  cost: number;
  price: number;
  infoUrl: string;
  longDescription: string;
  shortDescription: string;
  model: string;
  series: string;
  brand: Brand;
  categories: Category[];
  measure: Measure;
  quantity: number;
}

export interface IndividualProduct {
  id?: number;
  sale_price: number;
  product: Product;
}

export interface Brand {
  id?: number;
  name: string;
  infoUrl: string;
  observations: string;
}

export interface Category {
  id?: number;
  plural_name: string;
  singular_name: string;
}

export interface Measure {
  id?: number;
  name: string;
  abbreviation: string;
}

export interface Order {
  id?: number;
  sale: boolean;
  employee: string;
  external: string;
  payment: string;
  items: number;
  date: Date;
  price: number;
}

export interface OrderDetail {
  id?: number;
  order: Order;
  product: Product;
  quantity: number;
  price: number;
}

export interface StockXls {
  code: number;
  units: number;
  product: Product;
}

export enum PaymentOptions {
  'CASH',
  'DEBIT',
  'CREDIT',
  'BANK'
}
