import type { Leitura } from "./Main/types";

interface QueryState {
  page: number;
  limit: number;
  sort: string;
}

interface TableLeiturasProps {
  leituras: Leitura[];
  rawResponse: any; // Você pode melhorar isso depois
  queryState: QueryState;
  onChangeQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
}

function formatDate(value?: string) {
  if (!value) return "--";
  return new Date(value).toLocaleString("pt-BR");
}

function totalPages(rawResponse: any, limit: number, currentLength: number) {
  if (rawResponse?.count)
    return Math.max(1, Math.ceil(rawResponse.count / limit));
  if (rawResponse?.total)
    return Math.max(1, Math.ceil(rawResponse.total / limit));
  return currentLength < limit ? 1 : 2;
}

export default function TableLeituras({
  leituras,
  rawResponse,
  queryState,
  onChangeQueryState,
}: TableLeiturasProps) {
  const pages = totalPages(rawResponse, queryState.limit, leituras.length);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Tabela de leituras
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tabela paginada e ordenável com os filtros aplicados na consulta.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {[
                "ID",
                "Data",
                "Temperatura",
                "Umidade",
                "Pressão",
                "Vento",
                "Precipitação",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left font-semibold text-slate-700"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {leituras.map((leitura) => (
              <tr key={leitura.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700">{leitura.id}</td>
                <td className="px-4 py-3 text-slate-700">
                  {formatDate(leitura.data_leitura)}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {leitura.temperatura}
                </td>
                <td className="px-4 py-3 text-slate-700">{leitura.umidade}</td>
                <td className="px-4 py-3 text-slate-700">
                  {leitura.pressao_atmosferica}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {leitura.velocidade_vento}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {leitura.precipitacao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-slate-500">
          Página {queryState.page} de {pages}
        </p>
        <div className="flex gap-3">
          <button
            disabled={queryState.page <= 1}
            onClick={() =>
              onChangeQueryState((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
          >
            Anterior
          </button>
          <button
            disabled={queryState.page >= pages}
            onClick={() =>
              onChangeQueryState((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-800"
          >
            Próxima
          </button>
        </div>
      </div>
    </section>
  );
}
