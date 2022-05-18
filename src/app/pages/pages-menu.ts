import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home-outline',
    link: '/pages/home',
    home: true,
  },
  {
    title: 'PUBLIC KEY',
    icon: 'star',
    expanded: true,
    children: [
      {
        title: 'RSA',
        link: '/pages/publica/rsa',
        icon: 'unlock',
      },
      {
        title: 'Rabin',
        link: '/pages/publica/rabin',
        icon: 'unlock'
      },
      {
        title: 'ElGamal',
        link: '/pages/publica/elgamal',
        icon: 'unlock'
      },
      {
        title: 'Menezes-Vanstone',
        link: '/pages/publica/elgamalMV',
        icon: 'unlock'
      },
      {
        title: 'Digital Sign (ElGamal)',
        link: '/pages/publica/elGammalSign',
        icon: 'book-open'
      },
      {
        title: 'Digital Sign (RSA)',
        link: '/pages/publica/RSASign',
        icon: 'book-open'
      }
    ]
  },
  {
    title: 'Tables & Data',
    icon: 'grid-outline',
    hidden: true,
    children: [
      {
        title: 'Smart Table',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'Tree Grid',
        link: '/pages/tables/tree-grid',
      },
    ],
  },
  {
    title: 'Miscellaneous',
    icon: 'shuffle-2-outline',
    hidden: true,
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
];
