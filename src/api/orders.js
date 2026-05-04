// import api from './axios'

// export const ordersApi = {
//   async getOrders(params = {}) {
//     const { data } = await api.get('/orders', { params })
//     return data // { orders: [], total: 0, revenue: 0 }
//   },

//   async getOrder(id) {
//     const { data } = await api.get(`/orders/${id}`)
//     return data
//   },

//   async updateOrder(id, payload) {
//     const { data } = await api.patch(`/orders/${id}`, payload)
//     return data
//   },

//   async exportCSV(params = {}) {
//     const response = await api.get('/orders/export', {
//       params,
//       responseType: 'blob',
//     })
//     return response.data
//   },
// }


const mockOrders = [
  {
    id: 1042,
    buyer_name: 'Ama Owusu',
    buyer_phone: '+233 24 000 1111',
    total: 240,
    status: 'pending',
    delivery_method: 'pickup',
    notes: 'Please call before delivery. Gate is on the left side.',
    created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    items: [
      { id: 1, product_name: 'Ankara Dress', size: 'M', color: 'Blue', quantity: 1, price_at_time: 160 },
      { id: 2, product_name: 'Kente Bag',    size: null, color: 'Brown', quantity: 1, price_at_time: 80 },
    ],
  },
  {
    id: 1041,
    buyer_name: 'Kofi Asante',
    buyer_phone: '+233 20 555 2222',
    total: 85,
    status: 'paid',
    delivery_method: 'delivery',
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    items: [
      { id: 3, product_name: 'Dashiki Shirt', size: 'L', color: 'White', quantity: 1, price_at_time: 85 },
    ],
  },
  {
    id: 1040,
    buyer_name: 'Abena Mensah',
    buyer_phone: '+233 55 444 3333',
    total: 420,
    status: 'preparing',
    delivery_method: 'delivery',
    notes: 'Fragile items, please handle with care.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    items: [
      { id: 4, product_name: 'Kente Cloth',   size: null, color: 'Gold',  quantity: 2, price_at_time: 150 },
      { id: 5, product_name: 'Beaded Necklace', size: null, color: null,  quantity: 1, price_at_time: 120 },
    ],
  },
  {
    id: 1039,
    buyer_name: 'Kweku Darko',
    buyer_phone: '+233 27 888 4444',
    total: 120,
    status: 'ready',
    delivery_method: 'pickup',
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    items: [
      { id: 6, product_name: 'Batik Shirt', size: 'XL', color: 'Black', quantity: 1, price_at_time: 120 },
    ],
  },
  {
    id: 1038,
    buyer_name: 'Efua Boateng',
    buyer_phone: '+233 24 123 5555',
    total: 180,
    status: 'delivered',
    delivery_method: 'delivery',
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    items: [
      { id: 7, product_name: 'Wax Print Skirt', size: 'S',  color: 'Red',   quantity: 1, price_at_time: 100 },
      { id: 8, product_name: 'Ankara Bag',       size: null, color: 'Mixed', quantity: 1, price_at_time: 80  },
    ],
  },
  {
    id: 1037,
    buyer_name: 'Yaw Mensah',
    buyer_phone: '+233 26 777 6666',
    total: 320,
    status: 'pending',
    delivery_method: 'delivery',
    notes: 'Leave at the gate if no one is home.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
    items: [
      { id: 9,  product_name: 'Kente Shirt', size: 'M',  color: 'Green', quantity: 2, price_at_time: 110 },
      { id: 10, product_name: 'Dashiki Cap', size: null, color: 'Black', quantity: 1, price_at_time: 100 },
    ],
  },
  {
    id: 1036,
    buyer_name: 'Akua Frimpong',
    buyer_phone: '+233 23 999 7777',
    total: 65,
    status: 'paid',
    delivery_method: 'pickup',
    notes: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    items: [
      { id: 11, product_name: 'Ankara Headwrap', size: null, color: 'Purple', quantity: 1, price_at_time: 65 },
    ],
  },
]

const delay = (ms) => new Promise(res => setTimeout(res, ms))

export const ordersApi = {
  async getOrders() {
    await delay(800) // simulate network
    const total   = mockOrders.length
    const revenue = mockOrders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + o.total, 0)
    return { orders: mockOrders, total, revenue }
  },

  async getOrder(id) {
    await delay(300)
    return mockOrders.find(o => o.id === id) ?? null
  },

  async updateOrder(id, payload) {
    await delay(400)
    const order = mockOrders.find(o => o.id === id)
    if (order) Object.assign(order, payload)
    return order
  },

  async exportCSV() {
    await delay(500)
    const headers = ['order_id', 'buyer_name', 'buyer_phone', 'total', 'status', 'delivery_method', 'created_at']
    const rows = mockOrders.map(o =>
      [o.id, o.buyer_name, o.buyer_phone, o.total, o.status, o.delivery_method, o.created_at].join(',')
    )
    const csv  = [headers.join(','), ...rows].join('\n')
    return new Blob([csv], { type: 'text/csv' })
  },
}