import getNetlifyUrl from '.'
import axios from 'axios'

jest.mock('axios')

// URL doesn't matter since the call is mocked
const url = 'https://some-netlify-url'

describe('getNetlifyUrl', () => {
  it('calls axios.get as expected', async () => {
    const result = 'ok'
    const token = 'some-token'

    process.env['NETLIFY_TOKEN'] = token
    axios.get.mockImplementationOnce(() => Promise.resolve(result))

    await expect(getNetlifyUrl(url)).resolves.toEqual(result)

    expect(axios.get).toHaveBeenCalledWith(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
  })
})
