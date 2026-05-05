import api from './axios'

function generateDailyData(days = 30) {
  const result = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    result.push({
      date:     date.toISOString().split('T')[0],
      orders:   Math.floor(Math.random() * 12) + 1,
      revenue:  Math.floor(Math.random() * 800) + 100,
    })
  }
  return result
}

const mockAnalytics = {
  summary: {
    total_revenue:     12840,
    revenue_change:    18.4,   // % vs last period
    total_orders:      184,
    orders_change:     12.1,
    avg_order_value:   69.8,
    aov_change:        5.3,
    conversion_rate:   74,     // % of orders that get paid
    conversion_change: -2.1,
  },
  daily:  generateDailyData(30),
  by_status: [
    { status: 'delivered', count: 68  },
    { status: 'paid',      count: 48  },
    { status: 'preparing', count: 24  },
    { status: 'ready',     count: 18  },
    { status: 'pending',   count: 26  },
  ],
  top_products: [
    { name: 'Ankara Wrap Dress',  orders: 42, revenue: 6720 },
    { name: 'Leather Sandals',    orders: 31, revenue: 3720 },
    { name: 'Kente Tote Bag',     orders: 28, revenue: 2240 },
    { name: 'Wax Print Skirt',    orders: 19, revenue: 2090 },
    { name: 'Dashiki Shirt',      orders: 17, revenue: 1445 },
    { name: 'Beaded Necklace',    orders: 14, revenue: 980  },
  ],
  by_day: [
    { day: 'Mon', orders: 18 },
    { day: 'Tue', orders: 24 },
    { day: 'Wed', orders: 31 },
    { day: 'Thu', orders: 28 },
    { day: 'Fri', orders: 42 },
    { day: 'Sat', orders: 38 },
    { day: 'Sun', orders: 14 },
  ],
}

export const analyticsApi = {
  async getAnalytics(period = '30d') {
    await new Promise(r => setTimeout(r, 700))
    return mockAnalytics
  },
}