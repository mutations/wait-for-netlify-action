import getNetlifyUrl from '../get-netlify-url'

const ERROR_MESSAGES_FOR_SKIPPED_BUILDS = [
  `Failed during stage 'checking build content for changes': Canceled build due to no content change`,
]
const ERROR_STATES = ['error']
const READY_STATES = ['ready', 'current']

const waitForReadiness = (url, MAX_TIMEOUT, increment = 30) => {
  return new Promise((resolve, reject) => {
    let elapsedTimeSeconds = 0
    let state
    let errorMessage

    const handle = setInterval(async () => {
      elapsedTimeSeconds += increment

      if (elapsedTimeSeconds >= MAX_TIMEOUT) {
        clearInterval(handle)

        return reject(
          `Timeout reached: Deployment was not ready within ${MAX_TIMEOUT} seconds. Last known deployment state: ${state}.`,
        )
      }

      const { data: deploy } = await getNetlifyUrl(url)

      state = deploy && deploy.state
      errorMessage = deploy && deploy.error_message

      if (
        ERROR_STATES.includes(state) &&
        ERROR_MESSAGES_FOR_SKIPPED_BUILDS.includes(errorMessage)
      ) {
        clearInterval(handle)

        return resolve('skipped')
      }

      if (READY_STATES.includes(state)) {
        clearInterval(handle)

        return resolve()
      }

      console.log(`Not yet ready, waiting ${increment} more seconds...`)
    }, increment * 1000)
  })
}

export default waitForReadiness
