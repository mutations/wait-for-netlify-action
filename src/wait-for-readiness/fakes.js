export const emptyApiResult = null

export const deployCurrent = {
  id: 'deploy-current',
  state: 'current',
}

export const deployError = {
  id: 'deploy-error',
  state: 'error',
}

export const deployReady = {
  id: 'deploy-ready',
  state: 'ready',
}

export const deploySkipped = {
  ...deployError,
  error_message: `Failed during stage 'checking build content for changes': Canceled build due to no content change`,
}

export const deployUnknown = {
  id: 'deploy-unknown',
  state: 'unknown',
}
