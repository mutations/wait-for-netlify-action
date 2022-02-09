# Perform a full workflow test via `act` using the custom action.
#
# Update tests/event.json with a sha from your project deployed to Netlify.

act pull_request -j test -W tests/workflows/ -e tests/event.json --env-file .env.local
