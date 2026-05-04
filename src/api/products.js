import api from './axios'

const mockProducts = [
  {
    id: 1,
    name: 'Ankara Wrap Dress',
    description: 'Beautiful hand-crafted ankara wrap dress. Available in multiple sizes.',
    price: 160,
    stock: 12,
    is_active: true,
    sizes:  ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Red & Gold', 'Blue & White', 'Green & Black'],
    images: [
      { id: 1, url: 'https://placehold.co/400x400/1a1d23/9ca3af?text=Ankara+Dress', is_cover: true  },
      { id: 2, url: 'https://placehold.co/400x400/1a1d23/9ca3af?text=Side+View',    is_cover: false },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
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
      { id: 3, url: 'https://placehold.co/400x400/1a1d23/9ca3af?text=Kente+Bag', is_cover: true },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 3,
    name: 'Dashiki Shirt',
    description: 'Classic dashiki shirt with embroidered collar detail.',
    price: 85,
    stock: 0,
    is_active: false,
    sizes:  ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'White', 'Black'],
    images: [
      { id: 4, url: 'https://placehold.co/400x400/1a1d23/9ca3af?text=Dashiki', is_cover: true },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
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
      { id: 5, url: 'https://placehold.co/400x400/1a1d23/9ca3af?text=Sandals', is_cover: true },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
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
      { id: 6, url: 'https://placehold.co/400x400/1a1d23/9ca3af?text=Necklace', is_cover: true },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
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
      { id: 7, url: 'https://placehold.co/400x400/1a1d23/9ca3af?text=Skirt', is_cover: true },
    ],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
]

let nextId = 10

export const productsApi = {
  async getProducts() {
    await new Promise(r => setTimeout(r, 600))
    return { products: mockProducts, total: mockProducts.length }
  },

  async createProduct(payload) {
    await new Promise(r => setTimeout(r, 800))
    const product = {
      id:         ++nextId,
      ...payload,
      images:     [],
      is_active:  true,
      created_at: new Date().toISOString(),
    }
    mockProducts.unshift(product)
    return product
  },

  async updateProduct(id, payload) {
    await new Promise(r => setTimeout(r, 600))
    const idx = mockProducts.findIndex(p => p.id === id)
    if (idx !== -1) Object.assign(mockProducts[idx], payload)
    return mockProducts[idx]
  },

  async deleteProduct(id) {
    await new Promise(r => setTimeout(r, 400))
    const idx = mockProducts.findIndex(p => p.id === id)
    if (idx !== -1) mockProducts.splice(idx, 1)
  },

  async uploadImages(productId, files) {
    await new Promise(r => setTimeout(r, 1000))
    return files.map((f, i) => ({
      id:       nextId + i,
      url:      URL.createObjectURL(f),
      is_cover: i === 0,
    }))
  },
}