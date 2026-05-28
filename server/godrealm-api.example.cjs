const http = require('http')
const crypto = require('crypto')

let MongoClient
try {
  ;({ MongoClient } = require('mongodb'))
} catch {
  MongoClient = null
}

const port = Number(process.env.PORT || 3001)
const mongoUri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || 'godrealm'
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',').map((origin) => origin.trim())
const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  folder: process.env.CLOUDINARY_FOLDER || 'godrealm',
}

const memory = {
  users: [],
  sessions: [],
  media: [],
  podcasts: [],
  channels: [],
  prayers: [],
  testimonies: [],
  creatorLinks: [],
  donations: [],
  subscriptions: [],
  streams: [],
  paymentEvents: [],
  follows: [],
  savedItems: [],
  reports: [],
}

const seedMedia = [
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
    createdAt: '2026-05-24T00:00:00.000Z',
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
    createdAt: '2026-05-24T00:00:00.000Z',
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
    createdAt: '2026-05-24T00:00:00.000Z',
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
    createdAt: '2026-05-24T00:00:00.000Z',
  },
]

const seedPodcasts = [
  {
    id: 'pod-1',
    title: 'Fire and Grace Podcast',
    creator: 'Pastor David Osei',
    episode: 'Intercession When You Feel Weak',
    duration: '42 min',
    accent: '#e8762b',
    createdAt: '2026-05-24T00:00:00.000Z',
  },
  {
    id: 'pod-2',
    title: 'Faith Letters Weekly',
    creator: 'Sister Blessing Addo',
    episode: 'Writing Your Testimony With Courage',
    duration: '28 min',
    accent: '#3a8c6e',
    createdAt: '2026-05-24T00:00:00.000Z',
  },
  {
    id: 'pod-3',
    title: 'Worship Table',
    creator: 'Grace Melody Worship',
    episode: 'Building a Life of Praise',
    duration: '35 min',
    accent: '#7e6fbf',
    createdAt: '2026-05-24T00:00:00.000Z',
  },
]

const seedChannels = [
  { id: 'channel-1', name: 'Pastor David Osei', handle: '@pastorosei', category: 'Teaching', followers: '48K', createdAt: '2026-05-24T00:00:00.000Z' },
  { id: 'channel-2', name: 'Grace Melody Worship', handle: '@gracemelody', category: 'Worship', followers: '92K', createdAt: '2026-05-24T00:00:00.000Z' },
  { id: 'channel-3', name: 'Sister Blessing Addo', handle: '@blessingaddo', category: 'Testimony', followers: '12K', createdAt: '2026-05-24T00:00:00.000Z' },
]

const seedStreams = [
  {
    id: 'stream-1',
    hostId: 'seed',
    hostName: 'GodRealm Studio',
    title: 'Live Prayer Room',
    startsAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    provider: 'mux',
    status: 'scheduled',
    audience: '126 praying now',
    accent: '#c0392b',
  },
  {
    id: 'stream-2',
    hostId: 'seed',
    hostName: 'Kingdom Chapel Global',
    title: 'Sunday Worship Service',
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    provider: 'youtube',
    status: 'scheduled',
    audience: 'Starts tomorrow',
    accent: '#c9a84c',
  },
]

let mongoClient
let mongoConnectPromise
let mongoConnectionError = ''

const roles = new Set(['user', 'creator', 'ministry', 'admin'])
const paymentProviders = new Set(['hubtel', 'paystack', 'stripe'])

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') {
    return send(req, res, 204)
  }

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      const database = await getStore()
      return send(req, res, 200, {
        ok: true,
        app: 'GodRealm',
        service: 'api',
        database: database.kind,
        databaseWarning: database.warning || mongoConnectionError || '',
        payments: paymentReadiness(),
        uploads: cloudinary.cloudName ? 'cloudinary' : 'url-only',
      })
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/register') {
      const body = await readJson(req)
      const user = await createUser(body)
      return send(req, res, 201, { user: publicUser(user), token: await createSession(user.id) })
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      const body = await readJson(req)
      const user = await findOne('users', { email: String(body.email || '').toLowerCase() })
      if (!user || !verifyPassword(body.password, user)) return send(req, res, 401, { error: 'Invalid credentials' })
      return send(req, res, 200, { user: publicUser(user), token: await createSession(user.id) })
    }

    if (req.method === 'GET' && url.pathname === '/api/auth/me') {
      const user = await requireUser(req)
      return send(req, res, 200, { user: publicUser(user) })
    }

    if (req.method === 'POST' && url.pathname === '/api/uploads/sign') {
      await requireUser(req)
      const body = await readJson(req)
      const resourceType = ['image', 'video', 'raw'].includes(body.resourceType) ? body.resourceType : 'video'
      if (!cloudinary.cloudName || !cloudinary.apiKey || !cloudinary.apiSecret) {
        return send(req, res, 501, { error: 'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.' })
      }
      const timestamp = Math.round(Date.now() / 1000)
      const folder = optionalText(body.folder) || cloudinary.folder
      const signature = signCloudinaryParams({ folder, timestamp })
      return send(req, res, 200, {
        cloudName: cloudinary.cloudName,
        apiKey: cloudinary.apiKey,
        folder,
        timestamp,
        signature,
        resourceType,
        uploadUrl: `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/${resourceType}/upload`,
      })
    }

    if (req.method === 'GET' && url.pathname === '/api/creator/dashboard') {
      const user = await requireUser(req)
      const donations = await listRecords('donations', { userId: user.id })
      const subscriptions = await listRecords('subscriptions', { userId: user.id })
      const streams = await listRecords('streams', { hostId: user.id })
      return send(req, res, 200, {
        user: publicUser(user),
        media: await listRecords('media', { userId: user.id }),
        podcasts: await listRecords('podcasts', { userId: user.id }),
        creatorLinks: await listRecords('creatorLinks', { userId: user.id }),
        streams,
        revenue: revenueSummary([...donations, ...subscriptions]),
      })
    }

    if (req.method === 'GET' && url.pathname === '/api/media') {
      const type = optionalText(url.searchParams.get('type'))
      const query = type ? { type } : {}
      return send(req, res, 200, { media: await listRecordsWithSeed('media', query, seedMedia) })
    }

    if (req.method === 'POST' && url.pathname === '/api/media') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const media = await addRecord('media', {
        userId: user.id,
        type: optionalText(body.type) || 'video',
        title: requiredText(body.title, 'Media title'),
        creator: optionalText(body.creator) || user.displayName,
        duration: optionalText(body.duration) || '0:00',
        views: '0',
        tag: optionalText(body.tag) || 'Sermon',
        accent: optionalText(body.accent) || '#c9a84c',
        description: optionalText(body.description),
        mediaUrl: optionalText(body.mediaUrl),
        thumbnailUrl: optionalText(body.thumbnailUrl),
        status: optionalText(body.status) || 'published',
      })
      return send(req, res, 201, { media })
    }

    if (req.method === 'POST' && url.pathname.startsWith('/api/media/') && url.pathname.endsWith('/moderate')) {
      const user = await requireUser(req)
      if (!['admin', 'ministry'].includes(user.role)) return send(req, res, 403, { error: 'Admin or ministry role required' })
      const id = url.pathname.split('/')[3]
      const body = await readJson(req)
      const media = await updateRecord('media', { id }, {
        status: optionalText(body.status) || 'review',
        moderationNote: optionalText(body.note),
        moderatedBy: user.id,
        moderatedAt: new Date().toISOString(),
      })
      if (!media) return send(req, res, 404, { error: 'Media not found' })
      return send(req, res, 200, { media })
    }

    if (req.method === 'GET' && url.pathname === '/api/podcasts') {
      return send(req, res, 200, { podcasts: await listRecordsWithSeed('podcasts', {}, seedPodcasts) })
    }

    if (req.method === 'POST' && url.pathname === '/api/podcasts') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const podcast = await addRecord('podcasts', {
        userId: user.id,
        title: requiredText(body.title, 'Podcast title'),
        creator: optionalText(body.creator) || user.displayName,
        episode: requiredText(body.episode, 'Episode title'),
        duration: optionalText(body.duration) || '0 min',
        accent: optionalText(body.accent) || '#e8762b',
        audioUrl: optionalText(body.audioUrl),
        status: 'published',
      })
      return send(req, res, 201, { podcast })
    }

    if (req.method === 'GET' && url.pathname === '/api/channels') {
      return send(req, res, 200, { channels: await listRecordsWithSeed('channels', {}, seedChannels) })
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/channels/')) {
      const handle = decodeURIComponent(url.pathname.split('/').pop())
      const channels = await listRecordsWithSeed('channels', {}, seedChannels)
      const channel = channels.find((item) => item.id === handle || item.handle === handle || item.handle === `@${handle}`)
      if (!channel) return send(req, res, 404, { error: 'Channel not found' })
      const media = (await listRecordsWithSeed('media', {}, seedMedia)).filter((item) => item.creator === channel.name || item.userId === channel.userId)
      const podcasts = (await listRecordsWithSeed('podcasts', {}, seedPodcasts)).filter((item) => item.creator === channel.name || item.userId === channel.userId)
      return send(req, res, 200, { channel, media, podcasts })
    }

    if (req.method === 'POST' && url.pathname.startsWith('/api/channels/') && url.pathname.endsWith('/follow')) {
      const user = await requireUser(req)
      const handle = decodeURIComponent(url.pathname.split('/')[3])
      const channels = await listRecordsWithSeed('channels', {}, seedChannels)
      const channel = channels.find((item) => item.id === handle || item.handle === handle || item.handle === `@${handle}`)
      if (!channel) return send(req, res, 404, { error: 'Channel not found' })
      const existing = await findOne('follows', { userId: user.id, channelId: channel.id })
      if (existing) return send(req, res, 200, { follow: existing, channel })
      const follow = await addRecord('follows', {
        userId: user.id,
        channelId: channel.id,
        channelName: channel.name,
        channelHandle: channel.handle,
      })
      return send(req, res, 201, { follow, channel })
    }

    if (req.method === 'POST' && url.pathname === '/api/channels') {
      const user = await requireUser(req)
      if (!['creator', 'ministry', 'admin'].includes(user.role)) return send(req, res, 403, { error: 'Creator, ministry, or admin role required' })
      const body = await readJson(req)
      const name = requiredText(body.name || user.displayName, 'Channel name')
      const handle = normalizeHandle(body.handle || name)
      const exists = await findOne('channels', { handle })
      if (exists) return send(req, res, 409, { error: 'Channel handle is already taken' })
      const channel = await addRecord('channels', {
        userId: user.id,
        name,
        handle,
        category: optionalText(body.category) || user.role,
        followers: '0',
        bio: optionalText(body.bio),
        givingEnabled: Boolean(body.givingEnabled ?? true),
      })
      return send(req, res, 201, { channel })
    }

    if (req.method === 'GET' && url.pathname === '/api/feed/prayers') {
      return send(req, res, 200, { prayers: await listRecords('prayers') })
    }

    if (req.method === 'POST' && url.pathname === '/api/feed/prayers') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const prayer = await addRecord('prayers', {
        userId: user.id,
        author: user.displayName,
        body: requiredText(body.body, 'Prayer body'),
        verseRef: optionalText(body.verseRef),
        mediaUrl: optionalText(body.mediaUrl),
        visibility: optionalText(body.visibility) || 'public',
        prayerCount: 0,
      })
      return send(req, res, 201, { prayer })
    }

    if (req.method === 'POST' && url.pathname.startsWith('/api/feed/prayers/') && url.pathname.endsWith('/pray')) {
      await requireUser(req)
      const id = url.pathname.split('/')[4]
      const prayer = await findOne('prayers', { id })
      if (!prayer) return send(req, res, 404, { error: 'Prayer request not found' })
      const updated = await updateRecord('prayers', { id }, {
        prayerCount: Number(prayer.prayerCount || 0) + 1,
        lastPrayedAt: new Date().toISOString(),
      })
      return send(req, res, 200, { prayer: updated })
    }

    if (req.method === 'GET' && url.pathname === '/api/testimonies') {
      return send(req, res, 200, { testimonies: await listRecords('testimonies') })
    }

    if (req.method === 'POST' && url.pathname === '/api/testimonies') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const testimony = await addRecord('testimonies', {
        userId: user.id,
        author: user.displayName,
        title: requiredText(body.title, 'Testimony title'),
        story: requiredText(body.story, 'Testimony story'),
        mediaUrl: optionalText(body.mediaUrl),
        status: 'published',
        reactionCount: 0,
      })
      return send(req, res, 201, { testimony })
    }

    if (req.method === 'POST' && url.pathname.startsWith('/api/testimonies/') && url.pathname.endsWith('/react')) {
      await requireUser(req)
      const id = url.pathname.split('/')[3]
      const testimony = await findOne('testimonies', { id })
      if (!testimony) return send(req, res, 404, { error: 'Testimony not found' })
      const updated = await updateRecord('testimonies', { id }, {
        reactionCount: Number(testimony.reactionCount || 0) + 1,
        lastReactedAt: new Date().toISOString(),
      })
      return send(req, res, 200, { testimony: updated })
    }

    if (req.method === 'GET' && url.pathname === '/api/creator-links') {
      const user = await optionalUser(req)
      const query = user ? { userId: user.id } : {}
      return send(req, res, 200, { creatorLinks: await listRecords('creatorLinks', query) })
    }

    if (req.method === 'POST' && url.pathname === '/api/creator-links') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const creatorLink = await addRecord('creatorLinks', {
        userId: user.id,
        category: requiredText(body.category, 'Category'),
        platform: requiredText(body.platform, 'Platform'),
        url: validateUrl(body.url),
        label: optionalText(body.label) || body.platform,
        clickCount: 0,
        sortOrder: Number(body.sortOrder || 0),
      })
      return send(req, res, 201, { creatorLink })
    }

    if (req.method === 'POST' && url.pathname === '/api/payments/checkout') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const provider = normalizeProvider(body.provider)
      const payment = await createPaymentCheckout(user, body, provider)
      return send(req, res, 201, payment)
    }

    if (req.method === 'POST' && url.pathname === '/api/donations/checkout') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const provider = normalizeProvider(body.provider || 'paystack')
      const payment = await createPaymentCheckout(user, { ...body, type: 'donation' }, provider)
      return send(req, res, 201, payment)
    }

    if (req.method === 'POST' && url.pathname === '/api/subscriptions/checkout') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const provider = normalizeProvider(body.provider || 'stripe')
      const payment = await createPaymentCheckout(user, { ...body, type: 'subscription' }, provider)
      return send(req, res, 201, payment)
    }

    if (req.method === 'POST' && url.pathname === '/api/library/save') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const itemId = requiredText(body.itemId, 'Item id')
      const itemType = requiredText(body.itemType, 'Item type')
      const existing = await findOne('savedItems', { userId: user.id, itemId })
      if (existing) return send(req, res, 200, { savedItem: existing })
      const savedItem = await addRecord('savedItems', {
        userId: user.id,
        itemId,
        itemType,
        title: optionalText(body.title),
        creator: optionalText(body.creator),
      })
      return send(req, res, 201, { savedItem })
    }

    if (req.method === 'POST' && url.pathname === '/api/reports') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const targetType = requiredText(body.targetType, 'Target type')
      const targetId = requiredText(body.targetId, 'Target id')
      const report = await addRecord('reports', {
        reporterId: user.id,
        reporterName: user.displayName,
        targetType,
        targetId,
        targetTitle: optionalText(body.targetTitle),
        reason: requiredText(body.reason, 'Reason'),
        details: optionalText(body.details),
        status: 'open',
      })
      return send(req, res, 201, { report })
    }

    if (req.method === 'GET' && url.pathname === '/api/admin/reports') {
      const user = await requireUser(req)
      if (!['admin', 'ministry'].includes(user.role)) return send(req, res, 403, { error: 'Admin or ministry role required' })
      return send(req, res, 200, { reports: await listRecords('reports') })
    }

    if (req.method === 'PATCH' && url.pathname.startsWith('/api/admin/reports/')) {
      const user = await requireUser(req)
      if (!['admin', 'ministry'].includes(user.role)) return send(req, res, 403, { error: 'Admin or ministry role required' })
      const id = url.pathname.split('/')[4]
      const body = await readJson(req)
      const status = optionalText(body.status) || 'reviewing'
      if (!['open', 'reviewing', 'resolved', 'dismissed'].includes(status)) return send(req, res, 400, { error: 'Invalid report status' })
      const report = await updateRecord('reports', { id }, {
        status,
        adminNote: optionalText(body.note),
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString(),
      })
      if (!report) return send(req, res, 404, { error: 'Report not found' })
      return send(req, res, 200, { report })
    }

    if (req.method === 'GET' && url.pathname === '/api/library') {
      const user = await requireUser(req)
      const [savedItems, follows] = await Promise.all([
        listRecords('savedItems', { userId: user.id }),
        listRecords('follows', { userId: user.id }),
      ])
      return send(req, res, 200, { savedItems, follows })
    }

    if (req.method === 'GET' && url.pathname === '/api/giving/summary') {
      const user = await optionalUser(req)
      const query = user ? { userId: user.id } : {}
      const donations = await listRecords('donations', query)
      const subscriptions = await listRecords('subscriptions', query)
      return send(req, res, 200, {
        donations,
        subscriptions,
        totals: revenueSummary([...donations, ...subscriptions]),
        providers: paymentReadiness(),
      })
    }

    if (req.method === 'POST' && url.pathname.startsWith('/api/webhooks/')) {
      const provider = normalizeProvider(url.pathname.split('/').pop())
      const body = await readJson(req)
      const event = await addRecord('paymentEvents', {
        provider,
        headers: safeWebhookHeaders(req.headers),
        payload: body,
        verified: false,
        note: 'Add provider signature verification before production.',
      })
      return send(req, res, 202, { received: true, eventId: event.id })
    }

    if (req.method === 'POST' && url.pathname === '/api/streams/schedule') {
      const user = await requireUser(req)
      const body = await readJson(req)
      const stream = await addRecord('streams', {
        hostId: user.id,
        hostName: user.displayName,
        title: requiredText(body.title, 'Stream title'),
        startsAt: requiredText(body.startsAt, 'Start time'),
        provider: optionalText(body.provider) || 'mux',
        status: 'scheduled',
        audience: optionalText(body.audience) || 'Scheduled',
        accent: optionalText(body.accent) || '#c0392b',
      })
      return send(req, res, 201, { stream })
    }

    if (req.method === 'GET' && url.pathname === '/api/streams') {
      return send(req, res, 200, { streams: await listRecordsWithSeed('streams', {}, seedStreams) })
    }

    return send(req, res, 404, { error: 'Route not found' })
  } catch (error) {
    const status = error.statusCode || 500
    return send(req, res, status, { error: error.message || 'GodRealm API error' })
  }
})

async function getStore() {
  if (!mongoUri || !MongoClient) return { kind: 'memory' }

  if (!mongoClient) {
    mongoClient = new MongoClient(mongoUri, {
      // Render web services are long-running Node processes. This conservative pool is enough for an MVP
      // API and avoids over-opening Atlas connections while you are still measuring traffic.
      maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 20),
      minPoolSize: Number(process.env.MONGODB_MIN_POOL_SIZE || 0),
      maxIdleTimeMS: Number(process.env.MONGODB_MAX_IDLE_TIME_MS || 300000),
      serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 5000),
      connectTimeoutMS: Number(process.env.MONGODB_CONNECT_TIMEOUT_MS || 10000),
      socketTimeoutMS: Number(process.env.MONGODB_SOCKET_TIMEOUT_MS || 30000),
    })
  }

  if (!mongoConnectPromise) {
    mongoConnectPromise = mongoClient.connect()
  }

  try {
    await mongoConnectPromise
    mongoConnectionError = ''
    return { kind: 'mongodb', db: mongoClient.db(dbName) }
  } catch (error) {
    mongoConnectionError = error.message || 'MongoDB connection failed'
    mongoConnectPromise = null
    if (mongoClient) {
      await mongoClient.close().catch(() => {})
      mongoClient = null
    }
    return { kind: 'memory', warning: mongoConnectionError }
  }
}

async function createUser(body) {
  const email = String(body.email || '').trim().toLowerCase()
  if (!email || !email.includes('@')) throw badRequest('Valid email is required')
  if (await findOne('users', { email })) throw badRequest('Email is already registered')
  const password = requiredText(body.password, 'Password')
  if (password.length < 8) throw badRequest('Password must be at least 8 characters')
  const passwordSalt = crypto.randomBytes(16).toString('hex')

  const role = roles.has(body.role) ? body.role : 'user'
  return addRecord('users', {
    email,
    displayName: optionalText(body.displayName) || email.split('@')[0],
    role,
    passwordSalt,
    passwordHash: hashPassword(password, passwordSalt),
    spiritualTags: Array.isArray(body.spiritualTags) ? body.spiritualTags.slice(0, 8) : [],
  })
}

async function addRecord(collection, values) {
  const record = {
    id: crypto.randomUUID(),
    ...values,
    createdAt: new Date().toISOString(),
  }
  const store = await getStore()
  if (store.kind === 'mongodb') {
    await store.db.collection(collection).insertOne(record)
  } else {
    memory[collection].push(record)
  }
  return record
}

async function findOne(collection, query) {
  const store = await getStore()
  if (store.kind === 'mongodb') {
    return store.db.collection(collection).findOne(query, { projection: { _id: 0 } })
  }
  return memory[collection].find((record) => matches(record, query)) || null
}

async function listRecords(collection, query = {}) {
  const store = await getStore()
  if (store.kind === 'mongodb') {
    return store.db.collection(collection).find(query, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(100).toArray()
  }
  return memory[collection].filter((record) => matches(record, query)).slice().reverse()
}

async function listRecordsWithSeed(collection, query, seed) {
  const records = await listRecords(collection, query)
  if (records.length) return records
  return seed.filter((record) => matches(record, query))
}

async function updateRecord(collection, query, values) {
  const store = await getStore()
  if (store.kind === 'mongodb') {
    await store.db.collection(collection).updateOne(query, { $set: values })
    return store.db.collection(collection).findOne(query, { projection: { _id: 0 } })
  }

  const index = memory[collection].findIndex((record) => matches(record, query))
  if (index === -1) return null
  memory[collection][index] = { ...memory[collection][index], ...values }
  return memory[collection][index]
}

async function createSession(userId) {
  const token = crypto.randomBytes(24).toString('hex')
  await addRecord('sessions', {
    tokenHash: hashToken(token),
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
  })
  return token
}

async function requireUser(req) {
  const user = await optionalUser(req)
  if (!user) {
    const error = new Error('Authentication required')
    error.statusCode = 401
    throw error
  }
  return user
}

async function optionalUser(req) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) return null

  const session = await findOne('sessions', { tokenHash: hashToken(token) })
  if (!session || Date.parse(session.expiresAt) < Date.now()) return null
  return findOne('users', { id: session.userId })
}

async function createPaymentCheckout(user, body, provider) {
  const amountCents = Number(body.amountCents || body.amount || 0)
  if (!amountCents || amountCents < 100) throw badRequest('Payment amount must be at least 100 cents')

  const payment = await addRecord(body.type === 'subscription' ? 'subscriptions' : 'donations', {
    userId: user.id,
    email: user.email,
    provider,
    type: optionalText(body.type) || 'donation',
    tier: optionalText(body.tier),
    ministryId: optionalText(body.ministryId),
    amountCents,
    currency: optionalText(body.currency) || (provider === 'hubtel' || provider === 'paystack' ? 'GHS' : 'USD'),
    status: 'checkout_created',
  })

  return {
    provider,
    payment,
    checkoutUrl: getCheckoutUrl(provider, payment),
    mode: 'prototype',
  }
}

function getCheckoutUrl(provider, payment) {
  if (provider === 'hubtel') return `https://checkout.hubtel.example/godrealm/${payment.id}`
  if (provider === 'paystack') return `https://checkout.paystack.example/godrealm/${payment.id}`
  return `https://checkout.stripe.example/godrealm/${payment.id}`
}

function normalizeProvider(value) {
  const provider = String(value || '').trim().toLowerCase()
  if (!paymentProviders.has(provider)) throw badRequest('Provider must be hubtel, paystack, or stripe')
  return provider
}

function safeWebhookHeaders(headers) {
  return {
    'x-paystack-signature': headers['x-paystack-signature'] ? 'present' : '',
    'stripe-signature': headers['stripe-signature'] ? 'present' : '',
    'x-hubtel-signature': headers['x-hubtel-signature'] ? 'present' : '',
  }
}

function paymentReadiness() {
  return {
    hubtel: Boolean(process.env.HUBTEL_CLIENT_ID && process.env.HUBTEL_CLIENT_SECRET),
    paystack: Boolean(process.env.PAYSTACK_SECRET_KEY),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    prototypeProviders: ['hubtel', 'paystack', 'stripe'],
  }
}

function revenueSummary(records) {
  return records.reduce((summary, record) => {
    const amount = Number(record.amountCents || 0)
    summary.count += 1
    summary.amountCents += amount
    summary.byProvider[record.provider] = (summary.byProvider[record.provider] || 0) + amount
    return summary
  }, { count: 0, amountCents: 0, byProvider: {} })
}

function normalizeHandle(value) {
  const raw = optionalText(value).toLowerCase().replace(/[^a-z0-9_]+/g, '')
  if (!raw) throw badRequest('Channel handle is required')
  return `@${raw.replace(/^@+/, '')}`
}

function publicUser(user) {
  const { email, id, displayName, role, spiritualTags, createdAt } = user
  return { email, id, displayName, role, spiritualTags, createdAt }
}

function signCloudinaryParams(params) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return crypto.createHash('sha1').update(`${payload}${cloudinary.apiSecret}`).digest('hex')
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(String(password), salt, 120000, 32, 'sha256').toString('hex')
}

function verifyPassword(password, user) {
  if (!user.passwordHash || !user.passwordSalt) return true
  const candidate = hashPassword(String(password || ''), user.passwordSalt)
  return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(user.passwordHash, 'hex'))
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function matches(record, query) {
  return Object.entries(query).every(([key, value]) => record[key] === value)
}

function requiredText(value, label) {
  const text = optionalText(value)
  if (!text) throw badRequest(`${label} is required`)
  return text
}

function optionalText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateUrl(value) {
  const text = requiredText(value, 'URL')
  const parsed = new URL(text)
  if (!['http:', 'https:'].includes(parsed.protocol)) throw badRequest('URL must use http or https')
  return parsed.toString()
}

function badRequest(message) {
  const error = new Error(message)
  error.statusCode = 400
  return error
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 1_000_000) reject(badRequest('Request body is too large'))
    })
    req.on('end', () => {
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch {
        reject(badRequest('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function send(req, res, status, body = null) {
  const origin = req.headers.origin || ''
  const allowOrigin = allowedOrigins.includes('*') || allowedOrigins.includes(origin) ? origin || '*' : allowedOrigins[0]
  res.writeHead(status, {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature, X-Paystack-Signature, X-Hubtel-Signature',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  })
  res.end(body ? JSON.stringify(body, null, 2) : '')
}

async function shutdown() {
  if (mongoClient) await mongoClient.close()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

server.listen(port, () => {
  console.log(`GodRealm API running on http://localhost:${port}`)
})
