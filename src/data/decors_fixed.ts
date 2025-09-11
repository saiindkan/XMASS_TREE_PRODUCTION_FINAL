// Christmas Decor Products Data
interface ColorOption {
  name: string;
  code: string;
  images: string[];
  inStock: boolean;
}

interface DecorItem {
  id: number;
  name: string;
  category: string;
  material: string;
  price: number;
  badge?: string;
  description: string;
  colorOptions: ColorOption[];
  defaultColor: string;
}

const decors: DecorItem[] = [
  // Ornaments Collection
  {
    id: 101,
    name: "Plush Character Ornaments Set",
    category: "Ornaments",
    material: "Plush",
    price: 34.99,
    badge: "Best Seller",
    description: "Adorable plush character ornaments featuring classic Christmas figures. Each piece is handcrafted with soft, huggable fabric and detailed stitching.",
    defaultColor: "multi",
    colorOptions: [
      {
        name: "Multi-Color",
        code: "multi",
        images: [
          "/decor-images/1e7797736fea487b82e026c589677820.jpg",
          "/decor-images/41a38553b135437c82764679aa3d009f.jpg",
          "/decor-images/4cd2131ea5e84e819478c3dcc6b7747a.jpg"
        ],
        inStock: true
      },
      {
        name: "Red & Green",
        code: "red-green",
        images: [
          "/decor-images/IMG-20250822-WA0024.jpg",
          "/decor-images/IMG-20250822-WA0025.jpg"
        ],
        inStock: true
      }
    ]
  },
  {
    id: 102,
    name: "Glitter Snowflake Ornament Collection",
    category: "Ornaments",
    material: "Glass/Plastic",
    price: 24.99,
    description: "Elegant snowflake ornaments that add a touch of winter magic to your tree. Each piece features intricate designs and sparkling glitter.",
    defaultColor: "silver",
    colorOptions: [
      {
        name: "Silver/Blue",
        code: "silver",
        images: [
          "/decor-images/4e454c0cbd2c4da4ac5e381d1e01681e.jpg",
          "/decor-images/5c2fb62590c043db9b6bc85248004f2c.jpg"
        ],
        inStock: true
      },
      {
        name: "Gold/Red",
        code: "gold",
        images: [
          "/decor-images/IMG-20250822-WA0026.jpg",
          "/decor-images/IMG-20250822-WA0027.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Tree Toppers
  {
    id: 201,
    name: "Premium Angel Tree Topper",
    category: "Tree Toppers",
    material: "Fabric/Metal",
    price: 49.99,
    badge: "Premium",
    description: "A stunning angel tree topper with flowing fabric and delicate details. The perfect finishing touch for your Christmas tree.",
    defaultColor: "white-gold",
    colorOptions: [
      {
        name: "White/Gold",
        code: "white-gold",
        images: [
          "/decor-images/73e0678758a34141b5317c2d0f29640d.jpg",
          "/decor-images/7a6270c42c0247cb9f4e1a88023974b1.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Wreaths
  {
    id: 301,
    name: "Luxury Holiday Wreath Collection",
    category: "Wreaths",
    material: "Mixed Greenery",
    price: 59.99,
    description: "Handcrafted wreaths featuring premium greenery, pinecones, and festive accents. Perfect for doors, walls, or as a centerpiece.",
    defaultColor: "classic",
    colorOptions: [
      {
        name: "Classic Red & Gold",
        code: "classic",
        images: [
          "/decor-images/7427633500e14419aaf74c6fe5ec5f5b.jpg",
          "/decor-images/746bb7e675774df69b696fa7a0981491.jpg",
          "/decor-images/ad82bd37d0cd42608d580e67abaa6b08.jpg"
        ],
        inStock: true
      },
      {
        name: "Winter White & Silver",
        code: "winter",
        images: [
          "/decor-images/IMG-20250822-WA0028.jpg",
          "/decor-images/IMG-20250822-WA0029.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Table Decor
  {
    id: 401,
    name: "Elegant Table Centerpiece Set",
    category: "Table Decor",
    material: "Glass/Metal",
    price: 89.99,
    badge: "Luxury",
    description: "Transform your holiday table with these elegant centerpieces. Features seasonal florals, candles, and decorative elements in festive colors.",
    defaultColor: "silver-red",
    colorOptions: [
      {
        name: "Silver/Red",
        code: "silver-red",
        images: [
          "/decor-images/b394675d0c0146a794d07ebc976f7c0f.jpg",
          "/decor-images/bb48125200d84b91bc981dfbf0d3ca58.jpg",
          "/decor-images/daa0b47afb11469c9c71c77f4833f3c3.jpg"
        ],
        inStock: true
      },
      {
        name: "Gold/Green",
        code: "gold-green",
        images: [
          "/decor-images/IMG-20250822-WA0030.jpg",
          "/decor-images/IMG-20250822-WA0031.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Outdoor Decor
  {
    id: 501,
    name: "Outdoor Holiday Decor Set",
    category: "Outdoor Decor",
    material: "Weather-Resistant Materials",
    price: 129.99,
    description: "Make your home shine with this premium outdoor decoration set. Weather-resistant pieces create a warm, welcoming glow.",
    defaultColor: "multi",
    colorOptions: [
      {
        name: "Multi-Color",
        code: "multi",
        images: [
          "/decor-images/ec25475a6a6f4c2e898a234d8589d478.jpg",
          "/decor-images/f674dde349834724a1fbb1a0bb460ad1.jpg",
          "/decor-images/f6ba67d558f54bb291ae4d048e348fec.jpg"
        ],
        inStock: true
      },
      {
        name: "Classic Red & Green",
        code: "classic",
        images: [
          "/decor-images/IMG-20250822-WA0032.jpg",
          "/decor-images/IMG-20250822-WA0033.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Wall Decor
  {
    id: 601,
    name: "Festive Wall Art Collection",
    category: "Wall Decor",
    material: "Canvas/Wood",
    price: 79.99,
    description: "Beautiful holiday-themed wall art that brings festive cheer to any room. Each piece is ready to hang and adds a touch of Christmas magic.",
    defaultColor: "classic",
    colorOptions: [
      {
        name: "Classic Christmas",
        code: "classic",
        images: [
          "/decor-images/IMG-20250822-WA0024.jpg",
          "/decor-images/IMG-20250822-WA0025.jpg",
          "/decor-images/IMG-20250822-WA0026.jpg"
        ],
        inStock: true
      },
      {
        name: "Winter Wonderland",
        code: "winter",
        images: [
          "/decor-images/IMG-20250822-WA0034.jpg",
          "/decor-images/IMG-20250822-WA0035.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Stockings and Hangers
  {
    id: 701,
    name: "Personalized Stocking Set with Hangers",
    category: "Stockings",
    material: "Fabric/Metal",
    price: 64.99,
    badge: "Personalizable",
    description: "Complete stocking set with matching hangers. Features plush fabric and elegant embroidery. Personalization options available.",
    defaultColor: "classic",
    colorOptions: [
      {
        name: "Classic Red & Green",
        code: "classic",
        images: [
          "/decor-images/IMG-20250822-WA0030.jpg",
          "/decor-images/IMG-20250822-WA0031.jpg",
          "/decor-images/IMG-20250822-WA0032.jpg"
        ],
        inStock: true
      },
      {
        name: "Winter White & Silver",
        code: "winter",
        images: [
          "/decor-images/IMG-20250822-WA0036.jpg",
          "/decor-images/IMG-20250822-WA0038.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Figurines and Collectibles
  {
    id: 801,
    name: "Christmas Village Figurine Set",
    category: "Collectibles",
    material: "Resin/Ceramic",
    price: 149.99,
    description: "Charming Christmas village set with detailed figurines and buildings. Create a magical holiday scene on your mantel or tabletop.",
    defaultColor: "classic",
    colorOptions: [
      {
        name: "Classic Christmas",
        code: "classic",
        images: [
          "/decor-images/IMG-20250822-WA0035.jpg",
          "/decor-images/IMG-20250822-WA0036.jpg",
          "/decor-images/IMG-20250822-WA0038.jpg"
        ],
        inStock: true
      },
      {
        name: "Winter Wonderland",
        code: "winter",
        images: [
          "/decor-images/IMG-20250822-WA0039.jpg",
          "/decor-images/IMG-20250822-WA0040.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Holiday Lighting
  {
    id: 901,
    name: "Festive String Light Collection",
    category: "Lighting",
    material: "LED/Plastic",
    price: 39.99,
    badge: "Energy Efficient",
    description: "Create a magical holiday atmosphere with these energy-efficient LED string lights. Multiple lighting modes and lengths available.",
    defaultColor: "warm-white",
    colorOptions: [
      {
        name: "Warm White",
        code: "warm-white",
        images: [
          "/decor-images/IMG-20250822-WA0040.jpg",
          "/decor-images/IMG-20250822-WA0041.jpg"
        ],
        inStock: true
      },
      {
        name: "Multi-Color",
        code: "multi",
        images: [
          "/decor-images/IMG-20250822-WA0042.jpg",
          "/decor-images/IMG-20250822-WA0043.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Tree Skirts
  {
    id: 1001,
    name: "Luxury Christmas Tree Skirt",
    category: "Tree Skirts",
    material: "Faux Fur/Fabric",
    price: 54.99,
    description: "Plush tree skirt that adds a luxurious touch to your Christmas tree display. Features a soft, velvety texture and elegant design.",
    defaultColor: "classic",
    colorOptions: [
      {
        name: "Classic Red & White",
        code: "classic",
        images: [
          "/decor-images/IMG-20250822-WA0045.jpg",
          "/decor-images/IMG-20250822-WA0046.jpg"
        ],
        inStock: true
      },
      {
        name: "Winter White & Silver",
        code: "winter",
        images: [
          "/decor-images/IMG-20250822-WA0047.jpg",
          "/decor-images/IMG-20250822-WA0048.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Candles and Holders
  {
    id: 1101,
    name: "Holiday Candle Collection",
    category: "Candles",
    material: "Wax/Glass",
    price: 44.99,
    badge: "Scented",
    description: "Set of festive-scented candles in holiday-themed holders. Creates a warm, inviting atmosphere with seasonal fragrances.",
    defaultColor: "classic",
    colorOptions: [
      {
        name: "Classic Holiday",
        code: "classic",
        images: [
          "/decor-images/IMG-20250822-WA0048.jpg",
          "/decor-images/IMG-20250822-WA0049.jpg"
        ],
        inStock: true
      },
      {
        name: "Winter Spice",
        code: "winter",
        images: [
          "/decor-images/IMG-20250822-WA0050.jpg",
          "/decor-images/IMG-20250822-WA0051.jpg"
        ],
        inStock: true
      }
    ]
  },
  
  // Door Decor
  {
    id: 1201,
    name: "Christmas Door Hanger Set",
    category: "Door Decor",
    material: "Wood/Metal",
    price: 49.99,
    description: "Welcome guests with these charming Christmas door hangers. Each piece features festive designs and durable construction for indoor or outdoor use.",
    defaultColor: "classic",
    colorOptions: [
      {
        name: "Classic Christmas",
        code: "classic",
        images: [
          "/decor-images/IMG-20250822-WA0055.jpg",
          "/decor-images/IMG-20250822-WA0056.jpg"
        ],
        inStock: true
      },
      {
        name: "Rustic Woodland",
        code: "rustic",
        images: [
          "/decor-images/IMG-20250822-WA0057.jpg",
          "/decor-images/IMG-20250822-WA0058.jpg"
        ],
        inStock: true
      }
    ]
  }
];

export type { DecorItem, ColorOption };
export default decors;
