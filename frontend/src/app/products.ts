export interface product {
  name: string;
  category: string;
  path: string;
  space: number;
}

export const PRODUCTS: product[] = [
    {
      name: 'Skis',
      category: 'items',
      path: 'assets/svg/Skis.svg',
      space: 3
    },
    {
      name: 'Snowboard',
      category: 'items',
      path: 'assets/svg/Snowboard.svg',
      space: 3
    },
    {
      name: 'Bicycle',
      category: 'items',
      path: 'assets/svg/Bicycle.svg',
      space: 8,
    },
    {
      name: 'Small',
      category: 'size',
      path: 'assets/svg/Small.svg',
      space: 2,
    },
    {
      name: 'Medium',
      category: 'size',
      path: 'assets/svg/Medium.svg',
      space: 4,
    },
    {
      name: 'Large',
      category: 'size',
      path: 'assets/svg/Large.svg',
      space: 6,
    },
    {
      name: 'XL',
      category: 'size',
      path: 'assets/svg/XL.svg',
      space: 8,
    },
    {
      name: 'XXL',
      category: 'size',
      path: 'assets/svg/XXL.svg',
      space: 10,
    },
  ];
