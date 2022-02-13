import * as core from '@actions/core'
import axios from 'axios'
import pRetry from 'p-retry'

const waitForUrl = async (url, MAX_TIMEOUT = 60) => {
  const maxRetryTime = MAX_TIMEOUT * 1000

  /**
   * checkForUrl
   *
   * Function to check for a URL.
   */
  const checkForUrl = async () => {
    await axios.get(url)

    // Return `undefined` to preserve the previous API
    return
  }

  /**
   * Retry checkForUrl until found or `MAX_TIMEOUT` is reached.
   *
   * Wrap in try/catch to preserve the previous API.
   */
  try {
    return await pRetry(checkForUrl, {
      maxRetryTime,
      maxTimeout: 120 * 1000,
      onFailedAttempt: () => {
        console.log(`URL ${url} unavailable, retrying...`)
      },
    })
  } catch (error) {
    core.setFailed(`Timeout reached: Unable to connect to ${url}`)

    // Previous API resolves even when the URL is not found.
    return Promise.resolve()
  }
}

export default waitForUrl
