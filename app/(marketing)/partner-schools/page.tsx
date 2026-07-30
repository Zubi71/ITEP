const PARTNER_SCHOOLS = [
  {
    cat: "Universities & colleges",
    items: [
      { name: "Zarafshon State University", loc: "Samarkand, Uzbekistan" },
      { name: "Silk Road International College", loc: "Tashkent, Uzbekistan" },
      { name: "Fergana Valley Polytechnic Institute", loc: "Fergana, Uzbekistan" },
      { name: "Meridian Business School", loc: "Almaty, Kazakhstan" },
      { name: "Caspian Technical University", loc: "Baku, Azerbaijan" },
      { name: "Oxus College of Applied Sciences", loc: "Andijon, Uzbekistan" },
    ],
  },
  {
    cat: "Intensive English programs",
    items: [
      { name: "Bridgeview Language Institute", loc: "Toronto, Canada" },
      { name: "Northgate English Academy", loc: "Manchester, UK" },
      { name: "Harborline IEP", loc: "San Diego, USA" },
    ],
  },
  {
    cat: "Scholarship & exchange bodies",
    items: [
      { name: "Uzbekistan Presidential Scholars Fund", loc: "Tashkent, Uzbekistan" },
      { name: "Eurasia Graduate Exchange Board", loc: "Regional" },
    ],
  },
];

export default function PartnerSchoolsPage() {
  const total = PARTNER_SCHOOLS.reduce((s, g) => s + g.items.length, 0);
  const countries = new Set(PARTNER_SCHOOLS.flatMap((g) => g.items.map((it) => it.loc.split(", ").pop()))).size;

  return (
    <main className="p-6 lg:p-9 flex-1" style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
      <div className="mb-6">
        <div className="eyebrow eyebrow-seal">Academic partner schools</div>
        <h1 className="mt-2" style={{ fontSize: 28 }}>
          Institutions that accept scores from this centre
        </h1>
        <p className="muted mt-2" style={{ fontSize: 14, maxWidth: 620, lineHeight: 1.6 }}>
          iTEP Academic is a post-secondary assessment used for admissions, placement and exit testing. The
          institutions below currently accept results issued by this centre.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3.5 mb-6">
        <div className="card card-pad">
          <div className="eyebrow">Partner institutions</div>
          <div className="stat-n mt-2">{total}</div>
          <div className="tiny muted mt-1.5">Across every category</div>
        </div>
        <div className="card card-pad">
          <div className="eyebrow">Countries represented</div>
          <div className="stat-n mt-2">{countries}</div>
          <div className="tiny muted mt-1.5">And growing each term</div>
        </div>
        <div className="card card-pad">
          <div className="eyebrow">Accepted for</div>
          <div className="stat-n mt-2" style={{ color: "var(--seal)", fontSize: 22 }}>
            Admissions
          </div>
          <div className="tiny muted mt-1.5">Placement and exit testing too</div>
        </div>
      </div>

      <div className="grid gap-6">
        {PARTNER_SCHOOLS.map((g) => (
          <div key={g.cat}>
            <div className="eyebrow eyebrow-seal mb-3">{g.cat}</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {g.items.map((it) => (
                <div key={it.name} className="dir-card">
                  <div className="flex items-center gap-2.5">
                    <div className="dir-mark" style={{ background: "var(--ink)", color: "#fff" }}>
                      {it.name[0]}
                    </div>
                    <div style={{ fontWeight: 650, fontSize: 13.5, lineHeight: 1.35 }}>{it.name}</div>
                  </div>
                  <div className="tiny muted" style={{ marginLeft: 40 }}>
                    {it.loc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="tiny muted mt-7" style={{ lineHeight: 1.7, maxWidth: 640 }}>
        Beyond this centre&apos;s direct partners, the iTEP assessment is recognised more broadly for
        admissions, placement and exit testing at institutions worldwide. Ask your admissions office to
        confirm acceptance before relying on a score.
      </p>
    </main>
  );
}
