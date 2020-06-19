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

<h3 align=center>An elegant and minimal <a href="http://testanything.org/tap-version-13-specification.html">TAP 13</a> compliant testing library</h3>

> Tester c'est douter

Test your code and pipe the output to a [consumer](http://testanything.org/consumers.html) like [tape-spec-emoji](https://github.com/Sceat/tap-spec-emoji)

- The only assertion is a [fast deep equality](https://github.com/epoberezkin/fast-deep-equal)

<img align=right src="https://i.imgur.com/u8oN5NI.png">

<!-- omit in toc -->
## Concept

No fugazzi here, just equality

<!-- omit in toc -->
## Toc

- [Install](#install)
- [Use](#use)
- [Format](#format)

## Install

```
npm i -D @hydre/doubt
```

## Use

Usage is trivial

- `stdout` - Doubt doesn't pollute the standard output, use any stream
- `title` - Test suite title
- `calls` - Enforce how many tests you want, it will fails if the count doesn't match
- `timeout` - Enforce a maximum execution time, (note that this will not exit the program, it only is a check)

```js
import Doubt from '@hydre/doubt'

const doubt = Doubt({
  stdout : process.stdout,
  title  : 'Testing is simple',
  calls  : 1,
  timeout: 50,
})
```

And then write some tests

```js
doubt['Roses are red']({
  because: 'red',
  is     : 'red',
})
```

## Format

```js
import Doubt from '@hydre/doubt'
import reporter from 'tap-spec-emoji'
import { pipeline, PassThrough } from 'stream'

const through = new PassThrough()

pipeline(
    through,
    reporter(),
    process.stdout,
    () => {},
)

const doubt = Doubt({
  stdout : through,
  title  : 'Testing is simple',
  calls  : 4,
})

doubt['Roses are red']({
  because: 'red',
  is     : 'red',
})

doubt['Violets are blue']({
  because: 'blue',
  is     : 'blue',
})

doubt['Doubt is awesome']({
  because: { amazing: true },
  is     : { amazing: true },
})

doubt['Your tests should be too']({
  because: { 'using doubt': true },
  is     : { 'using doubt': false },
})
```