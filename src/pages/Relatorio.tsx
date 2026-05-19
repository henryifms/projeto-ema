import { useState } from "react";
import { useParams } from "react-router-dom";

import { InsightPanel } from "../components/Main/components/InsightPanel";

import { useEstacao } from "../components/Main/hooks/useEstacao";
import { useLeituras } from "../components/Main/hooks/useLeituras";

import { formatDate, formatNumber } from "../components/Main/utils/formatters";

import type { LogEntry } from "../components/Main/types";

const Relatorio = () => {
  const { id } = useParams();

  const {
    estacao,
    ultimaLeitura,
    convites,
    setConvites,
    loading,
    error,
  } = useEstacao(id);

  useLeituras(id);

  const [insightTab, setInsightTab] = useState<"logs" | "convites">(
    "logs",
  );

  const [creatingInvite, setCreatingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [requestingAccess, setRequestingAccess] = useState(false);

  const [accessRequestStatus, setAccessRequestStatus] = useState<
    string | null
  >(null);

  const logs: LogEntry[] =
    estacao && ultimaLeitura
      ? [
          {
            id: 1,
            tipo: "LEITURA",
            titulo: "Nova leitura registrada",
            descricao: `Temperatura ${formatNumber(
              ultimaLeitura.temperatura,
            )}°C às ${formatDate(ultimaLeitura.data_leitura)}`,
          },
          {
            id: 2,
            tipo: "ALERTA",
            titulo: "Análise de extremo térmico",
            descricao:
              ultimaLeitura.temperatura > 40
                ? "Temperatura acima da faixa operacional recomendada."
                : "Sem extremos críticos recentes para temperatura.",
          },
          {
            id: 3,
            tipo: "SISTEMA",
            titulo: "Sincronização concluída",
            descricao:
              "Leituras e contexto espacial carregados para a estação atual.",
          },
        ]
      : [];

  const handleCreateInvite = async (email: string) => {
    if (!id) {
      setInviteError("ID da estação não encontrado");
      return;
    }

    if (!email || !email.includes("@")) {
      setInviteError("Email inválido");
      return;
    }

    setCreatingInvite(true);
    setInviteError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Não autenticado");

      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/estacoes/${id}/convites/convidar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({}) as { erro?: string });

        throw new Error(errorData.erro || `Erro ${response.status}`);
      }

      const created = await response.json();

      setConvites((prev) => [created, ...prev]);

      alert("Convite enviado com sucesso!");
    } catch (err: any) {
      setInviteError(err.message || "Erro ao enviar convite");
    } finally {
      setCreatingInvite(false);
    }
  };

  const handleRequestAccess = async () => {
    if (!id) {
      setInviteError("ID da estação não encontrado");
      return;
    }

    setRequestingAccess(true);

    setInviteError(null);

    setAccessRequestStatus(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Não autenticado");

      const response = await fetch(
        `${import.meta.env.VITE_BACK_URL}/estacoes/${id}/convites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 409) {
          throw new Error(
            "Você já solicitou acesso a esta estação.",
          );
        }

        throw new Error(errorData.erro || `Erro ${response.status}`);
      }

      await response.json();

      setAccessRequestStatus(
        "Pedido enviado! Aguarde a aprovação do proprietário.",
      );
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setRequestingAccess(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
      </div>
    );
  }

  if (error || !estacao) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
        {error || "Estação não encontrada."}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Relatório da estação
      </h1>

      <div className="mx-auto w-full max-w-lg">
      <InsightPanel
        estacao={estacao}
        convites={convites}
        logs={logs}
        activeTab={insightTab}
        onChangeTab={setInsightTab}
        onCreateInvite={handleCreateInvite}
        onRequestAccess={handleRequestAccess}
        creatingInvite={creatingInvite}
        requestingAccess={requestingAccess}
        accessRequestStatus={accessRequestStatus}
        inviteError={inviteError}
      />
      </div>
    </div>
  );
};

export default Relatorio;
