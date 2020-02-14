export interface product {
  name: string;
  col: string;
  path: string;
  price: number;
}

export const PRODUCTS: product[] = [
    {
      name: 'Skis/Snowboard',
      col: '1',
      path: 'assets/svg/Skis.svg',
      price: 3
    },
    {
      name: 'Carry-On Suitcase',
      col: '1',
      path: 'assets/svg/Snowboard.svg',
      price: 3
    },
    {
      name: 'Bicycle',
      col: '1',
      path: 'assets/svg/Bicycle.svg',
      price: 8,
    },
    {
      name: 'Check-In Suitcase',
      col: '1',
      path: 'assets/svg/Small.svg',
      price: 2,
    },
    {
      name: 'Duffle Bag',
      col: '2',
      path: 'assets/svg/Medium.svg',
      price: 4,
    },
    {
      name: 'Large Duffle Bag',
      col: '2',
      path: 'assets/svg/Large.svg',
      price: 6,
    },
    {
      name: 'Cube Mini Fridge',
      col: '2',
      path: 'assets/svg/XL.svg',
      price: 8,
    },
    {
      name: 'Mini Fridge',
      col: '2',
      path: 'assets/svg/XXL.svg',
      price: 10,
    },
  ];
