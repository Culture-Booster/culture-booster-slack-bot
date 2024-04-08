# Culture Booster Slack Bot

**Guide Outline**:

- [Culture Booster Slack Bot](#culture-booster-slack-bot)
  - [Included Workflows](#included-workflows)
  - [Setup](#setup)
    - [Install the Slack CLI](#install-the-slack-cli)
  - [Running the Project Locally](#running-the-project-locally)
  - [Deploying the App](#deploying-the-app)
  - [Viewing Activity Logs](#viewing-activity-logs)
  - [Project Structure](#project-structure)
    - [`.slack/`](#slack)
    - [`datastores/`](#datastores)
    - [`functions/`](#functions)
    - [`triggers/`](#triggers)
    - [`workflows/`](#workflows)
    - [`manifest.ts`](#manifestts)
    - [`slack.json`](#slackjson)

---

## Included Workflows

- **Ticket Generator**: Creates a task in Notion and sends a message to the
  channel with the task link.

## Setup

Before getting started, first make sure you have a development workspace where
you have permission to install apps. **Please note that the features in this
project require that the workspace be part of
[a Slack paid plan](https://slack.com/pricing).**

### Install the Slack CLI

To use this template, you need to install and configure the Slack CLI.
Step-by-step instructions can be found in our
[Quickstart Guide](https://api.slack.com/automation/quickstart).

## Running the Project Locally

While building the app, you can see your changes appear in your workspace in
real-time with `slack run`. You'll know an app is the development version if the
name has the string `(local)` appended.

```zsh
# Run app locally
$ slack run

Connected, awaiting events
```

To stop running locally, press `<CTRL> + C` to end the process.

## Deploying the App

Once development is complete, deploy the app to Slack infrastructure using
`slack deploy`:

```zsh
$ slack deploy
```

## Viewing Activity Logs

Activity logs of your application can be viewed live and as they occur with the
following command:

```zsh
$ slack activity --tail
```

## Project Structure

### `.slack/`

Contains `apps.dev.json` and `apps.json`, which include installation details for
development and deployed apps.

### `datastores/`

[Datastores](https://api.slack.com/automation/datastores) securely store data
for your application on Slack infrastructure. Required scopes to use datastores
include `datastore:write` and `datastore:read`. We are not using any at the moment.

### `functions/`

[Functions](https://api.slack.com/automation/functions) are reusable building
blocks of automation that accept inputs, perform calculations, and provide
outputs. Functions can be used independently or as steps in workflows.

### `triggers/`

[Triggers](https://api.slack.com/automation/triggers) determine when workflows
are run. A trigger file describes the scenario in which a workflow should be
run, such as a user pressing a button or when a specific event occurs.

### `workflows/`

A [workflow](https://api.slack.com/automation/workflows) is a set of steps
(functions) that are executed in order.

Workflows can be configured to run without user input or they can collect input
by beginning with a [form](https://api.slack.com/automation/forms) before
continuing to the next step.

### `manifest.ts`

The [app manifest](https://api.slack.com/automation/manifest) contains the app's
configuration. This file defines attributes like app name and description.

### `slack.json`

Used by the CLI to interact with the project's SDK dependencies. It contains
script hooks that are executed by the CLI and implemented by the SDK.
