# generator-brei-app

> [Yeoman](http://yeoman.io) generator

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
```

Create a new Module
```bash
yo brei-app:module
```

Create a new Partial
```bash
yo brei-app:partial
```

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