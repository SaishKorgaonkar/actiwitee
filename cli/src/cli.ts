#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import 'dotenv/config'
import { Command } from 'commander'
import { loadConfig } from './config/load.js'
import { Store } from './storage/store.js'
import { runCollect } from './collect.js'
import { serve } from './server.js'
import { runAgent } from './agent/agent.js'
import { aggregate } from './aggregate.js'

const program = new Command()
program.name('actiwitee').description('Self-hostable coding-activity aggregator').version('0.1.0')

program
  .command('init')
  .description('Create config.yaml and .env from the examples')
  .action(() => {
    const here = process.cwd()
    const copies: [string, string][] = [
      ['config.example.yaml', 'config.yaml'],
      ['.env.example', '.env'],
    ]
    for (const [src, dst] of copies) {
      const from = path.join(findPkgRoot(), src)
      const to = path.join(here, dst)
      if (fs.existsSync(to)) {
        console.log(`• ${dst} already exists, skipping`)
        continue
      }
      fs.copyFileSync(from, to)
      console.log(`✓ wrote ${dst}`)
    }
    console.log('\nNext: edit config.yaml (handles + sources) and .env (tokens), then:')
    console.log('  actiwitee collect --demo   # try it with synthetic data')
    console.log('  actiwitee serve            # start the API')
  })

program
  .command('collect')
  .description('Fetch all configured sources and store results')
  .option('--demo', 'use synthetic demo data (no tokens/network)')
  .option('-c, --config <path>', 'path to config.yaml')
  .action(async (opts) => {
    const config = loadConfig(opts.config, { defaultsIfMissing: opts.demo })
    const store = new Store()
    await runCollect(config, store, { demo: opts.demo })
  })

program
  .command('serve')
  .description('Start the read-only HTTP API')
  .option('-c, --config <path>', 'path to config.yaml')
  .action(async (opts) => {
    const config = loadConfig(opts.config, { defaultsIfMissing: true })
    const store = new Store()
    await serve(config, store)
  })

program
  .command('agent')
  .description('Run the local session tracker (samples signals on an interval)')
  .option('--once', 'sample a single time and exit')
  .option('-c, --config <path>', 'path to config.yaml')
  .action(async (opts) => {
    const config = loadConfig(opts.config)
    const store = new Store()
    await runAgent(config, store, { once: opts.once })
  })

program
  .command('show')
  .description('Print the aggregated activity payload to stdout')
  .option('-c, --config <path>', 'path to config.yaml')
  .action(async (opts) => {
    const config = loadConfig(opts.config)
    const store = new Store()
    console.log(JSON.stringify(aggregate(config, store), null, 2))
  })

function findPkgRoot(): string {
  // resolve relative to this file so `init` works from any cwd
  let dir = path.dirname(new URL(import.meta.url).pathname)
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir
    dir = path.dirname(dir)
  }
  return process.cwd()
}

program.parseAsync(process.argv)
