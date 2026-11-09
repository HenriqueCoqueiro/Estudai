// Botão reutilizável. Recebe o texto, a função do clique e uma variante de cor.

import { Pressable, StyleSheet, Text } from 'react-native';

import { cores } from '../tema/cores';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  desabilitado?: boolean;
};

export function Botao({ titulo, onPress, variante = 'primario', desabilitado = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      // A função de style recebe "pressed" para dar um efeito ao tocar.
      style={({ pressed }) => [
        estilos.base,
        estilos[variante],
        (pressed || desabilitado) && { opacity: 0.6 },
      ]}
    >
      <Text style={[estilos.texto, variante === 'secundario' && { color: cores.primaria }]}>
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: cores.primariaClara },
  perigo: { backgroundColor: cores.perigo },
  texto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
