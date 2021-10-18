// TODO Tag Dalia and Amber on PR
const core = require('@actions/core');
const github = require('@actions/github');
const process = require('process');

console.log(github.context.payload.pull_request)

if (!github.context.payload.pull_request) {
    throw new Error(
        "Payload doesn't contain `pull_request`. Make sure this Action is being triggered by a pull_request event (https://help.github.com/en/articles/events-that-trigger-workflows#pull-request-event-pull_request)."
    )
}

const authToken = core.getInput('auth-token');

const octokit = new github.getOctokit(authToken);

const { number, labels } = github.context.payload.pull_request;

const issueKind = labels.find(label => label.name.startsWith('kind/'));
if(!issueKind) {
    failure('Pull request kind/ label is absent, and needs to be added.');
}
if(issueKind.name === 'kind/bug') {
    const bugType = labels.find(label => label.name.startsWith('bug-type/'));
    if(!bugType) {
        failure('Pull request bug-type/ label is absent, and is require when kind/bug is present.')
    }
}

function failure(message) {
    const { owner, repo } = github.context.repo;
    octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: github.context.payload.pull_request.number,
        event: 'REQUEST_CHANGES',
        body: message
    });
    core.setFailed(message);
    process.exit(1);
}