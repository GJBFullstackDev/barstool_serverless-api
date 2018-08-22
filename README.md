# Serverless API

Serverless API boilerplate written in Node.js, backed by MongoDB.

To get started quickly, drop this into the console.

## Development Guidelines

Below are a set of guidelines that this project aims to follow as much as possible. They are in place to prevent bugs, provide consistency across developers, and keep code quality high.

### Linting

ESLint is used on every JavaScript file in the project. There is a strict set of linting rules to ensure code is consistent across the entire project, no matter who wrote it. Linting is run before unit-tests and will fail the build if the linting does not pass.

Linting rules:

1. No `;` semicolons. Anywhere. They aren't needed in JavaScript and this keeps lines really clean and consistent with newer, more modern languages.
2. No global `Promise`, must require `Bluebird`. The utility functions in Bluebird are a core part of this project, so we ensure all promises are Bluebird promises preventing the need to guess whether you can call a Bluebird specific function.
3. No unused variables. If you declare a variable it must be used otherwise a linting error is thrown. This prevents a large class of developer bugs and keeps top-file requires nice and clean.
4. No `console.log`. Anywhere. You must perform all logging via `const logger = require('app/logger')`. You can use `logger.info(...)` for an equivalent to regular console logging. This ensures all logs can be properly routed and handled based on the development environment.

#### Other Rules

The following list is not yet covered by linting but should be followed:

1. Prefer anonymous functions of the form `() => { ... }`. This prevents the need to define `let _this = this` because anonymous keep current lexical scope.
2. Proper usage of promises. If you see multiple `.catch()` or a waterfall of callbacks when using promises thats a good indication they are being used incorrectly. Promises can be difficult to grasp at first, if you have questions just ask.
3. Document function arguments. It may seem unecessary but eventually we generate documentation and the comments are crucial. They also force you to explain why we need a certain function and what it's doing.

### Custom Environment

```sh
env $(cat .env | xargs) npm start
```

Here are the Environment variables required for the project, to be up and running immediately.

```sh
export PORT=3000
export SSL=false
export AWS_KEY='XXXXXX'
export AWS_SEC='XXXXXX'
export MONGODB_URI='mongodb://localhost/something'
export POSTMARK_KEY='XXXXXX'
export POSTMARK_SENDER='serverless-api@yourdomain.com'
```

### Pull Requests

All feature development must be done on a branch and then merged through a GitHub pull request. The master branch is protected, meaning no branch can be merged until the tests are passing on that branch and another developer has reviewed the pull request. This may seem excessive at first, but it will ensure an extremely high quality of coding across the project and force everyone to think about the design of someone elses work.

## Installation

This project uses [Yarn](https://yarnpkg.com/) as it's preferred dependency manager. Install Yarn and run it in this directory to install all dependencies:

```
yarn install
```

## Tests

This project has a suite of Unit and Integration tests. Unit-tests test specific functions in a module without starting an http server. Integration tests run an http server and test full requests and responses.

### Setup

In order to run tests you need to have a local instance of MongoDB 3.4 installed and running on the default port.

### Templates

This project uses the [Hygen](https://hygen.io/) templating engine.  In the root directory, enter any of the following to generate a proper template.

```sh
hygen api new --name YOUR_NAME
hygen lib new --name YOUR_NAME
hygen module new --name YOUR_NAME
hygen integration-test new --name YOUR_NAME --api API_NAME
hygen unit-test new --name YOUR_NAME --api API_NAME
```

### Run

Run all tests:

```
make test-all
```

Run just unit-tests:

```
make test-unit
```

Run just integration tests:

```
make test-int
```
