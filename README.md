# generator-brei-app

[![Greenkeeper badge](https://badges.greenkeeper.io/BarkleyREI/generator-brei-app.svg)](https://greenkeeper.io/)
[![Version npm][version]](http://browsenpm.org/package/generator-brei-app)
[![Build Status](https://travis-ci.org/BarkleyREI/generator-brei-app.svg?branch=master)](https://travis-ci.org/BarkleyREI/generator-brei-app)

[version]: http://img.shields.io/npm/v/generator-brei-app.svg?style=flat-square

## Getting Started with a Project

Install Yeoman, Bower, Grunt CLI, and JSHint

```bash
npm install -g yo bower jshint grunt-cli
```
Install Ruby
- Use a version lower than 2.5 (as of 1/10/2018)

Install Compass, SASS, and SCSS_Lint
````bash
sudo gem install compass sass scss_lint
````

Install the BREI-App Generator

```bash
npm install -g generator-brei-app
```

Finally, initiate the generator:

```bash
yo brei-app
```

From here you will be presented with a series of options:
```bash
What would you like to do? (Use arrow keys)
❯ Create a New Project
  Create a Partial
  Create a Module
  Create a Template
  ```
Just follow the prompts and off you go!

### Dropbox

- Do not stage the project (run npm install or other dependency managers) from Dropbox. The dependency folders, especially `node_modules`, contain thousands of files and directories, and Dropbox can freeze the disk or cause permissions errors while it syncs.

## Sub-Generators

#### All Sub-Generators install the properly formatted .hbs and .scss file according to BarkleyREI front-end coding standard conventions.

#### Note: you can either run `yo brei-app` and select the desired sub generator task, or you can use the following commands to do it manually.

Create a new Project:
```bash
yo brei-app:new
```

Create a new Template:
```bash
yo brei-app:template
```

Create a new Module
```bash
yo brei-app:module
```

Create a new Partial
```bash
yo brei-app:partial
```

## Testing the Generator

**This only needs run if you are locally modifying the generator files in this repo, not a project created with it.**

Prerequisites:

```bash
npm install -g jshint
```

To Test:
```bash
npm test
```

The test takes about 10-12 minutes to run.
