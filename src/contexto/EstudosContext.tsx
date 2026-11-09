// Contexto global do app: guarda as disciplinas e as tarefas em um só lugar
// e disponibiliza para todas as telas, sem precisar passar props de tela em tela.
//
// Fluxo: <EstudosProvider> envolve o app (em src/app/_layout.tsx) e qualquer
// tela chama useEstudos() para ler os dados ou executar as funções.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { coresDisciplinas } from '../tema/cores';
import { Disciplina, NovaTarefa, Tarefa } from '../tipos/estudos';
import { diasAte, hojeMaisDias } from '../utils/datas';

// Chave usada para salvar os dados no armazenamento do celular.
const CHAVE_ARMAZENAMENTO = '@estudai:dados';

// Tudo o que o contexto oferece para as telas.
type EstudosContextoTipo = {
  disciplinas: Disciplina[];
  tarefas: Tarefa[];
  carregando: boolean;
  adicionarDisciplina: (nome: string, professor: string, cor: string) => void;
  removerDisciplina: (id: string) => void;
  adicionarTarefa: (dados: NovaTarefa) => void;
  alternarConclusao: (id: string) => void;
  removerTarefa: (id: string) => void;
  buscarDisciplina: (id: string) => Disciplina | undefined;
};

const EstudosContexto = createContext<EstudosContextoTipo | undefined>(undefined);

/** Gera um id único simples a partir da data/hora + um número aleatório. */
function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Dados de exemplo mostrados na primeira vez que o app é aberto. */
function criarDadosIniciais(): { disciplinas: Disciplina[]; tarefas: Tarefa[] } {
  const disciplinas: Disciplina[] = [
    { id: 'd1', nome: 'Programação Mobile', professor: 'Profa. Ana', cor: coresDisciplinas[0] },
    { id: 'd2', nome: 'Cálculo II', professor: 'Prof. Carlos', cor: coresDisciplinas[3] },
    { id: 'd3', nome: 'Circuitos Digitais', professor: '', cor: coresDisciplinas[2] },
  ];
  const tarefas: Tarefa[] = [
    {
      id: 't1', titulo: 'Entregar app em React Native', disciplinaId: 'd1', tipo: 'Trabalho',
      prazo: hojeMaisDias(10), observacao: 'Relatório em PDF + apresentação', concluida: false,
    },
    {
      id: 't2', titulo: 'Lista de integrais', disciplinaId: 'd2', tipo: 'Exercício',
      prazo: hojeMaisDias(-1), observacao: '', concluida: false,
    },
    {
      id: 't3', titulo: 'Prova 2', disciplinaId: 'd2', tipo: 'Prova',
      prazo: hojeMaisDias(4), observacao: 'Capítulos 5 a 7', concluida: false,
    },
    {
      id: 't4', titulo: 'Ler capítulo de flip-flops', disciplinaId: 'd3', tipo: 'Leitura',
      prazo: hojeMaisDias(-3), observacao: '', concluida: true,
    },
  ];
  return { disciplinas, tarefas };
}

export function EstudosProvider({ children }: { children: ReactNode }) {
  // ---------- Estados ----------
  // useState guarda um valor e, quando ele muda, a tela é redesenhada.
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);

  // ---------- Carregar dados ao abrir o app ----------
  // useEffect com [] roda uma única vez, quando o componente aparece.
  useEffect(() => {
    async function carregar() {
      try {
        const json = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
        const dados = json ? JSON.parse(json) : criarDadosIniciais();
        setDisciplinas(dados.disciplinas);
        setTarefas(dados.tarefas);
      } catch (erro) {
        console.warn('Erro ao carregar os dados:', erro);
        const dados = criarDadosIniciais();
        setDisciplinas(dados.disciplinas);
        setTarefas(dados.tarefas);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // ---------- Salvar sempre que os dados mudarem ----------
  // Este useEffect roda toda vez que "disciplinas" ou "tarefas" mudam.
  useEffect(() => {
    if (carregando) return; // não salva antes de terminar de carregar
    AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify({ disciplinas, tarefas })).catch(
      (erro) => console.warn('Erro ao salvar os dados:', erro),
    );
  }, [disciplinas, tarefas, carregando]);

  // ---------- Funções que alteram os dados ----------
  // Nunca alteramos o array diretamente (ex.: push). Criamos um array NOVO,
  // porque o React só percebe a mudança quando recebe uma referência nova.

  function adicionarDisciplina(nome: string, professor: string, cor: string) {
    const nova: Disciplina = { id: gerarId(), nome: nome.trim(), professor: professor.trim(), cor };
    setDisciplinas((anteriores) => [...anteriores, nova]);
  }

  function removerDisciplina(id: string) {
    setDisciplinas((anteriores) => anteriores.filter((d) => d.id !== id));
    // Também apaga as tarefas daquela disciplina, para não ficarem "órfãs".
    setTarefas((anteriores) => anteriores.filter((t) => t.disciplinaId !== id));
  }

  function adicionarTarefa(dados: NovaTarefa) {
    const nova: Tarefa = {
      ...dados,
      id: gerarId(),
      titulo: dados.titulo.trim(),
      observacao: dados.observacao.trim(),
      concluida: false,
    };
    setTarefas((anteriores) => [...anteriores, nova]);
  }

  function alternarConclusao(id: string) {
    setTarefas((anteriores) =>
      anteriores.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t)),
    );
  }

  function removerTarefa(id: string) {
    setTarefas((anteriores) => anteriores.filter((t) => t.id !== id));
  }

  function buscarDisciplina(id: string) {
    return disciplinas.find((d) => d.id === id);
  }

  return (
    <EstudosContexto.Provider
      value={{
        disciplinas,
        tarefas,
        carregando,
        adicionarDisciplina,
        removerDisciplina,
        adicionarTarefa,
        alternarConclusao,
        removerTarefa,
        buscarDisciplina,
      }}
    >
      {children}
    </EstudosContexto.Provider>
  );
}

/** Hook para as telas acessarem o contexto. */
export function useEstudos() {
  const contexto = useContext(EstudosContexto);
  if (!contexto) {
    throw new Error('useEstudos precisa ser usado dentro de <EstudosProvider>');
  }
  return contexto;
}

/** Uma tarefa está atrasada se não foi concluída e o prazo já passou. */
export function estaAtrasada(tarefa: Tarefa): boolean {
  return !tarefa.concluida && diasAte(tarefa.prazo) < 0;
}
