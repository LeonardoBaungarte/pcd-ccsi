import type {
  SubtipoDeficiencia,
  TipoComSubtipos,
  TipoDeficiencia,
} from "../types";
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let msg = text || res.statusText || "Erro na requisição";
    try {
      const j = JSON.parse(text);
      msg = j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}
export const api = {
  listarTipos() {
    console.log(http<TipoDeficiencia[]>("/tipos"));
    return http<TipoDeficiencia[]>("/tipos");
  },
  criarTipo(nome: string) {
    return http<TipoDeficiencia>("/tipos", {
      method: "POST",
      body: JSON.stringify({ nome }),
    });
  },

  listarTiposComSubtipos(): Promise<TipoComSubtipos[]> {
    return http("/tipos/com-subtipos");
  },

  criarSubtipo(nome: string, tipoId: number): Promise<SubtipoDeficiencia> {
    return http("/subtipos", {
      method: "POST",
      body: JSON.stringify({ nome, tipoId }),
    });
  },

  // --- Barreiras ---
  listarBarreiras(): Promise<import("../types").Barreira[]> {
    return http("/barreiras");
  },
  criarBarreira(descricao: string): Promise<import("../types").Barreira> {
    return http("/barreiras", {
      method: "POST",
      body: JSON.stringify({ descricao }),
    });
  },
  listarSubtipos(): Promise<SubtipoDeficiencia[]> {
    return http("/subtipos");
  },
  vincularBarreirasASubtipo(subtipoId: number, barreiraIds: number[]) {
    return http(`/vinculos/subtipos/${subtipoId}/barreiras`, {
      method: "POST",
      body: JSON.stringify({ barreiraIds }),
    });
  },

  // --- Acessibilidades ---
  listarAcessibilidades(): Promise<import("../types").Acessibilidade[]> {
    return http("/acessibilidades");
  },
  criarAcessibilidade(
    descricao: string
  ): Promise<import("../types").Acessibilidade> {
    return http("/acessibilidades", {
      method: "POST",
      body: JSON.stringify({ descricao }),
    });
  },

  // --- Vínculos: Acessibilidade <-> Barreira ---
  vincularAcessibilidadesABarreira(
    barreiraId: number,
    acessibilidadeIds: number[]
  ): Promise<{ ok: true }> {
    return http(`/vinculos/barreiras/${barreiraId}/acessibilidades`, {
      method: "POST",
      body: JSON.stringify({ acessibilidadeIds }),
    });
  },
};
