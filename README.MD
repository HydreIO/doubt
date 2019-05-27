![][licence] [![][npm]][npmlink] [![][travis]][travislink] [![][npmdl]][npmlink]

<h1 align=center>@hydre/doubt</h1>

[![][discord]][discordlink] [![][twitter]][twitterlink]

[licence]: https://img.shields.io/github/license/HydreIO/doubt.svg?style=for-the-badge
[npm]: https://img.shields.io/npm/v/@hydre/doubt.svg?logo=npm&style=for-the-badge
[npmlink]: https://www.npmjs.com/package/@hydre/doubt
[travis]: https://img.shields.io/travis/com/HydreIO/doubt.svg?logo=travis&style=for-the-badge
[travislink]: https://travis-ci.com/HydreIO/doubt
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
npm i @hydre/doubt
```

## Use:

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

	await (500).ms()

	'Jon Snow is a Lord commander'.because('he is a virgin').isEqualTo('HE IS A VIRGIN' |> #.toLowerCase())

	'Ygritte is thick af'.because('What is dead may never die'.length).isAbove(0)

	'what do we say to the god of death'
		.because(async () => {
			await (1000).ms()
			throw new Error('Not today')
		})
		.succeeds()

	'The iron throne is made from a thousand swords'.because(1000).isBetween(1000, 1000)
})
```