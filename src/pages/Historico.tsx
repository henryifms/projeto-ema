import { useParams } from "react-router-dom";
import TableLeituras from "../components/TableLeituras";
import { useLeituras } from "../components/Main/hooks/useLeituras";

const Historico = () => {
  const { id } = useParams();

  const { leituras, rawResponse, queryState, setQueryState, loading } =
    useLeituras(id);

  if (loading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Histórico de Leituras</h1>

      <TableLeituras
        leituras={leituras}
        rawResponse={rawResponse}
        queryState={queryState}
        onChangeQueryState={setQueryState}
      />
    </div>
  );
};

export default Historico;
