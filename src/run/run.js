import waitForDeployCreation from '../wait-for-deploy-creation'
import waitForReadiness from '../wait-for-readiness'
import waitForUrl from '../wait-for-url'
import * as core from '@actions/core'
import * as github from '@actions/github'

const run = async () => {
  try {
    const netlifyToken = process.env.NETLIFY_TOKEN
    const commitSha =
      github.context.eventName === 'pull_request'
        ? github.context.payload.pull_request.head.sha
        : github.context.sha

    const DEPLOY_TIMEOUT = Number(core.getInput('deploy_timeout')) || 60 * 5
    const READINESS_TIMEOUT =
      Number(core.getInput('readiness_timeout')) || 60 * 15
    // keep max_timeout for backwards compatibility
    const RESPONSE_TIMEOUT =
      Number(core.getInput('response_timeout')) ||
      Number(core.getInput('max_timeout')) ||
      60
    const siteId = core.getInput('site_id')
    const context = core.getInput('context')

    if (!netlifyToken) {
      core.setFailed(
        'Please set NETLIFY_TOKEN env variable to your Netlify Personal Access Token secret',
      )
    }
    if (!commitSha) {
      core.setFailed('Could not determine GitHub commit')
    }
    if (!siteId) {
      core.setFailed('Required field `site_id` was not provided')
    }

    let message = `Waiting for Netlify to create a deployment for git SHA ${commitSha}`

    if (context) {
      message += ` and context ${context}`
    }

    console.log(message)
    const commitDeployment = await waitForDeployCreation(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
      commitSha,
      DEPLOY_TIMEOUT,
      context,
    )

    const url = `https://${commitDeployment.id}--${commitDeployment.name}.netlify.app`

    core.setOutput('deploy_id', commitDeployment.id)
    core.setOutput('url', url)

    console.log(
      `Waiting for Netlify deployment ${commitDeployment.id} in site ${commitDeployment.name} to be ready`,
    )
    const state = await waitForReadiness(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys/${commitDeployment.id}`,
      READINESS_TIMEOUT,
    )

    if (state === 'skipped') {
      core.setOutput(state, true)
      console.log('Netlify build was skipped')
    } else {
      console.log(`Waiting for a 200 from: ${url}`)
      await waitForUrl(url, RESPONSE_TIMEOUT)
    }
  } catch (error) {
    core.setFailed(typeof error === 'string' ? error : error.message)
  }
}

export default run
