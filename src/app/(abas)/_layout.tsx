// Layout das abas inferiores: Início, Tarefas e Disciplinas.
// Cada <Tabs.Screen name="..."> corresponde a um arquivo desta pasta.

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';

import { estaAtrasada, useEstudos } from '../../contexto/EstudosContext';
import { cores } from '../../tema/cores';

// Cria a função que desenha o ícone de cada aba.
// "color" vem da aba (ativa = roxo, inativa = cinza). O "as string" ajusta o
// tipo, porque a aba declara a cor com um tipo mais amplo que o do Ionicons.
function iconeDaAba(nome: keyof typeof Ionicons.glyphMap) {
  return ({ color, size }: { color: unknown; size: number }) => (
    <Ionicons name={nome} size={size} color={color as string} />
  );
}

export default function LayoutAbas() {
  const { tarefas } = useEstudos();

  // Número mostrado no "selinho" (badge) da aba Tarefas.
  const qtdAtrasadas = tarefas.filter(estaAtrasada).length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSuave,
        headerStyle: { backgroundColor: cores.cartao },
        headerTitleStyle: { color: cores.texto, fontWeight: '700' },
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Estudaí',
          tabBarLabel: 'Início',
          tabBarIcon: iconeDaAba('home'),
        }}
      />
      <Tabs.Screen
        name="tarefas"
        options={{
          title: 'Tarefas',
          tabBarIcon: iconeDaAba('list'),
          tabBarBadge: qtdAtrasadas > 0 ? qtdAtrasadas : undefined,
        }}
      />
      <Tabs.Screen
        name="disciplinas"
        options={{
          title: 'Disciplinas',
          tabBarIcon: iconeDaAba('book'),
        }}
      />
    </Tabs>
  );
}
