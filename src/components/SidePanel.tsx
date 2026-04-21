import { useState } from "react";

interface SidePanelProps {
  estacao: any;
  convites: any[];
  logs: any[];
  onCreateInvite: (email: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function formatDate(value?: string) {
  if (!value) return "--";
  return new Date(value).toLocaleString("pt-BR");
}

export default function SidePanel({
  estacao,
  convites,
  logs,
  onCreateInvite,
  onEdit,
  onDelete,
}: SidePanelProps) {
  const [inviteEmail, setInviteEmail] = useState("");

  return (
    <aside className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Informações da estação
        </h2>
        <div className="mt-5 space-y-4 text-sm">
          <div>
            <p className="text-slate-400">Status</p>
            <p className="mt-1 font-semibold text-slate-900">
              {estacao.status}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Endereço</p>
            <p className="mt-1 font-medium text-slate-700">
              {estacao.endereco}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Proprietário</p>
            <p className="mt-1 font-medium text-slate-700">
              {estacao.proprietario?.nome || "--"}
            </p>
            <p className="text-slate-500">
              {estacao.proprietario?.email || "--"}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Equipe</p>
            <div className="mt-2 space-y-2">
              {(estacao.equipe || []).map((member: any) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="font-semibold text-slate-900">{member.nome}</p>
                  <p className="text-slate-500">{member.email}</p>
                  <span className="mt-2 inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {member.usuarios_estacoes?.papel || "MEMBRO"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Convites</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {convites.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="email@instituicao.edu.br"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-teal-500 focus:bg-white"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (!inviteEmail.trim()) return;
                onCreateInvite(inviteEmail.trim());
                setInviteEmail("");
              }}
              className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Convidar usuário
            </button>
            <button
              onClick={() => {
                if (!inviteEmail.trim()) return;
                onCreateInvite(inviteEmail.trim());
                setInviteEmail("");
              }}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Solicitar acesso
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {convites.length ? (
            convites.map((invite, index) => (
              <div
                key={invite.id || invite.token || index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {invite.email || invite.nome || "Convite"}
                    </p>
                    <p className="text-slate-500">
                      {formatDate(invite.criado_em)}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {invite.status || "PENDENTE"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
                    Aceitar
                  </button>
                  <button className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white">
                    Rejeitar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              Nenhum convite retornado pela API.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Ações</h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={onEdit}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Editar estação
          </button>
          <button
            onClick={onDelete}
            className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Deletar estação
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Logs e eventos</h2>
        <div className="mt-4 space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">
                  {log.titulo}
                </p>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {log.tipo}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{log.descricao}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
