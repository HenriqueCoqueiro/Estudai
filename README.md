# Estudaí 📚 — Controle de Estudos

Aplicativo móvel para estudantes organizarem **disciplinas, tarefas e prazos**.
Feito com **React Native + TypeScript + Expo (SDK 58)** e **Expo Router** para a navegação.

**Problema:** o estudante perde prazos de provas, trabalhos e listas porque eles ficam espalhados (anotações, grupos, e-mail).
**Público-alvo:** estudantes de graduação e ensino técnico.

## Como rodar

1. Instale o [Node.js](https://nodejs.org) (versão LTS) e o app **Expo Go** no celular.
2. Na pasta do projeto:
   ```bash
   npm install
   npx expo start
   ```
3. Leia o QR code com o Expo Go (Android) ou com a câmera (iPhone). O celular e o computador precisam estar na mesma rede Wi-Fi.
   Se a rede da faculdade bloquear, use `npx expo start --tunnel`.

> Na primeira abertura o app já vem com algumas disciplinas e tarefas de exemplo, para facilitar a demonstração.
> Para apagar tudo e voltar aos exemplos, desinstale/limpe os dados do Expo Go.

## Funcionalidades

| Tela | O que faz |
|---|---|
| **Início** | Barra de progresso (% concluído), contadores de pendentes, atrasadas, concluídas e disciplinas, e os 3 próximos prazos. |
| **Tarefas** | Lista todas as tarefas, busca por título, filtro por status (Todas / Pendentes / Atrasadas / Concluídas) e por disciplina, concluir e excluir (com confirmação). Botão **+** abre o cadastro. |
| **Disciplinas** | Cadastro de disciplina (nome, professor, cor) com validação, lista com nº de tarefas e exclusão. |
| **Nova tarefa** | Formulário (modal): título, disciplina, tipo, prazo com máscara DD/MM/AAAA e observação, com validação. |

A aba **Tarefas** mostra um selinho vermelho com a quantidade de tarefas atrasadas.
Os dados ficam salvos no celular com **AsyncStorage** (diferencial: não somem ao fechar o app).

## Estrutura de arquivos

```
src/
├── app/                      ← cada arquivo aqui é uma TELA (Expo Router)
│   ├── _layout.tsx           ← layout raiz: Provider + Stack (pilha de telas)
│   ├── nova-tarefa.tsx       ← formulário de nova tarefa (modal)
│   └── (abas)/               ← grupo das abas inferiores
│       ├── _layout.tsx       ← define as 3 abas e seus ícones
│       ├── index.tsx         ← tela Início
│       ├── tarefas.tsx       ← tela Tarefas
│       └── disciplinas.tsx   ← tela Disciplinas
├── componentes/              ← peças de interface reutilizáveis
│   ├── Botao.tsx
│   ├── CampoTexto.tsx        ← input com rótulo e mensagem de erro
│   ├── CartaoResumo.tsx
│   ├── CartaoTarefa.tsx
│   ├── Chip.tsx              ← botão de seleção/filtro
│   └── EstadoVazio.tsx
├── contexto/
│   └── EstudosContext.tsx    ← ESTADO GLOBAL: dados + funções + AsyncStorage
├── tipos/
│   └── estudos.ts            ← tipos TypeScript (Disciplina, Tarefa...)
├── tema/
│   └── cores.ts              ← paleta de cores (identidade visual)
└── utils/
    └── datas.ts              ← máscara, validação e cálculo de prazos
```

## Onde cada requisito do trabalho aparece

| Requisito | Onde está no código |
|---|---|
| Interface gráfica | `componentes/*`, `StyleSheet.create` em cada tela, `tema/cores.ts` |
| Navegação (≥ 2 telas) | `app/_layout.tsx` (Stack) e `app/(abas)/_layout.tsx` (Tabs), `router.push('/nova-tarefa')`, `router.back()` |
| Entrada de dados | `TextInput` em `CampoTexto.tsx`; seleções com `Chip` e bolinhas de cor |
| Interatividade | `onPress` dos botões, chips, círculo de concluir, lixeira e botão **+** |
| Processamento | `filter` / `sort` / contagens em `index.tsx` e `tarefas.tsx`; `diasAte()` e `descreverPrazo()` em `utils/datas.ts` |
| Validação | `validar()` em `nova-tarefa.tsx` e `salvar()` em `disciplinas.tsx` (campos obrigatórios, tamanho mínimo, data real, prazo no passado, nome duplicado) |
| Identidade visual | Nome **Estudaí**, cor roxa principal, ícones nas abas |
| Diferencial | Persistência com AsyncStorage (`EstudosContext.tsx`) |

## Conceitos importantes para a apresentação

- **`useState`**: guarda valores que mudam (texto digitado, filtro escolhido, listas). Quando muda, a tela é redesenhada.
- **`useEffect`**: executa código em momentos específicos. Aqui: carregar os dados ao abrir o app (`[]`) e salvar sempre que `disciplinas` ou `tarefas` mudam.
- **Context (`createContext` + `useContext`)**: compartilha os dados entre todas as telas sem passar props de uma para outra.
- **Imutabilidade**: nunca usamos `push` nas listas. Criamos uma lista nova (`[...lista, novo]`, `filter`, `map`), porque o React só percebe a mudança quando recebe uma referência nova.
- **Props**: dados que um componente pai passa para um filho (ex.: `<Botao titulo="Salvar" onPress={salvar} />`).
- **Renderização condicional**: `{erro ? <Text>{erro}</Text> : null}` mostra a mensagem só quando há erro.
- **`FlatList`**: lista otimizada que só desenha os itens visíveis na tela.

## Dificuldade real encontrada (bom exemplo para o relatório)

`new Date("2026-11-20")` interpreta a data em **UTC**. No Brasil (UTC-3), isso vira **19/11 às 21h**, e o prazo aparecia com um dia a menos.
**Solução:** montar a data com `new Date(ano, mes - 1, dia)`, que usa o fuso local (ver `utils/datas.ts`).

## Comandos úteis

```bash
npx expo start          # roda o app
npx tsc --noEmit        # verifica erros de TypeScript
```

## Gerar o APK (instalar no Android sem o Expo Go)

```bash
npm install
npx eas-cli@latest login                      # entra na conta grátis do expo.dev
npx eas-cli@latest build -p android --profile apk
```

Responda **Y** (sim) às perguntas. Ao terminar (10–20 min), abra no celular o link que aparecer e instale o `.apk`.
