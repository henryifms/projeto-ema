export interface LeiturasFilters {
  criadaDepois: string;
  criadaAntes: string;
  temperatura_min: string;
  temperatura_max: string;
  umidade_min: string;
  umidade_max: string;
  pressao_atmosferica_min: string;
  pressao_atmosferica_max: string;
  velocidade_vento_min: string;
  velocidade_vento_max: string;
  precipitacao_min: string;
  precipitacao_max: string;
}

interface QueryState {
  page: number;
  limit: number;
  sort: string;
}

interface FiltersPanelProps {
  filters: LeiturasFilters;
  queryState: QueryState;
  onChangeFilters: React.Dispatch<React.SetStateAction<LeiturasFilters>>;
  onChangeQueryState: React.Dispatch<React.SetStateAction<QueryState>>;
  onReset: () => void;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

function NumberRange({
  label,
  minKey,
  maxKey,
  filters,
  onChange,
}: {
  label: string;
  minKey: keyof LeiturasFilters;
  maxKey: keyof LeiturasFilters;
  filters: LeiturasFilters;
  onChange: React.Dispatch<React.SetStateAction<LeiturasFilters>>;
}) {
  return (
    <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <input
          className={inputClass}
          type="number"
          placeholder="Min"
          value={filters[minKey]}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, [minKey]: e.target.value }))
          }
        />
        <input
          className={inputClass}
          type="number"
          placeholder="Max"
          value={filters[maxKey]}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, [maxKey]: e.target.value }))
          }
        />
      </div>
    </div>
  );
}

export default function FiltersPanel({
  filters,
  queryState,
  onChangeFilters,
  onChangeQueryState,
  onReset,
}: FiltersPanelProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Filtros avançados
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Os controles abaixo refletem diretamente os parâmetros de GET
            /estacoes/:id/leituras.
          </p>
        </div>
        <button
          onClick={onReset}
          className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Limpar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Intervalo de datas
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              className={inputClass}
              type="datetime-local"
              value={filters.criadaDepois}
              onChange={(e) =>
                onChangeFilters((prev) => ({
                  ...prev,
                  criadaDepois: e.target.value,
                }))
              }
            />
            <input
              className={inputClass}
              type="datetime-local"
              value={filters.criadaAntes}
              onChange={(e) =>
                onChangeFilters((prev) => ({
                  ...prev,
                  criadaAntes: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            Ordenação e paginação
          </p>
          <div className="grid grid-cols-2 gap-3">
            <select
              className={inputClass}
              value={queryState.sort}
              onChange={(e) =>
                onChangeQueryState((prev) => ({
                  ...prev,
                  sort: e.target.value,
                  page: 1,
                }))
              }
            >
              <option value="data_leitura:desc">Mais recentes</option>
              <option value="data_leitura:asc">Mais antigas</option>
              <option value="temperatura:desc">Temperatura desc</option>
              <option value="temperatura:asc">Temperatura asc</option>
              <option value="umidade:desc">Umidade desc</option>
              <option value="umidade:asc">Umidade asc</option>
            </select>
            <select
              className={inputClass}
              value={queryState.limit}
              onChange={(e) =>
                onChangeQueryState((prev) => ({
                  ...prev,
                  limit: Number(e.target.value),
                  page: 1,
                }))
              }
            >
              <option value={10}>10 linhas</option>
              <option value={20}>20 linhas</option>
              <option value={50}>50 linhas</option>
            </select>
          </div>
        </div>

        <NumberRange
          label="Temperatura"
          minKey="temperatura_min"
          maxKey="temperatura_max"
          filters={filters}
          onChange={onChangeFilters}
        />
        <NumberRange
          label="Umidade"
          minKey="umidade_min"
          maxKey="umidade_max"
          filters={filters}
          onChange={onChangeFilters}
        />
        <NumberRange
          label="Pressão atmosférica"
          minKey="pressao_atmosferica_min"
          maxKey="pressao_atmosferica_max"
          filters={filters}
          onChange={onChangeFilters}
        />
        <NumberRange
          label="Velocidade do vento"
          minKey="velocidade_vento_min"
          maxKey="velocidade_vento_max"
          filters={filters}
          onChange={onChangeFilters}
        />
        <NumberRange
          label="Precipitação"
          minKey="precipitacao_min"
          maxKey="precipitacao_max"
          filters={filters}
          onChange={onChangeFilters}
        />
      </div>
    </section>
  );
}
