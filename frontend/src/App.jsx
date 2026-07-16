import { useState } from "react";

/* ───────────────────────────── Constants ────────────────────────────── */
const API_URL = "http://localhost:8000/match";

const DIMENSION_META = [
  { key: "coding", label: "Coding Proficiency", icon: "⟨/⟩", color: "from-indigo-500 to-violet-500" },
  { key: "budget", label: "Budget Weight / Price", icon: "◈", color: "from-cyan-500 to-teal-500" },
  { key: "design", label: "Design Aesthetics", icon: "◎", color: "from-fuchsia-500 to-pink-500" },
];

const METRICS = [
  { value: "cosine", label: "Cosine Similarity" },
  { value: "euclidean", label: "Euclidean Distance" },
];

/* ───────────────── Utility: rank badge colors by position ──────────── */
const RANK_STYLES = [
  "from-amber-400 to-yellow-500 text-gray-950",
  "from-slate-300 to-slate-400 text-gray-950",
  "from-orange-400 to-amber-600 text-gray-950",
  "from-indigo-400 to-indigo-600 text-white",
  "from-cyan-400 to-cyan-600 text-gray-950",
];

/* ═══════════════════════════════════════════════════════════════════════
   APP COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  /* ── slider state ── */
  const [coding, setCoding] = useState(7.5);
  const [budget, setBudget] = useState(5.0);
  const [design, setDesign] = useState(8.0);

  /* ── metric selector ── */
  const [metric, setMetric] = useState("cosine");

  /* ── API state ── */
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── mobile sidebar toggle ── */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ─────────────── Fetch handler ─────────────── */
  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_URL}?metric=${metric}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: [coding, budget, design] }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Network error — is the API running?");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────── Format score ─────────────── */
  const formatScore = (score, metricUsed) => {
    if (metricUsed === "cosine") {
      return `${(score * 100).toFixed(1)}%`;
    }
    return score.toFixed(3);
  };

  const scoreLabel = (metricUsed) =>
    metricUsed === "cosine" ? "Match Pattern" : "Distance";

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {/* ═══════════════ TOP NAVBAR ═══════════════ */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SmartMatch logo" className="h-9 w-9 rounded-lg shadow-lg shadow-indigo-500/20 object-cover" />
            <div>
              <h1 className="text-base font-semibold leading-tight tracking-tight">SmartMatch</h1>
              <p className="text-[11px] leading-tight text-slate-500">AI Vector Profile Analytics</p>
            </div>
          </div>

          {/* Status pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Engine Online · localhost:8000
          </div>

          {/* Mobile toggle */}
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Toggle controls"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      {/* ═══════════════ MAIN LAYOUT ═══════════════ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ─────────── SIDEBAR / CONTROL PANEL ─────────── */}
        <aside
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            fixed lg:static inset-y-0 left-0 z-40
            w-80 shrink-0 border-r border-white/5 bg-gray-950 lg:bg-gray-950/50
            overflow-y-auto transition-transform duration-300 ease-in-out
            pt-16 lg:pt-0
          `}
        >
          <div className="flex flex-col gap-6 p-6">
            {/* Section title */}
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 text-xs">▦</span>
                Vector Matrix Inputs
              </h2>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Configure your 3-dimensional target vector for similarity computation against 1,000 freelancer profiles.
              </p>
            </div>

            {/* ── Sliders ── */}
            <div className="flex flex-col gap-5">
              {DIMENSION_META.map(({ key, label, icon, color }, i) => {
                const val = [coding, budget, design][i];
                const setter = [setCoding, setBudget, setDesign][i];
                return (
                  <div key={key} className="group">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-300">
                        <span className="text-base opacity-60">{icon}</span>
                        {label}
                      </label>
                      <span className={`min-w-[3rem] text-right text-sm font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                        {val.toFixed(1)}
                      </span>
                    </div>
                    <input
                      id={`slider-${key}`}
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={val}
                      onChange={(e) => setter(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-slate-600">
                      <span>0.0</span>
                      <span>10.0</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Metric Selector ── */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
                Distance Metric
              </p>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1">
                {METRICS.map(({ value, label }) => (
                  <button
                    key={value}
                    id={`metric-${value}`}
                    onClick={() => setMetric(value)}
                    className={`rounded-lg px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                      metric === value
                        ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Calculate Button ── */}
            <button
              id="calculate-btn"
              onClick={handleCalculate}
              disabled={loading}
              className={`
                relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold tracking-wide uppercase transition-all duration-300
                ${loading
                  ? "bg-slate-800 text-slate-500 cursor-wait"
                  : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Computing...
                </span>
              ) : (
                "Calculate Similarity Matrix"
              )}
            </button>

            {/* API note */}
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-600 leading-relaxed">
                POST → <code className="text-indigo-400/70">127.0.0.1:8000/match</code><br />
                Computes ranked matches across a 1,000-row freelancer matrix using NumPy-backed vector operations.
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─────────── MAIN ANALYTICS BOARD ─────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {/* ── Hero Introduction ── */}
            <div className="mb-8 rounded-2xl border border-white/5 bg-gradient-to-br from-indigo-500/[0.07] to-cyan-500/[0.04] p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-white mb-2">
                    Welcome to SmartMatch
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    SmartMatch is an AI-powered vector similarity engine that helps you find the best-matching freelancer profiles instantly.
                    Define your ideal candidate as a 3-dimensional vector — <span className="text-indigo-400 font-medium">Coding Proficiency</span>,{" "}
                    <span className="text-cyan-400 font-medium">Budget/Price</span>, and{" "}
                    <span className="text-fuchsia-400 font-medium">Design Aesthetics</span> — and the engine computes real-time similarity scores
                    against 1,000 profiles using NumPy-backed linear algebra.
                  </p>

                  {/* How it works steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { step: "01", title: "Set Your Vector", desc: "Adjust the 3 sliders to define your ideal profile target.", icon: "⟨/⟩" },
                      { step: "02", title: "Pick a Metric", desc: "Choose Cosine Similarity or Euclidean Distance.", icon: "∠" },
                      { step: "03", title: "Get Matches", desc: "Instantly see the top 5 closest profiles ranked by score.", icon: "◈" },
                    ].map(({ step, title, desc, icon }) => (
                      <div key={step} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">
                            {step}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">{title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tech badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["FastAPI Backend", "NumPy Vectors", "Cosine & Euclidean", "Real-Time Results", "1,000 Profiles"].map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Target Vector Card ── */}
            <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-1">Query Vector</p>
                  <h2 className="text-xl font-bold tracking-tight">
                    Target Array:{" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                      [{coding.toFixed(1)}, {budget.toFixed(1)}, {design.toFixed(1)}]
                    </span>
                  </h2>
                </div>
                <div className="flex gap-2">
                  {DIMENSION_META.map(({ key, label, icon, color }, i) => (
                    <div key={key} className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 min-w-[70px]">
                      <span className="text-lg mb-0.5">{icon}</span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                        {[coding, budget, design][i].toFixed(1)}
                      </span>
                      <span className="text-[9px] text-slate-600 mt-0.5">{label.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${
                  metric === "cosine"
                    ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                    : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                }`}>
                  {metric === "cosine" ? "cos(θ)" : "‖d‖₂"}
                  {" "}
                  {METRICS.find((m) => m.value === metric)?.label}
                </span>
                <span className="text-slate-700">·</span>
                <span>3-dimensional space</span>
                <span className="text-slate-700">·</span>
                <span>1,000 candidates</span>
              </div>
            </div>

            {/* ── Results area ── */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <span className="mt-0.5 text-red-400 text-lg">✕</span>
                <div>
                  <p className="text-sm font-medium text-red-400">Computation Failed</p>
                  <p className="mt-0.5 text-xs text-red-400/70">{error}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-shimmer rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white/5" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-40 rounded bg-white/5" />
                        <div className="h-3 w-24 rounded bg-white/5" />
                      </div>
                      <div className="h-8 w-20 rounded-full bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !results && !error && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-white/5">
                  <span className="text-4xl opacity-40">⬡</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No Analysis Run Yet</h3>
                <p className="max-w-sm text-sm text-slate-600 leading-relaxed">
                  Configure your target vector dimensions in the control panel, select a distance metric, and compute the similarity matrix.
                </p>
              </div>
            )}

            {results && !loading && (
              <>
                {/* Results header */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-300">
                    Top Matches
                    <span className="ml-2 text-xs font-normal text-slate-600">
                      ({results.metric_used === "cosine" ? "Ranked by similarity ↓" : "Ranked by proximity ↑"})
                    </span>
                  </h3>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-500">
                    {results.matches.length} results
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-4">
                  {results.matches.map((match, idx) => {
                    const isCosine = results.metric_used === "cosine";
                    const pct = isCosine ? match.score * 100 : null;

                    return (
                      <div
                        key={idx}
                        className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-indigo-500/5"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          {/* Left: rank + name */}
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${RANK_STYLES[idx]} text-xs font-bold shadow-lg`}>
                              #{idx + 1}
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-white group-hover:text-indigo-200 transition-colors">
                                {match.name}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                                vec[{match.profile_vector.map((v) => v.toFixed(1)).join(", ")}]
                              </p>
                            </div>
                          </div>

                          {/* Right: score badge */}
                          <div className="flex items-center gap-3">
                            {isCosine ? (
                              <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent leading-none">
                                  {pct.toFixed(1)}%
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5">{scoreLabel(results.metric_used)}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-end">
                                <span className="text-2xl font-bold text-cyan-400 leading-none">
                                  {match.score.toFixed(3)}
                                </span>
                                <span className="text-[10px] text-slate-500 mt-0.5">{scoreLabel(results.metric_used)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ── Dimension progress bars ── */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {DIMENSION_META.map(({ key, label, icon, color }, di) => {
                            const dimVal = match.profile_vector[di];
                            const pctWidth = (dimVal / 10) * 100;
                            return (
                              <div key={key} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                    <span className="text-xs">{icon}</span>
                                    {label.split(" ")[0]}
                                  </span>
                                  <span className={`text-xs font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                                    {dimVal.toFixed(1)}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
                                    style={{ width: `${pctWidth}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Cosine: full-width match bar */}
                        {isCosine && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-slate-600">Overall Similarity</span>
                              <span className="text-[10px] text-slate-600">{pct.toFixed(1)}%</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-700 ease-out"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
