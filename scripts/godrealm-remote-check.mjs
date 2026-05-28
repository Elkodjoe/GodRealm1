const API_URL = (process.env.API_URL || 'https://godrealm-api.onrender.com').replace(/\/$/, '')

async function check(path) {
  const started = Date.now()
  const response = await fetch(`${API_URL}${path}`)
  const text = await response.text()
  let data = {}

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }

  return {
    path,
    status: response.status,
    ok: response.ok,
    ms: Date.now() - started,
    data,
  }
}

async function main() {
  const checks = await Promise.all([
    check('/api/health'),
    check('/api/readiness'),
    check('/api/media'),
    check('/api/channels'),
    check('/api/streams'),
  ])

  checks.forEach((item) => {
    const detail = item.data.error || item.data.databaseWarning || item.data.database?.warning || item.data.service || ''
    console.log(`${item.ok ? 'ok' : 'fail'} ${item.status} ${item.path} ${item.ms}ms ${detail}`)
  })

  const failed = checks.filter((item) => !item.ok)
  if (failed.length) {
    throw new Error(`${failed.length} remote check${failed.length === 1 ? '' : 's'} failed for ${API_URL}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
