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
if(issueKind) {
    if (issueKind.name === 'kind/bug') {
        const bugType = labels.find(label => label.name.startsWith('bug-type/'));
        if (!bugType) {
            failure('Pull request bug-type/ label is absent, and is require when kind/bug is present.')
        }
    }
} else {
    failure('Pull request kind/ label is absent, and needs to be added.');
}


function failure(message) {
    const { owner, repo } = github.context.repo;
    core.setFailed(message);
    return octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: github.context.payload.pull_request.number,
        event: 'REQUEST_CHANGES',
        body: message
    });
}