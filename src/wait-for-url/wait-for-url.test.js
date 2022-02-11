import waitForUrl from './wait-for-url'
import * as core from '@actions/core'
import axios from 'axios'

jest.mock('axios')
jest.mock('@actions/core')

// URL doesn't matter since the call is mocked
const url = 'https://some-url'
// Shorten the setTimeout increment during test
const timeoutIncrement = 0.25
// Shorten the timeout during test
const maxTimeout = 0.5

describe('waitForUrl', () => {
  it('succeeds when the URL is found', async () => {
    axios.get.mockImplementation(() => Promise.resolve('ok'))

    await expect(waitForUrl(url, maxTimeout)).resolves.toEqual()

    expect(axios.get).toHaveBeenCalledWith(url)
  })

  it('fails after reaching the max timeout when the URL is not found', async () => {
    axios.get.mockImplementation(() => Promise.reject('not-found'))

    // Promise resolves in this case, `setFailed` is the indication of failure
    await expect(
      waitForUrl(url, maxTimeout, timeoutIncrement),
    ).resolves.toEqual()

    expect(axios.get).toHaveBeenCalledWith(url)
    expect(core.setFailed).toHaveBeenCalledWith(
      `Timeout reached: Unable to connect to ${url}`,
    )
  })

  it('fails after reaching the max timeout when axios throws an error', async () => {
    axios.get.mockImplementation(() => {
      throw new Error()
    })

    // Promise resolves in this case, `setFailed` is the indication of failure
    await expect(waitForUrl(url, maxTimeout)).resolves.toEqual()

    expect(axios.get).toHaveBeenCalledWith(url)
    expect(core.setFailed).toHaveBeenCalledWith(
      `Timeout reached: Unable to connect to ${url}`,
    )
  })
})
