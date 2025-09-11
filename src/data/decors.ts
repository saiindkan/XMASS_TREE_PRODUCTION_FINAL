// Christmas Decor Products Data
interface ColorOption {
  name: string;
  code: string;
  images: string[];
  inStock: boolean;
}

export interface DecorItem {
  id: number;
  name: string;
  category: string;
  material: string;
  price: number;
  badge?: string;
  description: string;
  defaultColor: string;
  colorOptions: ColorOption[];
}

// Helper function to generate unique IDs
const generateId = (base: number, index: number) => base * 1000 + index + 1;

// Available categories:
// - Plush Characters
// - Wreaths
// - Ribbons
// - Ornaments
// - Tree Toppers
// - Stockings
// - Wall Decorations
// - Table Decorations
// - Lights
// - Gift Accessories

const decors: DecorItem[] = [
    {
        id: generateId(1, 1),
        name: "Red and White Candy Cane Pillow",
        category: "Pillows",
        material: "Polyester",
        price: 24.99,
        description: "A festive home decor pillow shaped like a candy cane, with red and white diagonal stripes. This plush pillow adds a sweet touch to your holiday decor.",
        defaultColor: "Red and White",
        colorOptions: [
            {
                name: "Red and White",
                code: "#FF0000,#FFFFFF",
                images: ["/decor-images/1.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 2),
        name: "Santa Face Pillow",
        category: "Pillows",
        material: "Velvet and Sherpa",
        price: 29.99,
        description: "A shaped pillow representing the face of Santa Claus, featuring a velvet hat and a fluffy Sherpa beard with embroidered facial details. The perfect cozy addition to your holiday decor.",
        defaultColor: "Red and White",
        colorOptions: [
            {
                name: "Red and White",
                code: "#FF0000,#FFFFFF",
                images: ["/decor-images/2.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 3),
        name: "Red Fluffy-Cuff Character Stockings (Set of 4)",
        category: "Stockings",
        material: "Felt and Faux Fur",
        price: 44.99,
        description: "These red felt stockings feature 3D character appliques of Santa, a Snowman, a Reindeer, and a Penguin. They have a plush faux fur cuff and are made from a mix of burlap, plush, and non-woven materials. Perfect for family holiday decor.",
        defaultColor: "Red",
        colorOptions: [
            {
                name: "Red",
                code: "#FF0000",
                images: ["/decor-images/3.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 6),
        name: "Cat and Dog Stockings (Set of 2)",
        category: "Stockings",
        material: "Polyester Blend",
        price: 34.99,
        description: "A two-piece set of stockings with a simple, classic, hooked design. One stocking is red with a cat applique, and the other is green with a dog applique. Made from a polyester blend with needlepoint construction.",
        defaultColor: "Red and Green",
        colorOptions: [
            {
                name: "Red and Green",
                code: "#FF0000,#006400",
                images: ["/decor-images/6.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 7),
        name: "Illuminated Golden Retriever Stocking",
        category: "Stockings",
        material: "Polyester Fleece with LED Lights",
        price: 32.99,
        description: "A red Christmas stocking featuring a Golden Retriever dog with a string of illuminated lights around it. The LED lights are battery operated, adding a magical glow to your holiday decor.",
        defaultColor: "Red",
        colorOptions: [
            {
                name: "Red",
                code: "#FF0000",
                images: ["/decor-images/7.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 8),
        name: "Pink and White Candy Cane Pillow",
        category: "Pillows",
        material: "100% Polyester",
        price: 22.99,
        description: "A festive home decor pillow shaped like a candy cane, with a pink and ivory striped pattern. Made of 100% polyester, this plush pillow adds a sweet and cozy touch to your holiday decor.",
        defaultColor: "Pink and White",
        colorOptions: [
            {
                name: "Pink and White",
                code: "#FFB6C1,#FFFFFF",
                images: ["/decor-images/8.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 9),
        name: "Peppermint Candy Pillow",
        category: "Pillows",
        material: "Quality Polyester",
        price: 26.99,
        description: "This plush pillow is shaped like a wrapped peppermint candy, featuring a whimsical red and white design. Measuring 15 inches tall, it's made of quality polyester and adds a fun, festive touch to any holiday setting.",
        defaultColor: "Red and White",
        colorOptions: [
            {
                name: "Red and White",
                code: "#FF0000,#FFFFFF",
                images: ["/decor-images/9.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 10),
        name: "Plaid Cuff Stockings (Set of 3)",
        category: "Stockings",
        material: "Cotton and Polyester",
        price: 39.99,
        description: "These stockings feature a beige body with a unique plaid cuff in burgundy, white, and brown colors. Each stocking has a character applique of a Santa, snowman, or reindeer, with specific embroidered phrases on the characters.",
        defaultColor: "Beige and Plaid",
        colorOptions: [
            {
                name: "Beige and Plaid",
                code: "#F5F5DC,#800020,#FFFFFF,#8B4513",
                images: ["/decor-images/10.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 11),
        name: "Cable Knit Stockings (Set of 4)",
        category: "Stockings",
        material: "Soft Acrylic",
        price: 49.99,
        description: "These stockings feature a classic cable-knit design in various colors including red, cream, hunter green, and gray. Made from soft acrylic material, they can be personalized with embroidery for a special touch.",
        defaultColor: "Assorted Colors",
        colorOptions: [
            {
                name: "Assorted Colors",
                code: "#FF0000,#F5F5DC,#006400,#808080",
                images: ["/decor-images/11.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 12),
        name: "Faux Fur Pom-Pom Stockings (Set of 2)",
        category: "Stockings",
        material: "Faux Fur",
        price: 36.99,
        description: "These elegant stockings are made from soft faux fur and are accented with two pom-poms on the cuff. The one-sided design comes in a variety of colors, including white and brown, adding a luxurious touch to your holiday decor.",
        defaultColor: "White",
        colorOptions: [
            {
                name: "White",
                code: "#FFFFFF",
                images: ["/decor-images/12.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 13),
        name: "White Cable Knit Tree Collar",
        category: "Tree Decor",
        material: "Metal Frame with Fabric Cover",
        price: 54.99,
        description: "This elegant tree collar features a white cable-knit sweater design, perfect for hiding your tree stand. The metal frame is covered in fabric, creating a cozy and polished look. Available in various sizes to fit different tree stands.",
        defaultColor: "White",
        colorOptions: [
            {
                name: "White",
                code: "#FFFFFF",
                images: ["/decor-images/13.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 14),
        name: "Felt Fox Applique Stocking",
        category: "Stockings",
        material: "Wool Felt",
        price: 28.99,
        description: "This charming stocking features a 3D fox applique made from high-quality wool felt. The design includes intricate details and is available with an option for personalization with an embroidered name, making it a unique and special holiday decoration.",
        defaultColor: "Orange and White",
        colorOptions: [
            {
                name: "Orange and White",
                code: "#FFA500,#FFFFFF",
                images: ["/decor-images/14.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 15),
        name: "Black Cat with Lights Stocking",
        category: "Stockings",
        material: "Polyester Fleece",
        price: 29.99,
        description: "A personalized stocking featuring a playful black cat tangled in a string of Christmas lights. The design is printed on soft and durable polyester fleece, creating a cozy and whimsical holiday decoration.",
        defaultColor: "Black and Multicolor",
        colorOptions: [
            {
                name: "Black and Multicolor",
                code: "#000000,#FF0000,#00FF00,#0000FF",
                images: ["/decor-images/15.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 16),
        name: "Snowflake Stockings (Set of 3)",
        category: "Stockings",
        material: "Velvet",
        price: 59.99,
        description: "This set of elegant stockings is made from a soft, velvety material and features gold-printed snowflakes with gold beaded accents. The stockings are fully lined and available in burgundy, ivory, and green, adding a touch of sophistication to your holiday decor.",
        defaultColor: "Burgundy, Ivory, Green",
        colorOptions: [
            {
                name: "Burgundy, Ivory, Green",
                code: "#800020,#FFFFF0,#006400",
                images: ["/decor-images/16.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 17),
        name: "Gingerbread Man Plush Pillow",
        category: "Pillows",
        material: "Soft Plush Fabric",
        price: 27.99,
        description: "A delightful plush gingerbread man pillow with a Santa hat and scarf. Made of soft, huggable material, this decorative accessory adds a festive touch to your holiday home decor.",
        defaultColor: "Brown and Red",
        colorOptions: [
            {
                name: "Brown and Red",
                code: "#8B4513,#FF0000",
                images: ["/decor-images/17.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 18),
        name: "Black Dog with LED Lights Stocking",
        category: "Stockings",
        material: "Polyester with LED Lights",
        price: 31.99,
        description: "A unique and festive stocking featuring a black dog tangled in LED lights. The battery-operated LED lights add a magical glow, making this a rare and special holiday decoration.",
        defaultColor: "Black and Multicolor",
        colorOptions: [
            {
                name: "Black and Multicolor",
                code: "#000000,#FF0000,#00FF00,#0000FF",
                images: ["/decor-images/18.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 19),
        name: "Plaid Paw Print Stockings (Set of 2)",
        category: "Stockings",
        material: "Polyester and Knit",
        price: 38.99,
        description: "These charming stockings feature a classic plaid pattern with a knit cuff and are decorated with white paw print appliques. Available in red, black, and white plaid, they're perfect for pet lovers.",
        defaultColor: "Red, Black, and White Plaid",
        colorOptions: [
            {
                name: "Red, Black, and White Plaid",
                code: "#FF0000,#000000,#FFFFFF",
                images: ["/decor-images/19.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 20),
        name: "Snowman and Reindeer Applique Stockings (Set of 2)",
        category: "Stockings",
        material: "Mixed Textiles",
        price: 42.99,
        description: "A pair of stockings featuring whimsical applique characters of a snowman on a red stocking and a reindeer on a green stocking. The designs are made with varying textiles and feature snowflakes, adding a festive touch to your holiday decor.",
        defaultColor: "Red and Green",
        colorOptions: [
            {
                name: "Red and Green",
                code: "#FF0000,#006400",
                images: ["/decor-images/20.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 21),
        name: "Gingerbread Man Shaped Pillow",
        category: "Pillows",
        material: "Plush Fabric",
        price: 29.99,
        description: "A plush, brown gingerbread man pillow with a cheerful smile and decorative white icing-like stitching around its edges. The pillow is adorned with a red Santa hat and a red scarf, making it a hand-made decorative accessory perfect for adding a festive touch to any room.",
        defaultColor: "Brown and Red",
        colorOptions: [
            {
                name: "Brown and Red",
                code: "#8B4513,#FF0000",
                images: ["/decor-images/21.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 22),
        name: "Mini Initial Christmas Stockings (Set of 3)",
        category: "Stockings",
        material: "Knit Fabric",
        price: 27.99,
        description: "These charming mini stockings feature a knit or cable-knit body and a contrasting white cuff with an embroidered initial letter. Available in a variety of colors including pink, red, and blue, their small size makes them perfect for hanging on a Christmas tree or using as decorative gift bags.",
        defaultColor: "Pink, Red, and Blue",
        colorOptions: [
            {
                name: "Pink, Red, and Blue",
                code: "#FFC0CB,#FF0000,#0000FF",
                images: ["/decor-images/22.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 28),
        name: "The Canvas Beneath the Tree: Christmas Tree Skirt",
        category: "Tree Decor",
        material: "Knitted Fabric",
        price: 64.99,
        description: "This Christmas tree skirt serves as the foundational element of a decorated holiday space, providing a stylistic anchor for the gifts and ornaments above. Featuring a soft, textural knitted design, it adds a cozy and elegant touch to your holiday decor.",
        defaultColor: "Cream",
        colorOptions: [
            {
                name: "Cream",
                code: "#FFFDD0",
                images: ["/decor-images/28.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 35),
        name: "The Timeless Trio: Santa, Snowman, and Reindeer Figurines",
        category: "Figurines",
        material: "Resin and Fabric",
        price: 89.99,
        description: "This charming set features the classic holiday characters of Santa, a snowman, and a reindeer. Made from high-quality resin with fabric accents, these figurines bring timeless holiday cheer to any room in your home.",
        defaultColor: "Multicolor",
        colorOptions: [
            {
                name: "Multicolor",
                code: "#FF0000,#FFFFFF,#8B4513",
                images: ["/decor-images/35.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 200),
        name: "Rustic Cable Knit Christmas Stockings (Set of 4)",
        category: "Stockings",
        material: "Knit Fabric",
        price: 39.99,
        description: "This set of four large Christmas stockings is crafted from soft, thick knit material with a classic cable-knit pattern. The stockings come in a cozy color palette of deep red, forest green, warm white, and a soft gray. Each stocking has a sturdy loop for easy hanging, perfect for a mantel, staircase, or wall. Their generous size allows you to fill them with a variety of holiday treats and gifts, bringing a touch of rustic charm to your festive decor.",
        defaultColor: "Multicolor",
        colorOptions: [
            {
                name: "Multicolor",
                code: "#8B0000,#006400,#FFFFFF,#808080",
                images: ["/decor-images/59.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 201),
        name: "Christmas Stockings with Plush Cat and Dog Appliques",
        category: "Stockings",
        material: "Velvet and Plush",
        price: 34.99,
        description: "Celebrate your furry friends with this adorable pair of Christmas stockings. One stocking features a plush cat applique, while the other has a matching plush dog, both wearing festive Santa hats and red plaid bow ties. The stockings are made from a combination of soft velvet-like fabric in a traditional red and green color scheme. Each has a sturdy loop for hanging, making them the perfect personalized stockings for your favorite pet.",
        defaultColor: "Red and Green",
        colorOptions: [
            {
                name: "Red and Green",
                code: "#8B0000,#006400",
                images: ["/decor-images/61.jpg"],
                inStock: true
            }
        ]
    },
    {
        id: generateId(1, 202),
        name: "Cable Knit Christmas Stockings (Set of 4)",
        category: "Stockings",
        material: "Knit Fabric",
        price: 42.99,
        description: "This set of four large Christmas stockings is crafted from soft, thick knit material with a classic cable-knit pattern. The stockings come in a cozy color palette of deep red, forest green, warm white, and a soft gray. Each stocking has a sturdy loop for easy hanging, perfect for a mantel, staircase, or wall. Their generous size allows you to fill them with a variety of holiday treats and gifts, bringing a touch of rustic charm to your festive decor.",
        defaultColor: "Multicolor",
        colorOptions: [
            {
                name: "Multicolor",
                code: "#8B0000,#006400,#FFFFFF,#808080",
                images: ["/decor-images/60.jpg"],
                inStock: true
            }
        ]
    },
    // {
    //     id: generateId(10, 0),
    //     name: "Plaid Cuff Stockings",
    //     category: "Stockings",
    //     material: "Polyester, Cotton",
    //     price: 24.99,
    //     description: "These premium stockings feature a beige body with a unique plaid cuff in burgundy, white, and brown colors. Each stocking has a character applique of a Santa, snowman, or reindeer, with specific embroidered phrases on the characters.",
    //     defaultColor: "Beige",
    //     colorOptions: [
    //         {
    //             name: "Santa",
    //             code: "santa",
    //             images: ["OneDrive_1_9-9-2025/stocking-plaid-santa.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Snowman",
    //             code: "snowman",
    //             images: ["OneDrive_1_9-9-2025/stocking-plaid-snowman.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Reindeer",
    //             code: "reindeer",
    //             images: ["OneDrive_1_9-9-2025/stocking-plaid-reindeer.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(11, 0),
    //     name: "Cable Knit Stockings",
    //     category: "Stockings",
    //     material: "Acrylic",
    //     price: 29.99,
    //     description: "These stockings feature a classic cable-knit design in various colors including red, cream, hunter green, and gray. They are made from soft acrylic material and can be personalized with embroidery.",
    //     defaultColor: "Red",
    //     colorOptions: [
    //         {
    //             name: "Red",
    //             code: "red",
    //             images: ["OneDrive_1_9-9-2025/stocking-cable-red.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Cream",
    //             code: "cream",
    //             images: ["OneDrive_1_9-9-2025/stocking-cable-cream.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Hunter Green",
    //             code: "green",
    //             images: ["OneDrive_1_9-9-2025/stocking-cable-green.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Gray",
    //             code: "gray",
    //             images: ["OneDrive_1_9-9-2025/stocking-cable-gray.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(12, 0),
    //     name: "Faux Fur Pom-Pom Stockings",
    //     category: "Stockings",
    //     material: "Faux Fur",
    //     price: 34.99,
    //     description: "These luxurious stockings are made from soft faux fur and are accented with two pom-poms on the cuff. The design is one-sided and comes in a variety of colors, including white and brown.",
    //     defaultColor: "White",
    //     colorOptions: [
    //         {
    //             name: "White",
    //             code: "white",
    //             images: ["OneDrive_1_9-9-2025/stocking-pompom-white.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Brown",
    //             code: "brown",
    //             images: ["OneDrive_1_9-9-2025/stocking-pompom-brown.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(13, 0),
    //     name: "White Cable Knit Tree Collar",
    //     category: "Tree Accessories",
    //     material: "Metal, Fabric",
    //     price: 49.99,
    //     description: "This tree collar has a white cable-knit sweater design and is made with a metal frame covered in fabric. It is used to hide a tree stand and is available in various sizes.",
    //     defaultColor: "White",
    //     colorOptions: [
    //         {
    //             name: "White",
    //             code: "white",
    //             images: ["OneDrive_1_9-9-2025/tree-collar-white.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(14, 0),
    //     name: "Felt Fox Applique Stocking",
    //     category: "Stockings",
    //     material: "Wool Felt",
    //     price: 32.99,
    //     description: "This stocking features a charming 3D fox applique made from wool felt. It is available with an option for personalization with an embroidered name.",
    //     defaultColor: "Orange",
    //     colorOptions: [
    //         {
    //             name: "Orange Fox",
    //             code: "orange",
    //             images: ["decor-image/14.jpg", "decor-image/14-2.jpg", "decor-image/14-3.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(15, 0),
    //     name: "Black Cat with Lights Stocking",
    //     category: "Stockings",
    //     material: "Polyester Fleece",
    //     price: 27.99,
    //     description: "A personalized stocking with a black cat tangled in a string of Christmas lights. The design is printed on a soft and durable polyester fleece.",
    //     defaultColor: "Red",
    //     colorOptions: [
    //         {
    //             name: "Red Background",
    //             code: "red",
    //             images: ["decor-image/15.jpg", "decor-image/15-2.jpg", "decor-image/15-3.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(16, 0),
    //     name: "Snowflake Stockings",
    //     category: "Stockings",
    //     material: "Velvet, Beads",
    //     price: 39.99,
    //     description: "This set of elegant stockings is made from a soft, velvety material and features gold-printed snowflakes with gold beaded accents. They are fully lined and available in burgundy, ivory, and green.",
    //     defaultColor: "Burgundy",
    //     colorOptions: [
    //         {
    //             name: "Burgundy",
    //             code: "burgundy",
    //             images: ["decor-image/16.jpg", "decor-image/16-2.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Ivory",
    //             code: "ivory",
    //             images: ["decor-image/16-3.jpg", "decor-image/16-4.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Green",
    //             code: "green",
    //             images: ["decor-image/16-5.jpg", "decor-image/16-6.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(17, 0),
    //     name: "Gingerbread Man Plush Pillow",
    //     category: "Home Accessories",
    //     material: "Plush Fabric",
    //     price: 24.99,
    //     description: "A plush gingerbread man pillow with a Santa hat and scarf. It is made of a soft material and is a decorative accessory for the holidays.",
    //     defaultColor: "Brown",
    //     colorOptions: [
    //         {
    //             name: "Classic Brown",
    //             code: "brown",
    //             images: ["decor-image/17.jpg", "decor-image/17-2.jpg", "decor-image/17-3.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(18, 0),
    //     name: "Black Dog with LED Lights Stocking",
    //     category: "Stockings",
    //     material: "Polyester, LED Lights",
    //     price: 44.99,
    //     badge: "Limited Edition",
    //     description: "A festive stocking featuring a black dog tangled in LED lights, which are battery operated. It is a rare, unbranded item.",
    //     defaultColor: "Green",
    //     colorOptions: [
    //         {
    //             name: "Green with Lights",
    //             code: "green",
    //             images: ["decor-image/18.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(19, 0),
    //     name: "Plaid Paw Print Stockings",
    //     category: "Stockings",
    //     material: "Cotton, Polyester",
    //     price: 29.99,
    //     description: "These stockings have a plaid pattern with a knit cuff and are decorated with white paw print appliques. They are available in red, black, and white plaid.",
    //     defaultColor: "Red Plaid",
    //     colorOptions: [
    //         {
    //             name: "Red Plaid",
    //             code: "red-plaid",
    //             images: ["decor-image/19.jpg", "decor-image/19-2.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Black Plaid",
    //             code: "black-plaid",
    //             images: ["decor-image/19-3.jpg", "decor-image/19-4.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "White Plaid",
    //             code: "white-plaid",
    //             images: ["decor-image/19-5.jpg", "decor-image/19-6.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(20, 0),
    //     name: "Snowman and Reindeer Applique Stockings",
    //     category: "Stockings",
    //     material: "Mixed Textiles",
    //     price: 42.99,
    //     description: "A pair of stockings featuring whimsical applique characters of a snowman on a red stocking and a reindeer on a green stocking. The designs are made with varying textiles and feature snowflakes.",
    //     defaultColor: "Red/Green",
    //     colorOptions: [
    //         {
    //             name: "Red with Snowman",
    //             code: "red-snowman",
    //             images: ["decor-image/20.jpg", "decor-image/20-2.jpg", "decor-image/20-3.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Green with Reindeer",
    //             code: "green-reindeer",
    //             images: ["decor-image/20-4.jpg", "decor-image/20-5.jpg", "decor-image/20-6.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(21, 0),
    //     name: "Deluxe Gingerbread Man Pillow",
    //     category: "Home Accessories",
    //     material: "Plush Fabric",
    //     price: 34.99,
    //     description: "A plush, brown gingerbread man pillow with a cheerful smile and decorative white icing-like stitching around its edges. The pillow is adorned with a red Santa hat and a red scarf. It is a hand-made decorative accessory, perfect for adding a festive touch to a couch or holiday display.",
    //     defaultColor: "Brown",
    //     colorOptions: [
    //         {
    //             name: "Classic Brown",
    //             code: "brown",
    //             images: ["decor-image/21.jpg", "decor-image/21-2.jpg", "decor-image/21-3.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(22, 0),
    //     name: "Mini Initial Christmas Stockings",
    //     category: "Stockings",
    //     material: "Knit Fabric",
    //     price: 19.99,
    //     description: "These stockings feature a knit or cable-knit body and a contrasting white cuff with an embroidered initial letter. They are available in a variety of colors, including pink, red, and blue. The small size makes them suitable for hanging on a Christmas tree or using as a decorative gift bag.",
    //     defaultColor: "Red",
    //     colorOptions: [
    //         {
    //             name: "Pink",
    //             code: "pink",
    //             images: ["decor-image/22.jpg", "decor-image/22-2.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Red",
    //             code: "red",
    //             images: ["decor-image/22-3.jpg", "decor-image/22-4.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Blue",
    //             code: "blue",
    //             images: ["decor-image/22-5.jpg", "decor-image/22-6.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(28, 0),
    //     name: "Traditional Christmas Tree Skirt",
    //     category: "Tree Accessories",
    //     material: "Mixed Materials",
    //     price: 79.99,
    //     badge: "Premium Collection",
    //     description: "The Christmas tree skirt serves as the foundational element of a decorated holiday space, providing a stylistic anchor for the gifts and ornaments above. The visual evidence reveals a significant trend toward soft, textural fabrics, with a distinct emphasis on knitted designs.",
    //     defaultColor: "White",
    //     colorOptions: [
    //         {
    //             name: "Classic White",
    //             code: "white",
    //             images: ["decor-image/28.jpg", "decor-image/28-2.jpg", "decor-image/28-3.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Traditional Red",
    //             code: "red",
    //             images: ["decor-image/28-4.jpg", "decor-image/28-5.jpg", "decor-image/28-6.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Forest Green",
    //             code: "green",
    //             images: ["decor-image/28-7.jpg", "decor-image/28-8.jpg", "decor-image/28-9.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(35, 0),
    //     name: "The Timeless Trio Holiday Plush Set",
    //     category: "Plush Characters",
    //     material: "Premium Plush Fabric",
    //     price: 89.99,
    //     badge: "Collector's Edition",
    //     description: "A luxurious collection featuring the timeless trio of Christmas characters: Santa, Snowman, and Reindeer. Each character is meticulously crafted with premium plush materials and features traditional holiday designs including plaid outfits, festive scarves, and knitted accessories. This collector's edition set makes for a perfect holiday display or cherished family heirloom.",
    //     defaultColor: "Traditional",
    //     colorOptions: [
    //         {
    //             name: "Classic Set",
    //             code: "classic",
    //             images: ["decor-image/35.jpg", "decor-image/35-2.jpg", "decor-image/35-3.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Santa Character",
    //             code: "santa",
    //             images: ["decor-image/35-4.jpg", "decor-image/35-5.jpg", "decor-image/35-6.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Snowman Character",
    //             code: "snowman",
    //             images: ["decor-image/35-7.jpg", "decor-image/35-8.jpg"],
    //             inStock: true
    //         },
    //         {
    //             name: "Reindeer Character",
    //             code: "reindeer",
    //             images: ["decor-image/35-9.jpg", "decor-image/35-10.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 0),
    //     name: "Red and White Candy Cane Pillow",
    //     category: "Home Accessories",
    //     material: "Premium Plush Polyester",
    //     price: 29.99,
    //     description: "This is a shaped plush pillow with red and white diagonal stripes, resembling a candy cane. Perfect for adding a festive touch to your home decor.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Classic Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/1.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 1),
    //     name: "Santa Face Pillow",
    //     category: "Home Accessories",
    //     material: "Velvet and Sherpa",
    //     price: 34.99,
    //     description: "A shaped pillow representing the face of Santa Claus, featuring a velvet hat and a fluffy Sherpa beard. The pillow also has embroidered facial details.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Traditional",
    //             code: "red",
    //             images: [
    //                 "/decor-images/2.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 2),
    //     name: "Red Fluffy-Cuff Character Stockings",
    //     category: "Stockings",
    //     material: "Felt and Faux Fur",
    //     price: 39.99,
    //     badge: "Best Seller",
    //     description: "These red felt stockings feature 3D character appliques of Santa, a Snowman, a Reindeer, and a Penguin. They have a plush faux fur cuff and are made from a mix of burlap, plush, and non-woven materials.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Classic Red",
    //             code: "red",
    //             images: ["/decor-images/3.jpg"],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 3),
    //     name: "Cat and Dog Stockings Set",
    //     category: "Stockings",
    //     material: "Polyester Blend",
    //     price: 29.99,
    //     description: "This is a two-piece set of stockings with a simple, classic, hooked design. One stocking is red with a cat applique, and the other is green with a dog applique. They are made from a polyester blend with needlepoint construction.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Red and Green",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/6.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 4),
    //     name: "Illuminated Golden Retriever Stocking",
    //     category: "Stockings",
    //     material: "Polyester with LED Lights",
    //     price: 34.99,
    //     badge: "Light-up Feature",
    //     description: "A red Christmas stocking featuring a Golden Retriever dog with a string of illuminated lights around it. Perfect for pet lovers and adding a warm glow to your holiday decor.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Classic Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/7.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 5),
    //     name: "Pink and White Candy Cane Pillow",
    //     category: "Home Accessories",
    //     material: "Polyester",
    //     price: 29.99,
    //     description: "A festive home decor pillow shaped like a candy cane, with a pink and ivory striped pattern. It is made of 100% polyester.",
    //     defaultColor: "pink",
    //     colorOptions: [
    //         {
    //             name: "Pink Stripe",
    //             code: "pink",
    //             images: [
    //                 "/decor-images/8.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 6),
    //     name: "Peppermint Candy Pillow",
    //     category: "Home Accessories",
    //     material: "Plush Polyester",
    //     price: 24.99,
    //     description: "This plush pillow is shaped like a wrapped peppermint candy, featuring a whimsical red and white design. It measures 15 inches tall and is made of quality polyester.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Classic Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/9.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 0),
    //     name: "Holiday Character Wreath Collection",
    //     category: "Wreaths",
    //     material: "Premium Plush Fabric",
    //     price: 49.99,
    //     badge: "New Arrival",
    //     description: "Charming set of character wreaths featuring beloved holiday figures. Each wreath is crafted with premium plush material and includes festive holiday messages. Perfect for spreading Christmas cheer in any room.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Multi",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0024.jpg",
    //                 "/decor-images/IMG-20250822-WA0025.jpg",
    //                 "/decor-images/IMG-20250822-WA0026.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 1),
    //     name: "Plush Santa Door Hanger",
    //     category: "Wall Decorations",
    //     material: "Soft Plush",
    //     price: 29.99,
    //     description: "Adorable plush Santa door hanger with festive 'Merry Christmas' message. Features detailed embroidery and dimensional design.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Traditional Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0027.jpg",
    //                 "/decor-images/IMG-20250822-WA0028.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 2),
    //     name: "Vintage Glass Bauble Set",
    //     category: "Ornaments",
    //     material: "Hand-painted Glass",
    //     price: 34.99,
    //     badge: "Premium",
    //     description: "Set of exquisite hand-painted glass baubles featuring traditional Christmas motifs. Each piece is carefully crafted with vintage-inspired designs.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Classic Multi",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/b394675d0c0146a794d07ebc976f7c0f.jpg",
    //                 "/decor-images/bb48125200d84b91bc981dfbf0d3ca58.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 3),
    //     name: "Festive Gnome Family Set",
    //     category: "Table Decorations",
    //     material: "Premium Fabric and Faux Fur",
    //     price: 39.99,
    //     badge: "Best Seller",
    //     description: "Delightful set of holiday gnomes perfect for table decoration or shelf display. Features varying sizes and charming details like fuzzy beards and sparkly hats.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0029.jpg",
    //                 "/decor-images/IMG-20250822-WA0030.jpg",
    //                 "/decor-images/IMG-20250822-WA0031.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 4),
    //     name: "Premium Christmas Stocking Collection",
    //     category: "Stockings",
    //     material: "Velvet and Faux Fur",
    //     price: 24.99,
    //     description: "Luxurious Christmas stockings with plush trim and detailed embroidery. Perfect for hanging by the fireplace or on the wall.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Classic Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0032.jpg",
    //                 "/decor-images/IMG-20250822-WA0033.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 5),
    //     name: "Red and White Candy Cane Pillow",
    //     category: "Ornaments",
    //     material: "Glass",
    //     price: 42.99,
    //     badge: "Luxury",
    //     description: "This is a shaped plush pillow with red and white diagonal stripes, resembling a candy cane. While similar pillows are mentioned in the research, a precise match for this specific shape was not found. One source describes a Candy Cane Cushion , while others refer to rectangular pillows with a Red Stripe design.",
    //     defaultColor: "gold",
    //     colorOptions: [
    //         {
    //             name: "Red and White Candy Cane Pillow",
    //             code: "gold",
    //             images: [
    //                 // "/decor-images/1e7797736fea487b82e026c589677820.jpg",
    //                 // "/decor-images/41a38553b135437c82764679aa3d009f.jpg",
    //                 "/decor-images/4cd2131ea5e84e819478c3dcc6b7747a.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 6),
    //     name: "Santa's Workshop Decoration Set",
    //     category: "Table Decorations",
    //     material: "Resin and Fabric",
    //     price: 59.99,
    //     badge: "Limited Edition",
    //     description: "Detailed miniature workshop scene featuring Santa and his elves. Includes LED lighting effects and intricate decorative elements.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Scene",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0034.jpg",
    //                 "/decor-images/IMG-20250822-WA0035.jpg",
    //                 "/decor-images/IMG-20250822-WA0036.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 7),
    //     name: "Crystal Angel Tree Topper",
    //     category: "Tree Toppers",
    //     material: "Crystal and Metal",
    //     price: 49.99,
    //     badge: "Premium",
    //     description: "Stunning crystal angel tree topper with intricate wing details and subtle sparkle. Features secure tree attachment.",
    //     defaultColor: "clear",
    //     colorOptions: [
    //         {
    //             name: "Crystal Clear",
    //             code: "clear",
    //             images: [
    //                 "/decor-images/73e0678758a34141b5317c2d0f29640d.jpg",
    //                 "/decor-images/7a6270c42c0247cb9f4e1a88023974b1.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 8),
    //     name: "Deluxe Gift Wrap Ribbon Set",
    //     category: "Gift Accessories",
    //     material: "Velvet and Satin",
    //     price: 19.99,
    //     description: "Luxury ribbon collection in festive colors. Perfect for gift wrapping and tree decoration. Includes various widths and patterns.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0038.jpg",
    //                 "/decor-images/IMG-20250822-WA0039.jpg",
    //                 "/decor-images/IMG-20250822-WA0040.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 9),
    //     name: "Illuminated Christmas Village Set",
    //     category: "Table Decorations",
    //     material: "Porcelain and LED Lights",
    //     price: 89.99,
    //     badge: "Premium Collection",
    //     description: "Charming miniature village set with LED lighting. Features multiple buildings, figures, and scenic elements. Perfect for creating a festive display.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Village Scene",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0041.jpg",
    //                 "/decor-images/IMG-20250822-WA0042.jpg",
    //                 "/decor-images/IMG-20250822-WA0043.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 10),
    //     name: "Nordic Plush Gnome Collection",
    //     category: "Table Decorations",
    //     material: "Premium Plush and Faux Fur",
    //     price: 44.99,
    //     description: "Scandinavian-inspired gnome decorations with soft textured materials. Perfect for shelves, mantels, or table centerpieces.",
    //     defaultColor: "grey",
    //     colorOptions: [
    //         {
    //             name: "Nordic Grey",
    //             code: "grey",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0044.jpg",
    //                 "/decor-images/IMG-20250822-WA0045.jpg",
    //                 "/decor-images/IMG-20250822-WA0046.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 11),
    //     name: "Silver Snowflake Ornament Set",
    //     category: "Ornaments",
    //     material: "Metal and Crystal",
    //     price: 36.99,
    //     badge: "Elegant Collection",
    //     description: "Delicate silver snowflake ornaments with crystal accents. Each piece catches and reflects light beautifully.",
    //     defaultColor: "silver",
    //     colorOptions: [
    //         {
    //             name: "Silver Crystal",
    //             code: "silver",
    //             images: [
    //                 "/decor-images/4e454c0cbd2c4da4ac5e381d1e01681e.jpg",
    //                 "/decor-images/5c2fb62590c043db9b6bc85248004f2c.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 12),
    //     name: "Festive Door Wreath Collection",
    //     category: "Wreaths",
    //     material: "Artificial Pine and Decorative Elements",
    //     price: 69.99,
    //     badge: "Premium",
    //     description: "Luxurious holiday wreaths with rich decorative elements including pinecones, berries, and ribbon accents. Perfect for front door or wall display.",
    //     defaultColor: "green",
    //     colorOptions: [
    //         {
    //             name: "Traditional Green",
    //             code: "green",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0047.jpg",
    //                 "/decor-images/IMG-20250822-WA0048.jpg",
    //                 "/decor-images/IMG-20250822-WA0049.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 13),
    //     name: "Holiday Character Plush Set",
    //     category: "Plush Characters",
    //     material: "Premium Plush",
    //     price: 39.99,
    //     description: "Adorable set of holiday character plush decorations including Santa, reindeer, and snowman. Perfect for children's rooms or casual holiday decor.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Character Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0050.jpg",
    //                 "/decor-images/IMG-20250822-WA0051.jpg",
    //                 "/decor-images/IMG-20250822-WA0052.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 14),
    //     name: "LED Light String Collection",
    //     category: "Lights",
    //     material: "LED Lights with Clear Wire",
    //     price: 29.99,
    //     badge: "Energy Efficient",
    //     description: "Warm white LED light strings with multiple lighting modes. Perfect for tree decoration or creating ambient holiday lighting.",
    //     defaultColor: "warm white",
    //     colorOptions: [
    //         {
    //             name: "Warm White",
    //             code: "warmwhite",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0053.jpg",
    //                 "/decor-images/IMG-20250822-WA0054.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 15),
    //     name: "Luxury Gift Box Set",
    //     category: "Gift Accessories",
    //     material: "Premium Paper and Ribbon",
    //     price: 24.99,
    //     description: "Set of elegant gift boxes with matching ribbons and gift tags. Perfect for creating beautifully presented Christmas gifts.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0055.jpg",
    //                 "/decor-images/IMG-20250822-WA0056.jpg",
    //                 "/decor-images/IMG-20250822-WA0057.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 16),
    //     name: "Traditional Ball Ornament Collection",
    //     category: "Ornaments",
    //     material: "Glass",
    //     price: 45.99,
    //     badge: "Classic Collection",
    //     description: "Set of traditional glass ball ornaments in various festive colors and finishes. Includes matte, glossy, and glitter finishes.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0058.jpg",
    //                 "/decor-images/IMG-20250822-WA0059.jpg",
    //                 "/decor-images/IMG-20250822-WA0060.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 17),
    //     name: "Festive Wall Art Collection",
    //     category: "Wall Decorations",
    //     material: "Canvas and LED Lights",
    //     price: 34.99,
    //     description: "Beautiful holiday-themed wall art pieces with built-in LED lighting. Features classic Christmas scenes and messages.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Scene Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0061.jpg",
    //                 "/decor-images/IMG-20250822-WA0062.jpg",
    //                 "/decor-images/IMG-20250822-WA0063.jpg",
    //                 "/decor-images/IMG-20250822-WA0064.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 18),
    //     name: "Rustic Wooden Advent Calendar",
    //     category: "Wall Decorations",
    //     material: "Natural Wood and Fabric",
    //     price: 49.99,
    //     badge: "Handcrafted",
    //     description: "Traditional wooden advent calendar with 24 pockets. Features rustic design with red and green accents. Perfect for counting down to Christmas.",
    //     defaultColor: "natural",
    //     colorOptions: [
    //         {
    //             name: "Natural Wood",
    //             code: "natural",
    //             images: [
    //                 "/decor-images/dc28bdb1d5574a108e4b323e1e7408c2.jpg",
    //                 "/decor-images/defc259383b3426cb5cab20c816135df.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 19),
    //     name: "Premium Metallic Bauble Set",
    //     category: "Ornaments",
    //     material: "Glass with Metallic Finish",
    //     price: 39.99,
    //     badge: "Luxury Collection",
    //     description: "Set of high-end metallic finish baubles in various sizes. Perfect for creating an elegant tree display.",
    //     defaultColor: "mixed metallics",
    //     colorOptions: [
    //         {
    //             name: "Mixed Metallics",
    //             code: "metallics",
    //             images: [
    //                 "/decor-images/dfdac86ec98a4bffaa56e8ceb516f08c.jpg",
    //                 "/decor-images/ec25475a6a6f4c2e898a234d8589d478.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 20),
    //     name: "Deluxe Santa's Workshop Display",
    //     category: "Table Decorations",
    //     material: "Mixed Media with LED Lights",
    //     price: 79.99,
    //     badge: "Collector's Edition",
    //     description: "Elaborate Santa's workshop display with moving elements and LED lighting. Features detailed miniature furniture and workshop tools.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Scene Multi",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/f674dde349834724a1fbb1a0bb460ad1.jpg",
    //                 "/decor-images/f6ba67d558f54bb291ae4d048e348fec.jpg",
    //                 "/decor-images/8514c95b0fd94038b1acd5ff19edb3fc.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 21),
    //     name: "Vintage-Style Glass Ornament Collection",
    //     category: "Ornaments",
    //     material: "Hand-Painted Glass",
    //     price: 54.99,
    //     badge: "Limited Edition",
    //     description: "Collection of vintage-inspired glass ornaments featuring hand-painted designs and intricate patterns. Each piece is uniquely crafted.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Vintage Multi",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/7427633500e14419aaf74c6fe5ec5f5b.jpg",
    //                 "/decor-images/746bb7e675774df69b696fa7a0981491.jpg",
    //                 "/decor-images/ad82bd37d0cd42608d580e67abaa6b08.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 22),
    //     name: "Illuminated Christmas Scene",
    //     category: "Table Decorations",
    //     material: "Resin and LED Lights",
    //     price: 64.99,
    //     description: "Beautifully detailed Christmas village scene with built-in LED lighting. Features multiple buildings and figurines.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Scene Multi",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/WhatsApp Image 2025-08-25 at 11.07.41_fbb003f0.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 23),
    //     name: "Deluxe Nutcracker Guard Set",
    //     category: "Table Decorations",
    //     material: "Hand-painted Wood",
    //     price: 89.99,
    //     badge: "Collector's Item",
    //     description: "Set of traditional nutcracker figures in royal guard uniforms. Each piece is intricately hand-painted with gold accents and rich colors.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Traditional Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0009.jpg",
    //                 "/decor-images/IMG-20250822-WA0024.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 24),
    //     name: "Premium Window Light Display",
    //     category: "Lights",
    //     material: "LED and Acrylic",
    //     price: 44.99,
    //     badge: "Energy Efficient",
    //     description: "Beautiful window light display featuring cascading LED lights. Multiple lighting modes and timer function included.",
    //     defaultColor: "warm white",
    //     colorOptions: [
    //         {
    //             name: "Warm White",
    //             code: "warmwhite",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0035.jpg",
    //                 "/decor-images/IMG-20250822-WA0036.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 25),
    //     name: "Musical Christmas Train Set",
    //     category: "Table Decorations",
    //     material: "Metal and LED Lights",
    //     price: 89.99,
    //     badge: "Interactive",
    //     description: "Deluxe animated Christmas train set with LED lights, moving parts, and musical features. Perfect for under-tree display or table centerpiece. Includes multiple train cars and track pieces.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/f674dde349834724a1fbb1a0bb460ad1.jpg",
    //                 "/decor-images/f6ba67d558f54bb291ae4d048e348fec.jpg",
    //                 "/decor-images/8514c95b0fd94038b1acd5ff19edb3fc.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 26),
    //     name: "Luxury Gift Wrap Bundle",
    //     category: "Gift Accessories",
    //     material: "Premium Paper and Ribbons",
    //     price: 29.99,
    //     description: "Complete gift wrapping set including premium papers, ribbons, gift tags, and decorative elements. Perfect for creating stunning presents.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Collection",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0039.jpg",
    //                 "/decor-images/IMG-20250822-WA0040.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 27),
    //     name: "Musical Snow Globe Collection",
    //     category: "Table Decorations",
    //     material: "Glass and Resin",
    //     price: 59.99,
    //     badge: "Musical",
    //     description: "Set of musical snow globes featuring different Christmas scenes. Each globe plays a classic holiday tune.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Scene Collection",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0041.jpg",
    //                 "/decor-images/IMG-20250822-WA0042.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 28),
    //     name: "Deluxe Christmas Pillow Set",
    //     category: "Home Accessories",
    //     material: "Premium Velvet",
    //     price: 49.99,
    //     description: "Set of decorative Christmas pillows featuring festive designs and premium velvet fabric. Perfect for couches and beds.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0043.jpg",
    //                 "/decor-images/IMG-20250822-WA0044.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 29),
    //     name: "Premium Nativity Scene Set",
    //     category: "Table Decorations",
    //     material: "Hand-painted Resin",
    //     price: 99.99,
    //     badge: "Premium Collection",
    //     description: "Beautifully detailed nativity scene with hand-painted figures. Includes stable structure with LED lighting effects.",
    //     defaultColor: "traditional",
    //     colorOptions: [
    //         {
    //             name: "Traditional",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0045.jpg",
    //                 "/decor-images/IMG-20250822-WA0046.jpg",
    //                 "/decor-images/IMG-20250822-WA0047.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 30),
    //     name: "Victorian Santa Figure",
    //     category: "Collectible Figures",
    //     material: "Hand-painted Resin",
    //     price: 79.99,
    //     badge: "Limited Edition",
    //     description: "Elegant Victorian-style Santa figure in rich burgundy robes. Features intricate detailing and metallic accents. Perfect as a centerpiece or mantel decoration.",
    //     defaultColor: "burgundy",
    //     colorOptions: [
    //         {
    //             name: "Traditional",
    //             code: "burgundy",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0048.jpg",
    //                 "/decor-images/IMG-20250822-WA0049.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 31),
    //     name: "Crystal Icicle Light Set",
    //     category: "Lights",
    //     material: "Crystal Acrylic and LED",
    //     price: 54.99,
    //     badge: "Premium",
    //     description: "Stunning crystal-look icicle light set with 200 bright LED bulbs. Features 8 lighting modes and crystal-clear drops.",
    //     defaultColor: "clear",
    //     colorOptions: [
    //         {
    //             name: "Crystal Clear",
    //             code: "clear",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0050.jpg",
    //                 "/decor-images/IMG-20250822-WA0051.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 32),
    //     name: "Rustic Wooden Star Set",
    //     category: "Wall Decorations",
    //     material: "Natural Wood and LED",
    //     price: 45.99,
    //     description: "Set of three wooden stars with warm LED lighting. Features rustic finish and natural wood grain. Perfect for wall or window display.",
    //     defaultColor: "natural",
    //     colorOptions: [
    //         {
    //             name: "Natural Wood",
    //             code: "natural",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0052.jpg",
    //                 "/decor-images/IMG-20250822-WA0053.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 33),
    //     name: "Premium Holly Garland",
    //     category: "Garlands",
    //     material: "Artificial Leaves and Berries",
    //     price: 39.99,
    //     description: "Lush artificial holly garland with realistic leaves and bright red berries. Perfect for mantels, staircases, or doorways.",
    //     defaultColor: "green",
    //     colorOptions: [
    //         {
    //             name: "Traditional Green",
    //             code: "green",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0054.jpg",
    //                 "/decor-images/IMG-20250822-WA0055.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 34),
    //     name: "Animated Santa's Workshop",
    //     category: "Table Decorations",
    //     material: "Mixed Media with Moving Parts",
    //     price: 129.99,
    //     badge: "Interactive",
    //     description: "Large animated Santa's workshop scene with moving elves, working conveyor belt, and LED lighting. Features musical accompaniment.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Scene Multi",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0056.jpg",
    //                 "/decor-images/IMG-20250822-WA0057.jpg",
    //                 "/decor-images/IMG-20250822-WA0058.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 35),
    //     name: "Deluxe Angel Tree Topper",
    //     category: "Tree Toppers",
    //     material: "Fabric and LED Lights",
    //     price: 69.99,
    //     badge: "Premium Collection",
    //     description: "Elegant angel tree topper with flowing robes and illuminated wings. Features warm white LED lights and golden accents.",
    //     defaultColor: "ivory",
    //     colorOptions: [
    //         {
    //             name: "Classic Ivory",
    //             code: "ivory",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0059.jpg",
    //                 "/decor-images/IMG-20250822-WA0060.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 36),
    //     name: "Nordic Christmas Gnome Set",
    //     category: "Table Decorations",
    //     material: "Premium Fabric and Faux Fur",
    //     price: 49.99,
    //     description: "Set of three Nordic-style Christmas gnomes with luxury faux fur beards and knitted hats. Perfect for shelf or table display.",
    //     defaultColor: "grey",
    //     colorOptions: [
    //         {
    //             name: "Nordic Grey",
    //             code: "grey",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0061.jpg",
    //                 "/decor-images/IMG-20250822-WA0062.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 37),
    //     name: "Luxury Gift Box Tower",
    //     category: "Gift Accessories",
    //     material: "Premium Card and Ribbon",
    //     price: 34.99,
    //     badge: "Best Value",
    //     description: "Set of nested decorative gift boxes in various sizes. Features elegant design with pre-attached bows. Perfect for display or actual gift giving.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Classic Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0063.jpg",
    //                 "/decor-images/IMG-20250822-WA0064.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 38),
    //     name: "Vintage Glass Bell Collection",
    //     category: "Ornaments",
    //     material: "Hand-blown Glass",
    //     price: 59.99,
    //     badge: "Artisan Crafted",
    //     description: "Collection of hand-blown glass bells with vintage-inspired designs. Each piece features delicate paintwork and golden accents.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Vintage Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/7427633500e14419aaf74c6fe5ec5f5b.jpg",
    //                 "/decor-images/746bb7e675774df69b696fa7a0981491.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 39),
    //     name: "Illuminated Window Wreath",
    //     category: "Wreaths",
    //     material: "Artificial Greenery and LED",
    //     price: 84.99,
    //     badge: "New Arrival",
    //     description: "Large illuminated wreath with warm white LED lights. Features realistic greenery, pinecones, and battery-operated timer function.",
    //     defaultColor: "green",
    //     colorOptions: [
    //         {
    //             name: "Natural Green",
    //             code: "green",
    //             images: [
    //                 "/decor-images/dfdac86ec98a4bffaa56e8ceb516f08c.jpg",
    //                 "/decor-images/ec25475a6a6f4c2e898a234d8589d478.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 40),
    //     name: "Deluxe Christmas Village House",
    //     category: "Table Decorations",
    //     material: "Ceramic with LED",
    //     price: 89.99,
    //     badge: "Collector's Series",
    //     description: "Detailed ceramic village house with intricate Victorian architecture. Features warm LED lighting and hand-painted details. Part of the collector's village series.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Traditional",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/f674dde349834724a1fbb1a0bb460ad1.jpg",
    //                 "/decor-images/f6ba67d558f54bb291ae4d048e348fec.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 41),
    //     name: "Musical Carousel Display",
    //     category: "Table Decorations",
    //     material: "Metal and Glass",
    //     price: 119.99,
    //     badge: "Musical",
    //     description: "Rotating musical carousel with holiday scenes. Features LED lighting, plays 8 classic Christmas tunes, and includes miniature horses.",
    //     defaultColor: "gold",
    //     colorOptions: [
    //         {
    //             name: "Antique Gold",
    //             code: "gold",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0024.jpg",
    //                 "/decor-images/IMG-20250822-WA0025.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 42),
    //     name: "Premium Pine Garland Set",
    //     category: "Garlands",
    //     material: "Artificial Pine with Lights",
    //     price: 64.99,
    //     description: "9-foot premium artificial pine garland with integrated LED lights. Includes pine cones and berries. Perfect for mantels and staircases.",
    //     defaultColor: "green",
    //     colorOptions: [
    //         {
    //             name: "Forest Green",
    //             code: "green",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0026.jpg",
    //                 "/decor-images/IMG-20250822-WA0027.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 43),
    //     name: "Luxury Beaded Tree Skirt",
    //     category: "Tree Accessories",
    //     material: "Velvet with Glass Beads",
    //     price: 79.99,
    //     badge: "Premium",
    //     description: "Elegant tree skirt featuring hand-beaded snowflake patterns on luxury velvet. 48-inch diameter with metallic thread accents.",
    //     defaultColor: "cream",
    //     colorOptions: [
    //         {
    //             name: "Cream Gold",
    //             code: "cream",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0028.jpg",
    //                 "/decor-images/IMG-20250822-WA0029.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 44),
    //     name: "3D Holographic Window Display",
    //     category: "Lights",
    //     material: "Holographic Film with LED",
    //     price: 69.99,
    //     badge: "Innovation",
    //     description: "Advanced holographic window display creating 3D Christmas scenes. Features multiple animation patterns and remote control.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Multi Color",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0030.jpg",
    //                 "/decor-images/IMG-20250822-WA0031.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 45),
    //     name: "Deluxe Gift Wrapping Station",
    //     category: "Gift Accessories",
    //     material: "Mixed Materials",
    //     price: 149.99,
    //     badge: "Complete Set",
    //     description: "Professional-grade gift wrapping station including premium papers, ribbons, bows, tags, and organizing storage. Perfect for creating beautiful packages.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Collection",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0032.jpg",
    //                 "/decor-images/IMG-20250822-WA0033.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 46),
    //     name: "Vintage Sleigh Display",
    //     category: "Table Decorations",
    //     material: "Hand-painted Metal",
    //     price: 94.99,
    //     badge: "Vintage Style",
    //     description: "Large decorative sleigh in vintage style. Perfect for creating holiday displays or as a beautiful gift holder. Features intricate detailing.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Vintage Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0034.jpg",
    //                 "/decor-images/IMG-20250822-WA0035.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 47),
    //     name: "Luxury Advent Calendar House",
    //     category: "Wall Decorations",
    //     material: "Wood with LED",
    //     price: 129.99,
    //     badge: "Limited Edition",
    //     description: "Illuminated wooden house advent calendar with 24 doors. Features detailed laser-cut design and warm LED lighting.",
    //     defaultColor: "natural",
    //     colorOptions: [
    //         {
    //             name: "Natural Wood",
    //             code: "natural",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0036.jpg",
    //                 "/decor-images/IMG-20250822-WA0037.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 48),
    //     name: "Crystal Snowflake Mobile",
    //     category: "Hanging Decorations",
    //     material: "Crystal and Metal",
    //     price: 59.99,
    //     description: "Elegant hanging mobile featuring crystal snowflakes. Catches and reflects light beautifully. Perfect for windows or entryways.",
    //     defaultColor: "clear",
    //     colorOptions: [
    //         {
    //             name: "Crystal Clear",
    //             code: "clear",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0038.jpg",
    //                 "/decor-images/IMG-20250822-WA0039.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 49),
    //     name: "Ultimate Christmas Corner Scene",
    //     category: "Room Decorations",
    //     material: "Mixed Materials with LED",
    //     price: 199.99,
    //     badge: "Premium Collection",
    //     description: "Complete room corner decoration set including illuminated tree, presents, figurines, and surrounding decorative elements. Perfect for creating an instant Christmas display.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Traditional Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0040.jpg",
    //                 "/decor-images/IMG-20250822-WA0041.jpg",
    //                 "/decor-images/IMG-20250822-WA0042.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 50),
    //     name: "Traditional Santa Wall Hanging",
    //     category: "Wall Decorations",
    //     material: "Premium Fabric",
    //     price: 39.99,
    //     description: "Classic Santa Claus wall hanging with festive 'Merry Christmas' text. Features plush fabric and detailed embroidery.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Classic Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0009.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 51),
    //     name: "Premium LED Light Chain",
    //     category: "Lights",
    //     material: "LED and Copper Wire",
    //     price: 39.99,
    //     badge: "Energy Efficient",
    //     description: "Flexible copper wire LED light chain with warm white lights. Perfect for wrapping around trees, railings, or creating custom light displays.",
    //     defaultColor: "warm white",
    //     colorOptions: [
    //         {
    //             name: "Warm White",
    //             code: "warmwhite",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0037.jpg",
    //                 "/decor-images/IMG-20250822-WA0038.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 52),
    //     name: "Premium Glass Ornament Collection",
    //     category: "Ornaments",
    //     material: "Hand-painted Glass",
    //     price: 49.99,
    //     badge: "Luxury",
    //     description: "Set of exquisite hand-painted glass ornaments featuring traditional holiday motifs. Each piece is individually crafted.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Traditional Mix",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/daa0b47afb11469c9c71c77f4833f3c3.jpg",
    //                 "/decor-images/dc28bdb1d5574a108e4b323e1e7408c2.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 53),
    //     name: "Rustic Wooden Calendar House",
    //     category: "Wall Decorations",
    //     material: "Natural Wood",
    //     price: 79.99,
    //     badge: "Handcrafted",
    //     description: "Beautiful wooden advent calendar house with 24 numbered doors. Features natural wood finish and intricate detailing.",
    //     defaultColor: "natural",
    //     colorOptions: [
    //         {
    //             name: "Natural Wood",
    //             code: "natural",
    //             images: [
    //                 "/decor-images/defc259383b3426cb5cab20c816135df.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 54),
    //     name: "Metallic Bauble Collection",
    //     category: "Ornaments",
    //     material: "Glass with Metallic Finish",
    //     price: 54.99,
    //     description: "Elegant set of metallic finish Christmas baubles in various sizes. Perfect for creating a sophisticated tree display.",
    //     defaultColor: "mixed metallics",
    //     colorOptions: [
    //         {
    //             name: "Mixed Metallics",
    //             code: "metallics",
    //             images: [
    //                 "/decor-images/dfdac86ec98a4bffaa56e8ceb516f08c.jpg",
    //                 "/decor-images/ec25475a6a6f4c2e898a234d8589d478.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 55),
    //     name: "Deluxe Santa's Workshop Scene",
    //     category: "Table Decorations",
    //     material: "Mixed Media with LED",
    //     price: 149.99,
    //     badge: "Premium Collection",
    //     description: "Large-scale Santa's workshop display featuring multiple moving elements, LED lighting, and intricate details. A perfect centerpiece for holiday decoration.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Scene Multi",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/f674dde349834724a1fbb1a0bb460ad1.jpg",
    //                 "/decor-images/f6ba67d558f54bb291ae4d048e348fec.jpg",
    //                 "/decor-images/8514c95b0fd94038b1acd5ff19edb3fc.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 56),
    //     name: "Luxury Glass Ball Set",
    //     category: "Ornaments",
    //     material: "Glass with Glitter Finish",
    //     price: 64.99,
    //     badge: "Premium",
    //     description: "Set of luxury glass ball ornaments featuring glitter finishes and intricate patterns. Perfect for creating a stunning tree display.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Holiday Sparkle",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0058.jpg",
    //                 "/decor-images/IMG-20250822-WA0059.jpg",
    //                 "/decor-images/IMG-20250822-WA0060.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 57),
    //     name: "LED Christmas Canvas Art",
    //     category: "Wall Decorations",
    //     material: "Canvas with LED Lights",
    //     price: 59.99,
    //     description: "Festive canvas wall art with integrated LED lights. Features a beautiful Christmas scene that lights up for added ambiance.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Scene Light",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0061.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 58),
    //     name: "Animated Christmas Village Display",
    //     category: "Table Decorations",
    //     material: "Porcelain and LED",
    //     price: 159.99,
    //     badge: "Collector's Edition",
    //     description: "Large animated village display with multiple buildings, moving figures, and LED lighting. Features a working train and musical accompaniment.",
    //     defaultColor: "multi",
    //     colorOptions: [
    //         {
    //             name: "Village Scene",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0043.jpg",
    //                 "/decor-images/IMG-20250822-WA0044.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 59),
    //     name: "Luxury Velvet Tree Skirt",
    //     category: "Tree Accessories",
    //     material: "Premium Velvet",
    //     price: 69.99,
    //     badge: "Premium",
    //     description: "Elegant tree skirt in rich velvet with metallic embroidery and beaded accents. Features a generous 52-inch diameter.",
    //     defaultColor: "burgundy",
    //     colorOptions: [
    //         {
    //             name: "Royal Burgundy",
    //             code: "burgundy",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0045.jpg",
    //                 "/decor-images/IMG-20250822-WA0046.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 60),
    //     name: "Deluxe Window Candle Set",
    //     category: "Lights",
    //     material: "Metal and LED",
    //     price: 49.99,
    //     description: "Set of 4 battery-operated LED window candles with timers. Features traditional design with warm white light.",
    //     defaultColor: "brass",
    //     colorOptions: [
    //         {
    //             name: "Antique Brass",
    //             code: "brass",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0047.jpg",
    //                 "/decor-images/IMG-20250822-WA0048.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 61),
    //     name: "Premium Nativity Figurine Set",
    //     category: "Collectible Figures",
    //     material: "Hand-painted Resin",
    //     price: 129.99,
    //     badge: "Limited Edition",
    //     description: "Complete 12-piece nativity set with hand-painted figures and stable. Each piece features exceptional detail and artistry.",
    //     defaultColor: "traditional",
    //     colorOptions: [
    //         {
    //             name: "Traditional",
    //             code: "multi",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0049.jpg",
    //                 "/decor-images/IMG-20250822-WA0050.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 62),
    //     name: "Nordic Style Advent Calendar",
    //     category: "Wall Decorations",
    //     material: "Wood and Fabric",
    //     price: 54.99,
    //     description: "Scandinavian-inspired advent calendar with 24 numbered pockets. Features minimalist design and natural materials.",
    //     defaultColor: "natural",
    //     colorOptions: [
    //         {
    //             name: "Natural Wood",
    //             code: "natural",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0051.jpg",
    //                 "/decor-images/IMG-20250822-WA0052.jpg"
    //             ],
    //             inStock: true
    //         }
    //     ]
    // },
    // {
    //     id: generateId(1, 63),
    //     name: "Deluxe Christmas Gift Sack Set",
    //     category: "Gift Accessories",
    //     material: "Premium Fabric",
    //     price: 34.99,
    //     badge: "Best Value",
    //     description: "Set of 3 large decorative gift sacks in varying sizes. Perfect for oversized presents and creating a traditional Christmas morning display.",
    //     defaultColor: "red",
    //     colorOptions: [
    //         {
    //             name: "Traditional Red",
    //             code: "red",
    //             images: [
    //                 "/decor-images/IMG-20250822-WA0053.jpg",
    //                 "/decor-images/IMG-20250822-WA0054.jpg"
    //             ],
    //             inStock: true
            // }
        // ]
    // }
];

export default decors;
