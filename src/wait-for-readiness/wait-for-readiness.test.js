import getNetlifyUrl from '../get-netlify-url'
import waitForReadiness from '.'
import * as fakes from './fakes'

jest.mock('../get-netlify-url')

// URL doesn't matter since the call is mocked
const url = 'https://some-netlify-url'
// Shorten the setInterval increment during test
const intervalIncrement = 0.25
// Shorten the timeout during test
const maxTimeout = 0.5

describe('waitForReadiness', () => {
  it('succeeds when the deployment is `ready`', async () => {
    getNetlifyUrl.mockImplementation(() => ({ data: fakes.deployReady }))

    await expect(
      waitForReadiness(url, maxTimeout, intervalIncrement),
    ).resolves.toEqual()
  })

  it('succeeds when the deployment is `current`', async () => {
    getNetlifyUrl.mockImplementation(() => ({ data: fakes.deployCurrent }))

    await expect(
      waitForReadiness(url, maxTimeout, intervalIncrement),
    ).resolves.toEqual()
  })

  it('fails after reaching the max timeout when the deployment is not ready', async () => {
    const deploy = fakes.deployUnknown
    getNetlifyUrl.mockImplementation(() => ({ data: deploy }))

    await expect(
      waitForReadiness(url, maxTimeout, intervalIncrement),
    ).rejects.toEqual(
      `Timeout reached: Deployment was not ready within ${maxTimeout} seconds. Last known deployment state: ${deploy.state}.`,
    )
  })

  it('fails when a deployment cannot be found for the site', async () => {
    getNetlifyUrl.mockImplementation(() => ({ data: fakes.emptyApiResult }))

    await expect(
      waitForReadiness(url, maxTimeout, intervalIncrement),
    ).rejects.toMatch('Timeout reached')
  })
})
