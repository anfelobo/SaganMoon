const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const PORT = 3000

if (!process.env.FREE_ASTRO_API_KEY) {
  console.error('ERROR: falta FREE_ASTRO_API_KEY en el archivo .env')
  process.exit(1)
}

app.get('/api/moon', async (req, res) => {
  try {
    const apiUrl =
      'https://api.freeastroapi.com/api/v1/moon/phase' +
      '?date=2026-09-20T18:00:00-05:00'

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.FREE_ASTRO_API_KEY
      }
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('FreeAstroAPI respondió:', response.status, data)
      return res.status(response.status).json(data)
    }

    res.json(data)
  } catch (error) {
    console.error('Error consultando FreeAstroAPI:', error)
    res.status(500).json({
      error: 'No fue posible consultar FreeAstroAPI',
      message: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log('SaganMoon API funcionando en:', `http://localhost:${PORT}`)
})
