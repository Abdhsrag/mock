// Top Selling Products Mock Data sourced from:
// "A:\ConnectO\TEMP\abdo\New Update Features\top-selling-products-api.md"

export const topSellingEgyptMock = {
  success: true,
  data: {
    scope: "first_order_page_per_connected_platform_and_fbpi_warehouse",
    overview_interval_applied: false,
    country: "Egypt",
    marketplace: "EGY",
    applicable_platforms: ["amazon", "new_noon", "jumia"],
    fetched_at: "2026-09-23T15:02:14.700929Z",
    platforms: {
      amazon: {
        state: "ok",
        orders_sampled: 100,
        has_more: true,
        sample_created_from: "2026-09-07T18:02:46.749Z",
        sample_created_to: "2026-09-13T06:59:30.648Z",
        counted_units: 106,
        products: [
          {
            rank: 1,
            name: "M K Air Bubble Wrap Roll for Packing, 50cm Width, 100m Length",
            image_url: "https://m.media-amazon.com/images/I/61MRKqhak4L.jpg",
            sku: "BZG-13",
            barcode: null,
            asin: "B0969GG1XK",
            units_sold: 17,
            warehouses: []
          },
          {
            rank: 2,
            name: "Waterproof Bubble Wrap for Sealing (70cm X 80m)",
            image_url: "https://m.media-amazon.com/images/I/61WPFWx6aRL.jpg",
            sku: "BGZ-19",
            barcode: null,
            asin: "B0968Y6T89",
            units_sold: 14,
            warehouses: []
          },
          {
            rank: 3,
            name: "Generalia Clothes Drying Rack, Large 3-Tier Foldable Clothing Rail, Stainless Steel Laundry Garment Dryer Stand for Towels, Clothes, Shoes, Blue",
            image_url: "https://m.media-amazon.com/images/I/61nDr6DotXL.jpg",
            sku: "RK-04",
            barcode: null,
            asin: "B0CFG3LZ5P",
            units_sold: 12,
            warehouses: []
          },
          {
            rank: 4,
            name: "Al-Faridah Bubble Wrap Roll - 50 cm x 100 m",
            image_url: "https://m.media-amazon.com/images/I/61-VTer4nvL.jpg",
            sku: "BZG-18",
            barcode: null,
            asin: "B096MV5FZF",
            units_sold: 11,
            warehouses: []
          },
          {
            rank: 5,
            name: "M K Air Bubble Wrap Roll for Packing, 50cm Width, 100m Length",
            image_url: "https://m.media-amazon.com/images/I/61MRKqhak4L.jpg",
            sku: "BZG-20",
            barcode: null,
            asin: "B0969GG1XK",
            units_sold: 10,
            warehouses: []
          }
        ],
        unit_basis: "fulfilled_units_in_shipped_orders",
        query_created_after: "2024-09-24T15:02:11Z"
      },
      new_noon: {
        state: "ok",
        orders_sampled: 50,
        has_more: true,
        sample_created_from: "2026-09-20T21:56:30",
        sample_created_to: "2026-09-23T14:12:21",
        counted_units: 46,
        products: [
          {
            rank: 1,
            name: null,
            image_url: null,
            sku: "BZG-03",
            barcode: null,
            asin: null,
            units_sold: 6,
            warehouses: ["W00172296EG"]
          },
          {
            rank: 2,
            name: null,
            image_url: null,
            sku: "37098296A",
            barcode: null,
            asin: null,
            units_sold: 5,
            warehouses: ["W00172296EG"]
          },
          {
            rank: 3,
            name: null,
            image_url: null,
            sku: "Hub-100",
            barcode: null,
            asin: null,
            units_sold: 4,
            warehouses: ["W00172296EG"]
          },
          {
            rank: 4,
            name: null,
            image_url: null,
            sku: "Hub-201",
            barcode: null,
            asin: null,
            units_sold: 3,
            warehouses: ["W00172296EG"]
          },
          {
            rank: 5,
            name: null,
            image_url: null,
            sku: "49564881A",
            barcode: null,
            asin: null,
            units_sold: 2,
            warehouses: ["W00172296EG"]
          }
        ],
        unit_basis: "confirmed_shipped_items",
        warehouses_checked: 2,
        warehouses_total: 2,
        coverage: "active_fbpi_warehouses_only"
      },
      jumia: {
        state: "ok",
        orders_sampled: 18,
        has_more: false,
        sample_created_from: "2026-08-20T10:58:34Z",
        sample_created_to: "2026-09-23T07:29:01Z",
        counted_units: 16,
        products: [
          {
            rank: 1,
            name: "Portable Insulated Lunch Containers with Bag, Separate Stackable Lunch Container, Leakproof Stackable Stainless Steel Food Container, for Adult Men Women Kids, Insulated Bento Boxes (Beige)",
            image_url: "https://vendorcenter.jumia.com/product-set-images/2026/08/18/gvc.product.image.1787027986741.81ea579b-690a-4007-8c97-05a27f479cb8.jpeg",
            sku: "BG-01",
            barcode: null,
            asin: null,
            units_sold: 4,
            warehouses: []
          },
          {
            rank: 2,
            name: "Airfryer Pack of 50 Air Fryer Parchment Paper Liner Air Fryer Non-Stick Disposable Paper for Frying Pan, Oven, Microwave and Hot Air Fryer, Size 20 CM",
            image_url: "https://vendorcenter.jumia.com/product-set-images/2026/08/17/gvc.product.image.1787000205484.b4063ad5-c21b-4d94-81f1-caad9635e544.jpeg",
            sku: "PR-01",
            barcode: null,
            asin: null,
            units_sold: 3,
            warehouses: []
          },
          {
            rank: 3,
            name: "Bubble Wrap Roll, Heavy-Duty Protective Packaging for Shipping, Moving, and Storage, Roll of Bubble Wrap Size 100m",
            image_url: "https://vendorcenter.jumia.com/product-set-images/2026/08/18/gvc.product.image.1787077993869.a736fc68-3cc1-4fde-aed3-abc8dae8c4f3.jpeg",
            sku: "BZG-01",
            barcode: null,
            asin: null,
            units_sold: 2,
            warehouses: []
          },
          {
            rank: 4,
            name: "Digital Kitchen Scale, Stainless Steel Platform, 10 KG Capacity, 1g Accuracy, LCD Display, Multiple Unit Conversion",
            image_url: "https://vendorcenter.jumia.com/product-set-images/2026/08/17/gvc.product.image.1786995919697.c4f93961-ea11-4e41-a511-49353983c1b4.jpeg",
            sku: "SC-01",
            barcode: null,
            asin: null,
            units_sold: 2,
            warehouses: []
          },
          {
            rank: 5,
            name: "Premium Thick Padded Prayer Mat for Comfort Knees, Elegant Design Soft Plush Large Size Sponge 1.5cm, Attractive Royal Color, Beige",
            image_url: "https://vendorcenter.jumia.com/product-set-images/2026/09/05/gvc.product.image.1788587087774.5dc361bd-7202-4408-8b1b-8de99cd97d46.jpeg",
            sku: "MAT-01",
            barcode: null,
            asin: null,
            units_sold: 2,
            warehouses: []
          }
        ],
        unit_basis: "shipped_or_delivered_items",
        query_created_after: "2026-06-26T15:02:11Z"
      }
    }
  },
  cached: false
};

export const topSellingKsaMock = {
  success: true,
  data: {
    scope: "first_order_page_per_connected_platform_and_fbpi_warehouse",
    overview_interval_applied: false,
    country: "Saudi Arabia",
    marketplace: "KSA",
    applicable_platforms: ["amazon", "new_noon", "trendyol"],
    fetched_at: "2026-09-23T15:02:16.017474Z",
    platforms: {
      amazon: {
        state: "not_connected",
        products: []
      },
      new_noon: {
        state: "not_connected",
        products: []
      },
      trendyol: {
        state: "ok",
        orders_sampled: 36,
        has_more: false,
        sample_created_from: "2026-08-30T08:26:18.238000Z",
        sample_created_to: "2026-09-23T07:13:58.817000Z",
        counted_units: 31,
        products: [
          {
            rank: 1,
            name: "Complete and Balanced Rich in Chicken Adult Dry Cat Food  - 7.5 kg",
            image_url: "https://cdn.dsmcdn.com/ty1632/prod/QC/20250205/15/71cd239a-d098-3c93-9b2d-ff66045d8ccc/1_org_zoom.jpg",
            sku: null,
            barcode: "8694686406991",
            asin: null,
            units_sold: 5,
            warehouses: [],
            brand: "Beso",
            category: "Cat Foods",
            product_url: "https://www.trendyol.sa/en/abc/xyz-p-897681649?&merchantId=1191553&filterOverPriceListings=false"
          },
          {
            rank: 2,
            name: "with Chicken Light and Sterilized Adult Dry Cat Food - 2 kg",
            image_url: "https://cdn.dsmcdn.com/ty1607/prod/QC/20241124/15/603d0db2-6638-3f0e-85aa-16c753ba4b0f/1_org_zoom.jpg",
            sku: null,
            barcode: "8694686407189",
            asin: null,
            units_sold: 5,
            warehouses: [],
            brand: "Beso",
            category: "Cat Foods",
            product_url: "https://www.trendyol.sa/en/abc/xyz-p-877160042?&merchantId=1191553&filterOverPriceListings=false"
          },
          {
            rank: 3,
            name: "Complete and Balanced Rich in Chicken Dry Kitten Food - 15 kg",
            image_url: "https://cdn.dsmcdn.com/ty1650/prod/QC/20250318/11/c1fe0461-f642-335c-a6df-778f4b78f149/1_org_zoom.jpg",
            sku: null,
            barcode: "8694686406816",
            asin: null,
            units_sold: 3,
            warehouses: [],
            brand: "Beso",
            category: "Cat Foods",
            product_url: "https://www.trendyol.sa/en/abc/xyz-p-877159960?&merchantId=1191553&filterOverPriceListings=false"
          },
          {
            rank: 4,
            name: "Complete and Balanced Rich in Chicken Dry Kitten Food - 2 kg",
            image_url: "https://cdn.dsmcdn.com/ty1606/prod/QC/20241125/14/189c1f0d-9f2d-3171-87b4-545403494e42/1_org_zoom.jpg",
            sku: null,
            barcode: "8694686406809",
            asin: null,
            units_sold: 3,
            warehouses: [],
            brand: "Beso",
            category: "Cat Foods",
            product_url: "https://www.trendyol.sa/en/abc/xyz-p-877159922?&merchantId=1191553&filterOverPriceListings=false"
          },
          {
            rank: 5,
            name: "Adult Cat Food Rich in Chicken –Premium High Protein Cat Food for Healthy Growth & Immunity 1kg",
            image_url: "https://cdn.dsmcdn.com/ty1778/prod/QC_PREP/20251021/17/50fd8119-ac7f-32b4-8c12-635973de4c25/1_org_zoom.jpg",
            sku: null,
            barcode: "8694686406922",
            asin: null,
            units_sold: 2,
            warehouses: [],
            brand: "Beso",
            category: "Cat Foods",
            product_url: "https://www.trendyol.sa/en/abc/xyz-p-1033389822?&merchantId=1191553&filterOverPriceListings=false"
          }
        ],
        unit_basis: "shipped_or_delivered_line_quantity",
        requested_start_date: "2026-09-10T15:02:15.083306Z"
      }
    }
  },
  cached: false
};

export const topSellingUaeMock = {
  success: true,
  data: {
    scope: "first_order_page_per_connected_platform_and_fbpi_warehouse",
    overview_interval_applied: false,
    country: "United Arab Emirates",
    marketplace: "UAE",
    applicable_platforms: ["amazon", "new_noon", "trendyol"],
    fetched_at: "2026-09-23T15:02:18.120341Z",
    platforms: {
      amazon: {
        state: "ok",
        orders_sampled: 72,
        has_more: true,
        sample_created_from: "2026-09-12T10:14:22.000Z",
        sample_created_to: "2026-09-23T08:30:11.000Z",
        counted_units: 84,
        products: [
          {
            rank: 1,
            name: "Anker Soundcore Life P2 Mini True Wireless Earbuds, Deep Bass",
            image_url: "https://m.media-amazon.com/images/I/61kWB+elL9L._AC_SL1500_.jpg",
            sku: "ANK-LP2-BLK",
            barcode: "194644082353",
            asin: "B0996123XZ",
            units_sold: 15,
            warehouses: []
          },
          {
            rank: 2,
            name: "Stainless Steel Thermal Coffee Mug 500ml Leakproof Travel Tumbler",
            image_url: "https://m.media-amazon.com/images/I/61jC8K7W6zL._AC_SL1200_.jpg",
            sku: "TM-500-SLV",
            barcode: null,
            asin: "B08R9Z2M4N",
            units_sold: 11,
            warehouses: []
          },
          {
            rank: 3,
            name: "Ergonomic Memory Foam Mouse Pad with Wrist Rest Cushion",
            image_url: "https://m.media-amazon.com/images/I/71wF1c4G9aL._AC_SL1500_.jpg",
            sku: "MP-WR01",
            barcode: null,
            asin: "B07P92K11Q",
            units_sold: 9,
            warehouses: []
          }
        ],
        unit_basis: "fulfilled_units_in_shipped_orders",
        query_created_after: "2024-09-24T15:02:11Z"
      },
      new_noon: {
        state: "ok",
        orders_sampled: 38,
        has_more: false,
        sample_created_from: "2026-09-18T09:12:00",
        sample_created_to: "2026-09-23T11:45:00",
        counted_units: 34,
        products: [
          {
            rank: 1,
            name: null,
            image_url: null,
            sku: "DXB-9021",
            barcode: null,
            asin: null,
            units_sold: 8,
            warehouses: ["W00194820AE"]
          },
          {
            rank: 2,
            name: null,
            image_url: null,
            sku: "DXB-4410",
            barcode: null,
            asin: null,
            units_sold: 5,
            warehouses: ["W00194820AE"]
          }
        ],
        unit_basis: "confirmed_shipped_items",
        warehouses_checked: 1,
        warehouses_total: 1,
        coverage: "active_fbpi_warehouses_only"
      },
      trendyol: {
        state: "not_connected",
        products: []
      }
    }
  },
  cached: false
};

export const topSellingDatasets = {
  EGY: topSellingEgyptMock,
  KSA: topSellingKsaMock,
  UAE: topSellingUaeMock
};

export const platformMeta = {
  amazon: {
    name: 'Amazon',
    logo: '/assets/brands/amazon.svg',
    color: '#ff9900',
    bg: '#fff7ed',
    accent: '#ea580c',
    pillBg: '#fef3c7',
    pillText: '#92400e'
  },
  new_noon: {
    name: 'Noon FBPI',
    logo: null,
    color: '#eab308',
    bg: '#fefce8',
    accent: '#ca8a04',
    pillBg: '#fef08a',
    pillText: '#854d0e'
  },
  jumia: {
    name: 'Jumia',
    logo: '/assets/brands/jumia.svg',
    color: '#f97316',
    bg: '#fff7ed',
    accent: '#c2410c',
    pillBg: '#ffedd5',
    pillText: '#9a3412'
  },
  trendyol: {
    name: 'Trendyol',
    logo: null,
    color: '#f43f5e',
    bg: '#fff1f2',
    accent: '#e11d48',
    pillBg: '#ffe4e6',
    pillText: '#9f1239'
  }
};
