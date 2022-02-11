import getNetlifyUrl from '../get-netlify-url'

const waitForDeployCreation = (
  url,
  commitSha,
  MAX_TIMEOUT,
  context,
  increment = 15,
) => {
  return new Promise((resolve, reject) => {
    let elapsedTimeSeconds = 0

    const handle = setInterval(async () => {
      elapsedTimeSeconds += increment

      if (elapsedTimeSeconds >= MAX_TIMEOUT) {
        clearInterval(handle)

        return reject(
          `Timeout reached: Deployment was not created within ${MAX_TIMEOUT} seconds.`,
        )
      }

      const { data: netlifyDeployments } = await getNetlifyUrl(url)

      if (!netlifyDeployments) {
        clearInterval(handle)

        return reject(`Failed to get deployments for site`)
      }

      const commitDeployment = netlifyDeployments.find(
        (d) =>
          d.commit_ref === commitSha && (!context || d.context === context),
      )

      if (commitDeployment) {
        clearInterval(handle)

        return resolve(commitDeployment)
      }

      console.log(`Not yet created, waiting ${increment} more seconds...`)
    }, increment * 1000)
  })
}

export default waitForDeployCreation
