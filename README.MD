![][licence] [![][npm]][npmlink] [![][npmdl]][npmlink]

<h1 align=center>@hydre/doubt</h1>

[![][discord]][discordlink] [![][twitter]][twitterlink]

[licence]: https://img.shields.io/github/license/HydreIO/doubt.svg?style=for-the-badge
[npm]: https://img.shields.io/npm/v/@hydre/doubt.svg?logo=npm&style=for-the-badge
[npmlink]: https://www.npmjs.com/package/@hydre/doubt
[twitter]: https://img.shields.io/badge/follow-us-blue.svg?logo=twitter&style=for-the-badge
[twitterlink]: https://twitter.com/hydreio
[discord]: https://img.shields.io/discord/398114799776694272.svg?logo=discord&style=for-the-badge
[discordlink]: https://discord.gg/bRSpRpD
[npmdl]: https://img.shields.io/npm/dw/@hydre/doubt.svg?color=%239C27B0&style=for-the-badge

> Tester c'est douter

<img align="right" width="600" src="https://i.imgur.com/HULOni8.png">

Doubt is a feather weight testing library [TAP 13](http://testanything.org/tap-version-13-specification.html) compliant.

Test your code and pipe the output to a [consumer](http://testanything.org/consumers.html) like [tape-spec](https://github.com/scottcorgan/tap-spec)

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

And now play with it

```js
// Find a nice title
'Obama is gone'.doubt(() => {
	// write cool tests
	'may we meet again'.because('i miss you').isTrue()
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
		.succeeds()

	'The iron throne is made from a thousand swords'.because(1000).isBetween(1000, 1000)
})
```

Damn bugs.. run only one set of tests

```js
'Oh Боже'.only(()=> {
	'is not a number'.because(NaN).isNaN()
})
```
> it's a bad practice to use global isNaN instead of Number.isNaN but for the sake of simplicity we here use the global isNaN has it less strict than the Number.isNaN

## Glob

Run multiple test files all at once by including a script in your `package.json`

```
"test": "doubt 'test/**/*.js' | tap-spec"
```

You can also install it globally to run manually

```
npm i -g @hydre/doubt
doubt 'test/**/*.js' | tap-spec
```

Using babel ? me too! since directly transforming the code then evaluating it just do weird shit, you'll have to import your files manually.
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
5. you can now `babel-node test | tap-spec`

## Api

### Describe

```js
''.doubt(() => {})
''.only(() => {})
```

### Test

- !!val

```js
because(val).isTrue()
```

- val === undefined

```js
because(val).isUndefined()
```

- val !== undefined

```js
because(val).isDefined()
```

- !val

```js
because(val).isFalse()
```

- val === x

```js
because(val).isEqualTo(x)
```

- val !== x

```js
because(val).isNotEqualTo(x)
```

- equal(val,x)

```js
because(val).isDeeplyEqualTo(x)
```

- val > x

```js
because(val).isAbove(x)
```

- val < x

```js
because(val).isBelow(x)
```

- val >= x && val <= y

```js
because(val).isBetween(x, y)
```

- isNaN(val)

```js
because(val).isNaN()
```

- typeof val === x

```js
because(val).isTypeOf(x)
```

- keys(val) contained in x

```js
because(val).hasKeys([x])
```

- val instanceof x

```js
because(val).isInstanceOf(x)
```

### Promises

Don't forget to await those ones

- val is a succeeding promise

```js
await because(val).succeeds()
```

- val is a failing promise

```js
await because(val).fails()
```

- waiting helper

```js
await Number.ms()
```
