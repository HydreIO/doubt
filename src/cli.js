#!/usr/bin/env node
const glob = require('glob')

const [, , path] = process.argv

glob(path, {}, (err, files) => {
	for (let file of files) import(file)
})
