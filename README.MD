<h1 align=center>@hydre/doubt</h1>
<p align=center>
  <img src="https://img.shields.io/github/license/HydreIO/doubt.svg?style=for-the-badge" />
  <a href="https://discord.gg/bRSpRpD">
    <img src="https://img.shields.io/discord/398114799776694272.svg?logo=discord&style=for-the-badge" />
  </a>
	<a href="https://www.npmjs.com/package/@hydre/doubt">
    <img src="https://img.shields.io/npm/v/@hydre/doubt.svg?logo=npm&style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/npm/dw/@hydre/doubt?logo=npm&style=for-the-badge" />
	<a href="https://github.com/HydreIO/doubt/actions?query=workflow%3ACI">
  	<img src="https://img.shields.io/github/workflow/status/hydreio/doubt/CI?logo=Github&style=for-the-badge" />
	<a/>
</p>

<h3 align=center>A feather weight testing library <a href="http://testanything.org/tap-version-13-specification.html">TAP 13</a> compliant</h3>

> Tester c'est douter

Test your code and pipe the output to a [consumer](http://testanything.org/consumers.html) like [tape-spec-emoji](https://github.com/Sceat/tap-spec-emoji)

<!-- omit in toc -->
## Why

Testing should be dead simple, sexy, and **FAST**

- I like to make my own soap
- I like hype driven development
- I like train

> Node 13.10 minimum

<!-- omit in toc -->
## TOC
<img align="right" width="600" src="https://i.imgur.com/YkdDZIh.png">

- [Install](#install)
- [Use](#use)
- [Exemple](#exemple)
- [Custom output](#custom-output)
- [Glob](#glob)
- [Api](#api)
	- [Describe](#describe)
	- [Test](#test)
	- [isTrue](#istrue)
	- [isUndefined](#isundefined)
	- [isDefined](#isdefined)
	- [isFalse](#isfalse)
	- [isEqualTo](#isequalto)
	- [isNotEqualTo](#isnotequalto)
	- [isDeeplyEqualTo](#isdeeplyequalto)
	- [isAbove](#isabove)
	- [isBelow](#isbelow)
	- [isBetween](#isbetween)
	- [isNaN](#isnan)
	- [isTypeOf](#istypeof)
	- [hasKeys](#haskeys)
	- [isInstanceOf](#isinstanceof)
	- [pass](#pass)
	- [fails](#fails)
	- [failsWith](#failswith)
	- [failsWithMessage](#failswithmessage)
- [waiting helper](#waiting-helper)

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
node --harmony --experimental-specifier-resolution=node test.js
```
And now play with it

```js
// Find a nice title
'Obama is gone'.doubt(() => {
	// write cool tests
	'may we meet again'.because('i miss you').isTrue()
})
```

You can either pass values, promises, or async functions to resolve values ! awesome
> to use the async version you **have** to `await` your test !

**Beware while using promises instead of async functions as any rejection will not be handled**

```js
'Obama is gone'.doubt(async () => {

	'may we meet again'.because('i miss you').isTrue()

	await 'may we meet again later'.because(async ()=> {
		await 50..ms()
		return 'i miss you'
	}).isTrue()
})
```

***new in 3.0*** expect to fail precisely !
> Any errors are converted to their constructor name, thus you are able to just throw their names

```js
'Obama is gone'.doubt(async () => {

	'may we meet again'.because(() => { throw new Error() }).failsWith(new Error())

	await 'may we meet loosely'.because(() => { throw new Error() }).failsWith(async () => 'Error')

	'may we hack you mind'.because(() => { throw 'oh no' }).failsWith('oh no')

	class NiggaError extends Error { }
  'failsWith'.because(() => { throw 'NiggaError' }).failsWith(new NiggaError())

	await 'may we hack you mind later'.because(async ()=> {
		await 50..ms()
		throw new Error()
	}).failsWithMessage('')
})
```

## Exemple

```js
import '@hydre/doubt'

const shire = { population: 150, hobbits: ['Frodo', 'Lobelia'] }
const lair = { owner: 'Batman', queer: 'Robbin' }

'The shire'.doubt(() => {

	'should contain many hobbits'.because(shire.population > 100).isTrue()

	"is Batman's lair".because(shire).isDeeplyEqualTo(lair)
})

'In the seven kingdoms'.doubt(async () => {

	await 500..ms()

	'Jon Snow is a Lord commander'.because('he is a virgin').isEqualTo('HE IS A VIRGIN'.toLowerCase())

	'Ygritte is thick af'.because('What is dead may never die'.length).isAbove(0)

	await 'what do we say to the god of death'
		.because(async () => {
			await 1000..ms()
			throw new Error('Not today')
		})
		.fails()

	await 'The iron throne is made from a thousand swords'.because(1000).isBetween(1000, async () => 1000)
})
```

Damn bugs.. run only one set of tests
> it's a bad practice to use global isNaN instead of Number.isNaN but for the sake of simplicity we here use the global isNaN as it less strict than the Number.isNaN

```js
'Oh Боже'.only(()=> {
	'is not a number'.because(NaN).isNaN()
})
```

As doubt records your tests then run beforeExit, you have the possibility to run some actions after all tests have been executed
```js
import doubt from '@hydre/doubt'
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

## Api

### Describe

```js
''.doubt(() => {})
''.only(() => {})


''.doubt(async () => {})
''.only(async () => {})
```

### Test

Any input can be an `asyncFunction` or a `promise`, just remember to `await` the line for theses

Ex:

```js
const foo = async () => 1
const bar = foo()
await 'foo'.because(foo).isEqualTo(bar)
await 'bar'.because(1).isEqualTo(async () => bar)
```

### isTrue

```js
// !!val
because(val).isTrue()
```

### isUndefined

```js
// val === undefined
because(val).isUndefined()
```

### isDefined

```js
// val !== undefined
because(val).isDefined()
```

### isFalse

```js
// !val
because(val).isFalse()
```

### isEqualTo

```js
// val === x
because(val).isEqualTo(x)
```

### isNotEqualTo

```js
// val !== x
because(val).isNotEqualTo(x)
```

### isDeeplyEqualTo

```js
// deepEqual(val, x)
because(val).isDeeplyEqualTo(x)
```

### isAbove

```js
// val > x
because(val).isAbove(x)
```

### isBelow

```js
// val < x
because(val).isBelow(x)
```

### isBetween

```js
// val >= x && val <= y
because(val).isBetween(x, y)
```

### isNaN

```js
// isNaN(val)
because(val).isNaN()
```

### isTypeOf

```js
// typeof val === x
because(val).isTypeOf(x)
```

### hasKeys

```js
// x in val
because(val).hasKeys([x])
```

### isInstanceOf

```js
// val instanceof x
because(val).isInstanceOf(x)
```

### pass

```js
// function succeeds
because(() => {}).pass()
```

### fails

```js
// function fails
because(() => { throw 0 }).fails()
```

### failsWith

```js
// function fails with a strict value (the constructor name is used for any errors)
because(() => { throw 0 }).failsWith(0)
```

### failsWithMessage

```js
// function fails
because(() => { throw new Error('0') }).failsWithMessage('0')
```

---

## waiting helper

```js
await Number.ms()
```
