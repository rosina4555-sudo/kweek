import { ref, computed } from 'vue'
import { analyticsApi } from '@/api/analytics'
import { useToast }     from '@/composables/useToast'

export function useAnalytics() {
  const toast   = useToast()
  const loading = ref(false)
  const period  = ref('30d')
  const data    = ref(null)

  const periods = [
    { key: '7d',  label: 'Last 7 days'  },
    { key: '30d', label: 'Last 30 days' },
    { key: '90d', label: 'Last 90 days' },
  ]

  async function fetchAnalytics() {
    loading.value = true
    try {
      data.value = await analyticsApi.getAnalytics(period.value)
    } catch (err) {
      toast.error(err.message)
    } finally {
      loading.value = false
    }
  }

  async function changePeriod(p) {
    period.value = p
    await fetchAnalytics()
  }

  // ── Chart configs ─────────────────────────────────────
  const isDark = () => document.documentElement.classList.contains('dark')

  const gridColor  = () => isDark() ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor  = () => isDark() ? '#6B7280' : '#9CA3AF'
  const brandColor = '#4F46E5'

  const revenueChartData = computed(() => {
    if (!data.value) return null
    const daily = data.value.daily
    return {
      labels: daily.map(d => {
        const date = new Date(d.date)
        return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
      }),
      datasets: [{
        label:           'Revenue (GH₵)',
        data:            daily.map(d => d.revenue),
        borderColor:     brandColor,
        backgroundColor: isDark()
          ? 'rgba(79,70,229,0.08)'
          : 'rgba(79,70,229,0.06)',
        borderWidth:     1.5,
        fill:            true,
        tension:         0.4,
        pointRadius:     0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: brandColor,
      }],
    }
  })

  const ordersChartData = computed(() => {
    if (!data.value) return null
    const daily = data.value.daily
    return {
      labels: daily.map(d => {
        const date = new Date(d.date)
        return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
      }),
      datasets: [{
        label:           'Orders',
        data:            daily.map(d => d.orders),
        borderColor:     isDark() ? '#374151' : '#E5E7EB',
        backgroundColor: isDark() ? '#1F2330' : '#F8F9FB',
        borderWidth:     1,
        fill:            true,
        tension:         0.4,
        pointRadius:     0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: brandColor,
      }],
    }
  })

  const statusChartData = computed(() => {
    if (!data.value) return null
    const items  = data.value.by_status
    const colors = isDark()
      ? ['#6EE7B7', '#A5B4FC', '#93C5FD', '#C4B5FD', '#6B7280']
      : ['#065F46', '#4F46E5', '#1E40AF', '#4C1D95', '#374151']
    const bgs = isDark()
      ? ['rgba(110,231,183,0.15)', 'rgba(165,180,252,0.15)', 'rgba(147,197,253,0.15)', 'rgba(196,181,253,0.15)', 'rgba(107,114,128,0.1)']
      : ['rgba(6,95,70,0.1)', 'rgba(79,70,229,0.1)', 'rgba(30,64,175,0.1)', 'rgba(76,29,149,0.1)', 'rgba(55,65,81,0.08)']

    return {
      labels: items.map(i => i.status.charAt(0).toUpperCase() + i.status.slice(1)),
      datasets: [{
        data:             items.map(i => i.count),
        backgroundColor:  bgs,
        borderColor:      colors,
        borderWidth:      1.5,
        hoverOffset:      4,
      }],
    }
  })

  const topProductsChartData = computed(() => {
    if (!data.value) return null
    const items = data.value.top_products.slice(0, 6)
    return {
      labels: items.map(i => i.name),
      datasets: [{
        label:           'Orders',
        data:            items.map(i => i.orders),
        backgroundColor: isDark()
          ? 'rgba(79,70,229,0.2)'
          : 'rgba(79,70,229,0.1)',
        borderColor:     brandColor,
        borderWidth:     1.5,
        borderRadius:    4,
      }],
    }
  })

  const dayChartData = computed(() => {
    if (!data.value) return null
    const items = data.value.by_day
    return {
      labels: items.map(i => i.day),
      datasets: [{
        label:           'Orders',
        data:            items.map(i => i.orders),
        backgroundColor: items.map(i =>
          i.orders === Math.max(...items.map(x => x.orders))
            ? brandColor
            : isDark() ? '#1F2330' : '#F1F3F7'
        ),
        borderColor: items.map(i =>
          i.orders === Math.max(...items.map(x => x.orders))
            ? brandColor
            : isDark() ? '#272B38' : '#E2E4E9'
        ),
        borderWidth:  1,
        borderRadius: 6,
      }],
    }
  })

  const baseLineOptions = computed(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark() ? '#181C24' : '#fff',
        borderColor:     isDark() ? '#272B38' : '#E2E4E9',
        borderWidth:     1,
        titleColor:      isDark() ? '#F9FAFB' : '#111827',
        bodyColor:       isDark() ? '#9CA3AF' : '#6B7280',
        padding:         10,
        cornerRadius:    8,
      },
    },
    scales: {
      x: {
        grid:  { display: false },
        ticks: {
          color:    textColor(),
          font:     { size: 11 },
          maxTicksLimit: 8,
        },
        border: { display: false },
      },
      y: {
        grid:  { color: gridColor(), drawBorder: false },
        ticks: { color: textColor(), font: { size: 11 }, maxTicksLimit: 5 },
        border: { display: false },
      },
    },
  }))

  const donutOptions = computed(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    cutout:              '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color:     isDark() ? '#9CA3AF' : '#6B7280',
          font:      { size: 11 },
          padding:   16,
          boxWidth:  10,
          boxHeight: 10,
        },
      },
      tooltip: {
        backgroundColor: isDark() ? '#181C24' : '#fff',
        borderColor:     isDark() ? '#272B38' : '#E2E4E9',
        borderWidth:     1,
        titleColor:      isDark() ? '#F9FAFB' : '#111827',
        bodyColor:       isDark() ? '#9CA3AF' : '#6B7280',
        padding:         10,
        cornerRadius:    8,
      },
    },
  }))

  const hBarOptions = computed(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    indexAxis:           'y',
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark() ? '#181C24' : '#fff',
        borderColor:     isDark() ? '#272B38' : '#E2E4E9',
        borderWidth:     1,
        titleColor:      isDark() ? '#F9FAFB' : '#111827',
        bodyColor:       isDark() ? '#9CA3AF' : '#6B7280',
        padding:         10,
        cornerRadius:    8,
      },
    },
    scales: {
      x: {
        grid:  { color: gridColor() },
        ticks: { color: textColor(), font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid:  { display: false },
        ticks: { color: textColor(), font: { size: 11 } },
        border: { display: false },
      },
    },
  }))

  const vBarOptions = computed(() => ({
    responsive:          true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark() ? '#181C24' : '#fff',
        borderColor:     isDark() ? '#272B38' : '#E2E4E9',
        borderWidth:     1,
        titleColor:      isDark() ? '#F9FAFB' : '#111827',
        bodyColor:       isDark() ? '#9CA3AF' : '#6B7280',
        padding:         10,
        cornerRadius:    8,
      },
    },
    scales: {
      x: {
        grid:  { display: false },
        ticks: { color: textColor(), font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid:  { color: gridColor() },
        ticks: { color: textColor(), font: { size: 11 }, maxTicksLimit: 5 },
        border: { display: false },
      },
    },
  }))

  return {
    loading, period, periods, data,
    fetchAnalytics, changePeriod,
    revenueChartData, ordersChartData,
    statusChartData, topProductsChartData,
    dayChartData,
    baseLineOptions, donutOptions,
    hBarOptions, vBarOptions,
  }
}