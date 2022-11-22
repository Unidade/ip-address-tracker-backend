import { config } from 'dotenv'
config()
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const API_KEY = process.env.API_KEY

if (!API_KEY) {
  console.log(
    'You must create a .env file on the root directory with your ipify personal api key'
  )
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(express.json())

app.post('/', async (req, res, next) => {
  const { ipAddress, domain } = req.body
  if (!ipAddress && !domain) {
    return res
      .status(400)
      .send('Neither ipAddress nor domain was found on the body request')
  }

  try {
    const data = ipAddress
      ? await getLocationByIpAddress(ipAddress)
      : await getLocationByDomain(domain)

    if (data.code) {
      return res.status(400).send(data.messages)
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

async function getLocationByIpAddress(ipAddress) {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    const data = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`,
      requestOptions
    )

    const text = await data.json()

    return text
  } catch (e) {
    throw e
  }
}

async function getLocationByDomain(domain) {
  try {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    const data = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&domain=${domain}`,
      requestOptions
    )

    const text = await data.json()

    return text
  } catch (e) {
    throw e
  }
}
