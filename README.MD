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

<h3 align=center>An elegant <a href="http://testanything.org/tap-version-13-specification.html">TAP 13</a> compliant testing library</h3>

> Tester c'est douter

Test your code and pipe the output to a [consumer](http://testanything.org/consumers.html) like [tape-spec-emoji](https://github.com/Sceat/tap-spec-emoji)

- Doubt is **really** small (~100 lines of code)
- The only assertion is a fast deep equality
- Writing test is trivial
- Doubt is just an async iterator, you can
  do whatever you want with the output

*(pic too large on npm ? see the [github repo](https://github.com/HydreIO/doubt))*
<img align=right height=600 src="https://i.imgur.com/NNycOhi.png">
<!-- omit in toc -->
## Concept

There is no better test than pure deep equality.

> Node 14.2 required

<!-- omit in toc -->
## TOC

- [Install](#install)
- [Use](#use)
- [Suites](#suites)

## Install

```
npm i -D @hydre/doubt
```

## Use

You will need at least node <kbd>14.2</kbd>

As doubt doesn't pollute the standart output, it is compatible
out of the box with any test coverage tool!

Write clear and concise tests in separate files


```js
// doubt.test.js
export default class {
  static name = 'Testing is simple' // the name of the suite
  static loop = 2 // 1 by default

  #add = a => b => a + b

  roses(affirm) {
    const add_1 = this.#add(1)
    affirm({
      that   : 'Roses',
      should : 'be red'.red.underline,
      because: add_1(1),
      is     : 2,
    })
  }
```

And now run it !

```js
import doubt from '../src/index.js'
import reporter from 'tap-spec-emoji'
import Suite from './doubt.test.js'
import { pipeline } from 'stream'

(async () => {
  pipeline(
      // await doubt(Suite, Suite, Suite)
      // await doubt(...[suites])
      await doubt(Suite), // doubt is a promise of an asyncGenerator
      reporter(),
      process.stdout,
      error => {
        if (error) console.error(error)
      },
  )
})()
```

## Suites

A suite is a Class where each function (static or simple)
is a test.

Each function will be extracted and ran inside its own
instance of the class

Use private fields to deleguate logic inside your suite

```js
export default class {
  static name = 'Testing arrays'

  #array
  #init_array = async () => {
    this.#array.push(3)
  }

  constructor() {
    this.#array = [1, 2]
  }

  async ['a test'](affirm) {
    this.#init_array()
    affirm({
      that   : 'the array',
      should : 'contains 3 elements',
      because: this.#array.length,
      is     : 3,
    })
  }

  // here we use the array but
  // we are in a different instance of the class
  // so this test is true
  async anotherTest(affirm) {
    // this.#init_array()
    affirm({
      that   : 'the array',
      should : 'contains 2 elements',
      because: this.#array.length,
      is     : 2,
    })
  }
```
