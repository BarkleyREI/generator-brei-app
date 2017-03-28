# generator-brei-app
[![Version npm][version]](http://browsenpm.org/package/generator-brei-app)
[![Build Status](https://travis-ci.org/BarkleyREI/generator-brei-app.svg?branch=master)](https://travis-ci.org/BarkleyREI/generator-brei-app)

[version]: http://img.shields.io/npm/v/generator-brei-app.svg?style=flat-square

## Getting Started

Install Yeoman

```bash
npm install -g yo
```
Install Ruby

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
  Import a Pattern
  Update Your Project
  ```
Just follow the promps and off you go!

## Sub-Generators

#### All Sub-Generators install the properly formatted .hbs and .scss file. All according to conventions. Woot.

#### Note: you can either run `yo brei-app` and select the desired sub generator task, or you can use the following commands to do it manually.

Create a new Project:
```bash
yo brei-app:new
```

Create a new Template:
```bash
yo brei-app:template

#  @param {String} the name of your template
```

Create a new Module
```bash
yo brei-app:module

#  @param {String} the name of your module
```

Create a new Partial
```bash
yo brei-app:partial

#  @param {String} the name of your partial
```

Add a pattern from the [BREI Pattern Library](https://github.com/BarkleyREI/brei-pattern-library)
```bash
yo brei-app:pattern

#  @param {String} The type of pattern (template, module, partial)
#  @param {String} The name of the pattern (the pattern must exists)
```
- You will be provided a list of available patterns, so long as the library's `pattern.json` is up to date.
This will help prevent issues of spelling the name wrong.

Update part of your project
```bash
yo brei-app:update
```
- This will provide you with options on which segment of the project you would like to update.
 - Tips: when a conflict occurs, hit "d" to see a diff of changes, hit "y" to overwrite, hit "n" to not overwrite.

## Testing

Prerequisites:

```bash
npm install -g jshint
```

To Test:
```bash
npm test
```
