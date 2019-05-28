#!/usr/bin/env node
import glob from 'glob'
import path from 'path'

const [, , regex] = process.argv

glob(regex, {}, (err, files) => {
	for (let file of files) file |> path.resolve |> require
})
