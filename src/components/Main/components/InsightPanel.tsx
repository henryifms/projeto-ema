import { useState } from "react";
import type { InsightPanelProps, LogEntry, Convite } from "../types";
import { statusMap } from "../utils/constants";
import { formatDate } from "../utils/formatters";

export function InsightPanel({
  estacao,
  convites,
  logs,
  activeTab,
  onChangeTab,
  onCreateInvite,
  onRequestAccess,
  creatingInvite,
  inviteError,
  requestingAccess,
  accessRequestStatus,
}: InsightPanelProps) {
  const [inviteEmail, setInviteEmail] = useState("");

  const tabClass = (tab: string) =>
    `rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
      activeTab === tab
        ? "bg-green-600 text-white shadow-sm"
        : "bg-green-50 text-green-700 hover:bg-green-100"
    }`;

  const statusStyles: Record<string, string> = {
    PENDENTE: "bg-yellow-100 text-yellow-700",
    ACEITO: "bg-green-100 text-green-700",
    REJEITADO: "bg-red-100 text-red-700",
  };

  const isOwner =
    estacao.usuario_proprietario_id ===
    (window as { __CURRENT_USER_ID__?: number }).__CURRENT_USER_ID__;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="mt-1 text-xl font-bold text-gray-900">
            Contexto da estação
          </h2>
        </div>
        <div
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${statusMap[estacao.status]}`}
        >
          {estacao.status}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onChangeTab("logs")}
          className={tabClass("logs")}
        >
          Logs
        </button>
        <button
          onClick={() => onChangeTab("convites")}
          className={tabClass("convites")}
        >
          Convites
        </button>
      </div>

      {activeTab === "logs" ? (
        <div className="space-y-3">
          {logs.length ? (
            logs.map((log: LogEntry) => (
              <article
                key={log.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {log.titulo}
                  </p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                    {log.tipo}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {log.descricao}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
              Sem logs para esta estação.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {isOwner ? (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Convidar usuário
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  autoComplete="off"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@instituicao.edu.br"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 text-gray-800"
                  disabled={creatingInvite}
                />
                <button
                  onClick={() => {
                    if (!inviteEmail.trim() || creatingInvite) return;
                    onCreateInvite(inviteEmail.trim());
                    setInviteEmail("");
                  }}
                  disabled={creatingInvite}
                  className="rounded-xl bg-green-600 px-4 py-2 text-white font-semibold transition hover:bg-green-700 disabled:opacity-50"
                >
                  {creatingInvite ? "Enviando..." : "Enviar convite"}
                </button>
                {inviteError && (
                  <p className="text-xs text-red-500">{inviteError}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="mb-3 text-sm font-semibold text-gray-900">
                Solicitar acesso
              </p>
              <button
                onClick={onRequestAccess}
                disabled={requestingAccess}
                className="rounded-xl bg-green-600 px-4 py-2 text-white font-semibold transition hover:bg-green-700 disabled:opacity-50"
              >
                {requestingAccess ? "Enviando..." : "Pedir acesso à estação"}
              </button>
              {accessRequestStatus && (
                <p className="mt-2 text-xs text-green-600">
                  {accessRequestStatus}
                </p>
              )}
              {inviteError && (
                <p className="mt-2 text-xs text-red-500">{inviteError}</p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {convites.length ? (
              convites.map((invite: Convite, index: number) => (
                <article
                  key={invite.id || invite.token || index}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {invite.email || invite.nome || "Convite"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(invite.criado_em)}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        statusStyles[
                          (invite.status || "PENDENTE").toUpperCase()
                        ]
                      }`}
                    >
                      {invite.status || "PENDENTE"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
                Nenhum convite encontrado para esta estação.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
