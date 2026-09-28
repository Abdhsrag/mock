export const overviewMock = {
  totals: {
    totalSales: 16420300,
    orderCount: 842,
    averageOrderValue: 19498,
  },
  pendingOrders: 74,
  statusBreakdown: [
    { name: 'Delivered', value: 603, color: '#10b981' },
    { name: 'Shipped', value: 112, color: '#2563eb' },
    { name: 'Pending', value: 74, color: '#f59e0b' },
    { name: 'Canceled', value: 31, color: '#ef4444' },
    { name: 'Returned', value: 22, color: '#8b5cf6' },
  ],
  deliveryBreakdown: [
    { name: 'Door delivery', value: 496, color: '#2563eb' },
    { name: 'Pickup station', value: 268, color: '#10b981' },
    { name: 'Express delivery', value: 78, color: '#f59e0b' },
  ],
  regions: [
    { name: 'Cairo', value: 312 },
    { name: 'Giza', value: 184 },
    { name: 'Alexandria', value: 121 },
    { name: 'Dakahlia', value: 96 },
    { name: 'Sharqia', value: 72 },
    { name: 'Other', value: 57 },
  ],
  trend: [31, 44, 37, 55, 51, 63, 68, 54, 59, 79, 64, 52, 67, 60, 88, 75, 74, 96, 84, 102, 109, 91, 90, 123, 121, 136, 107, 107, 125, 118, 132, 158, 177],
  topProducts: [
    { name: 'Oraimo FreePods 4', sku: 'ORA-FP4', category: 'Electronics', units: 245, orders: 221, sales: 2695000, color: '#eef2ff', symbol: '🎧' },
    { name: 'Infinix Hot 40', sku: 'INX-H40', category: 'Mobile Phones', units: 198, orders: 187, sales: 5128200, color: '#ecfeff', symbol: '📱' },
    { name: 'itel 32” HD TV', sku: 'ITL-32HD', category: 'Electronics', units: 156, orders: 142, sales: 3104400, color: '#fff7ed', symbol: '📺' },
    { name: 'Midea 1.5HP Air Conditioner', sku: 'MDA-15HP', category: 'Home & Kitchen', units: 134, orders: 129, sales: 2010000, color: '#eff6ff', symbol: '❄️' },
    { name: 'Nivea Body Lotion 400ml', sku: 'NIV-BL400', category: 'Health & Beauty', units: 112, orders: 106, sales: 1568000, color: '#fdf2f8', symbol: '🧴' },
  ],
};

const amazonOrderSeeds = [
  { id: '114-5839201-2763428', date: '2026-09-27T13:42:00', status: 'unshipped', customerName: 'Mariam Hassan', customerEmail: 'mariam.h@example.com', total: 2398, currency: 'EGP', fulfillment: 'MFN', itemCount: 2, payment: 'Other', items: [{ title: 'Oraimo FreePods 4', sku: 'ORA-FP4-BLK', asin: 'B0C8F4P2Q1', quantity: 1, price: 1499 }, { title: 'Oraimo Power Bank 20,000mAh', sku: 'ORA-PB20', asin: 'B0D2K7Q8M4', quantity: 1, price: 899 }] },
  { id: '112-0736154-8391207', date: '2026-09-27T11:18:00', status: 'pending', customerName: 'Omar Saleh', customerEmail: 'omar.s@example.com', total: 7499, currency: 'EGP', fulfillment: 'AFN', itemCount: 1, payment: 'Other', items: [{ title: 'Infinix Hot 40, 256GB', sku: 'INX-H40-256', asin: 'B0D5H4T40X', quantity: 1, price: 7499 }] },
  { id: '113-8419053-6021740', date: '2026-09-26T17:03:00', status: 'shipped', customerName: 'Lina Mostafa', customerEmail: 'lina.m@example.com', total: 1599, currency: 'EGP', fulfillment: 'MFN', itemCount: 1, payment: 'COD', items: [{ title: 'Anker Soundcore Mini 3', sku: 'ANK-SM3-BLK', asin: 'B09Q8Y2K7T', quantity: 1, price: 1599 }] },
  { id: '111-2083741-9562308', date: '2026-09-26T09:26:00', status: 'delivered', customerName: 'Karim Nabil', customerEmail: 'karim.n@example.com', total: 597, currency: 'EGP', fulfillment: 'AFN', itemCount: 1, payment: 'Other', items: [{ title: 'Baseus USB-C Cable 2m', sku: 'BAS-CAB-2M', asin: 'B0B7S2H5Z8', quantity: 3, price: 597 }] },
  { id: '114-7632019-4251106', date: '2026-09-25T15:51:00', status: 'unshipped', customerName: 'Noor Ibrahim', customerEmail: 'noor.i@example.com', total: 17999.0, currency: 'EGP', fulfillment: 'MFN', itemCount: 1, payment: 'Other', items: [{ title: 'Midea 1.5HP Air Conditioner', sku: 'MDA-15HP-AC', asin: 'B0D1M1DEA5', quantity: 1, price: 17999 }] },
  { id: '112-5918073-3440981', date: '2026-09-25T08:14:00', status: 'shipped', customerName: 'Youssef Adel', customerEmail: 'y.adel@example.com', total: 229, currency: 'EGP', fulfillment: 'AFN', itemCount: 1, payment: 'Other', items: [{ title: 'Nivea Body Lotion 400ml', sku: 'NIV-BL400', asin: 'B08N1VEA40', quantity: 1, price: 229 }] },
  { id: '113-0951836-6643907', date: '2026-09-24T19:37:00', status: 'cancelled', customerName: 'Salma Atef', customerEmail: 'salma.a@example.com', total: 1699.0, currency: 'EGP', fulfillment: 'MFN', itemCount: 1, payment: 'Other', items: [{ title: 'Oraimo FreePods 4', sku: 'ORA-FP4-WHT', asin: 'B0C8F4P2Q2', quantity: 1, price: 1699 }] },
  { id: '114-4478203-8142269', date: '2026-09-24T12:11:00', status: 'delivered', customerName: 'Hany Fawzy', customerEmail: 'hany.f@example.com', total: 3499.0, currency: 'EGP', fulfillment: 'AFN', itemCount: 1, payment: 'Other', items: [{ title: 'itel 32” HD TV', sku: 'ITL-32HD-TV', asin: 'B0D3ITEL32H', quantity: 1, price: 3499 }] },
  { id: '111-6031729-5568142', date: '2026-09-23T16:48:00', status: 'pending', customerName: 'Dina Samir', customerEmail: 'dina.e@example.com', total: 1499, currency: 'EGP', fulfillment: 'MFN', itemCount: 1, payment: 'COD', items: [{ title: 'Oraimo FreePods 4', sku: 'ORA-FP4-BLK', asin: 'B0C8F4P2Q1', quantity: 1, price: 1499 }] },
  { id: '112-8326174-2491058', date: '2026-09-22T10:29:00', status: 'delivered', customerName: 'Tarek Mostafa', customerEmail: 't.mostafa@example.com', total: 1798, currency: 'EGP', fulfillment: 'AFN', itemCount: 2, payment: 'Other', items: [{ title: 'Anker Soundcore Mini 3', sku: 'ANK-SM3-BLK', asin: 'B09Q8Y2K7T', quantity: 1, price: 1599 }, { title: 'Baseus USB-C Cable 2m', sku: 'BAS-CAB-2M', asin: 'B0B7S2H5Z8', quantity: 1, price: 199 }] },
  { id: '113-1749206-0358187', date: '2026-09-21T14:02:00', status: 'delivered', customerName: 'Nada Emad', customerEmail: 'nada.e@example.com', total: 229.0, currency: 'EGP', fulfillment: 'AFN', itemCount: 1, payment: 'Other', items: [{ title: 'Nivea Body Lotion 400ml', sku: 'NIV-BL400', asin: 'B08N1VEA40', quantity: 1, price: 229 }] },
  { id: '114-6092187-7104382', date: '2026-09-20T11:54:00', status: 'shipped', customerName: 'Amr Khaled', customerEmail: 'amr.k@example.com', total: 7499.0, currency: 'EGP', fulfillment: 'MFN', itemCount: 1, payment: 'Other', items: [{ title: 'Infinix Hot 40, 256GB', sku: 'INX-H40-256', asin: 'B0D5H4T40X', quantity: 1, price: 7499 }] },
  { id: '112-7471206-1238409', date: '2026-09-19T17:22:00', status: 'delivered', customerName: 'Heba Saeed', customerEmail: 'heba.s@example.com', total: 899, currency: 'EGP', fulfillment: 'AFN', itemCount: 1, payment: 'Other', items: [{ title: 'Oraimo Power Bank 20,000mAh', sku: 'ORA-PB20', asin: 'B0D2K7Q8M4', quantity: 1, price: 899 }] },
];

const mockShippingAddresses = [
  ['Mariam Hassan', '15 El-Merghany St.', 'Heliopolis', 'Cairo', '11341'],
  ['Omar Saleh', '22 Ahmed Orabi St.', 'Mohandessin', 'Giza', '12411'],
  ['Lina Mostafa', '8 Fouad St.', 'Downtown', 'Alexandria', '21512'],
  ['Karim Nabil', '31 Abbas El-Akkad St.', 'Nasr City', 'Cairo', '11765'],
  ['Noor Ibrahim', '5 El-Tahrir St.', 'Dokki', 'Giza', '12611'],
  ['Youssef Adel', '14 El-Gomhoreya St.', 'Mansoura', 'Dakahlia', '35511'],
  ['Salma Atef', '19 El-Nasr St.', 'Maadi', 'Cairo', '11742'],
  ['Hany Fawzy', '7 Mostafa Kamel St.', 'Sidi Gaber', 'Alexandria', '21615'],
  ['Dina Samir', '12 Makram Ebeid St.', 'Nasr City', 'Cairo', '11759'],
  ['Tarek Mostafa', '4 Taha Hussein St.', 'Zamalek', 'Cairo', '11211'],
  ['Nada Emad', '10 Saad Zaghloul St.', 'Smouha', 'Alexandria', '21648'],
  ['Amr Khaled', '26 Lebanon St.', 'Mohandessin', 'Giza', '12411'],
  ['Heba Saeed', '3 El-Horreya St.', 'Sidi Gaber', 'Alexandria', '21617'],
];

export const amazonOrdersMock = amazonOrderSeeds.map((order, index) => {
  const [name, line1, line2, city, postalCode] = mockShippingAddresses[index];
  const isShipped = ['shipped', 'delivered'].includes(order.status);
  return {
    ...order,
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    companyName: order.id === '112-8326174-2491058' ? 'Tarek Mostafa Trading' : undefined,
    purchaseOrderNumber: order.id === '112-8326174-2491058' ? 'PO-2026-0922' : undefined,
    shippingAddress: { name, line1, line2, city, state: city, postalCode, country: 'EG', phone: '+20 100 000 0000' },
    items: order.items.map((item) => ({ ...item, currency: order.currency, quantityShipped: isShipped ? item.quantity : 0 })),
  };
});

const amazonListingSeeds = [
  { sku: 'ORA-FP4-BLK', asin: 'B0C8F4P2Q1', title: 'Oraimo FreePods 4 Wireless Earbuds with 35-Hour Playtime, Black', category: 'Electronics', productType: 'HEADPHONES', condition: 'New', fulfillmentChannel: 'DEFAULT', price: 1499, currency: 'EGP', quantity: 42, status: 'BUYABLE', created: '2026-07-14', updated: '2026-09-27', color: '#eef2ff', symbol: '🎧', issues: [] },
  { sku: 'INX-H40-256', asin: 'B0D5H4T40X', title: 'Infinix Hot 40 Smartphone, 256GB, 8GB RAM, Starlit Black', category: 'Mobile Phones', productType: 'SMARTPHONE', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-07-11', price: 7499, currency: 'EGP', quantity: 16, status: 'BUYABLE', updated: '2026-09-26', color: '#ecfeff', symbol: '📱', issues: [] },
  { sku: 'ITL-32HD-TV', asin: 'B0D3ITEL32H', title: 'itel 32-inch HD LED TV with Dolby Audio and HDMI', category: 'Televisions', productType: 'TELEVISION', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-06-19', price: 3499, currency: 'EGP', quantity: 0, status: 'DISCOVERABLE', updated: '2026-09-25', color: '#fff7ed', symbol: '📺', issues: ['Quantity is zero'] },
  { sku: 'MDA-15HP-AC', asin: 'B0D1M1DEA5', title: 'Midea 1.5HP Split Air Conditioner, Energy Saving, White', category: 'Home & Kitchen', productType: 'AIR_CONDITIONER', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-06-24', price: 17999, currency: 'EGP', quantity: 8, status: 'BUYABLE', updated: '2026-09-24', color: '#eff6ff', symbol: '❄️', issues: [] },
  { sku: 'NIV-BL400', asin: 'B08N1VEA40', title: 'Nivea Nourishing Body Lotion, 400 ml, Deep Moisture', category: 'Beauty', productType: 'BODY_MOISTURIZER', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-05-20', price: 229, currency: 'EGP', quantity: 61, status: 'BUYABLE', updated: '2026-09-23', color: '#fdf2f8', symbol: '🧴', issues: [] },
  { sku: 'ANK-SM3-BLK', asin: 'B09Q8Y2K7T', title: 'Anker Soundcore Mini 3 Portable Bluetooth Speaker, Black', category: 'Electronics', productType: 'PORTABLE_ELECTRONIC_DEVICE', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-05-28', price: 1599, currency: 'EGP', quantity: 5, status: 'BUYABLE', updated: '2026-09-22', color: '#f0fdf4', symbol: '🔊', issues: [] },
  { sku: 'BAS-CAB-2M', asin: 'B0B7S2H5Z8', title: 'Baseus USB-C to USB-C Cable, 100W Fast Charging, 2m', category: 'Accessories', productType: 'CABLE', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-06-08', price: 199, currency: 'EGP', quantity: 0, status: 'DISCOVERABLE', updated: '2026-09-21', color: '#f8fafc', symbol: '🔌', issues: ['Missing main image'] },
  { sku: 'ORA-PB20', asin: 'B0D2K7Q8M4', title: 'Oraimo Power Bank 20,000mAh, 22.5W Fast Charging', category: 'Accessories', productType: 'POWER_BANK', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-06-05', price: 899, currency: 'EGP', quantity: 24, status: 'BUYABLE', updated: '2026-09-20', color: '#fefce8', symbol: '🔋', issues: [] },
  { sku: 'SAMS-A15-128', asin: 'B0D9SAMA15X', title: 'Samsung Galaxy A15, 128GB, 6GB RAM, Blue Black', category: 'Mobile Phones', productType: 'SMARTPHONE', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-04-18', price: 6999, currency: 'EGP', quantity: 13, status: 'BUYABLE', updated: '2026-09-18', color: '#eff6ff', symbol: '📱', issues: [] },
  { sku: 'XIA-RB13', asin: 'B0D6XIA13A2', title: 'Xiaomi Redmi Buds 5 Lite, White', category: 'Electronics', productType: 'HEADPHONES', condition: 'New', fulfillmentChannel: 'DEFAULT', created: '2026-04-29', price: 699, currency: 'EGP', quantity: 31, status: 'BUYABLE', updated: '2026-09-17', color: '#f5f3ff', symbol: '🎵', issues: [] },
];

export const localImage = (symbol, title, background) => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><rect width="640" height="480" rx="36" fill="' + background + '"/><circle cx="320" cy="218" r="116" fill="#ffffff" opacity=".82"/><text x="320" y="260" text-anchor="middle" font-size="128">' + symbol + '</text><text x="320" y="410" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#475569">' + title.replace(/[<>&]/g, '') + '</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

// Use the same normalized fields as the dashboard's Amazon listing adapter.
export const amazonListingsMock = amazonListingSeeds.map((listing) => {
  const imageUrl = localImage(listing.symbol, listing.title, listing.color);
  const isBuyable = listing.status === 'BUYABLE';
  const isDiscoverable = listing.status === 'DISCOVERABLE';
  const issues = listing.issues.map((message) => ({ severity: 'WARNING', message, enforcement: null }));
  return {
    ...listing,
    condition: 'new_new',
    status: [listing.status],
    isBuyable,
    isDiscoverable,
    price: { amount: listing.price, currency: listing.currency },
    image: { url: imageUrl, width: 640, height: 480 },
    images: [{ url: imageUrl, variant: 'MAIN' }],
    issues,
    hasErrors: false,
    hasWarnings: issues.length > 0,
    createdAt: listing.created,
    updatedAt: listing.updated,
    marketplaceId: 'ARBP9OOSHTCHU',
  };
});
