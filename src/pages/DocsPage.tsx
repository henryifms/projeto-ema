import { useEffect, useState } from "react";

/* =========================
   TIPOS SWAGGER (parciais)
========================= */

type SwaggerSchema = {
  type?: string;
  properties?: Record<string, unknown>;
  example?: unknown;
};

type SwaggerRequestBody = {
  content?: {
    "application/json"?: {
      schema?: SwaggerSchema;
    };
  };
};

type SwaggerEndpointDetails = {
  summary?: string;
  requestBody?: SwaggerRequestBody;
};

type SwaggerPaths = Record<string, Record<string, SwaggerEndpointDetails>>;

type Endpoint = {
  method: string;
  path: string;
  description: string;
  hasBody: boolean;
  exampleBody?: unknown;
};

type EndpointCardProps = {
  method: string;
  path: string;
  description: string;
  example?: unknown;
};

const EndpointCard = ({
  method,
  path,
  description,
  example,
}: EndpointCardProps) => {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);

    try {
      const finalPath = path.replace(/{[^}]+}/g, (param) => {
        if (param.toLowerCase().includes("id")) return "1";
        if (param.toLowerCase().includes("token")) return "abc123";
        return "1";
      });

      if (method !== "GET" && !example) {
        alert("Esse endpoint precisa de body!");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_BACK_URL}${finalPath}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          method !== "GET"
            ? JSON.stringify(
                example && typeof example === "object" ? example : {},
              )
            : undefined,
      });

      const data = await res.json();

      setResponse(`Status: ${res.status}\n\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      if (err instanceof Error) {
        setResponse(`Erro: ${err.message}`);
      } else {
        setResponse("Erro desconhecido");
      }
    }

    setLoading(false);
  };

  return (
    <div className="border rounded-2xl p-5 shadow-md bg-white">
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-lg text-sm font-bold text-white ${
            method === "GET"
              ? "bg-green-500"
              : method === "POST"
                ? "bg-blue-500"
                : method === "DELETE"
                  ? "bg-red-500"
                  : "bg-gray-500"
          }`}
        >
          {method}
        </span>

        <code className="text-lg font-mono">{path}</code>
      </div>

      <p className="mt-3 text-gray-600">{description}</p>

      {example !== undefined && (
        <pre className="bg-gray-100 p-3 mt-4 rounded-lg text-sm overflow-x-auto">
          {JSON.stringify(example, null, 2)}
        </pre>
      )}

      <button
        onClick={handleTest}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Carregando..." : "Testar endpoint"}
      </button>

      {response && (
        <pre className="bg-black text-green-400 p-3 mt-4 rounded-lg text-sm overflow-x-auto">
          {response}
        </pre>
      )}
    </div>
  );
};

export default function DocsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACK_URL}/docs.json`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const parsed: Endpoint[] = [];
        const paths = data.paths as SwaggerPaths;

        Object.entries(paths).forEach(([path, methods]) => {
          Object.entries(methods).forEach(([method, details]) => {
            const schema =
              details.requestBody?.content?.["application/json"]?.schema;

            parsed.push({
              method: method.toUpperCase(),
              path,
              description: details.summary || "Sem descrição",
              hasBody: !!schema,
              exampleBody: schema?.example || schema?.properties || {},
            });
          });
        });

        setEndpoints(parsed);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <h1 className="text-3xl font-bold">Documentação da API</h1>

        <section>
          <h2 className="text-2xl font-semibold">Sobre o projeto</h2>
          <p className="text-gray-600 mt-2">
            Este sistema exibe estações meteorológicas em um mapa interativo,
            consumindo dados de uma API própria.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Como funciona</h2>
          <p className="text-gray-600 mt-2">
            O frontend faz requisições HTTP para a API, obtendo dados das
            estações e renderizando no mapa usando Leaflet.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Endpoints</h2>

          {endpoints.map((ep, index) => (
            <EndpointCard
              key={index}
              method={ep.method}
              path={ep.path}
              description={ep.description}
              example={ep.exampleBody}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
