import getNetlifyUrl from '../get-netlify-url'

const READY_STATES = ['ready', 'current']

const waitForReadiness = (url, MAX_TIMEOUT, increment = 30) => {
  return new Promise((resolve, reject) => {
    let elapsedTimeSeconds = 0
    let state

    const handle = setInterval(async () => {
      elapsedTimeSeconds += increment

      if (elapsedTimeSeconds >= MAX_TIMEOUT) {
        clearInterval(handle)

        return reject(
          `Timeout reached: Deployment was not ready within ${MAX_TIMEOUT} seconds. Last known deployment state: ${state}.`,
        )
      }

      const { data: deploy } = await getNetlifyUrl(url)

      state = deploy.state

      if (READY_STATES.includes(state)) {
        clearInterval(handle)

        return resolve()
      }

      console.log(`Not yet ready, waiting ${increment} more seconds...`)
    }, increment * 1000)
  })
}

export default waitForReadiness
