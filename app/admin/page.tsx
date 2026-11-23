"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SourceBadge, VerificationBadge } from "@/components/ui/badge";
import { PillTabs } from "@/components/ui/pill-tabs";
import {
  ShieldCheck,
  Check,
  AlertTriangle,
  Clock,
  ExternalLink,
  Users,
  FileCheck2,
  Database,
  History,
  CheckCircle2,
} from "lucide-react";
import { INITIAL_OPPORTUNITIES, OUTCOMES_STORE, Opportunity, GrowthOutcome } from "@/lib/data/mock-db";

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<string>("catalogue");
  const [catalogue, setCatalogue] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [outcomesQueue, setOutcomesQueue] = useState<GrowthOutcome[]>(OUTCOMES_STORE);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const res = await fetch("/api/admin/users");
        const json = await res.json();
        if (json.success && json.data.audit_logs) {
          setAuditLogs(json.data.audit_logs);
        }
      } catch {
        // Handled
      }
    }
    loadAdminData();
  }, []);

  const handleVerifyOutcome = async (outcomeId: string) => {
    setOutcomesQueue((prev) =>
      prev.map((o) => (o.id === outcomeId ? { ...o, verification: "verified" } : o))
    );
    try {
      await fetch("/api/admin/verification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome_id: outcomeId, verification: "verified" }),
      });
    } catch {
      // Handled
    }
  };

  const handleToggleStale = (oppId: string) => {
    setCatalogue((prev) =>
      prev.map((o) => {
        if (o.id !== oppId) return o;
        const nextStatus = o.source_status === "stale" ? "sourced" : "stale";
        return { ...o, source_status: nextStatus, last_checked_at: new Date().toISOString() };
      })
    );
  };

  const tabs = [
    { id: "catalogue", label: "Catalogue & Freshness", count: catalogue.length },
    { id: "verification", label: "Verification Review Queue", count: outcomesQueue.filter((o) => o.verification !== "verified").length },
    { id: "audit", label: "Audit Log & Roles" },
  ];

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1E22] text-white text-caption font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D3E57A]" />
          ADMINISTRATION CONSOLE
        </div>
        <h1 className="text-display font-light tracking-tight text-[#1E1E22] dark:text-white leading-tight">
          Catalogue & <span className="font-normal">Verification</span>
        </h1>
        <p className="text-small text-[#6B7280] dark:text-gray-400 mt-1">
          Monitor source freshness, review student achievement evidence, and inspect audit logs.
        </p>
      </div>

      {/* Admin Tabs */}
      <PillTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: CATALOGUE MANAGEMENT */}
      {activeTab === "catalogue" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-small font-bold text-gray-500">
              Active Opportunities Catalogue ({catalogue.length} entries)
            </span>
            <span className="text-caption text-gray-400">
              Auto-expiry active
            </span>
          </div>

          {/* DESKTOP TABLE (>=1024px) */}
          <div className="hidden lg:block overflow-hidden rounded-[28px] glass-surface border border-white/60 dark:border-white/10">
            <table className="w-full text-left text-small">
              <thead className="bg-black/5 dark:bg-white/5 text-caption font-bold text-gray-500 uppercase">
                <tr>
                  <th className="p-4 pl-6">Title & Organizer</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status & Freshness</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Last Checked</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {catalogue.map((opp) => {
                  const isExpired = new Date(opp.deadline).getTime() < Date.now();
                  return (
                    <tr key={opp.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-[#1E1E22] dark:text-white">
                          {opp.title}
                        </div>
                        <div className="text-caption text-gray-500">
                          {opp.organizer}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-600 dark:text-gray-300">
                        {opp.type}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <SourceBadge status={opp.source_status} />
                          {isExpired && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E0605E]/20 text-[#E0605E]">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-[13px]">
                        {new Date(opp.deadline).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-400 text-caption font-mono">
                        {new Date(opp.last_checked_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          label={opp.source_status === "stale" ? "Mark Sourced" : "Flag Stale"}
                          onClick={() => handleToggleStale(opp.id)}
                          className="text-[11px] h-8"
                        >
                          {opp.source_status === "stale" ? "Mark Sourced" : "Flag Stale"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS (<1024px) */}
          <div className="lg:hidden flex flex-col gap-3">
            {catalogue.map((opp) => (
              <Card key={opp.id} variant="glass" className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <SourceBadge status={opp.source_status} />
                  <span className="text-caption font-bold text-gray-500">{opp.type}</span>
                </div>
                <div>
                  <h4 className="text-body font-bold text-[#1E1E22] dark:text-white">
                    {opp.title}
                  </h4>
                  <span className="text-caption text-gray-500">by {opp.organizer}</span>
                </div>
                <div className="flex items-center justify-between text-caption text-gray-500 border-t border-black/5 dark:border-white/5 pt-2">
                  <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    label={opp.source_status === "stale" ? "Mark Sourced" : "Flag Stale"}
                    onClick={() => handleToggleStale(opp.id)}
                  >
                    {opp.source_status === "stale" ? "Mark Sourced" : "Flag Stale"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: VERIFICATION REVIEW QUEUE */}
      {activeTab === "verification" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-small font-bold text-gray-500">
              Student Growth Outcomes Pending Official Verification
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {outcomesQueue.map((item) => (
              <Card key={item.id} variant="glass" className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <VerificationBadge state={item.verification} />
                    <span className="text-caption font-semibold text-gray-500">
                      Role: {item.participation}
                    </span>
                  </div>

                  <h3 className="text-h3 font-bold text-[#1E1E22] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-small text-gray-500 italic max-w-xl">
                    &ldquo;{item.reflection}&rdquo;
                  </p>

                  {item.evidence_url && (
                    <a
                      href={item.evidence_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-small text-[#2F6BFF] hover:underline font-semibold inline-flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Attached Proof ({item.evidence_url})
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  {item.verification === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 text-caption font-bold text-[#5BAE75] px-3 py-1.5 rounded-full bg-[#5BAE75]/15">
                      <CheckCircle2 className="w-4 h-4" />
                      Approved
                    </span>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      label="Approve & Verify"
                      onClick={() => handleVerifyOutcome(item.id)}
                      className="gap-1.5 bg-[#D3E57A] text-[#1E1E22] hover:bg-[#C5DA62]"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Approve & Verify
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG & ROLES */}
      {activeTab === "audit" && (
        <Card className="flex flex-col gap-5 p-6 sm:p-8">
          <div>
            <h3 className="text-h2 font-semibold tracking-tight text-[#1E1E22] dark:text-white">
              System Audit Trail
            </h3>
            <p className="text-small text-gray-500 mt-0.5">
              Immutable activity log recording ingestion, verification, and freshness operations.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-small text-[#1E1E22] dark:text-white">
                    {log.action} · <span className="font-normal text-gray-500">{log.details}</span>
                  </span>
                  <span className="text-caption text-gray-400">
                    Actor: {log.actor} (Target: {log.target})
                  </span>
                </div>
                <span className="text-caption font-mono text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
