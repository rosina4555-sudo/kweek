// import api from './axios'

// const mockStore = {
//   id: 1,
//   name: "Ama's Boutique",
//   description: 'Quality African fashion delivered to your door. Based in Accra.',
//   whatsapp: '+233240001234',
//   logo_url: null,
//   banner_url: null,
// }

// const mockProducts = [
//   {
//     id: 1,
//     name: 'Ankara Wrap Dress',
//     description: 'Beautiful hand-crafted ankara wrap dress made from premium imported fabric. Fully lined, with an adjustable wrap tie. Suitable for both casual and formal occasions.',
//     price: 160,
//     stock: 12,
//     is_active: true,
//     sizes:  ['XS', 'S', 'M', 'L', 'XL'],
//     colors: ['Red & Gold', 'Blue & White', 'Green & Black'],
//     images: [
//       { id: 1, url: 'https://placehold.co/800x800/1a1d23/9ca3af?text=Ankara+Dress', is_cover: true  },
//       { id: 2, url: 'https://placehold.co/800x800/2d3340/9ca3af?text=Side+View',    is_cover: false },
//       { id: 3, url: 'https://placehold.co/800x800/161a23/9ca3af?text=Back+View',    is_cover: false },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Kente Tote Bag',
//     description: 'Handwoven kente tote bag. Perfect for everyday use.',
//     price: 80,
//     stock: 5,
//     is_active: true,
//     sizes:  [],
//     colors: ['Brown', 'Black', 'Natural'],
//     images: [
//       { id: 3, url: 'https://placehold.co/800x800/1a1d23/9ca3af?text=Kente+Bag', is_cover: true },
//     ],
//   },
// ]

// export const storefrontApi = {
//   async getStore(sellerId) {
//     await new Promise(r => setTimeout(r, 400))
//     return mockStore
//   },

//   async getProduct(sellerId, productId) {
//     await new Promise(r => setTimeout(r, 500))
//     const product = mockProducts.find(p => p.id === Number(productId))
//     if (!product) throw new Error('Product not found')
//     return { store: mockStore, product }
//   },

//   async placeOrder(sellerId, payload) {
//     await new Promise(r => setTimeout(r, 800))
//     return {
//       id:         Math.floor(Math.random() * 9000) + 1000,
//       ...payload,
//       status:     'pending',
//       created_at: new Date().toISOString(),
//     }
//   },
// }



import api from './axios'

const mockStore = {
  id: 1,
  name: "Ama's Boutique",
  description: 'Quality African fashion delivered to your door. Based in Accra, Ghana. DM us on WhatsApp to ask questions before ordering.',
  whatsapp: '+233240001234',
  logo_url: null,
  banner_url: null,
}

const mockProducts = [
  {
    id: 1,
    name: 'Ankara Wrap Dress',
    description: 'Beautiful hand-crafted ankara wrap dress made from premium imported fabric.',
    price: 160,
    stock: 12,
    is_active: true,
    sizes:  ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red & Gold', 'Blue & White', 'Green & Black'],
    images: [
      { id: 1, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Ankara+Dress', is_cover: true  },
      { id: 2, url: 'https://placehold.co/600x600/2d3340/9ca3af?text=Side+View',    is_cover: false },
    ],
  },
  {
    id: 2,
    name: 'Kente Tote Bag',
    description: 'Handwoven kente tote bag, perfect for everyday use.',
    price: 80,
    stock: 5,
    is_active: true,
    sizes:  [],
    colors: ['Brown', 'Black', 'Natural'],
    images: [
      { id: 3, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Kente+Bag', is_cover: true },
    ],
  },
  {
    id: 3,
    name: 'Dashiki Shirt',
    description: 'Classic dashiki shirt with embroidered collar detail.',
    price: 85,
    stock: 0,
    is_active: true,
    sizes:  ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'White', 'Black'],
    images: [
      { id: 4, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Dashiki', is_cover: true },
    ],
  },
  {
    id: 4,
    name: 'Leather Sandals',
    description: 'Handmade leather sandals with adjustable straps.',
    price: 120,
    stock: 8,
    is_active: true,
    sizes:  ['38', '39', '40', '41', '42', '43', '44'],
    colors: ['Brown', 'Tan', 'Black'],
    images: [
      { id: 5, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Sandals', is_cover: true },
    ],
  },
  {
    id: 5,
    name: 'Beaded Necklace',
    description: 'Handcrafted beaded necklace with traditional patterns.',
    price: 70,
    stock: 20,
    is_active: true,
    sizes:  [],
    colors: ['Multicolor', 'Gold', 'Silver'],
    images: [
      { id: 6, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Necklace', is_cover: true },
    ],
  },
  {
    id: 6,
    name: 'Wax Print Skirt',
    description: 'Vibrant wax print midi skirt with elasticated waist.',
    price: 110,
    stock: 3,
    is_active: true,
    sizes:  ['S', 'M', 'L'],
    colors: ['Purple & Gold', 'Orange & Black'],
    images: [
      { id: 7, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Skirt', is_cover: true },
    ],
  },
  {
    id: 7,
    name: 'Kente Cloth',
    description: 'Traditional handwoven kente cloth. Perfect for special occasions.',
    price: 300,
    stock: 4,
    is_active: true,
    sizes:  ['2 yards', '4 yards', '6 yards'],
    colors: ['Gold & Green', 'Blue & Gold', 'Red & Black'],
    images: [
      { id: 8, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Kente', is_cover: true },
    ],
  },
  {
    id: 8,
    name: 'Ankara Suit',
    description: 'Sharp ankara suit — jacket and trousers. Perfect for events.',
    price: 250,
    stock: 6,
    is_active: true,
    sizes:  ['S', 'M', 'L', 'XL'],
    colors: ['Navy & Gold', 'Black & White'],
    images: [
      { id: 9, url: 'https://placehold.co/600x600/1a1d23/9ca3af?text=Suit', is_cover: true },
    ],
  },
]

export const storefrontApi = {
  async getStore(sellerId) {
    await new Promise(r => setTimeout(r, 500))
    return { store: mockStore, products: mockProducts.filter(p => p.is_active) }
  },

  async getProduct(sellerId, productId) {
    await new Promise(r => setTimeout(r, 400))
    const product = mockProducts.find(p => p.id === Number(productId))
    if (!product) throw new Error('Product not found')
    return { store: mockStore, product }
  },

  async placeOrder(sellerId, payload) {
    await new Promise(r => setTimeout(r, 800))
    return {
      id:         Math.floor(Math.random() * 9000) + 1000,
      ...payload,
      status:     'pending',
      created_at: new Date().toISOString(),
    }
  },
}