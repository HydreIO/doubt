#!/usr/bin/env node
import glob from 'glob'
import path from 'path'
import { transformFileSync } from '@babel/core'
import Doubt from './doubt'

const [, , regex] = process.argv

glob(regex, {}, (err, files) => {
	for (let file of files) {
		const code = file |> path.resolve |> transformFileSync |> #.code
		Doubt.nextfile = file |> path.basename // litle hack to still catch the filename
		eval(code) // eval doesn't work while piping
	}
})
