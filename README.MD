<h1 align=center>@hydre/doubt</h1>
<p align=center>
  <img src="https://img.shields.io/github/license/HydreIO/doubt.svg?style=for-the-badge" />
  <a href="https://discord.gg/bRSpRpD">
    <img src="https://img.shields.io/discord/398114799776694272.svg?logo=discord&style=for-the-badge" />
  </a>
  <a href="https://www.npmjs.com/package/@hydre/doubt">
    <img src="https://img.shields.io/npm/v/@hydre/doubt.svg?logo=npm&style=for-the-badge" />
  </a>
  <a href="https://www.npmjs.com/package/@hydre/doubt">
    <img src="https://img.shields.io/npm/dw/@hydre/doubt?logo=npm&style=for-the-badge" />
  </a>
  <a href="https://github.com/HydreIO/doubt/actions?query=workflow%3ACI">
    <img src="https://img.shields.io/github/workflow/status/hydreio/doubt/CI?logo=Github&style=for-the-badge" />
  <a/>
</p>

<h3 align=center>A feather weight testing library <a href="http://testanything.org/tap-version-13-specification.html">TAP 13</a> compliant</h3>

> Tester c'est douter

Test your code and pipe the output to a [consumer](http://testanything.org/consumers.html) like [tape-spec-emoji](https://github.com/Sceat/tap-spec-emoji)

<img align=right height=400 src="https://i.imgur.com/Qj9y57w.png">

<!-- omit in toc -->
## Concept

There is no better test than pure deep equality.

> Node 14 required

<!-- omit in toc -->
## TOC

- [Install](#install)
- [Use](#use)
- [Once](#once)
- [Hooks](#hooks)
- [Custom output](#custom-output)
- [Glob](#glob)

## Install

```
npm i -D @hydre/doubt
```

## Use

Just import ! hulk u morron

```js
import '@hydre/doubt'
```
```sh
node test.js
```
And now play with it

```js
'Testing is simple'.doubt(() => {
  'roses'
      .should('be %s', 'red'.red.underline)
      .because('red')
      .is('red')

  'violets'
      .should('be %s', 'blue'.cyan.underline)
      .because('blue')
      .is('blue')

  'this library'
      .should('be amazing')
      .because({ amazing: true })
      .is({ amazing: true })

  'your test'
      .should('be amazing too')
      .because({ 'using doubt': false })
      .is({ 'using doubt': true })
})
```

## Once

Damn bugs.. run only one set of tests

```js
'Oh Боже'.only(async ()=> {
  const given = 'spiderman'

  given
    .should('subscribe to pewdiepie')
    .because([9, 'yo'])
    .is([9, 'yo'])
})
```

## Hooks

As doubt records your tests then run beforeExit, you have the possibility to run some actions before and after all tests have been executed
```js
// if you use an http server and listen before the tests then no tests will run as node will never exit
// you must use a hook
doubt.onStart(async ()=> { server.listen() })

doubt.onEnd(({ total, passed }) => { console.log(`just ran ${total} tests!`) })
```
You can also pass an async function
```js
import doubt from '@hydre/doubt'

doubt.onEnd(async ({ total, passed }) => {
  const failed = total - passed
  if (failed) await slack.notify('Some tests have failed!')
})
```

## Custom output

instead of piping at the console level with your favorite tap compliant beautifier
```
npm run test | tape-spec-emoji
```

you can set it in code by creating a stream
> `Doubt.stream()` basically just stop the default piping to stdout, and return the internal asyncIterator

```js
import { pipeline } from 'stream'
import doubt from '@hydre/doubt'
import tap_spec from 'tap-spec-emoji'

pipeline(Doubt.stream(), tap_spec(), process.stdout, error => { if (error) console.log(error) })

'test me'.doubt(()=>{})
```

## Glob

Run multiple test files all at once by including a script in your `package.json`

```
"test": "doubt 'test/**/*.js' | tap-spec-emoji"
```

You can also install it globally to run manually

```
npm i -g @hydre/doubt
doubt 'test/**/*.js' | tap-spec-emoji
```

Using babel ? since directly transforming the code then evaluating it just do weird shit, you'll have to import your files manually.
Or follow these 5 steps

1. install the [babel-plugin-wildcard](https://github.com/vihanb/babel-plugin-wildcard)
2. create an index.js file in your test folder such as
   ```
   test/
   ├── index.js
   ├── sometest.js
   └── testsome.js
   ```
3. just import the current folder inside the `index.js` file by pasting `import * as _ from './'`
4. the wildcard plugin will do the rest by importing all your test files
5. you can now `babel-node test | tap-spec-emoji`