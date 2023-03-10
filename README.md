# Northcoders House of Games API

## Link to hosted version - 

https://silverfox-ncgames.onrender.com/api

## Summary

This repo has APIs to connect to following tables - 

1) Categories
2) Comments
3) Reviews
4) Users

All the available API endpoints are listed under /api.

## Versions

This project is using Node.js v19.1.0 and PostgreSQL 14.5.

## Clone

Fork the repo and clone it to your local machine.

## Seeding

1) run the script setup-dbs (to setup the databases)
2) run the seed script (to seed the database with required data)

## Dependecies

Following are the dependencies required (if they are not present in package.json, please install them!)
- dotenv
- express
- pg
- supertest

devDependecies:
- jest
- jest-extended
- jest-sorted (Check out [the documentation for jest-sorted])
- pg-format

## To create environment variables

Please create two files :-
1) .env.test  with PGDATABASE=nc_games_test
2) .env.development with PGDATABASE=nc_games

With the above files, connection.js would be able to connect test and development databases. (Make a note to .gitignore them!)

## Kanban

### Link to your Trello Board here: https://trello.com/b/gBtX4GN3/be-nc-games

To keep track of the tasks involved in this project we're going to use a kanban board. Ensure that you work on one _ticket_ at time. You can click on the ticket to find out more information about what is required for the feature. A ticket is not considered complete unless both the happy path and errors response are handled. You can make use of the checklist on each ticket to keep track of the errors you want to handle. You can also make use of [error-handling.md](error-handling.md) to consider the error codes we may wish to respond with.

**Please ensure you work through the tickets in numerical order.**

## Git Branching and Pull Requests

You will be working on each ticket on a new **branch**.

To create and switch to a new git branch use the command:

```
git checkout -b <new branch name>
```

This will create a branch and move over to that branch. (Omit the `-b` flag if you wish to switch to an already existing branch).

We recommend that you name the branch after the number assigned to each ticket via the header. eg. `ncnews-1`

When pushing the branch to git hub ensure that you make reference to the branch you are pushing to on the remote.

```
git push origin <branch name>
```

From github you can make a pull request and share the link and ticket number via a pull request specific nchelp using the command `nchelp pr`. A tutor will swing by to review your code. Ensure that you keep your trello up to date whilst you await the PR approval. Regular `nchelp` will be available for when you need support.

Once a pull request been accepted be sure to switch back to the main branch and pull down the updated changes.

```
git checkout main

git pull origin main
```

You can tidy up your local branches once they have been pull into main by deleting them:

```
git branch -D <local branch>
```

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_
