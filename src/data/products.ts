// Products data
export interface Product {
  id: number;
  name: string;
  images: string[];
  type?: string;
  category?: string;
  height?: string;
  shape?: string;
  light?: string;
  badge?: string;
  price: number;
  description: string;
}

const products: Product[] = [
  // Test Product - $1.00
  {
    id: 0,
    name: "Test Product - $1.00",
    images: ["/1.jpg"],
    category: "Test Products",
    price: 1.00,
    description: "A simple test product for $1.00 to verify payment processing and order functionality"
  },

  // King Fraser Fir
  {
    id: 1,
    name: "King Fraser Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20Fully%20Decorated.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20Partially%20Decorated.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20No%20Decoration.webp"
    ],
    height: "5\' - 6\'",
    shape: "Full",
    light: "LED",
    price: 170,
    description: "Features a robust profile with dense, two-toned green needles for a lifelike appearance"
  },

  // Balsam Fir
  {
    id: 2,
    name: "Balsam Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Fully%20Decorated%20Christams%20Tree.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Partially%20Decorated.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Christmas%20Tree%20in%20a%20Farm.jpg"
    ],
    height: "5\' - 6\'",
    shape: "Slim",
    light: "Unlit",
    price: 170,
    description: "A slender tree perfect for smaller spaces, with a traditional, fragrant profile"
  },

  // Douglas Fir
  {
    id: 3,
    name: "Douglas Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Fully%20Decorated%20Christmas%20Tree.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Partially%20Decorated%20Christmas%20Tree.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Christmas%20Tree%20in%20a%20Farm.jpg"
    ],
    height: "5\' - 6\'",
    shape: "Slim",
    light: "Unlit",
    badge: "Limited Stock",
    price: 170,
    description: "A snowy, flocked tree for a winter wonderland look. Limited stock!"
  },

  // White Pine Fir
  {
    id: 4,
    name: "White Pine Fir",
    images: [
      "/1.jpg",
      "/2.jpg",
      "/3.jpg"
    ],
    height: "5\' - 6\'",
    shape: "Full",
    light: "LED",
    badge: "New Arrival",
    price: 170,
    description: "A stunning white pine with soft, flexible needles and excellent needle retention. Perfect for families with pets"
  },

  // King Noble Fir
  {
    id: 5,
    name: "King Noble Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20with%20Full%20Decoration.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20in%20a%20Farm.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20with%20No%20Decoration.webp"
    ],
    height: "5\' - 6\'",
    shape: "Full",
    light: "LED",
    badge: "Best Seller",
    price: 170,
    description: "A classic, ultra-realistic fir with lush, full branches. Our most popular tree!"
  },

  // King Fraser Fir (6-7 ft)
  {
    id: 6,
    name: "King Fraser Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20Fully%20Decorated.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20Partially%20Decorated.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20No%20Decoration.webp"
    ],
    height: "6\' - 7\'",
    shape: "Full",
    light: "LED",
    price: 180,
    description: "A larger Fraser Fir with exceptional needle retention and perfect symmetry for spacious rooms"
  },

  // Balsam Fir (6-7 ft)
  {
    id: 7,
    name: "Balsam Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Fully%20Decorated%20Christams%20Tree.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Partially%20Decorated.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Christmas%20Tree%20in%20a%20Farm.jpg"
    ],
    height: "6\' - 7\'",
    shape: "Slim",
    light: "Unlit",
    price: 180,
    description: "A majestic Balsam Fir with a traditional Christmas fragrance and elegant silhouette"
  },

  // Douglas Fir (6-7 ft)
  {
    id: 8,
    name: "Douglas Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Fully%20Decorated%20Christmas%20Tree.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Partially%20Decorated%20Christmas%20Tree.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Christmas%20Tree%20in%20a%20Farm.jpg"
    ],
    height: "6\' - 7\'",
    shape: "Slim",
    light: "Unlit",
    badge: "Limited Stock",
    price: 180,
    description: "A snowy, flocked tree for a winter wonderland look. Limited stock!"
  },

  // White Pine Fir (6-7 ft)
  {
    id: 9,
    name: "White Pine Fir",
    images: [
      "/1.jpg",
      "/2.jpg",
      "/3.jpg"
    ],
    height: "6\' - 7\'",
    shape: "Full",
    light: "LED",
    badge: "New Arrival",
    price: 180,
    description: "A stunning white pine with soft, flexible needles and excellent needle retention. Perfect for families with pets"
  },

  // King Noble Fir (6-7 ft)
  {
    id: 10,
    name: "King Noble Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20with%20Full%20Decoration.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20in%20a%20Farm.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20with%20No%20Decoration.webp"
    ],
    height: "6\' - 7\'",
    shape: "Full",
    light: "LED",
    badge: "Best Seller",
    price: 180,
    description: "A classic, ultra-realistic fir with lush, full branches. Our most popular tree!"
  },

  // King Fraser Fir (7-8 ft)
  {
    id: 11,
    name: "King Fraser Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20Fully%20Decorated.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20Partially%20Decorated.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Fraser%20Fir%20No%20Decoration.webp"
    ],
    height: "7\' - 8\'",
    shape: "Full",
    light: "LED",
    price: 190,
    description: "A grand Fraser Fir with exceptional needle retention and perfect symmetry for spacious rooms"
  },

  // Balsam Fir (7-8 ft)
  {
    id: 12,
    name: "Balsam Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Fully%20Decorated%20Christams%20Tree.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Partially%20Decorated.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Balsam%20Fir%20Christmas%20Tree%20in%20a%20Farm.jpg"
    ],
    height: "7\' - 8\'",
    shape: "Slim",
    light: "Unlit",
    price: 190,
    description: "A majestic Balsam Fir with a traditional Christmas fragrance and elegant silhouette"
  },

  // Douglas Fir (7-8 ft)
  {
    id: 13,
    name: "Douglas Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Fully%20Decorated%20Christmas%20Tree.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Partially%20Decorated%20Christmas%20Tree.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Douglas%20Fir%20Christmas%20Tree%20in%20a%20Farm.jpg"
    ],
    height: "7\' - 8\'",
    shape: "Slim",
    light: "Unlit",
    badge: "Limited Stock",
    price: 190,
    description: "A snowy, flocked tree for a winter wonderland look. Limited stock!"
  },

  // White Pine Fir (7-8 ft)
  {
    id: 14,
    name: "White Pine Fir",
    images: [
      "/1.jpg",
      "/2.jpg",
      "/3.jpg"
    ],
    height: "7\' - 8\'",
    shape: "Full",
    light: "LED",
    badge: "New Arrival",
    price: 190,
    description: "A stunning white pine with soft, flexible needles and excellent needle retention. Perfect for families with pets"
  },

  // King Noble Fir (7-8 ft)
  {
    id: 15,
    name: "King Noble Fir",
    images: [
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20with%20Full%20Decoration.jpg",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20in%20a%20Farm.webp",
      "https://nyykggssyasvxrtjhhhb.supabase.co/storage/v1/object/public/Product%20Images/Noble%20Fir%20Christmas%20Tree%20with%20No%20Decoration.webp"
    ],
    height: "7\' - 8\'",
    shape: "Full",
    light: "LED",
    badge: "Best Seller",
    price: 190,
    description: "A classic, ultra-realistic fir with lush, full branches. Our most popular tree!"
  },
  
];

export default products;
