# Perform a full workflow test via `act` using the custom action.
#
# Update tests/event.json with a sha from your project deployed to Netlify.
#

# build action to `dist/`
docker compose run --rm app build

# run local action using `act`
act pull_request --job test --workflows tests/workflows/ --eventpath tests/event.json --env-file .env.local
