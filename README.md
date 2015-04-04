# generator-brei-app
[![Version npm][version]](http://browsenpm.org/package/generator-brei-app)
[![Build Status](https://travis-ci.org/BarkleyREI/generator-brei-app.svg?branch=master)](https://travis-ci.org/BarkleyREI/generator-brei-app)

[version]: http://img.shields.io/npm/v/generator-brei-app.svg?style=flat-square

## Getting Started

Install Yeoman

```bash
npm install -g yo
```
Install the BREI-App Generator

```bash
npm install -g generator-brei-app
```

Finally, initiate the generator:

```bash
yo brei-app
```

## Sub-Generators
#### All Sub-Generators install the properly formatted .hbs and .scss file. All according to conventions. Woot.


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


## Testing
#### This generator has git pre-commit hook that will forcefully run the tests and jshint

Prerequisites:

```bash
npm install -g jshint
```

To Test:
```bash
npm test
```
