const core = require('@actions/core');
const github = require('@actions/github');

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
console.log(issueKind);
if(!issueKind) {
    failure('Pull request kind/ label is absent, and needs to be added.');
}
console.log(issueKind);
if(issueKind === 'kind/bug') {
    const bugType = labels.find(label => label.name.startsWith('bug-type/'));
    if(!bugType) {
        failure('Pull request bug-type/ label is absent, and is require when kind/bug is present.')
    }
}


    // labels: [
    //     {
    //         color: 'd73a4a',
    //         default: true,
    //         description: "Something isn't working",
    //         id: 3454323411,
    //         name: 'bug',
    //         node_id: 'LA_kwDOGOOWis7N5MrT',
    //         url: 'https://api.github.com/repos/syntastical/github-action-test/labels/bug'
    //     }
    // ],


function failure(message) {
    const { owner, repo } = github.context.repo;
    // octokit.rest.pulls.dismissReview
    octokit.rest.pulls.createReview({
        owner,
        repo,
        pull_number: github.context.payload.pull_request.number,
        event: 'REQUEST_CHANGES',
        body: message
    });
    core.setFailed(message);
}