const core = require('@actions/core');
const github = require('@actions/github');

if (!github.context.payload.pull_request) {
    throw new Error(
        "Payload doesn't contain `pull_request`. Make sure this Action is being triggered by a pull_request event (https://help.github.com/en/articles/events-that-trigger-workflows#pull-request-event-pull_request)."
    )
}

const authToken = core.getInput('auth-token');

const octokit = new github.GitHub(authToken);

const { owner, repo } = github.context.repo;
octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number: github.context.payload.pull_request.number,
    event: 'REQUEST_CHANGES',
    body: 'Label missing'
})
console.log(github.context.payload.pull_request.labels)

core.setFailed('Label missing');
