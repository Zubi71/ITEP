const CLIENTS = [
  {
    cat: "Universities & colleges",
    items: ["Zarafshon State University", "Oxus College of Applied Sciences", "Silk Road International College", "Fergana Valley Polytechnic Institute"],
  },
  {
    cat: "Language schools & programs",
    items: ["Bridgeview Language Institute", "Northgate English Academy", "Persons Youth Language Program"],
  },
  {
    cat: "Government & public sector",
    items: ["Andijon Regional Education Department", "Ministry of Employment — Vocational Bureau", "Tashkent City Youth Affairs Office"],
  },
  {
    cat: "Corporate clients",
    items: ["Oltin Vodiy Textile Group", "TransAsia Logistics", "Farg'ona Chemical Works", "Meridian Business Consulting", "Andijon Silk Export Co-operative"],
  },
];

export default function ExistingClientsPage() {
  const total = CLIENTS.reduce((s, g) => s + g.items.length, 0);

  return (
    <main className="p-6 lg:p-9 flex-1" style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
      <div className="mb-6">
        <div className="eyebrow eyebrow-seal">About this centre</div>
        <h1 className="mt-2" style={{ fontSize: 28 }}>
          Existing clients
        </h1>
        <p className="muted mt-2" style={{ fontSize: 14, maxWidth: 620, lineHeight: 1.6 }}>
          Academic institutions, government offices and employers across the region that use this centre
          for admissions, hiring or workplace English assessment.
        </p>
      </div>

      <div className="card card-pad mb-4" style={{ maxWidth: 280 }}>
        <div className="eyebrow">Organisations served</div>
        <div className="stat-n mt-2">{total}</div>
        <div className="tiny muted mt-1.5">Across four categories</div>
      </div>

      <div className="grid gap-3.5">
        {CLIENTS.map((g) => (
          <div key={g.cat} className="card card-pad">
            <div className="eyebrow eyebrow-seal mb-3">{g.cat}</div>
            <div className="grid sm:grid-cols-2 gap-1">
              {g.items.map((name) => (
                <div key={name} className="flex items-center gap-2.5 px-2 py-2">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--seal)", flex: "none" }} />
                  <span style={{ fontSize: 13.5, fontWeight: 550 }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
