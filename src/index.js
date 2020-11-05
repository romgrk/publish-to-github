/*
 * index.js
 */

const core = require('@actions/core')
const github = require('@actions/github')

async function main() {
  try {
    // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput('who-to-greet')
    const nameToGreet = 'test'
    console.log(`Hello ${nameToGreet}!`)
    const time = (new Date()).toTimeString()
    core.setOutput("time", time)
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)

    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_ACTOR
    const repo = process.env.GITHUB_REPOSITORY
    const message = 'automated: publish-to-github action'


    const octokit = github.getOctokit(token)

    const response = await octokit().repos.listCommits({
      owner,
      repo,
      sha: base,
      per_page: 1
    })
    console.log(response)
    let latestCommitSha = response.data[0].sha
    const treeSha = response.data[0].commit.tree.sha
    console.log({ latestCommitSha, treeSha })

    console.log(`The event payload: ${payload}`)
    /* octokit.git.createCommit({
    *   owner,
    *   repo,
    *   message,
    *   tree,
    *   parents,
    * }); */
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
