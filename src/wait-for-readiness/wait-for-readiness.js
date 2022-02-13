import getNetlifyUrl from '../get-netlify-url'
import pRetry from 'p-retry'

const ERROR_MESSAGES_FOR_SKIPPED_BUILDS = [
  `Failed during stage 'checking build content for changes': Canceled build due to no content change`,
]
const ERROR_STATES = ['error']
const READY_STATES = ['ready', 'current']

const waitForReadiness = async (url, MAX_TIMEOUT) => {
  const maxRetryTime = MAX_TIMEOUT * 1000

  /**
   * checkForReadiness
   *
   * Function to check a Netlify deploy's state.
   */
  const checkForReadiness = async () => {
    const { data: deploy } = await getNetlifyUrl(url)

    const state = deploy && deploy.state
    const errorMessage = deploy && deploy.error_message

    if (
      ERROR_STATES.includes(state) &&
      ERROR_MESSAGES_FOR_SKIPPED_BUILDS.includes(errorMessage)
    ) {
      return 'skipped'
    }

    if (READY_STATES.includes(state)) {
      return
    }

    // Each check can reject but pRetry will only return the last one
    return Promise.reject(
      new Error(
        `Timeout reached: Deployment was not ready within ${MAX_TIMEOUT} seconds. Last known deployment state: ${state}.`,
      ),
    )
  }

  /**
   * Retry checkForReadiness until ready, skipped, or the `MAX_TIMEOUT` is reached.
   *
   * Wrap in try/catch to preserve the previous API.
   */
  try {
    return await pRetry(checkForReadiness, {
      maxRetryTime,
      maxTimeout: 120 * 1000,
      onFailedAttempt: () => {
        console.log(`Not yet ready, retrying for ${MAX_TIMEOUT} seconds...`)
      },
    })
  } catch (error) {
    return Promise.reject(error.message || error)
  }
}

export default waitForReadiness
