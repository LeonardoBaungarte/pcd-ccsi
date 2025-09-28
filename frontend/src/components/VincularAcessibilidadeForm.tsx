import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Acessibilidade, Barreira } from "../types";

type Props = { onLinked: () => void };

export default function VincularAcessibilidadeForm({ onLinked }: Props) {    
  const [barreiras, setBarreiras] = useState<Barreira[]>([]);
  const [acessibilidades, setAcessibilidades] = useState<Acessibilidade[]>([]);
  const [barreiraId, setBarreiraId] = useState<number | "">("");
  const [acessibilidadeIds, setAcessibilidadeIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.listarBarreiras(), api.listarAcessibilidades()])
      .then(([bars, acess]) => {
        setBarreiras(bars);
        setAcessibilidades(acess);
      })
      .catch((e) => setErro(e.message));
  }, []);

  function toggleAcessibilidade(id: number) {
    setAcessibilidadeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!barreiraId || acessibilidadeIds.length === 0) {
      setErro("Selecione uma barreira e ao menos uma acessibilidade.");
      return;
    }

    setLoading(true);
    try {
      await api.vincularAcessibilidadesABarreira(Number(barreiraId), acessibilidadeIds);
      setAcessibilidadeIds([]);
      setBarreiraId("");
      onLinked();
    } catch (e: any) {
      setErro(e.message ?? "Erro ao vincular acessibilidades");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3">
      <div>
        <label className="label">Barreira</label>
        <select
          className="input"
          value={barreiraId}
          onChange={(e) =>
            setBarreiraId(e.target.value ? Number(e.target.value) : "")
          }
          disabled={loading}
        >
          <option value="">Selecione...</option>
          {barreiras.map((b) => (
            <option key={b.id} value={b.id}>
              {b.descricao}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Acessibilidades</label>
        <div className="space-y-2">
          {acessibilidades.map((a) => (
            <label key={a.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={acessibilidadeIds.includes(a.id)}
                onChange={() => toggleAcessibilidade(a.id)}
                disabled={loading}
              />
              {a.descricao}
            </label>
          ))}
        </div>
      </div>

      {erro && <p className="error">{erro}</p>}

      <div className="flex justify-end">
        <button disabled={loading} className="btn btn-primary">
          {loading ? "Salvando..." : "Vincular acessibilidades"}
        </button>
      </div>
    </form>
  );
}
