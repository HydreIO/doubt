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
  <img src="https://img.shields.io/github/workflow/status/@hydre/doubt/CI?logo=Github&style=for-the-badge" />
</p>

<h3 align=center>A feather weight testing library <a href="http://testanything.org/tap-version-13-specification.html">TAP 13</a> compliant</h3>

> Tester c'est douter

<img align="right" width="600" src="https://i.imgur.com/7W0Nnua.png">

Test your code and pipe the output to a [consumer](http://testanything.org/consumers.html) like [tape-spec-emoji](https://github.com/Sceat/tap-spec-emoji)

## Why

Testing should be dead simple, sexy, and **FAST**

- I like to make my own soap
- I like simple things
- I like train

## Install

```
npm i -D @hydre/doubt
```

## Use:

Just import ! hulk u morron

```js
import '@hydre/doubt'
```

> !! **RUN WITH `--harmony --experimental-specifier-resolution=node`**

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

**Beware while using promise instead of async functions as any rejection will not be handled**

```js
// Find a nice title
'Obama is gone'.doubt(async () => {
	// write cool tests
	'may we meet again'.because('i miss you').isTrue()

	await 'may we meet again later'.because(async ()=> {
		await 50..ms()
		return 'i miss you'
	}).isTrue()
})
```

## Exemple:

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
```js
import doubt from '@hydre/doubt'
import tapSpec from 'tap-spec-emoji'
doubt.createStream().pipe(tapSpec()).pipe(process.stdout)

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

> remember to `await` everytime you use an async function instead of a value in `because()`


## isTrue

!!val

```js
because(val).isTrue()
await because(async () => val).isTrue()
```

## isUndefined

val === undefined

```js
because(val).isUndefined()
await because(async () => val).isUndefined()
```

## isDefined

val !== undefined

```js
because(val).isDefined()
await because(async () => val).isDefined()
```

## isFalse

!val

```js
because(val).isFalse()
await because(async () => val).isFalse()
```

## isEqualTo

val === x

```js
because(val).isEqualTo(x)
await because(async () => val).isEqualTo(x)

// it works for every cases even
await because(val).isEqualTo(async () => x)
await because(async () => val).isEqualTo(async () => x)
```

## isNotEqualTo

val !== x

```js
because(val).isNotEqualTo(x)
await because(async () => val).isNotEqualTo(x)
await because(val).isNotEqualTo(async () => x)
await because(async () => val).isNotEqualTo(async () => x)
```

## isDeeplyEqualTo

equal(val,x)

```js
because(val).isDeeplyEqualTo(x)
await because(async () => val).isDeeplyEqualTo(x)
await because(val).isDeeplyEqualTo(async () => x)
await because(async () => val).isDeeplyEqualTo(async () => x)
```

## isAbove

val > x

```js
because(val).isAbove(x)
await because(async () => val).isAbove(x)
await because(val).isAbove(async () => x)
await because(async () => val).isAbove(async () => x)
```

## isBelow

val < x

```js
because(val).isBelow(x)
await because(async () => val).isBelow(x)
await because(val).isBelow(async () => x)
await because(async () => val).isBelow(async () => x)
```

## isBetween

val >= x && val <= y

```js
because(val).isBetween(x, y)
await because(async () => val).isBetween(x, y)
await because(val).isBetween(x, async () => y)
await because(async () => val).isBetween(async () => x, y)
// not writing all cases for this one as you're probably not that dumb if you found my lib
```

## isNaN

isNaN(val)

```js
because(val).isNaN()
await because(async () => val).isNaN()
```

## isTypeOf

typeof val === x

```js
because(val).isTypeOf(x)
await because(async () => val).isTypeOf(x)
await because(val).isTypeOf(async () => x)
await because(async () => val).isTypeOf(async () => x)
```

## hasKeys

x in val

```js
because(val).hasKeys([x])
await because(async () => val).hasKeys([x])
await because(val).hasKeys(async () => [x])
await because(async () => val).hasKeys(async () => [x])
```

## isInstanceOf

val instanceof x

```js
because(val).isInstanceOf(x)
await because(async () => val).isInstanceOf(x)
await because(val).isInstanceOf(async () => x)
await because(async () => val).isInstanceOf(async () => x)
```

## succeeds

val succeed

```js
await because(async () => val).succeeds()
```

## fails

val fails

```js
await because(async () => val).fails()
```

### waiting helper

```js
await Number.ms()
```
