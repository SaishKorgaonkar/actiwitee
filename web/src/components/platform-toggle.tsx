'use client'

type Platform = 'mac' | 'windows'

const platforms: { id: Platform; label: string }[] = [
  { id: 'mac', label: 'Mac' },
  { id: 'windows', label: 'Windows' },
]

export function PlatformToggle({
  value,
  onChange,
}: {
  value: Platform
  onChange: (p: Platform) => void
}) {
  return (
    <div className="flex gap-2">
      {platforms.map((p) => {
        const active = value === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-ink text-on-primary'
                : 'bg-surface-card text-body hover:bg-surface-card-elevated hover:text-ink'
            }`}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}

export type { Platform }
