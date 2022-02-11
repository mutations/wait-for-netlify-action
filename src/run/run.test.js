import waitForDeployCreation from '../wait-for-deploy-creation'
import waitForReadiness from '../wait-for-readiness'
import waitForUrl from '../wait-for-url'
import * as fakes from './fakes'
import run from './run'
import * as core from '@actions/core'
import * as github from '@actions/github'

jest.mock('../wait-for-deploy-creation')
jest.mock('../wait-for-readiness')
jest.mock('../wait-for-url')
jest.mock('@actions/core')

const defaultDeployTimeout = 300
const defaultReadinessTimeout = 900
const defaultResponseTimeout = 60

describe('index', () => {
  afterEach(() => {
    // Reset github context
    setGithubContext({})
  })

  it('succeeds when a deployment is created, ready, and the preview url is available', async () => {
    setupMockInputs({
      site_id: 'site-id',
    })
    setupMockWaitFunctions()
    setGithubContext(fakes.githubContextPullRequestWithSha)

    process.env.NETLIFY_TOKEN = 'token'

    await run()

    expect(core.setOutput).toHaveBeenCalledWith('deploy_id', '1')
    expect(core.setOutput).toHaveBeenCalledWith(
      'url',
      'https://1--deploy-1.netlify.app',
    )
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('fails when a promise rejects', async () => {
    setupMockInputs({
      site_id: 'site-id-reject',
    })
    setGithubContext(fakes.githubContextPullRequestWithSha)

    waitForDeployCreation.mockRejectedValue('mock Reject')

    process.env.NETLIFY_TOKEN = 'token'

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('mock Reject')
  })

  it('fails when an error is caught', async () => {
    setupMockInputs({
      site_id: 'site-id-error',
    })
    setGithubContext(fakes.githubContextPullRequestWithSha)

    waitForDeployCreation.mockImplementation(() => {
      throw new Error('mock Error')
    })

    process.env.NETLIFY_TOKEN = 'token'

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('mock Error')
  })

  describe('constants and inputs', () => {
    it('sets the defaults correctly', async () => {
      setupMockInputs({
        site_id: 'site-id-1',
      })
      setupMockWaitFunctions()

      await run()

      expect(waitForDeployCreation).toHaveBeenCalledWith(
        'https://api.netlify.com/api/v1/sites/site-id-1/deploys',
        undefined,
        defaultDeployTimeout,
        undefined,
      )
      expect(waitForReadiness).toHaveBeenCalledWith(
        `https://api.netlify.com/api/v1/sites/site-id-1/deploys/1`,
        defaultReadinessTimeout,
      )
      expect(waitForUrl).toHaveBeenCalledWith(
        'https://1--deploy-1.netlify.app',
        defaultResponseTimeout,
      )
    })

    it('sets the overrides correctly', async () => {
      const deployTimeout = 100
      const readinessTimeout = 500
      const responseTimeout = 30
      const context = 'my-context'

      setupMockInputs({
        context,
        deploy_timeout: deployTimeout,
        readiness_timeout: readinessTimeout,
        response_timeout: responseTimeout,
        site_id: 'site-id-2',
      })
      setupMockWaitFunctions()

      await run()

      expect(waitForDeployCreation).toHaveBeenCalledWith(
        'https://api.netlify.com/api/v1/sites/site-id-2/deploys',
        undefined,
        deployTimeout,
        context,
      )
      expect(waitForReadiness).toHaveBeenCalledWith(
        'https://api.netlify.com/api/v1/sites/site-id-2/deploys/1',
        readinessTimeout,
      )
      expect(waitForUrl).toHaveBeenCalledWith(
        'https://1--deploy-1.netlify.app',
        responseTimeout,
      )
    })

    it('fails when the netlify token is missing', async () => {
      setupMockWaitFunctions()

      delete process.env.NETLIFY_TOKEN

      await run()

      expect(core.setFailed).toHaveBeenCalledWith(
        'Please set NETLIFY_TOKEN env variable to your Netlify Personal Access Token secret',
      )
    })

    it('fails when the pull request sha is missing', async () => {
      setupMockWaitFunctions()
      setGithubContext(fakes.githubContextPullRequestWithoutSha)

      await run()

      expect(core.setFailed).toHaveBeenCalledWith(
        'Could not determine GitHub commit',
      )
    })

    it('fails when the push sha is missing', async () => {
      setupMockWaitFunctions()
      setGithubContext(fakes.githubContextPushWithoutSha)

      await run()

      expect(core.setFailed).toHaveBeenCalledWith(
        'Could not determine GitHub commit',
      )
    })

    it('fails when the site id is missing', async () => {
      setupMockInputs({
        site_id: undefined,
      })
      setupMockWaitFunctions()

      await run()

      expect(core.setFailed).toHaveBeenCalledWith(
        'Required field `site_id` was not provided',
      )
    })
  })
})

// Helper to setup `github` mock inputs
function setupMockInputs(inputs = {}) {
  core.getInput.mockImplementation((input) => {
    return inputs[input]
  })
}

// Helper to setup the mock functions for the happy path
function setupMockWaitFunctions() {
  waitForDeployCreation.mockImplementation(() => fakes.deploy)
  waitForReadiness.mockImplementation(fakes.noopFunc)
  waitForUrl.mockImplementation(fakes.noopFunc)
}

// Helper to set the github context
function setGithubContext(context) {
  // eslint-disable-next-line no-import-assign
  github.context = context
}
