export function Footer() {
  return (
    <footer className="border-t border-hairline py-12">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-primary">Actiwitee</p>
          <p className="mt-1 text-xs text-muted">Unified coding activity, self-hosted.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-body">
          <a href="https://github.com/SaishKorgaonkar/actiwitee" className="hover:text-ink">
            GitHub
          </a>
          <a href="https://codepulse.saish.xyz/health" className="hover:text-ink">
            API
          </a>
          <a href="https://saish.xyz" className="hover:text-ink">
            Demo
          </a>
        </div>

        <p className="text-xs text-muted-soft">
          © {new Date().getFullYear()} Saish Korgaonkar
        </p>
      </div>
    </footer>
  )
}
