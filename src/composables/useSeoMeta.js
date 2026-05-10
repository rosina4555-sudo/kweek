import { useHead } from '@unhead/vue'

const SITE_NAME = 'Kweek'
const BASE_URL  = 'https://kweek.onrender.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og/og-home.png`

export function useSeoMeta({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  url   = BASE_URL,
  type  = 'website',
} = {}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description',        content: description },
      { property: 'og:type',        content: type },
      { property: 'og:url',         content: url },
      { property: 'og:title',       content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image',       content: image },
      { property: 'og:image:width',  content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:site_name',   content: SITE_NAME },
      { name: 'twitter:card',        content: 'summary_large_image' },
      { name: 'twitter:title',       content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image',       content: image },
    ],
    link: [
      { rel: 'canonical', href: url },
    ],
  })
}