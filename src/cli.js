#!/usr/bin/env node
import glob from 'glob'
import path from 'path'

glob(
    // eslint-disable-next-line no-magic-numbers
    process.argv[2], {}, (error, files) => {
      for (const file of files) import(path.resolve(file))
    },
)
