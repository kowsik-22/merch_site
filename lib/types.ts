export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
};

export type OrderLineItem = {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  priceInRupees: number;
};
