interface GuideItem {
  details: boolean;
  title: string;
  description: string;
  link: string;
}

export interface HelpProps {
  backgroundImage: string;
  heading?: string;
  title: string;
  guideData: GuideItem[];
  description?: string;
  link?: string;
}

export const HelpData: Omit<HelpProps, 'guideData'> & { guideData: GuideItem[] } = {
  backgroundImage: "./support.webp",
  title: "Help Center",
  heading: "Helpful Guides & Resources",
  guideData: [
    {
        title: 'Placing Your Order',
        description: 'Learn how to easily browse our catalog and complete your construction material order. complete your construction material order.',
        link: '/help/ordering',
        details: false
    },
    {
        title: 'Delivery & Shipping',
        description: 'Find information about our delivery options, shipping costs, and estimated timelines for construction sites.',
        link: '/help/delivery',
        details: false
    },
    {
        title: 'Payment Options',
        description: 'Explore the various secure payment methods we accept for your construction supply purchases.',
        link: '/help/payment',
        details: false
    },
    {
        title: 'Returns & Exchanges',
        description: 'Understand our policy on returns and exchanges for construction materials that don\'t meet your needs.',
        link: '/help/returns',
        details: false
    },
    {
        title: 'Account Management',
        description: 'Manage your profile, track your orders, and update your information on our platform.',
        link: '/help/account',
        details: false
    },
    {
        title: 'Product Information',
        description: 'Get detailed specifications and usage guides for our range of construction products.',
        link: '/help/products',
        details: false
    },
  ],
};