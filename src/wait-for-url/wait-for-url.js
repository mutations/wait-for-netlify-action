import * as core from '@actions/core'
import axios from 'axios'

const waitForUrl = async (url, MAX_TIMEOUT) => {
  const iterations = MAX_TIMEOUT / 3
  for (let i = 0; i < iterations; i++) {
    try {
      await axios.get(url)

      return
    } catch (e) {
      console.log(`URL ${url} unavailable, retrying...`)
      await new Promise((r) => setTimeout(r, 3000))
    }
  }
  core.setFailed(`Timeout reached: Unable to connect to ${url}`)
}

export default waitForUrl
