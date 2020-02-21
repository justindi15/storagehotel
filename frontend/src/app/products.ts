export interface product {
  name: string;
  plan_id: string;
  col: string;
  path: string;
  price: number;
}

export const storagebox: product = {
  name: 'storagehotel large box',
  plan_id: 'box',
  col: '0',
  path: 'assets/item-icons/box-icon.png',
  price: 15
}

export const PRODUCTS: product[] = [
    {
      name: 'Bicycle',
      plan_id: 'bicycle',
      col: '1',
      path: 'assets/svg/Bicycle.svg',
      price: 20,
    },
    {
      name: 'Carry-On Suitcase',
      plan_id: 'carry-on',
      col: '1',
      path: 'assets/item-icons/carry-on-icon.png',
      price: 15
    },
    {
      name: 'Cube Mini Fridge',
      plan_id: 'cube-mini-fridge',
      col: '1',
      path: 'assets/item-icons/cube-fridge-icon.png',
      price: 15,
    },
    {
      name: 'Duffle Bag',
      plan_id: 'duffle',
      col: '1',
      path: 'assets/item-icons/duffle-icon.png',
      price: 15,
    },
    {
      name: 'Skis/Snowboard',
      plan_id: 'skis-snowboard',
      col: '2',
      path: 'assets/item-icons/skis-icon.png',
      price: 20
    },
    {
      name: 'Check-In Suitcase',
      plan_id: 'check-in',
      col: '2',
      path: 'assets/item-icons/check-in-icon.png',
      price: 25,
    },
    {
      name: 'Mini Fridge',
      plan_id: 'mini-fridge',
      col: '2',
      path: 'assets/item-icons/mini-fridge-icon.png',
      price: 25,
    },
    {
      name: 'Large Duffle Bag',
      plan_id: 'large-duffle',
      col: '2',
      path: 'assets/item-icons/large-duffle-icon.png',
      price: 25,
    },
  ];
