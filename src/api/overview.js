import api from './axios'

// ── Mock data — remove when backend is ready ──────────
const mockOverview = {
  stats: {
    orders_today:    24,
    orders_yesterday: 21,
    revenue:         840,
    pending:         7,
    out_of_stock:    3,
  },
  recent_orders: [
    { id: 1042, buyer_name: 'Ama Owusu',    total: 240, status: 'pending',   created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString()        },
    { id: 1041, buyer_name: 'Kofi Asante',  total: 85,  status: 'paid',      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()   },
    { id: 1040, buyer_name: 'Abena Mensah', total: 420, status: 'preparing', created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()   },
    { id: 1039, buyer_name: 'Kweku Darko',  total: 120, status: 'ready',     created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString()  },
    { id: 1038, buyer_name: 'Efua Boateng', total: 180, status: 'delivered', created_at: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString()  },
  ],
  activity: [
    { id: 1, type: 'new_order',     title: 'New order from Ama Owusu',      sub: '2 items · GH₵ 240 · Pickup',   time: new Date(Date.now() - 1000 * 60 * 2).toISOString()       },
    { id: 2, type: 'marked_paid',   title: 'Order #1041 marked as paid',    sub: 'Kofi Asante · GH₵ 85',          time: new Date(Date.now() - 1000 * 60 * 60).toISOString()      },
    { id: 3, type: 'new_order',     title: 'New order from Abena Mensah',   sub: '3 items · GH₵ 420 · Delivery',  time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()  },
    { id: 4, type: 'status_change', title: 'Order #1039 marked ready',      sub: 'Kweku Darko · GH₵ 120',         time: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
    { id: 5, type: 'new_order',     title: 'New order from Yaw Boateng',    sub: '2 items · GH₵ 310 · Pickup',   time: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString() },
    { id: 6, type: 'marked_paid',   title: 'Order #1036 marked as paid',    sub: 'Akosua Frimpong · GH₵ 95',      time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
  ],
  store_url: 'kweek.app/store/kwame-mensah',
}

export const overviewApi = {
  async getOverview() {
    await new Promise(r => setTimeout(r, 600))
    return mockOverview
  },
}