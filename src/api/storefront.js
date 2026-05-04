import api from './axios'

const mockStore = {
  id: 1,
  name: "Ama's Boutique",
  description: 'Quality African fashion delivered to your door. Based in Accra.',
  whatsapp: '+233240001234',
  logo_url: null,
  banner_url: null,
}

const mockProducts = [
  {
    id: 1,
    name: 'Ankara Wrap Dress',
    description: 'Beautiful hand-crafted ankara wrap dress made from premium imported fabric. Fully lined, with an adjustable wrap tie. Suitable for both casual and formal occasions.',
    price: 160,
    stock: 12,
    is_active: true,
    sizes:  ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red & Gold', 'Blue & White', 'Green & Black'],
    images: [
      { id: 1, url: 'https://placehold.co/800x800/1a1d23/9ca3af?text=Ankara+Dress', is_cover: true  },
      { id: 2, url: 'https://placehold.co/800x800/2d3340/9ca3af?text=Side+View',    is_cover: false },
      { id: 3, url: 'https://placehold.co/800x800/161a23/9ca3af?text=Back+View',    is_cover: false },
    ],
  },
  {
    id: 2,
    name: 'Kente Tote Bag',
    description: 'Handwoven kente tote bag. Perfect for everyday use.',
    price: 80,
    stock: 5,
    is_active: true,
    sizes:  [],
    colors: ['Brown', 'Black', 'Natural'],
    images: [
      { id: 3, url: 'https://placehold.co/800x800/1a1d23/9ca3af?text=Kente+Bag', is_cover: true },
    ],
  },
]

export const storefrontApi = {
  async getStore(sellerId) {
    await new Promise(r => setTimeout(r, 400))
    return mockStore
  },

  async getProduct(sellerId, productId) {
    await new Promise(r => setTimeout(r, 500))
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