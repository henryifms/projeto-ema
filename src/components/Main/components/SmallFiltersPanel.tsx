import type { SmallFiltersPanelProps } from "../types";

export function SmallFiltersPanel({
  filters,
  queryState,
  onChangeFilters,
  onChangeQueryState,
  onReset,
}: SmallFiltersPanelProps) {
  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md min-h-[700px]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Filtros da estação atual
          </p>
        </div>
        <button
          onClick={onReset}
          className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Limpar
        </button>
      </div>

      <div className="space-y-3">
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

        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            type="number"
            placeholder="Temp min"
            value={filters.temperatura_min}
            onChange={(e) =>
              onChangeFilters((prev) => ({
                ...prev,
                temperatura_min: e.target.value,
              }))
            }
          />
          <input
            className={inputClass}
            type="number"
            placeholder="Temp max"
            value={filters.temperatura_max}
            onChange={(e) =>
              onChangeFilters((prev) => ({
                ...prev,
                temperatura_max: e.target.value,
              }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            type="number"
            placeholder="Umidade min"
            value={filters.umidade_min}
            onChange={(e) =>
              onChangeFilters((prev) => ({
                ...prev,
                umidade_min: e.target.value,
              }))
            }
          />
          <input
            className={inputClass}
            type="number"
            placeholder="Umidade max"
            value={filters.umidade_max}
            onChange={(e) =>
              onChangeFilters((prev) => ({
                ...prev,
                umidade_max: e.target.value,
              }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            type="number"
            placeholder="Precipitação min"
            value={filters.precipitacao_min}
            onChange={(e) =>
              onChangeFilters((prev) => ({
                ...prev,
                precipitacao_min: e.target.value,
              }))
            }
          />
          <input
            className={inputClass}
            type="number"
            placeholder="Precipitação max"
            value={filters.precipitacao_max}
            onChange={(e) =>
              onChangeFilters((prev) => ({
                ...prev,
                precipitacao_max: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </section>
  );
}
