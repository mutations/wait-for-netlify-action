import getNetlifyUrl from '../get-netlify-url'
import waitForDeployCreation from '.'
import * as fakes from './fakes'

jest.mock('../get-netlify-url')

// URL doesn't matter since the call is mocked
const url = 'https://some-netlify-url'
// Shorten the timeout during test
const maxTimeout = 0.25

describe('waitForDeployCreation', () => {
  it('succeeds when it finds the deployment for the site', async () => {
    const commitSha = '1-xxxx'

    getNetlifyUrl.mockImplementation(() => ({ data: fakes.deploys }))

    await expect(
      waitForDeployCreation(url, commitSha, maxTimeout, null),
    ).resolves.toEqual(fakes.deploy1)
  })

  it('fails when deployments cannot be found for the site', async () => {
    const commitSha = ''

    getNetlifyUrl.mockImplementation(() => ({ data: fakes.emptyApiResult }))

    await expect(
      waitForDeployCreation(url, commitSha, maxTimeout, null),
    ).rejects.toEqual('Failed to get deployments for site')
  })

  it('fails after reaching the max timeout when a deployment is not created', async () => {
    const commitSha = 'does-not-exist'

    getNetlifyUrl.mockImplementation(() => ({ data: fakes.deploys }))

    await expect(
      waitForDeployCreation(url, commitSha, maxTimeout, null),
    ).rejects.toEqual(
      `Timeout reached: Deployment was not created within ${maxTimeout} seconds.`,
    )
  })

  describe('with context', () => {
    it('succeeds when it finds the deployment for the site', async () => {
      const commitSha = '2-xxxx'
      const context = 'deploy-preview'

      getNetlifyUrl.mockImplementation(() => ({ data: fakes.deploys }))

      await expect(
        waitForDeployCreation(url, commitSha, maxTimeout, context),
      ).resolves.toEqual(fakes.deploy2)
    })

    it('fails when the deployment for the site cannot be found', async () => {
      const commitSha = '2-xxxx'
      const context = 'production'

      getNetlifyUrl.mockImplementation(() => ({ data: fakes.deploys }))

      await expect(
        waitForDeployCreation(url, commitSha, maxTimeout, context),
      ).rejects.toEqual(
        `Timeout reached: Deployment was not created within ${maxTimeout} seconds.`,
      )
    })
  })
})
