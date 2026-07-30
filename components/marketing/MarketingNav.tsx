import Link from "next/link";

export function MarketingNav() {
  return (
    <div className="pubnav flex items-center justify-between px-4 lg:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex items-center justify-center" style={{ width: 26, height: 26, background: "var(--seal)", borderRadius: 5 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: "#fff" }}>
            school
          </span>
        </div>
        <span style={{ fontWeight: 800, fontSize: 15 }}>iTEP Center</span>
      </Link>

      <nav className="hidden md:flex items-center">
        <Link href="/free-tests" className="pubnav-link">
          Free tests
        </Link>
        <Link href="/study" className="pubnav-link">
          Free resources
        </Link>
        <Link href="/partner-schools" className="pubnav-link">
          Partner schools
        </Link>
        <Link href="/existing-clients" className="pubnav-link">
          Existing clients
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <Link href="/login" className="btn btn-quiet btn-sm" style={{ color: "#b9c6de" }}>
          Log in
        </Link>
        <Link href="/login" className="btn btn-seal btn-sm">
          Register
        </Link>
      </div>
    </div>
  );
}
