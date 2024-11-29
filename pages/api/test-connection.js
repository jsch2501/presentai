export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // 1. Prüfen Sie die Umgebungsvariablen
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: 'Missing environment variables',
        error: {
          url: !supabaseUrl ? 'missing' : 'present',
          key: !supabaseKey ? 'missing' : 'present'
        }
      })
    }

    // 2. Testen Sie die Erreichbarkeit der Supabase-URL
    const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`)
    
    if (!healthCheck.ok) {
      return res.status(500).json({
        success: false,
        message: 'Supabase URL not reachable',
        error: `Status: ${healthCheck.status}`
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Supabase URL is reachable',
      url: supabaseUrl
    })

  } catch (error) {
    console.error('Connection Test Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: error.message
    })
  }
}
