import { z } from 'zod'

const githubSource = z.object({
  id: z.string(),
  username: z.string(),
  tokenEnv: z.string().optional(),
  includePrivate: z.boolean().default(true),
})

const handleSource = z.object({
  id: z.string().optional(),
  username: z.string(),
})

const signal = z.object({
  id: z.string(),
  type: z.enum(['process', 'app-focus', 'session-log']),
  match: z.string().optional(),
  path: z.string().optional(),
  category: z.string().default('local'),
})

export const configSchema = z.object({
  server: z
    .object({
      port: z.number().default(4787),
      cors: z.string().default('*'),
    })
    .default({ port: 4787, cors: '*' }),
  rangeDays: z.number().default(371),
  sources: z
    .object({
      github: z.array(githubSource).default([]),
      leetcode: z.array(handleSource).default([]),
      codeforces: z.array(handleSource).default([]),
      codechef: z.array(handleSource).default([]),
    })
    .default({}),
  weights: z
    .object({
      github: z.number().default(1),
      leetcode: z.number().default(3),
      codeforces: z.number().default(3),
      codechef: z.number().default(3),
      local: z.number().default(1),
    })
    .default({}),
  levels: z
    .object({
      mode: z.enum(['percentile', 'fixed']).default('percentile'),
      thresholds: z.array(z.number()).length(4).default([1, 4, 8, 12]),
    })
    .default({}),
  agent: z
    .object({
      interval: z.number().default(180),
      minSessionGap: z.number().default(900),
      signals: z.array(signal).default([]),
    })
    .default({}),
})

export type Config = z.infer<typeof configSchema>
export type GithubSource = z.infer<typeof githubSource>
export type HandleSource = z.infer<typeof handleSource>
export type Signal = z.infer<typeof signal>
