// Layout raiz (Expo Router). Este é o primeiro componente que o app desenha.
//
// No Expo Router, cada arquivo dentro de src/app vira uma tela (rota):
//   src/app/(abas)/...     -> as três abas inferiores
//   src/app/nova-tarefa.tsx -> tela de cadastro, aberta como "modal"
//
// O <EstudosProvider> envolve tudo para que todas as telas acessem os dados.

import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';

import { EstudosProvider } from '../contexto/EstudosContext';
import { cores } from '../tema/cores';

export default function LayoutRaiz() {
  return (
    <EstudosProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: cores.cartao },
          headerTintColor: cores.primaria,
          headerTitleStyle: { color: cores.texto, fontWeight: '700' },
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        {/* O grupo (abas) já tem seu próprio cabeçalho, então escondemos este */}
        <Stack.Screen name="(abas)" options={{ headerShown: false }} />
        <Stack.Screen
          name="nova-tarefa"
          options={{ title: 'Nova tarefa', presentation: 'modal' }}
        />
      </Stack>
    </EstudosProvider>
  );
}
