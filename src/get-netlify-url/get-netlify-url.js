import axios from 'axios'

function getNetlifyUrl(url) {
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.NETLIFY_TOKEN}`,
    },
  })
}

export default getNetlifyUrl
