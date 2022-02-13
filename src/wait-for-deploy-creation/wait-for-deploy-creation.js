import getNetlifyUrl from '../get-netlify-url'
import pRetry, { AbortError } from 'p-retry'

const waitForDeployCreation = async (url, commitSha, MAX_TIMEOUT, context) => {
  const maxRetryTime = MAX_TIMEOUT * 1000

  /**
   * checkForDeploy
   *
   * Function to check Netlify for a specific deploy.
   */
  const checkForDeploy = async () => {
    const { data: netlifyDeployments } = await getNetlifyUrl(url)

    if (!netlifyDeployments) {
      throw new AbortError('Failed to get deployments for site')
    }

    const commitDeployment = netlifyDeployments.find(
      (d) => d.commit_ref === commitSha && (!context || d.context === context),
    )

    if (commitDeployment) {
      return commitDeployment
    }

    // Each check can reject but pRetry will only return the last one
    return Promise.reject(
      new Error(
        `Timeout reached: Deployment was not created within ${MAX_TIMEOUT} seconds.`,
      ),
    )
  }

  /**
   * Retry checkForDeploy until found or the `MAX_TIMEOUT` is reached.
   *
   * Wrap in try/catch to preserve the previous API.
   */
  try {
    return await pRetry(checkForDeploy, {
      maxRetryTime,
      maxTimeout: 120 * 1000,
      onFailedAttempt: () => {
        console.log(`Not yet created, retrying for ${MAX_TIMEOUT} seconds...`)
      },
    })
  } catch (error) {
    return Promise.reject(error.message || error)
  }
}

export default waitForDeployCreation
