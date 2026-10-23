export default function Home() {
  const metrics = [
    { label: "Peak Deduction TPS", value: "12,480 /s", delta: "0 Overdrafts (Row-Lock + CAS)" },
    { label: "Idempotency Hit Rate", value: "99.998%", delta: "Redis Token + Unique TxIndex" },
    { label: "T+1 Recon Accuracy", value: "100.00%", delta: "Auto-healed 14 dropped webhooks" },
    { label: "P99 Ledger Latency", value: "6.4 ms", delta: "Single-statement conditional UPDATE" },
  ];

  const ledgerRows = [
    { tx: "TX-20261023-9841", type: "WITHDRAW_USDT", amount: "-2,500.00 USDT", state: "SETTLED", guard: "Freeze -> Query -> Commit", ms: "4.8ms" },
    { tx: "TX-20261023-9840", type: "FIAT_EXCHANGE", amount: "+3,380.00 SGD", state: "SETTLED", guard: "Atomic Dual-Entry Tx", ms: "5.2ms" },
    { tx: "TX-20261023-9839", type: "DEPOSIT_WEBHOOK", amount: "+10,000.00 USD", state: "RECONCILED", guard: "HMAC Sig + Amount Verify", ms: "3.1ms" },
    { tx: "TX-20261023-9838", type: "DUPLICATE_RETRY", amount: "0.00 USD", state: "BLOCKED_IDEMPOTENT", guard: "Redis Lua Token Consumed", ms: "0.9ms" },
    { tx: "TX-20261023-9837", type: "PAYOUT_TIMEOUT", amount: "-850.00 SGD", state: "FROZEN_PENDING_POLL", guard: "Query-Only (No Re-Send)", ms: "6.1ms" },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto px-6 py-14 space-y-12">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SIGNORE · LEDGER &amp; SETTLEMENT SANDBOX
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Zero-Discrepancy Wallet Accounting Engine
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl">
              Production-grade patterns for high-concurrency balance deduction, Redis token idempotency, outbox Kafka delivery, and T+1 channel reconciliation.
            </p>
          </div>
          <a
            href="https://github.com/opc-x/signore"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 text-xs font-mono text-zinc-300 transition"
          >
            GitHub Source ↗
          </a>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-zinc-900/60 border border-zinc-800/90 p-5">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">{m.label}</div>
              <div className="text-2xl font-bold text-white mt-2 font-mono">{m.value}</div>
              <div className="text-xs text-emerald-400/90 mt-2">{m.delta}</div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-emerald-400">01 · Atomic Anti-Overdraft SQL</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Eliminates read-modify-write race conditions without long-held SELECT FOR UPDATE locks or distributed lock network hops:
            </p>
            <pre className="text-xs font-mono bg-black/70 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-emerald-300">
{`UPDATE wallet_account
   SET balance = balance - :amount,
       version = version + 1,
       updated_at = NOW()
 WHERE user_id = :userId
   AND currency = :currency
   AND balance >= :amount; -- 0 rows = insufficient`}
            </pre>
          </div>

          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 p-6 space-y-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-emerald-400">02 · Payout Timeout State Machine</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Prevents double-payouts when upstream payment gateways time out: freeze first, never blind-retry, poll status until terminal state.
            </p>
            <pre className="text-xs font-mono bg-black/70 border border-zinc-800 rounded-lg p-4 overflow-x-auto text-zinc-300">
{`[INIT] ──(Freeze Balance)──► [FROZEN_PENDING]
                                  │
       ┌──(Gateway Timeout: Poll Only, NEVER Re-Send)──┐
       ▼                                               ▼
[CONFIRMED_SUCCESS]                           [CONFIRMED_FAILED]
  └─► Commit Deduction                          └─► Unfreeze & Refund`}
            </pre>
          </div>
        </section>

        <section className="rounded-xl bg-zinc-900/40 border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-300">Live Audit Stream (Simulated)</h2>
            <span className="text-xs font-mono text-zinc-500">Outbox + Kafka · Exactly-Once Accounting</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">TX_ID</th>
                  <th className="py-3 px-4">EVENT</th>
                  <th className="py-3 px-4">AMOUNT</th>
                  <th className="py-3 px-4">STATE</th>
                  <th className="py-3 px-4">INVARIANT GUARD</th>
                  <th className="py-3 px-4 text-right">LATENCY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {ledgerRows.map((r) => (
                  <tr key={r.tx} className="hover:bg-zinc-900/40">
                    <td className="py-3 px-4 text-zinc-300">{r.tx}</td>
                    <td className="py-3 px-4 text-zinc-400">{r.type}</td>
                    <td className="py-3 px-4 text-white font-semibold">{r.amount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {r.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">{r.guard}</td>
                    <td className="py-3 px-4 text-right text-zinc-500">{r.ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
