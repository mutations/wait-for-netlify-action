export const deploy = {
  id: '1',
  name: 'deploy-1',
}

export const githubContextPushWithoutSha = {
  eventName: 'push',
  sha: undefined,
  payload: {
    pull_request: {
      head: {
        sha: undefined,
      },
    },
  },
}

export const githubContextPullRequestWithoutSha = {
  eventName: 'pull_request',
  sha: undefined,
  payload: {
    pull_request: {
      head: {
        sha: undefined,
      },
    },
  },
}

export const githubContextPullRequestWithSha = {
  eventName: 'pull_request',
  sha: '12345',
  payload: {
    pull_request: {
      head: {
        sha: '12345',
      },
    },
  },
}

export const noopFunc = () => {}
