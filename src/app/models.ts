export interface Group {
  id?: number;
  name: string;
  stores: boolean;
  groups: boolean;
  products: boolean;
  users: boolean;
  brands: boolean;
  categories: boolean;
  units: boolean;
}
export interface User {
  id?: number;
  name: string;
  cuit: string;
  address: string;
  birthday: Date;
  email: string;
  telephone: string;
  groups: Group[];
}

export interface Store {
  id?: number;
  name: string;
  address: string;
}

export interface Product {
  id?: number;
  code: string;
  name: string;
  cost_after_tax: number;
  cost_before_tax: number;
  info_url: string;
  long_description: string;
  short_description: string;
  model: string;
  series: string;
  brand: Brand;
  category: Category;
  unit: Unit;
}

export interface IndividualProduct {
  id?: number;
  sale_price: number;
  product: Product;
  store: Store;
}

export interface Brand {
  id?: number;
  name: string;
  infourl: string;
  observations: string;
  supplier: User;
}

export interface Category {
  id?: number;
  plural_name: string;
  singular_name: string;
}

export interface Unit {
  id?: number;
  name: string;
}
