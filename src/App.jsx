import { useEffect, useMemo, useState } from 'react'
import './App.css'

const brand = {
  name: 'GodRealm',
  tagline: 'Prayer, testimony, worship, giving, and creator discovery in one faith-native platform.',
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const phases = [
  {
    id: 'foundation',
    label: 'Phase 1',
    title: 'Foundation',
    duration: 'Months 1-3',
    color: '#c9a84c',
    milestone: 'MVP launch with prayer, testimony, Bible links, and profiles.',
    features: [
      'Email and social sign-in',
      'Daily prayer feed with text, audio, and video-ready posts',
      'Testimony wall with written and media stories',
      'Bible verse attachment and external Bible app links',
      'Creator and ministry profiles',
      'Push-ready devotional notification model',
    ],
    stack: ['React + Capacitor', 'Node API', 'PostgreSQL or Supabase', 'Bible API'],
  },
  {
    id: 'revenue',
    label: 'Phase 2',
    title: 'Monetization',
    duration: 'Months 4-6',
    color: '#7e6fbf',
    milestone: 'Subscriptions, donations, and ministry plans live.',
    features: [
      'Free, Seeker, Faithful, and Ministry tiers',
      'One-time and recurring donations',
      'Premium devotional content gates',
      'Donor wall and giving badges',
      'Church and ministry organization accounts',
      'Payment webhook event ledger',
    ],
    stack: ['Stripe', 'PayPal', 'RevenueCat', 'Webhook worker'],
  },
  {
    id: 'streaming',
    label: 'Phase 3',
    title: 'Live Streaming',
    duration: 'Months 7-9',
    color: '#3a8c6e',
    milestone: 'First live worship service and prayer room streamed on GodRealm.',
    features: [
      'Live worship and prayer sessions',
      'Interactive prayer request chat',
      'Stream scheduling and calendars',
      'Replay library for sermons and worship',
      'Multi-host ministry rooms',
      'YouTube and Facebook restreaming path',
    ],
    stack: ['Mux', 'LiveKit or Agora', 'HLS playback', 'Socket.io'],
  },
  {
    id: 'scale',
    label: 'Phase 4',
    title: 'Community and Scale',
    duration: 'Months 10-12',
    color: '#c0392b',
    milestone: 'Public mobile launch with circles, analytics, and AI companion.',
    features: [
      'Private prayer circles',
      'AI prayer and Scripture companion',
      'Intercessory prayer matching',
      'Podcast and sermon distribution links',
      'Analytics dashboard for ministries',
      'iOS and Android store launch',
    ],
    stack: ['OpenAI or Claude API', 'Typesense', 'Cloudflare CDN', 'App stores'],
  },
]

const pillars = [
  ['Prayer Feed', 'Post what is on your heart and let the community pray with you in real time.', 'Core'],
  ['Bible Integration', 'Attach Scripture to prayers, testimonies, sermons, and devotional posts.', 'Spiritual'],
  ['Testimony Hub', 'Share written, audio, and video testimonies with reactions and prayer responses.', 'Community'],
  ['Live Worship', 'Host worship nights, sermons, prayer calls, and Bible studies with live chat.', 'Media'],
  ['Creator Links', 'Give artists, authors, pastors, and ministries one profile for every platform.', 'Discovery'],
  ['Subscriptions', 'Unlock premium devotionals, early stream access, circles, and creator tools.', 'Revenue'],
  ['Donations', 'Support churches, missionaries, causes, and GodRealm directly through giving flows.', 'Giving'],
  ['AI Companion', 'Receive Scripture-backed prayer prompts and careful spiritual journaling support.', 'AI'],
]

const platformCategories = [
  {
    id: 'podcasts',
    label: 'Podcasts',
    color: '#e8762b',
    platforms: ['Spotify', 'Apple Podcasts', 'YouTube Podcasts', 'Buzzsprout', 'Podbean', 'Custom RSS'],
  },
  {
    id: 'video',
    label: 'Video and Streaming',
    color: '#c0392b',
    platforms: ['YouTube', 'Vimeo', 'Facebook Live', 'Instagram', 'TikTok', 'Sermon.net'],
  },
  {
    id: 'music',
    label: 'Gospel Music',
    color: '#7e6fbf',
    platforms: ['Spotify Artist', 'Apple Music', 'YouTube Music', 'SoundCloud', 'Audiomack', 'Boomplay'],
  },
  {
    id: 'books',
    label: 'Books and Novels',
    color: '#3a8c6e',
    platforms: ['Amazon Kindle', 'Author Page', 'Goodreads', 'Apple Books', 'Kobo', 'Gumroad'],
  },
  {
    id: 'social',
    label: 'Social and Ministry',
    color: '#2e86ab',
    platforms: ['Website', 'Church Website', 'Instagram', 'Facebook', 'Substack', 'Linktree'],
  },
  {
    id: 'courses',
    label: 'Courses and Teaching',
    color: '#c9a84c',
    platforms: ['Teachable', 'Thinkific', 'Kajabi', 'Udemy', 'RightNow Media', 'Custom Course'],
  },
]

const profiles = [
  {
    name: 'Pastor David Osei',
    handle: '@pastorosei',
    role: 'Teacher, author, revivalist',
    links: ['Fire and Grace Podcast', 'Pastor Osei TV', 'Intercession Masterclass', 'Prayers That Move Mountains'],
    verified: true,
  },
  {
    name: 'Grace Melody Worship',
    handle: '@gracemelody',
    role: 'Gospel artist and worship leader',
    links: ['Spotify Artist', 'Apple Music', 'YouTube Channel', 'Audiomack', 'Boomplay'],
    verified: true,
  },
  {
    name: 'Sister Blessing Addo',
    handle: '@blessingaddo',
    role: 'Christian novelist and speaker',
    links: ['When She Prayed', 'Goodreads Author Page', 'Faith Letters Weekly'],
    verified: false,
  },
]

const mediaItems = [
  {
    id: 'sermon-1',
    type: 'video',
    title: 'Faith That Moves Mountains',
    creator: 'Pastor David Osei',
    duration: '38:24',
    views: '48K',
    tag: 'Sermon',
    accent: '#c9a84c',
    description: 'A teaching on persistent prayer, bold faith, and trusting God through impossible seasons.',
  },
  {
    id: 'worship-1',
    type: 'video',
    title: 'Midnight Worship Room',
    creator: 'Grace Melody Worship',
    duration: '1:12:08',
    views: '92K',
    tag: 'Worship',
    accent: '#7e6fbf',
    description: 'A worship set for prayer, quiet reflection, and late-night devotion.',
  },
  {
    id: 'testimony-1',
    type: 'short',
    title: 'How God Restored My Family',
    creator: 'Sister Blessing Addo',
    duration: '6:42',
    views: '12K',
    tag: 'Testimony',
    accent: '#3a8c6e',
    description: 'A short testimony about forgiveness, reconciliation, and patient prayer.',
  },
  {
    id: 'bible-1',
    type: 'video',
    title: 'Bible Study: Psalm 23',
    creator: 'GodRealm Studio',
    duration: '24:10',
    views: '31K',
    tag: 'Bible Study',
    accent: '#2e86ab',
    description: 'A calm verse-by-verse study for people seeking comfort and direction.',
  },
]

const podcastItems = [
  {
    id: 'pod-1',
    title: 'Fire and Grace Podcast',
    creator: 'Pastor David Osei',
    episode: 'Intercession When You Feel Weak',
    duration: '42 min',
    accent: '#e8762b',
  },
  {
    id: 'pod-2',
    title: 'Faith Letters Weekly',
    creator: 'Sister Blessing Addo',
    episode: 'Writing Your Testimony With Courage',
    duration: '28 min',
    accent: '#3a8c6e',
  },
  {
    id: 'pod-3',
    title: 'Worship Table',
    creator: 'Grace Melody Worship',
    episode: 'Building a Life of Praise',
    duration: '35 min',
    accent: '#7e6fbf',
  },
]

const liveItems = [
  ['Live Prayer Room', 'GodRealm Studio', '126 praying now', '#c0392b'],
  ['Sunday Worship Service', 'Kingdom Chapel Global', 'Starts 10:00 AM', '#c9a84c'],
  ['Youth Bible Study', 'Faith Builders Network', 'Live in 25 min', '#3a8c6e'],
]

const tiers = [
  ['Free', '$0', 'Prayer feed, testimonies, Bible links, basic profile'],
  ['Seeker', '$4.99/mo', 'Prayer circles, ad-free experience, early streams'],
  ['Faithful', '$9.99/mo', 'AI companion, exclusive devotionals, host rooms, donor badge'],
  ['Ministry', '$29.99/mo', 'Organization profile, analytics, donations, multi-host streams'],
]

const languages = [
  { code: 'en-US', name: 'English', region: 'Global' },
  { code: 'fr-FR', name: 'French', region: 'Africa, Europe, Caribbean' },
  { code: 'es-ES', name: 'Spanish', region: 'Global' },
  { code: 'pt-PT', name: 'Portuguese', region: 'Africa, Brazil, Europe' },
  { code: 'ar-SA', name: 'Arabic', region: 'North Africa, Middle East' },
  { code: 'sw-KE', name: 'Swahili', region: 'East Africa' },
  { code: 'ha-NG', name: 'Hausa', region: 'West Africa' },
  { code: 'yo-NG', name: 'Yoruba', region: 'Nigeria, diaspora' },
  { code: 'am-ET', name: 'Amharic', region: 'Ethiopia' },
  { code: 'ak-GH', name: 'Twi / Akan', region: 'Ghana' },
]

const christianSearchCorpus = [
  {
    title: 'Prayer for peace',
    topic: 'prayer peace anxiety fear',
    verse: 'Philippians 4:6-7',
    answer: 'Bring every concern to God in prayer. Peace grows when your heart is honest before Him and anchored in gratitude.',
  },
  {
    title: 'Salvation and new life',
    topic: 'salvation Jesus gospel born again faith',
    verse: 'John 3:16',
    answer: 'The Christian hope is centered on Jesus Christ: God gives eternal life to those who believe in Him and receive His grace.',
  },
  {
    title: 'Healing and comfort',
    topic: 'healing sickness comfort grief pain',
    verse: 'Psalm 147:3',
    answer: 'God is near to the wounded. Prayer for healing can include trust, medical wisdom, community support, and patient hope.',
  },
  {
    title: 'Purpose and calling',
    topic: 'purpose calling destiny work ministry vision',
    verse: 'Jeremiah 29:11',
    answer: 'Calling is usually walked out one faithful step at a time. Commit your work to God and ask for wisdom, discipline, and open doors.',
  },
  {
    title: 'Giving and generosity',
    topic: 'giving tithes offering donation generosity',
    verse: '2 Corinthians 9:7',
    answer: 'Christian giving is not pressure; it is cheerful generosity. Give with wisdom, love, and a desire to serve people well.',
  },
  {
    title: 'Worship and praise',
    topic: 'worship praise music song gratitude',
    verse: 'Psalm 96:1',
    answer: 'Worship turns attention back to God. It can be sung, spoken, lived, served, and carried into ordinary daily choices.',
  },
  {
    title: 'Forgiveness',
    topic: 'forgiveness forgive mercy bitterness reconciliation',
    verse: 'Ephesians 4:32',
    answer: 'Forgiveness begins with releasing revenge to God. Reconciliation may require truth, repentance, boundaries, and time.',
  },
  {
    title: 'Testimony',
    topic: 'testimony story witness miracle share',
    verse: 'Revelation 12:11',
    answer: 'A testimony tells what God has done. Keep it honest, humble, and hopeful so others can see His faithfulness clearly.',
  },
]

const seedSession = {
  displayName: 'Kodjo',
  role: 'creator',
  email: 'kodjo@godrealm.local',
}

const seedPrayers = [
  {
    id: 'seed-prayer-1',
    author: 'Pastor David Osei',
    body: 'Praying for every builder who is carrying a God-given idea and needs clarity for the next step.',
    verseRef: 'Proverbs 16:3',
    prayerCount: 42,
    createdAt: 'Today',
  },
  {
    id: 'seed-prayer-2',
    author: 'Grace Melody Worship',
    body: 'Covering worship leaders, artists, and ministries releasing songs of hope this week.',
    verseRef: 'Psalm 96:1',
    prayerCount: 28,
    createdAt: 'Yesterday',
  },
]

const seedTestimonies = [
  {
    id: 'seed-testimony-1',
    author: 'Sister Blessing Addo',
    title: 'Provision came right on time',
    story: 'After months of praying over a manuscript and ministry budget, the exact support came through two unexpected partners.',
    createdAt: 'This week',
  },
]

const apiPlan = [
  ['POST /api/auth/register', 'Create a user, creator, ministry, or admin account.'],
  ['POST /api/auth/login', 'Issue a session token for web and mobile clients.'],
  ['GET /api/media', 'List sermons, worship videos, testimonies, clips, and Bible studies.'],
  ['POST /api/media', 'Publish a video, short, sermon, testimony, or Bible study record.'],
  ['GET /api/podcasts', 'List podcast shows and episodes.'],
  ['POST /api/podcasts', 'Publish a podcast episode record.'],
  ['GET /api/channels', 'List creator and ministry channels.'],
  ['POST /api/channels', 'Create a creator or ministry channel.'],
  ['GET /api/channels/:handle', 'Load a channel page with its videos and podcasts.'],
  ['GET /api/feed/prayers', 'List public prayer requests and devotional posts.'],
  ['POST /api/testimonies', 'Create written, audio, or video testimony records.'],
  ['POST /api/creator-links', 'Save external podcast, music, book, course, and social links.'],
  ['POST /api/donations/checkout', 'Start a one-time or recurring donation checkout.'],
  ['POST /api/subscriptions/checkout', 'Start a GodRealm membership checkout.'],
  ['GET /api/giving/summary', 'Show donation and subscription totals by provider.'],
  ['POST /api/streams/schedule', 'Schedule a worship, sermon, or prayer livestream.'],
  ['GET /api/streams', 'List scheduled and live prayer rooms or worship events.'],
]

const schemas = [
  ['users', 'id, email, display_name, role, avatar_url, spiritual_tags, created_at'],
  ['media', 'id, user_id, type, title, creator, duration, views, tag, media_url, thumbnail_url'],
  ['podcasts', 'id, user_id, title, creator, episode, duration, audio_url, status, created_at'],
  ['channels', 'id, user_id, name, handle, category, followers, avatar_url, created_at'],
  ['prayer_posts', 'id, user_id, body, media_url, verse_ref, visibility, prayer_count, created_at'],
  ['testimonies', 'id, user_id, title, story, media_url, status, reaction_count, created_at'],
  ['creator_links', 'id, user_id, category, platform, url, label, click_count, sort_order'],
  ['subscriptions', 'id, user_id, tier, provider, provider_customer_id, status, renews_at'],
  ['donations', 'id, donor_id, ministry_id, amount_cents, provider, recurring, created_at'],
  ['streams', 'id, host_id, title, starts_at, provider, playback_url, status'],
  ['prayer_circles', 'id, owner_id, name, privacy, member_count, created_at'],
]

const tabs = [
  ['home', 'Home'],
  ['videos', 'Videos'],
  ['podcasts', 'Podcasts'],
  ['live', 'Live'],
  ['channels', 'Channels'],
  ['giving', 'Giving'],
  ['upload', 'Upload'],
  ['creator', 'Creator'],
  ['admin', 'Admin'],
  ['community', 'Prayer'],
  ['search', 'Christian Search'],
  ['library', 'Library'],
  ['language', 'Languages'],
  ['links', 'Links'],
  ['roadmap', 'Roadmap'],
  ['backend', 'Backend'],
  ['mobile', 'Mobile'],
]

const loadStored = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [tab, setTab] = useState('home')
  const [activePhase, setActivePhase] = useState(phases[0].id)
  const [activeCategory, setActiveCategory] = useState(platformCategories[0].id)
  const [activeMedia, setActiveMedia] = useState(mediaItems[0])
  const [mediaFeed, setMediaFeed] = useState(mediaItems)
  const [podcastFeed, setPodcastFeed] = useState(podcastItems)
  const [channelFeed, setChannelFeed] = useState(profiles)
  const [streamFeed, setStreamFeed] = useState(liveItems.map(([title, host, audience, accent], index) => ({
    id: `local-stream-${index}`,
    title,
    hostName: host,
    audience,
    accent,
    status: audience.toLowerCase().includes('praying') ? 'live' : 'scheduled',
  })))
  const [apiStatus, setApiStatus] = useState('Local fallback')
  const [session, setSession] = useState(() => loadStored('godrealm.session', seedSession))
  const [authToken, setAuthToken] = useState(() => loadStored('godrealm.authToken', ''))
  const [authDraft, setAuthDraft] = useState({ displayName: 'Kodjo', email: 'kodjo@godrealm.local', password: 'GodRealm123', role: 'creator' })
  const [authMode, setAuthMode] = useState('register')
  const [authMessage, setAuthMessage] = useState('')
  const [prayers, setPrayers] = useState(() => loadStored('godrealm.prayers', seedPrayers))
  const [testimonies, setTestimonies] = useState(() => loadStored('godrealm.testimonies', seedTestimonies))
  const [links, setLinks] = useState(() => loadStored('godrealm.creatorLinks', {}))
  const [profileDraft, setProfileDraft] = useState(seedSession)
  const [prayerDraft, setPrayerDraft] = useState('')
  const [verseDraft, setVerseDraft] = useState('')
  const [testimonyDraft, setTestimonyDraft] = useState({ title: '', story: '' })
  const [draftUrl, setDraftUrl] = useState('')
  const [language, setLanguage] = useState(() => loadStored('godrealm.language', languages[0]))
  const [searchQuery, setSearchQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [mediaDraft, setMediaDraft] = useState({ type: 'video', title: '', tag: 'Sermon', duration: '', description: '', mediaUrl: '' })
  const [podcastDraft, setPodcastDraft] = useState({ title: '', episode: '', duration: '', audioUrl: '' })
  const [uploadMessage, setUploadMessage] = useState('')
  const [mediaFile, setMediaFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [audioFile, setAudioFile] = useState(null)
  const [activeChannel, setActiveChannel] = useState(profiles[0])
  const [adminMessage, setAdminMessage] = useState('')
  const [givingDraft, setGivingDraft] = useState({ provider: 'paystack', type: 'donation', tier: 'Faithful', amount: '2500', ministryId: 'GodRealm Studio' })
  const [paymentMessage, setPaymentMessage] = useState('')
  const [givingSummary, setGivingSummary] = useState({ totals: { count: 0, amountCents: 0, byProvider: {} }, donations: [], subscriptions: [], providers: {} })
  const [streamDraft, setStreamDraft] = useState({ title: 'Friday Prayer Watch', startsAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString().slice(0, 16), provider: 'mux' })
  const [channelDraft, setChannelDraft] = useState({ name: '', handle: '', category: 'Teaching', bio: '' })
  const [library, setLibrary] = useState({ savedItems: [], follows: [] })
  const [libraryMessage, setLibraryMessage] = useState('')

  const currentCategory = platformCategories.find((category) => category.id === activeCategory)
  const currentPhase = phases.find((phase) => phase.id === activePhase)
  const savedLinkCount = useMemo(() => Object.values(links).reduce((sum, list) => sum + list.length, 0), [links])
  const creatorMedia = useMemo(() => mediaFeed.filter((item) => item.userId === session.id || item.creator === session.displayName), [mediaFeed, session])
  const creatorPodcasts = useMemo(() => podcastFeed.filter((item) => item.userId === session.id || item.creator === session.displayName), [podcastFeed, session])
  const searchResults = useMemo(() => {
    const words = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
    if (!words.length) return christianSearchCorpus

    return christianSearchCorpus
      .map((item) => ({
        ...item,
        score: words.reduce((sum, word) => (
          sum + (`${item.title} ${item.topic} ${item.verse} ${item.answer}`.toLowerCase().includes(word) ? 1 : 0)
        ), 0),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
  }, [searchQuery])

  useEffect(() => {
    window.localStorage.setItem('godrealm.session', JSON.stringify(session))
  }, [session])

  useEffect(() => {
    window.localStorage.setItem('godrealm.authToken', JSON.stringify(authToken))
  }, [authToken])

  useEffect(() => {
    window.localStorage.setItem('godrealm.prayers', JSON.stringify(prayers))
  }, [prayers])

  useEffect(() => {
    window.localStorage.setItem('godrealm.testimonies', JSON.stringify(testimonies))
  }, [testimonies])

  useEffect(() => {
    window.localStorage.setItem('godrealm.creatorLinks', JSON.stringify(links))
  }, [links])

  useEffect(() => {
    window.localStorage.setItem('godrealm.language', JSON.stringify(language))
  }, [language])

  useEffect(() => {
    let cancelled = false

    async function loadPlatformData() {
      try {
        const [healthRes, mediaRes, podcastRes, channelRes] = await Promise.all([
          fetch(`${API_URL}/api/health`),
          fetch(`${API_URL}/api/media`),
          fetch(`${API_URL}/api/podcasts`),
          fetch(`${API_URL}/api/channels`),
          fetch(`${API_URL}/api/feed/prayers`),
          fetch(`${API_URL}/api/testimonies`),
        ])

        if (!healthRes.ok || !mediaRes.ok || !podcastRes.ok || !channelRes.ok || !prayerRes.ok || !testimonyRes.ok) {
          throw new Error('GodRealm API unavailable')
        }

        const [health, mediaData, podcastData, channelData, prayerData, testimonyData] = await Promise.all([
          healthRes.json(),
          mediaRes.json(),
          podcastRes.json(),
          channelRes.json(),
          prayerRes.json(),
          testimonyRes.json(),
        ])

        if (cancelled) return

        const nextMedia = mediaData.media?.length ? mediaData.media : mediaItems
        setMediaFeed(nextMedia)
        setPodcastFeed(podcastData.podcasts?.length ? podcastData.podcasts : podcastItems)
        setChannelFeed(channelData.channels?.length ? channelData.channels : profiles)
        if (prayerData.prayers?.length) setPrayers(prayerData.prayers)
        if (testimonyData.testimonies?.length) setTestimonies(testimonyData.testimonies)
        setActiveMedia((current) => nextMedia.find((item) => item.id === current.id) || nextMedia[0])
        setApiStatus(`API connected: ${health.database}`)
        fetch(`${API_URL}/api/streams`).then((res) => res.json()).then((data) => {
          if (!cancelled && data.streams?.length) setStreamFeed(data.streams)
        }).catch(() => {})
        fetch(`${API_URL}/api/giving/summary`).then((res) => res.json()).then((data) => {
          if (!cancelled) setGivingSummary(data)
        }).catch(() => {})
        if (authToken) {
          fetch(`${API_URL}/api/library`, { headers: { Authorization: `Bearer ${authToken}` } })
            .then((res) => res.json())
            .then((data) => {
              if (!cancelled) setLibrary({ savedItems: data.savedItems || [], follows: data.follows || [] })
            })
            .catch(() => {})
        }
      } catch {
        if (!cancelled) setApiStatus('Local fallback')
      }
    }

    loadPlatformData()

    return () => {
      cancelled = true
    }
  }, [authToken])

  const apiRequest = async (path, options = {}) => {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(options.headers || {}),
      },
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || 'GodRealm API request failed')
    return data
  }

  const refreshMedia = async () => {
    const [mediaData, podcastData] = await Promise.all([
      apiRequest('/api/media'),
      apiRequest('/api/podcasts'),
    ])
    const nextMedia = mediaData.media?.length ? mediaData.media : mediaItems
    setMediaFeed(nextMedia)
    setPodcastFeed(podcastData.podcasts?.length ? podcastData.podcasts : podcastItems)
    setActiveMedia(nextMedia[0])
  }

  const refreshGiving = async () => {
    const data = await apiRequest('/api/giving/summary')
    setGivingSummary(data)
  }

  const refreshLibrary = async () => {
    if (!authToken) return
    const data = await apiRequest('/api/library')
    setLibrary({ savedItems: data.savedItems || [], follows: data.follows || [] })
  }

  const uploadFile = async (file, resourceType) => {
    if (!file) return ''
    const signed = await apiRequest('/api/uploads/sign', {
      method: 'POST',
      body: JSON.stringify({ resourceType }),
    })
    const form = new FormData()
    form.append('file', file)
    form.append('api_key', signed.apiKey)
    form.append('timestamp', signed.timestamp)
    form.append('folder', signed.folder)
    form.append('signature', signed.signature)

    const response = await fetch(signed.uploadUrl, {
      method: 'POST',
      body: form,
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || 'Cloudinary upload failed')
    return data.secure_url
  }

  const handleAuth = async (event) => {
    event.preventDefault()
    setAuthMessage('Connecting...')
    try {
      const data = await apiRequest(authMode === 'register' ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(authDraft),
      })
      setAuthToken(data.token)
      setSession(data.user)
      setProfileDraft(data.user)
      setAuthMessage(`${authMode === 'register' ? 'Registered' : 'Signed in'} as ${data.user.displayName}`)
    } catch (error) {
      setAuthMessage(error.message)
    }
  }

  const publishMedia = async (event) => {
    event.preventDefault()
    setUploadMessage('Publishing video...')
    try {
      let mediaUrl = mediaDraft.mediaUrl
      let thumbnailUrl = mediaDraft.thumbnailUrl || ''
      if (mediaFile) {
        setUploadMessage('Uploading media file...')
        mediaUrl = await uploadFile(mediaFile, 'video')
      }
      if (thumbnailFile) {
        setUploadMessage('Uploading thumbnail...')
        thumbnailUrl = await uploadFile(thumbnailFile, 'image')
      }
      const data = await apiRequest('/api/media', {
        method: 'POST',
        body: JSON.stringify({ ...mediaDraft, mediaUrl, thumbnailUrl }),
      })
      setMediaFeed((current) => [data.media, ...current])
      setActiveMedia(data.media)
      setMediaFile(null)
      setThumbnailFile(null)
      setMediaDraft({ type: 'video', title: '', tag: 'Sermon', duration: '', description: '', mediaUrl: '', thumbnailUrl: '' })
      setUploadMessage('Video published to GodRealm API')
    } catch (error) {
      setUploadMessage(error.message)
    }
  }

  const publishPodcast = async (event) => {
    event.preventDefault()
    setUploadMessage('Publishing podcast...')
    try {
      let audioUrl = podcastDraft.audioUrl
      if (audioFile) {
        setUploadMessage('Uploading audio file...')
        audioUrl = await uploadFile(audioFile, 'video')
      }
      const data = await apiRequest('/api/podcasts', {
        method: 'POST',
        body: JSON.stringify({ ...podcastDraft, audioUrl }),
      })
      setPodcastFeed((current) => [data.podcast, ...current])
      setAudioFile(null)
      setPodcastDraft({ title: '', episode: '', duration: '', audioUrl: '' })
      setUploadMessage('Podcast episode published to GodRealm API')
    } catch (error) {
      setUploadMessage(error.message)
    }
  }

  const moderateMedia = async (item, status) => {
    setAdminMessage(`Updating ${item.title}...`)
    try {
      const data = await apiRequest(`/api/media/${item.id}/moderate`, {
        method: 'POST',
        body: JSON.stringify({ status, note: `Marked ${status} from GodRealm admin panel` }),
      })
      setMediaFeed((current) => current.map((media) => (media.id === item.id ? data.media : media)))
      setAdminMessage(`${item.title} marked ${status}`)
    } catch (error) {
      setAdminMessage(error.message)
    }
  }

  const createCheckout = async (event) => {
    event.preventDefault()
    setPaymentMessage('Creating checkout...')
    try {
      const path = givingDraft.type === 'subscription' ? '/api/subscriptions/checkout' : '/api/donations/checkout'
      const data = await apiRequest(path, {
        method: 'POST',
        body: JSON.stringify({
          provider: givingDraft.provider,
          tier: givingDraft.tier,
          ministryId: givingDraft.ministryId,
          amountCents: Number(givingDraft.amount),
        }),
      })
      setPaymentMessage(`${data.provider} checkout ready: ${data.checkoutUrl}`)
      await refreshGiving()
    } catch (error) {
      setPaymentMessage(error.message)
    }
  }

  const scheduleStream = async (event) => {
    event.preventDefault()
    setUploadMessage('Scheduling livestream...')
    try {
      const data = await apiRequest('/api/streams/schedule', {
        method: 'POST',
        body: JSON.stringify({
          title: streamDraft.title,
          startsAt: new Date(streamDraft.startsAt).toISOString(),
          provider: streamDraft.provider,
          audience: 'Scheduled from creator console',
        }),
      })
      setStreamFeed((current) => [data.stream, ...current])
      setUploadMessage('Livestream scheduled.')
    } catch (error) {
      setUploadMessage(error.message)
    }
  }

  const createChannel = async (event) => {
    event.preventDefault()
    setUploadMessage('Creating channel...')
    try {
      const data = await apiRequest('/api/channels', {
        method: 'POST',
        body: JSON.stringify({
          name: channelDraft.name || session.displayName,
          handle: channelDraft.handle || session.displayName,
          category: channelDraft.category,
          bio: channelDraft.bio,
          givingEnabled: true,
        }),
      })
      setChannelFeed((current) => [data.channel, ...current])
      setActiveChannel(data.channel)
      setChannelDraft({ name: '', handle: '', category: 'Teaching', bio: '' })
      setUploadMessage('Channel created.')
    } catch (error) {
      setUploadMessage(error.message)
    }
  }

  const saveLibraryItem = async (item, itemType = 'media') => {
    setLibraryMessage(`Saving ${item.title || item.episode || item.name}...`)
    try {
      await apiRequest('/api/library/save', {
        method: 'POST',
        body: JSON.stringify({
          itemId: item.id,
          itemType,
          title: item.title || item.episode || item.name,
          creator: item.creator || item.hostName || item.name,
        }),
      })
      await refreshLibrary()
      setLibraryMessage('Saved to your library.')
    } catch (error) {
      setLibraryMessage(error.message)
    }
  }

  const followChannel = async (channel) => {
    setLibraryMessage(`Following ${channel.name}...`)
    try {
      await apiRequest(`/api/channels/${encodeURIComponent(channel.handle || channel.id)}/follow`, { method: 'POST' })
      await refreshLibrary()
      setLibraryMessage(`Following ${channel.name}.`)
    } catch (error) {
      setLibraryMessage(error.message)
    }
  }

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language.code
    utterance.rate = 0.92
    window.speechSynthesis.speak(utterance)
  }

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      speak('Voice search is not supported in this browser yet.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = language.code
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event) => {
      setSearchQuery(event.results[0][0].transcript)
    }
    recognition.start()
  }

  const saveProfile = (event) => {
    event.preventDefault()
    setSession({
      displayName: profileDraft.displayName.trim() || 'GodRealm Creator',
      email: profileDraft.email.trim() || 'creator@godrealm.local',
      role: profileDraft.role,
    })
  }

  const addPrayer = async (event) => {
    event.preventDefault()
    const body = prayerDraft.trim()
    if (!body) return

    try {
      const data = await apiRequest('/api/feed/prayers', {
        method: 'POST',
        body: JSON.stringify({ body, verseRef: verseDraft.trim() }),
      })
      setPrayers((current) => [data.prayer, ...current])
      setPrayerDraft('')
      setVerseDraft('')
    } catch {
      setPrayers((current) => [
        {
          id: crypto.randomUUID(),
          author: session.displayName,
          body,
          verseRef: verseDraft.trim(),
          prayerCount: 0,
          createdAt: 'Just now',
        },
        ...current,
      ])
      setPrayerDraft('')
      setVerseDraft('')
    }
  }

  const addTestimony = async (event) => {
    event.preventDefault()
    const title = testimonyDraft.title.trim()
    const story = testimonyDraft.story.trim()
    if (!title || !story) return

    try {
      const data = await apiRequest('/api/testimonies', {
        method: 'POST',
        body: JSON.stringify({ title, story }),
      })
      setTestimonies((current) => [data.testimony, ...current])
      setTestimonyDraft({ title: '', story: '' })
    } catch {
      setTestimonies((current) => [
        {
          id: crypto.randomUUID(),
          author: session.displayName,
          title,
          story,
          createdAt: 'Just now',
        },
        ...current,
      ])
      setTestimonyDraft({ title: '', story: '' })
    }
  }

  const prayWithRequest = async (prayer) => {
    try {
      const data = await apiRequest(`/api/feed/prayers/${prayer.id}/pray`, { method: 'POST' })
      setPrayers((current) => current.map((item) => (item.id === prayer.id ? data.prayer : item)))
    } catch {
      setPrayers((current) => current.map((item) => (
        item.id === prayer.id ? { ...item, prayerCount: Number(item.prayerCount || 0) + 1 } : item
      )))
    }
  }

  const reactToTestimony = async (testimony) => {
    try {
      const data = await apiRequest(`/api/testimonies/${testimony.id}/react`, { method: 'POST' })
      setTestimonies((current) => current.map((item) => (item.id === testimony.id ? data.testimony : item)))
    } catch {
      setTestimonies((current) => current.map((item) => (
        item.id === testimony.id ? { ...item, reactionCount: Number(item.reactionCount || 0) + 1 } : item
      )))
    }
  }

  const addLink = (platform) => {
    const url = draftUrl.trim()
    if (!url) return

    setLinks((current) => ({
      ...current,
      [activeCategory]: [
        ...(current[activeCategory] || []).filter((link) => link.platform !== platform),
        { platform, url },
      ],
    }))
    setDraftUrl('')
  }

  return (
    <div className="godrealm-app">
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">Faith media operating system</p>
          <h1>{brand.name}</h1>
          <p className="hero__tagline">{brand.tagline}</p>
          <div className="hero__stats" aria-label="GodRealm launch pillars">
            <span>Prayer feed</span>
            <span>Testimony hub</span>
            <span>Creator links</span>
            <span>Live worship</span>
            <span>Giving</span>
            <span>{apiStatus}</span>
          </div>
        </div>
      </header>

      <nav className="tabs" aria-label="GodRealm sections">
        {tabs.map(([id, label]) => (
          <button className={tab === id ? 'tab tab--active' : 'tab'} key={id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      <main className="page">
        {tab === 'home' && (
          <>
            <section className="watch-layout">
              <div className="watch-player" style={{ '--accent': activeMedia.accent }}>
                {activeMedia.mediaUrl ? (
                  <video className="real-video" src={activeMedia.mediaUrl} controls poster={activeMedia.thumbnailUrl || ''} />
                ) : (
                  <div className="mock-video">
                    <span>{activeMedia.tag}</span>
                    <strong>{activeMedia.title}</strong>
                    <small>{activeMedia.duration}</small>
                  </div>
                )}
                <div className="watch-meta">
                  <div>
                    <h2>{activeMedia.title}</h2>
                    <p>{activeMedia.creator} · {activeMedia.views} views · {activeMedia.description}</p>
                  </div>
                  <div className="action-row">
                    <button className="primary-action" type="button">Pray</button>
                    <button className="primary-action" type="button" onClick={() => saveLibraryItem(activeMedia, 'media')}>Save</button>
                    <button className="primary-action" type="button">Give</button>
                  </div>
                </div>
              </div>
              <aside className="up-next">
                <h2>Up next</h2>
                {mediaFeed.map((item) => (
                  <button
                    className={activeMedia.id === item.id ? 'queue-card queue-card--active' : 'queue-card'}
                    key={item.id}
                    onClick={() => setActiveMedia(item)}
                    style={{ '--accent': item.accent }}
                    type="button"
                  >
                    <span>{item.duration}</span>
                    <strong>{item.title}</strong>
                    <small>{item.creator} · {item.views}</small>
                  </button>
                ))}
              </aside>
            </section>
            <SectionHeader title="Recommended For You" subtitle="Sermons, worship, testimonies, and Bible study" />
            <MediaGrid items={mediaFeed} onSelect={(item) => { setActiveMedia(item); setTab('home') }} />
            <SectionHeader title="Podcast Episodes" subtitle="Listen to Christian teaching and testimony series" />
            <PodcastRow items={podcastFeed} />
          </>
        )}

        {tab === 'videos' && (
          <>
            <SectionHeader title="Videos" subtitle="YouTube-style browsing for sermons, worship, Bible study, and testimonies" />
            <MediaGrid items={mediaFeed} onSelect={(item) => { setActiveMedia(item); setTab('home') }} />
          </>
        )}

        {tab === 'podcasts' && (
          <>
            <SectionHeader title="Podcasts" subtitle="Episode library for creators, pastors, and ministries" />
            <PodcastRow items={podcastFeed} />
            <section className="audio-player">
              <div>
                <p className="eyebrow">Now playing</p>
                <h2>{podcastFeed[0]?.episode || 'No episode loaded'}</h2>
                <p>{podcastFeed[0]?.title || 'GodRealm Podcasts'} · {podcastFeed[0]?.creator || 'GodRealm'}</p>
              </div>
              <div className="player-bar"><span /></div>
            </section>
          </>
        )}

        {tab === 'live' && (
          <>
            <SectionHeader title="Live" subtitle="Prayer rooms, worship services, sermons, and Bible studies" />
            <div className="live-grid">
              {streamFeed.map((stream) => (
                <article className="live-card" key={stream.id || stream.title} style={{ '--accent': stream.accent || '#c0392b' }}>
                  <span>{stream.status || 'scheduled'}</span>
                  <h2>{stream.title}</h2>
                  <p>{stream.hostName || stream.host || 'GodRealm creator'}</p>
                  <strong>{stream.audience || new Date(stream.startsAt).toLocaleString()}</strong>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'channels' && (
          <>
            <SectionHeader title="Creator Channels" subtitle="YouTube-style homes for pastors, artists, authors, and ministries" />
            <section className="channel-layout">
              <aside className="channel-list">
                {channelFeed.map((channel) => (
                  <button
                    className={activeChannel.handle === channel.handle ? 'channel-button channel-button--active' : 'channel-button'}
                    key={channel.handle}
                    onClick={() => setActiveChannel(channel)}
                    type="button"
                  >
                    <strong>{channel.name}</strong>
                    <span>{channel.handle}</span>
                    <em>{channel.category || channel.role || 'Creator'}</em>
                  </button>
                ))}
              </aside>
              <section className="channel-page">
                <div className="channel-hero">
                  <div className="avatar">{(activeChannel.name || 'GR').split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                  <div>
                    <p className="eyebrow">{activeChannel.category || activeChannel.role || 'Creator'}</p>
                    <h2>{activeChannel.name}</h2>
                    <p>{activeChannel.handle} · {activeChannel.followers || activeChannel.links?.length || 'New'} followers</p>
                  </div>
                  <button className="primary-action" type="button" onClick={() => followChannel(activeChannel)}>Follow</button>
                </div>
                <SectionHeader title="Channel Videos" subtitle="Published media by this creator" />
                <MediaGrid
                  items={mediaFeed.filter((item) => item.creator === activeChannel.name || activeChannel.name === 'GodRealm Studio').slice(0, 6)}
                  onSelect={(item) => { setActiveMedia(item); setTab('home') }}
                />
              </section>
            </section>
          </>
        )}

        {tab === 'upload' && (
          <>
            <SectionHeader title="Creator Upload" subtitle="Sign in, then publish video and podcast metadata to the GodRealm API" />
            <section className="upload-layout">
              <form className="mvp-form" onSubmit={handleAuth}>
                <p className="eyebrow">Creator account</p>
                <h2>{authMode === 'register' ? 'Register' : 'Sign in'}</h2>
                <label>
                  Display name
                  <input
                    value={authDraft.displayName}
                    onChange={(event) => setAuthDraft({ ...authDraft, displayName: event.target.value })}
                  />
                </label>
                <label>
                  Email
                  <input
                    value={authDraft.email}
                    onChange={(event) => setAuthDraft({ ...authDraft, email: event.target.value })}
                    type="email"
                  />
                </label>
                <label>
                  Password
                  <input
                    value={authDraft.password}
                    onChange={(event) => setAuthDraft({ ...authDraft, password: event.target.value })}
                    type="password"
                  />
                </label>
                <label>
                  Role
                  <select
                    value={authDraft.role}
                    onChange={(event) => setAuthDraft({ ...authDraft, role: event.target.value })}
                  >
                    <option value="creator">Creator</option>
                    <option value="ministry">Ministry</option>
                    <option value="user">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <div className="action-row">
                  <button className="primary-action" type="submit">{authMode === 'register' ? 'Create account' : 'Sign in'}</button>
                  <button className="primary-action" type="button" onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}>
                    Use {authMode === 'register' ? 'sign in' : 'register'}
                  </button>
                </div>
                {authMessage && <p className="form-note">{authMessage}</p>}
              </form>

              <form className="mvp-form" onSubmit={publishMedia}>
                <p className="eyebrow">Video upload</p>
                <h2>Sermon, worship, testimony, or study</h2>
                <label>
                  Title
                  <input value={mediaDraft.title} onChange={(event) => setMediaDraft({ ...mediaDraft, title: event.target.value })} />
                </label>
                <label>
                  Type
                  <select value={mediaDraft.type} onChange={(event) => setMediaDraft({ ...mediaDraft, type: event.target.value })}>
                    <option value="video">Video</option>
                    <option value="short">Short</option>
                    <option value="live-replay">Live replay</option>
                  </select>
                </label>
                <label>
                  Tag
                  <input value={mediaDraft.tag} onChange={(event) => setMediaDraft({ ...mediaDraft, tag: event.target.value })} />
                </label>
                <label>
                  Duration
                  <input value={mediaDraft.duration} onChange={(event) => setMediaDraft({ ...mediaDraft, duration: event.target.value })} placeholder="38:24" />
                </label>
                <label>
                  Choose video/audio file
                  <input accept="video/*,audio/*" onChange={(event) => setMediaFile(event.target.files?.[0] || null)} type="file" />
                </label>
                <label>
                  Choose thumbnail image
                  <input accept="image/*" onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)} type="file" />
                </label>
                <label>
                  Media URL
                  <input value={mediaDraft.mediaUrl} onChange={(event) => setMediaDraft({ ...mediaDraft, mediaUrl: event.target.value })} placeholder="https://..." />
                </label>
                <label>
                  Thumbnail URL
                  <input value={mediaDraft.thumbnailUrl || ''} onChange={(event) => setMediaDraft({ ...mediaDraft, thumbnailUrl: event.target.value })} placeholder="https://..." />
                </label>
                <label>
                  Description
                  <textarea value={mediaDraft.description} onChange={(event) => setMediaDraft({ ...mediaDraft, description: event.target.value })} />
                </label>
                <button className="primary-action" type="submit">Publish video</button>
              </form>

              <form className="mvp-form" onSubmit={publishPodcast}>
                <p className="eyebrow">Podcast upload</p>
                <h2>Episode metadata</h2>
                <label>
                  Show title
                  <input value={podcastDraft.title} onChange={(event) => setPodcastDraft({ ...podcastDraft, title: event.target.value })} />
                </label>
                <label>
                  Episode
                  <input value={podcastDraft.episode} onChange={(event) => setPodcastDraft({ ...podcastDraft, episode: event.target.value })} />
                </label>
                <label>
                  Duration
                  <input value={podcastDraft.duration} onChange={(event) => setPodcastDraft({ ...podcastDraft, duration: event.target.value })} placeholder="42 min" />
                </label>
                <label>
                  Choose audio file
                  <input accept="audio/*,video/*" onChange={(event) => setAudioFile(event.target.files?.[0] || null)} type="file" />
                </label>
                <label>
                  Audio URL
                  <input value={podcastDraft.audioUrl} onChange={(event) => setPodcastDraft({ ...podcastDraft, audioUrl: event.target.value })} placeholder="https://..." />
                </label>
                <button className="primary-action" type="submit">Publish podcast</button>
                {uploadMessage && <p className="form-note">{uploadMessage}</p>}
              </form>

              <form className="mvp-form" onSubmit={createChannel}>
                <p className="eyebrow">Channel setup</p>
                <h2>Create creator channel</h2>
                <label>
                  Channel name
                  <input value={channelDraft.name} onChange={(event) => setChannelDraft({ ...channelDraft, name: event.target.value })} placeholder={session.displayName} />
                </label>
                <label>
                  Handle
                  <input value={channelDraft.handle} onChange={(event) => setChannelDraft({ ...channelDraft, handle: event.target.value })} placeholder="@yourministry" />
                </label>
                <label>
                  Category
                  <select value={channelDraft.category} onChange={(event) => setChannelDraft({ ...channelDraft, category: event.target.value })}>
                    <option>Teaching</option>
                    <option>Worship</option>
                    <option>Testimony</option>
                    <option>Ministry</option>
                    <option>Prayer</option>
                  </select>
                </label>
                <label>
                  Bio
                  <textarea value={channelDraft.bio} onChange={(event) => setChannelDraft({ ...channelDraft, bio: event.target.value })} />
                </label>
                <button className="primary-action" type="submit">Create channel</button>
              </form>

              <form className="mvp-form" onSubmit={scheduleStream}>
                <p className="eyebrow">Livestream</p>
                <h2>Schedule worship or prayer</h2>
                <label>
                  Stream title
                  <input value={streamDraft.title} onChange={(event) => setStreamDraft({ ...streamDraft, title: event.target.value })} />
                </label>
                <label>
                  Start time
                  <input type="datetime-local" value={streamDraft.startsAt} onChange={(event) => setStreamDraft({ ...streamDraft, startsAt: event.target.value })} />
                </label>
                <label>
                  Provider
                  <select value={streamDraft.provider} onChange={(event) => setStreamDraft({ ...streamDraft, provider: event.target.value })}>
                    <option value="mux">Mux</option>
                    <option value="youtube">YouTube</option>
                    <option value="livekit">LiveKit</option>
                  </select>
                </label>
                <button className="primary-action" type="submit">Schedule stream</button>
              </form>
            </section>
          </>
        )}

        {tab === 'creator' && (
          <>
            <SectionHeader title="Creator Dashboard" subtitle="Manage your videos, podcasts, status, and creator workflow" />
            <section className="creator-dashboard">
              <div className="feed-column">
                <h2>{session.displayName}</h2>
                <article className="feed-card">
                  <h3>Account</h3>
                  <p>{session.email} · {session.role}</p>
                  <p>{authToken ? 'Signed in with API token' : 'Sign in on Upload to publish to the API'}</p>
                </article>
                <article className="feed-card">
                  <h3>Storage</h3>
                  <p>Cloudinary uploads activate when Render has CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.</p>
                </article>
                <article className="feed-card">
                  <h3>Revenue</h3>
                  <p>{givingSummary.totals?.count || 0} checkout records · ${((givingSummary.totals?.amountCents || 0) / 100).toFixed(2)} tracked.</p>
                </article>
              </div>
              <div className="feed-column">
                <h2>My Videos</h2>
                {creatorMedia.length ? creatorMedia.map((item) => (
                  <article className="feed-card" key={item.id}>
                    <div><strong>{item.title}</strong><span>{item.status || 'published'}</span></div>
                    <p>{item.tag} · {item.duration || '0:00'}</p>
                    <button className="primary-action" type="button" onClick={() => { setActiveMedia(item); setTab('home') }}>Open player</button>
                  </article>
                )) : <article className="feed-card"><p>No uploaded videos yet.</p></article>}
              </div>
              <div className="feed-column">
                <h2>My Podcasts</h2>
                {creatorPodcasts.length ? creatorPodcasts.map((item) => (
                  <article className="feed-card" key={item.id}>
                    <div><strong>{item.episode}</strong><span>{item.duration}</span></div>
                    <p>{item.title}</p>
                    {item.audioUrl && <audio controls src={item.audioUrl} />}
                  </article>
                )) : <article className="feed-card"><p>No podcast episodes yet.</p></article>}
              </div>
            </section>
          </>
        )}

        {tab === 'giving' && (
          <>
            <SectionHeader title="Giving and Membership" subtitle="Donation, subscription, and ministry support checkout flows" />
            <section className="giving-layout">
              <form className="mvp-form" onSubmit={createCheckout}>
                <p className="eyebrow">Checkout</p>
                <h2>Create giving flow</h2>
                <label>
                  Flow type
                  <select value={givingDraft.type} onChange={(event) => setGivingDraft({ ...givingDraft, type: event.target.value })}>
                    <option value="donation">Donation</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </label>
                <label>
                  Provider
                  <select value={givingDraft.provider} onChange={(event) => setGivingDraft({ ...givingDraft, provider: event.target.value })}>
                    <option value="paystack">Paystack</option>
                    <option value="hubtel">Hubtel</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </label>
                <label>
                  Tier or purpose
                  <input value={givingDraft.tier} onChange={(event) => setGivingDraft({ ...givingDraft, tier: event.target.value })} />
                </label>
                <label>
                  Amount in cents/pesewas
                  <input value={givingDraft.amount} onChange={(event) => setGivingDraft({ ...givingDraft, amount: event.target.value })} />
                </label>
                <label>
                  Ministry or creator
                  <input value={givingDraft.ministryId} onChange={(event) => setGivingDraft({ ...givingDraft, ministryId: event.target.value })} />
                </label>
                <button className="primary-action" type="submit">Create checkout</button>
                {paymentMessage && <p className="form-note">{paymentMessage}</p>}
              </form>

              <section className="feed-column">
                <h2>Giving summary</h2>
                <article className="feed-card">
                  <h3>Total tracked</h3>
                  <p>{givingSummary.totals?.count || 0} checkout records · ${((givingSummary.totals?.amountCents || 0) / 100).toFixed(2)}</p>
                </article>
                <article className="feed-card">
                  <h3>Provider readiness</h3>
                  <p>Hubtel: {givingSummary.providers?.hubtel ? 'Configured' : 'Prototype'} · Paystack: {givingSummary.providers?.paystack ? 'Configured' : 'Prototype'} · Stripe: {givingSummary.providers?.stripe ? 'Configured' : 'Prototype'}</p>
                </article>
                {[...(givingSummary.donations || []), ...(givingSummary.subscriptions || [])].slice(0, 6).map((item) => (
                  <article className="feed-card" key={item.id}>
                    <div><strong>{item.type || 'donation'}</strong><span>{item.provider}</span></div>
                    <p>{item.tier || item.ministryId || 'GodRealm'} · ${((item.amountCents || 0) / 100).toFixed(2)}</p>
                  </article>
                ))}
              </section>
            </section>
          </>
        )}

        {tab === 'community' && (
          <>
            <SectionHeader title="Community MVP" subtitle="Working prayer, testimony, and profile flow saved on this device" />
            <section className="community-layout">
              <form className="mvp-form" onSubmit={saveProfile}>
                <p className="eyebrow">Account</p>
                <h2>{session.displayName}</h2>
                <label>
                  Display name
                  <input
                    value={profileDraft.displayName}
                    onChange={(event) => setProfileDraft({ ...profileDraft, displayName: event.target.value })}
                  />
                </label>
                <label>
                  Email
                  <input
                    value={profileDraft.email}
                    onChange={(event) => setProfileDraft({ ...profileDraft, email: event.target.value })}
                  />
                </label>
                <label>
                  Role
                  <select
                    value={profileDraft.role}
                    onChange={(event) => setProfileDraft({ ...profileDraft, role: event.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="ministry">Ministry</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
                <button className="primary-action" type="submit">Save profile</button>
              </form>

              <form className="mvp-form" onSubmit={addPrayer}>
                <p className="eyebrow">Prayer feed</p>
                <h2>Post a prayer</h2>
                <textarea
                  value={prayerDraft}
                  onChange={(event) => setPrayerDraft(event.target.value)}
                  placeholder="Share what is on your spirit..."
                />
                <input
                  value={verseDraft}
                  onChange={(event) => setVerseDraft(event.target.value)}
                  placeholder="Optional verse, e.g. Psalm 23:1"
                />
                <button className="primary-action" type="submit">Add prayer</button>
              </form>

              <form className="mvp-form" onSubmit={addTestimony}>
                <p className="eyebrow">Testimony hub</p>
                <h2>Share a testimony</h2>
                <input
                  value={testimonyDraft.title}
                  onChange={(event) => setTestimonyDraft({ ...testimonyDraft, title: event.target.value })}
                  placeholder="Testimony title"
                />
                <textarea
                  value={testimonyDraft.story}
                  onChange={(event) => setTestimonyDraft({ ...testimonyDraft, story: event.target.value })}
                  placeholder="What did God do?"
                />
                <button className="primary-action" type="submit">Publish testimony</button>
              </form>
            </section>

            <div className="feed-grid">
              <section className="feed-column">
                <h2>Prayer Feed</h2>
                {prayers.map((prayer) => (
                  <article className="feed-card" key={prayer.id}>
                    <div>
                      <strong>{prayer.author}</strong>
                      <span>{prayer.createdAt}</span>
                    </div>
                    <p>{prayer.body}</p>
                    {prayer.verseRef && <em>{prayer.verseRef}</em>}
                    <button
                      type="button"
                      onClick={() => prayWithRequest(prayer)}
                    >
                      Pray with them ({prayer.prayerCount || 0})
                    </button>
                  </article>
                ))}
              </section>

              <section className="feed-column">
                <h2>Testimony Wall</h2>
                {testimonies.map((testimony) => (
                  <article className="feed-card" key={testimony.id}>
                    <div>
                      <strong>{testimony.author}</strong>
                      <span>{testimony.createdAt}</span>
                    </div>
                    <h3>{testimony.title}</h3>
                    <p>{testimony.story}</p>
                    <button type="button" onClick={() => reactToTestimony(testimony)}>
                      Amen ({testimony.reactionCount || 0})
                    </button>
                  </article>
                ))}
              </section>
            </div>
          </>
        )}

        {tab === 'admin' && (
          <>
            <SectionHeader title="Admin Moderation" subtitle="Review media before wider release" />
            <section className="admin-panel">
              <div>
                <p className="eyebrow">Current role</p>
                <h2>{session.displayName}</h2>
                <p className="form-note">Admin actions require an account with admin or ministry role on the API.</p>
                {adminMessage && <p className="form-note">{adminMessage}</p>}
              </div>
              <div className="admin-list">
                {mediaFeed.map((item) => (
                  <article className="feed-card" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.status || 'published'}</span>
                    </div>
                    <p>{item.creator} · {item.tag}</p>
                    <div className="action-row">
                      <button className="primary-action" type="button" onClick={() => moderateMedia(item, 'approved')}>Approve</button>
                      <button className="primary-action" type="button" onClick={() => moderateMedia(item, 'review')}>Review</button>
                      <button className="primary-action" type="button" onClick={() => moderateMedia(item, 'hidden')}>Hide</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === 'search' && (
          <>
            <SectionHeader title="Free Christian Search" subtitle="Search faith topics with voice input and audio readback" />
            <section className="search-panel">
              <div>
                <p className="eyebrow">Open faith search</p>
                <h2>Ask about prayer, Scripture, giving, worship, healing, purpose, or testimony.</h2>
                <p>
                  This MVP uses a free local Christian knowledge set and browser voice/audio features.
                  Later, it can connect to your MongoDB content, Bible API, and a paid AI provider if you choose.
                </p>
              </div>
              <div className="search-box">
                <label>
                  Search in {language.name}
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Try: prayer for peace, healing, salvation, giving..."
                  />
                </label>
                <div className="action-row">
                  <button className="primary-action" type="button" onClick={startVoiceSearch}>
                    {isListening ? 'Listening...' : 'Voice search'}
                  </button>
                  <button
                    className="primary-action"
                    type="button"
                    onClick={() => speak(searchResults[0] ? `${searchResults[0].title}. ${searchResults[0].verse}. ${searchResults[0].answer}` : 'No result found.')}
                  >
                    Play answer
                  </button>
                </div>
              </div>
            </section>
            <div className="result-grid">
              {searchResults.map((result) => (
                <article className="result-card" key={result.title}>
                  <span>{result.verse}</span>
                  <h2>{result.title}</h2>
                  <p>{result.answer}</p>
                  <button type="button" onClick={() => speak(`${result.title}. ${result.verse}. ${result.answer}`)}>
                    Listen
                  </button>
                </article>
              ))}
              {!searchResults.length && (
                <article className="result-card">
                  <h2>No result yet</h2>
                  <p>Try a Christian topic like prayer, salvation, healing, worship, giving, or testimony.</p>
                </article>
              )}
            </div>
          </>
        )}

        {tab === 'language' && (
          <>
            <SectionHeader title="Language Options" subtitle="10 major languages for GodRealm access and voice features" />
            <div className="language-grid">
              {languages.map((item) => (
                <button
                  className={language.code === item.code ? 'language-card language-card--active' : 'language-card'}
                  key={item.code}
                  onClick={() => setLanguage(item)}
                  type="button"
                >
                  <span>{item.code}</span>
                  <strong>{item.name}</strong>
                  <em>{item.region}</em>
                </button>
              ))}
            </div>
            <section className="vision-band">
              <div>
                <p className="eyebrow">Selected language</p>
                <h2>{language.name}</h2>
              </div>
              <p>
                GodRealm will use this language for browser speech recognition and audio readback where
                the device supports it. Full interface translation can be connected next.
              </p>
            </section>
          </>
        )}

        {tab === 'library' && (
          <>
            <SectionHeader title="Library" subtitle="Your saved creators, playlists, prayer history, and profile links" />
            <div className="library-layout">
              <section className="feed-column">
                <h2>Saved Items</h2>
                {library.savedItems.length ? library.savedItems.map((item) => (
                  <article className="feed-card" key={item.id}>
                    <div><strong>{item.title || item.itemId}</strong><span>{item.itemType}</span></div>
                    <p>{item.creator || 'GodRealm'} saved {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'recently'}</p>
                  </article>
                )) : (
                  <article className="feed-card"><h3>No saved items yet</h3><p>Save sermons, worship videos, podcasts, and streams from the player.</p></article>
                )}
              </section>
              <section className="feed-column">
                <h2>Following</h2>
                {library.follows.length ? library.follows.map((follow) => (
                  <article className="feed-card" key={follow.id}>
                    <div><strong>{follow.channelName}</strong><span>{follow.channelHandle}</span></div>
                    <p>Followed {follow.createdAt ? new Date(follow.createdAt).toLocaleString() : 'recently'}</p>
                  </article>
                )) : (
                  <article className="feed-card"><h3>No followed creators yet</h3><p>Follow channels to build a personalized GodRealm home.</p></article>
                )}
              </section>
              <section className="feed-column">
                <h2>Creator Tools</h2>
                <article className="feed-card"><h3>Creator links</h3><p>{savedLinkCount} external platform links saved locally.</p></article>
                <article className="feed-card"><h3>Profile</h3><p>{session.displayName} · {session.role}</p></article>
                <article className="feed-card"><h3>Channels</h3><p>{channelFeed.length} creator channels loaded from {apiStatus.toLowerCase()}.</p></article>
                <article className="feed-card"><h3>Library status</h3><p>{libraryMessage || `${library.savedItems.length} saved and ${library.follows.length} followed.`}</p></article>
              </section>
            </div>
          </>
        )}

        {tab === 'links' && (
          <>
            <SectionHeader title="Creator Link System" subtitle="Connect every ministry platform in one profile" />
            <section className="link-builder">
              <aside className="category-rail">
                {platformCategories.map((category) => (
                  <button
                    className={category.id === activeCategory ? 'category-button category-button--active' : 'category-button'}
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    style={{ '--accent': category.color }}
                  >
                    <strong>{category.label}</strong>
                    <span>{(links[category.id] || []).length} linked</span>
                  </button>
                ))}
              </aside>
              <div className="link-panel" style={{ '--accent': currentCategory.color }}>
                <div className="link-panel__header">
                  <div>
                    <p className="eyebrow">{currentCategory.label}</p>
                    <h2>Add external links</h2>
                  </div>
                  <span className="count-pill">{savedLinkCount} saved</span>
                </div>
                <input
                  className="url-input"
                  value={draftUrl}
                  onChange={(event) => setDraftUrl(event.target.value)}
                  placeholder="Paste a URL, then choose the platform it belongs to"
                  type="url"
                />
                <div className="platform-grid">
                  {currentCategory.platforms.map((platform) => (
                    <button className="platform-button" key={platform} onClick={() => addLink(platform)}>
                      <span>{platform}</span>
                      <small>{links[activeCategory]?.some((link) => link.platform === platform) ? 'Linked' : 'Save link'}</small>
                    </button>
                  ))}
                </div>
                {savedLinkCount > 0 && (
                  <div className="preview-links">
                    {Object.entries(links).flatMap(([categoryId, categoryLinks]) =>
                      categoryLinks.map((link) => {
                        const category = platformCategories.find((item) => item.id === categoryId)
                        return (
                          <a href={link.url} key={`${categoryId}-${link.platform}`} style={{ '--accent': category.color }}>
                            {link.platform}
                          </a>
                        )
                      }),
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {tab === 'profiles' && (
          <>
            <SectionHeader title="Creator Profiles" subtitle="How pastors, artists, authors, and ministries appear" />
            <div className="profile-grid">
              {profiles.map((profile) => (
                <article className="profile-card" key={profile.handle}>
                  <div className="avatar">{profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                  <div>
                    <div className="profile-card__title">
                      <h2>{profile.name}</h2>
                      {profile.verified && <span>Verified</span>}
                    </div>
                    <p className="handle">{profile.handle}</p>
                    <p>{profile.role}</p>
                    <div className="chip-row">
                      {profile.links.map((link) => <span key={link}>{link}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === 'money' && (
          <>
            <SectionHeader title="Revenue Architecture" subtitle="Subscriptions, donations, ministry tools, and events" />
            <div className="tier-grid">
              {tiers.map(([name, price, perks]) => (
                <article className="tier-card" key={name}>
                  <p>{name}</p>
                  <h2>{price}</h2>
                  <span>{perks}</span>
                </article>
              ))}
            </div>
            <section className="projection">
              <p className="eyebrow">Conservative projection</p>
              <div>
                <strong>Month 6: $2.5K MRR</strong>
                <strong>Month 9: $12K MRR</strong>
                <strong>Year 1: $35K MRR</strong>
                <strong>Year 2: $150K MRR</strong>
              </div>
            </section>
          </>
        )}

        {tab === 'roadmap' && (
          <>
            <SectionHeader title="12-Month Roadmap" subtitle="From MVP to public mobile platform" />
            <div className="phase-switcher">
              {phases.map((phase) => (
                <button
                  className={phase.id === activePhase ? 'phase-button phase-button--active' : 'phase-button'}
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  style={{ '--accent': phase.color }}
                >
                  {phase.label}
                  <span>{phase.title}</span>
                </button>
              ))}
            </div>
            <section className="phase-detail" style={{ '--accent': currentPhase.color }}>
              <div className="phase-detail__header">
                <div>
                  <p className="eyebrow">{currentPhase.duration}</p>
                  <h2>{currentPhase.title}</h2>
                </div>
                <strong>{currentPhase.milestone}</strong>
              </div>
              <div className="two-column">
                <ListBlock title="Features" items={currentPhase.features} />
                <ListBlock title="Stack" items={currentPhase.stack} />
              </div>
            </section>
          </>
        )}

        {tab === 'backend' && (
          <>
            <SectionHeader title="Backend and Database" subtitle="Production-ready shape for auth, posts, links, money, and streams" />
            <div className="two-column">
              <SpecTable title="API routes" rows={apiPlan} />
              <SpecTable title="Database models" rows={schemas} />
            </div>
            <section className="vision-band">
              <div>
                <p className="eyebrow">Auth roles</p>
                <h2>User, creator, ministry, and admin</h2>
              </div>
              <p>
                The included example API now documents GodRealm endpoints and an in-memory prototype. Swap
                the repository for Supabase, PostgreSQL, or MongoDB when you are ready to persist data.
              </p>
            </section>
          </>
        )}

        {tab === 'mobile' && (
          <>
            <SectionHeader title="Mobile Launch" subtitle="Capacitor Android shell renamed for GodRealm" />
            <div className="mobile-grid">
              <StatusCard label="App name" value="GodRealm" />
              <StatusCard label="App id" value="com.godrealm.app" />
              <StatusCard label="Web output" value="dist" />
              <StatusCard label="Next command" value="npx cap sync android" />
            </div>
            <section className="vision-band">
              <div>
                <p className="eyebrow">Store path</p>
                <h2>Build the APK after every production web build.</h2>
              </div>
              <p>
                The project is ready for the normal flow: build the web app, sync Capacitor, then open or
                build Android from the generated native project.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <p>{subtitle}</p>
      <h2>{title}</h2>
    </div>
  )
}

function ListBlock({ title, items }) {
  return (
    <div className="list-block">
      <h3>{title}</h3>
      {items.map((item) => <p key={item}>{item}</p>)}
    </div>
  )
}

function SpecTable({ title, rows }) {
  return (
    <section className="spec-table">
      <h2>{title}</h2>
      {rows.map(([name, description]) => (
        <div className="spec-row" key={name}>
          <strong>{name}</strong>
          <span>{description}</span>
        </div>
      ))}
    </section>
  )
}

function StatusCard({ label, value }) {
  return (
    <article className="status-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function MediaGrid({ items, onSelect }) {
  return (
    <div className="media-grid">
      {items.map((item) => (
        <button className="media-card" key={item.id} onClick={() => onSelect(item)} style={{ '--accent': item.accent }} type="button">
          <div className="thumbnail">
            <span>{item.tag}</span>
            <small>{item.duration}</small>
          </div>
          <strong>{item.title}</strong>
          <p>{item.creator}</p>
          <em>{item.views} views</em>
        </button>
      ))}
    </div>
  )
}

function PodcastRow({ items }) {
  return (
    <div className="podcast-row">
      {items.map((item) => (
        <article className="podcast-card" key={item.id} style={{ '--accent': item.accent }}>
          <div className="podcast-art">
            <span>{item.title.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <p className="eyebrow">{item.duration}</p>
            <h2>{item.episode}</h2>
            <p>{item.title} · {item.creator}</p>
          </div>
          <button className="primary-action" type="button">Play</button>
        </article>
      ))}
    </div>
  )
}

export default App
