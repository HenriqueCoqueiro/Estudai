// Tipos (formatos) dos dados usados no aplicativo.
// O TypeScript usa essas definições para avisar, ainda no editor,
// quando tentamos usar um campo que não existe ou com o tipo errado.

export type Disciplina = {
  id: string;
  nome: string;
  professor: string; // pode ficar vazio ("")
  cor: string; // cor em hexadecimal, ex.: "#4F46E5"
};

// Union type: o tipo da tarefa só pode ser um destes quatro textos.
export type TipoTarefa = 'Prova' | 'Trabalho' | 'Exercício' | 'Leitura';

export const TIPOS_TAREFA: TipoTarefa[] = ['Prova', 'Trabalho', 'Exercício', 'Leitura'];

export type Tarefa = {
  id: string;
  titulo: string;
  disciplinaId: string; // liga a tarefa a uma Disciplina pelo id
  tipo: TipoTarefa;
  prazo: string; // data no formato ISO "AAAA-MM-DD"
  observacao: string;
  concluida: boolean;
};

// Dados que o formulário envia para criar uma tarefa.
// Omit remove os campos que o próprio app gera (id e concluida).
export type NovaTarefa = Omit<Tarefa, 'id' | 'concluida'>;

export type FiltroStatus = 'Todas' | 'Pendentes' | 'Atrasadas' | 'Concluídas';
