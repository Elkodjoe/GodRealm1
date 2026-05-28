const API_URL = process.env.API_URL || 'http://127.0.0.1:3001'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options)
  const text = await response.text()
  let data = {}

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { error: text || 'Request failed' }
  }

  if (!response.ok) {
    throw new Error(`${options.method || 'GET'} ${path} failed: ${data.error || response.statusText}`)
  }

  return data
}

function authHeaders(token, extra = {}) {
  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  }
}

async function main() {
  const health = await request('/api/health')
  console.log(`api=${health.ok ? 'ok' : 'down'} database=${health.database} uploads=${health.uploads}`)

  const email = `smoke-${Date.now()}@godrealm.local`
  const auth = await request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      displayName: 'Smoke Creator',
      email,
      password: 'GodRealm123',
      role: 'admin',
    }),
  })

  if (!auth.token || !auth.user?.id) throw new Error('Registration did not return a session')
  console.log(`registered=${email}`)

  const channel = await request('/api/channels', {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      name: 'Smoke Chapel',
      handle: `smoke${Date.now()}`,
      category: 'Teaching',
      bio: 'A smoke-test channel for GodRealm.',
    }),
  })

  const media = await request('/api/media', {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      title: 'Smoke Sermon',
      type: 'video',
      tag: 'Sermon',
      duration: '12:34',
      description: 'Smoke test media publish.',
      mediaUrl: 'https://example.com/smoke-sermon.mp4',
    }),
  })

  await request(`/api/media/${media.media.id}/moderate`, {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status: 'approved', note: 'Smoke approved' }),
  })

  const donation = await request('/api/donations/checkout', {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      provider: 'paystack',
      amountCents: 2500,
      ministryId: channel.channel.id,
      tier: 'Offering',
    }),
  })

  const subscription = await request('/api/subscriptions/checkout', {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      provider: 'stripe',
      amountCents: 999,
      tier: 'Faithful',
    }),
  })

  const stream = await request('/api/streams/schedule', {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      title: 'Smoke Prayer Watch',
      startsAt: new Date(Date.now() + 3600000).toISOString(),
      provider: 'mux',
    }),
  })

  const prayer = await request('/api/feed/prayers', {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      body: 'Smoke test prayer request.',
      verseRef: 'Psalm 23:1',
    }),
  })

  const prayed = await request(`/api/feed/prayers/${prayer.prayer.id}/pray`, {
    method: 'POST',
    headers: authHeaders(auth.token),
  })

  const testimony = await request('/api/testimonies', {
    method: 'POST',
    headers: authHeaders(auth.token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      title: 'Smoke Testimony',
      story: 'A short smoke-test testimony for the GodRealm wall.',
    }),
  })

  const reacted = await request(`/api/testimonies/${testimony.testimony.id}/react`, {
    method: 'POST',
    headers: authHeaders(auth.token),
  })

  const giving = await request('/api/giving/summary', {
    headers: authHeaders(auth.token),
  })

  if (!donation.checkoutUrl || !subscription.checkoutUrl || !stream.stream?.id) {
    throw new Error('Checkout or stream creation failed')
  }

  if ((giving.totals?.count || 0) < 2) {
    throw new Error('Giving summary did not include created checkouts')
  }

  if (prayed.prayer?.prayerCount !== 1 || reacted.testimony?.reactionCount !== 1) {
    throw new Error('Prayer or testimony interaction did not update')
  }

  console.log(`channel=${channel.channel.handle}`)
  console.log(`media=${media.media.title}`)
  console.log(`giving=count:${giving.totals.count} amount:${giving.totals.amountCents}`)
  console.log(`stream=${stream.stream.title}`)
  console.log(`community=prayers:${prayed.prayer.prayerCount} testimonies:${reacted.testimony.reactionCount}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
