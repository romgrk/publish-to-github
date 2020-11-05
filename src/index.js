/*
 * index.js
 */

const core = require('@actions/core')
const github = require('@actions/github')
const shell = require('shelljs')

function _(command) {
  const result = shell.exec(command)
  if (result.code !== 0)
    throw new Error(result.stdout + result.stderr)
  console.log(result.toString())
  return result
}

async function main() {
  try {
    // `who-to-greet` input defined in action metadata file
    // const nameToGreet = core.getInput('who-to-greet')
    console.log('Starting publish-to-action...')

    const octokit = github.getOctokit(token)
    const context = github.context

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`)

    const token = process.env.GITHUB_TOKEN
    const owner = process.env.GITHUB_ACTOR
    const repo = process.env.GITHUB_REPOSITORY
    const message = 'automated: publish-to-github action'

    const remote = `https://${owner}:${token}@github.com/${repo}.git`

    const branchName = 'master'
    const githubSha = process.env.GITHUB_SHA
    const timestamp = new Date().toISOString()

    // initialize git
    _(`git config http.sslVerify false`)
    _(`git config user.name "Automated Publisher"`)
    _(`git config user.email "actions@users.noreply.github.com"`)
    _(`git remote add publisher "${remote}"`)
    _(`git show-ref`) // useful for debugging
    _(`git branch --verbose`)

    // install lfs hooks
    _(`git lfs install`)

    // publish any new files
    _(`git checkout ${branchName}`)
    _(`git add -A`)
    _(`git commit -m "Automated publish: ${timestamp} ${githubSha}" || exit 0`)
    _(`git pull --rebase publisher ${branchName}`)
    _(`git push publisher ${branchName}`)


  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
