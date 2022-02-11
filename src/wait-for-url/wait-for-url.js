import * as core from '@actions/core'
import axios from 'axios'

const waitForUrl = async (url, MAX_TIMEOUT = 60, increment = 3) => {
  const iterations = MAX_TIMEOUT / increment
  for (let i = 0; i < iterations; i++) {
    try {
      await axios.get(url)

      return
    } catch (e) {
      console.log(`URL ${url} unavailable, retrying...`)
      await new Promise((r) => setTimeout(r, increment * 1000))
    }
  }
  core.setFailed(`Timeout reached: Unable to connect to ${url}`)
}

export default waitForUrl
