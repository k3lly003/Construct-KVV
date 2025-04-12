interface NavItem {
  label: string;
  items?: {
    title: string;
    description?: string;
    isPopular?: boolean;
    items: {
      name: string;
      isPopular?: boolean;
    }[];
  }[];
}

export const navItems: NavItem[] = [
    {
      label: 'Features',
      items: [
        {
          title: 'Planning',
          items: [
            { name: '3D Floor Plans', isPopular: true },
            { name: 'Takeoffs' },
            { name: 'Bid Management' },
            { name: 'Product Clipper & Library' },
            { name: 'Selections', isPopular: true },
            { name: 'CRM' },
            { name: 'Mood Boards' },
          ],
        },
        {
          title: 'Financials',
          items: [
            { name: 'Estimates' },
            { name: 'Proposals' },
            { name: 'Change Orders' },
            { name: 'Invoices' },
            { name: 'Online Payments' },
            { name: 'Financial Reports' },
            { name: 'QuickBooks Integration' },
          ],
        },
        {
          title: 'Project Management',
          items: [
            { name: 'Schedule', isPopular: true },
            { name: 'Task Management' },
            { name: 'Daily Logs' },
            { name: 'Procurement' },
            { name: 'Time & Expense Tracking' },
            { name: 'Client Dashboard' },
            { name: 'Subcontractor Dashboard' },
          ],
        },
        {
          title: 'Marketing',
          items: [
            { name: 'Custom Website' },
            { name: 'Email Marketing' },
            { name: 'Premium Profile' },
          ],
        },
      ],
    },
    {
      label: 'Who We Serve',
      items: [
        {
          title: 'Industries',
          items: [
            { name: 'General Contractors' },
            { name: 'Remodelers' },
            { name: 'Design-Build Firms' },
            { name: 'Custom Builders' },
            { name: 'Specialty Contractors' },
          ],
        },
      ],
    },
  ];
  