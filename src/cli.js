#!/usr/bin/env node
import glob from 'glob'
import Doubt from './doubt'

const [, , path] = process.argv

glob(path, {}, (err, files) => {
	for (let file of files) import(file)
})
