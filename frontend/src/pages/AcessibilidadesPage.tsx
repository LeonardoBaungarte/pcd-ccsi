import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { type Acessibilidade } from "../types";
import AcessibilidadeForm from "../components/AcessibilidadeForm";
import VincularAcessibilidadeForm from "../components/VincularAcessibilidadeForm";

export default function AcessibilidadesPage() {
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    setErro(null);
    setLoading(true);
    try {
      const data = await api.listarAcessibilidades();
      setAcessibilidades(data);
    } catch (e: any) {
      setErro(e.message ?? "Erro ao carregar barreiras");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="container-page space-y-6 py-8">
      <header>
        <h1 className="text-2xl font-bold">Acessibilidades</h1>
        <p className="text-gray-600">
          Crie novas acessibilidades e vincule a barreiras.
        </p>
      </header>

      <AcessibilidadeForm onCreated={carregar} />
      <VincularAcessibilidadeForm onLinked={carregar} />

      {loading ? (
        <div className="card">Carregando...</div>
      ) : erro ? (
        <div className="card text-red-600">{erro}</div>
      ) : (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">
            Acessibildiades cadastradas
          </h3>
          <ul className="divide-y">
            {acessibilidades.map((a) => (
              <li key={a.id} className="py-2 flex justify-between">
                <span>{a.descricao}</span>
                <span className="text-xs text-gray-400">#{a.id}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
