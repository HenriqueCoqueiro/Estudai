// "Chip": botão pequeno e arredondado usado para seleções e filtros.

import { Pressable, StyleSheet, Text } from 'react-native';

import { cores } from '../tema/cores';

type Props = {
  texto: string;
  selecionado: boolean;
  onPress: () => void;
  cor?: string; // cor usada quando está selecionado
};

export function Chip({ texto, selecionado, onPress, cor = cores.primaria }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        estilos.chip,
        selecionado ? { backgroundColor: cor, borderColor: cor } : null,
      ]}
    >
      <Text style={[estilos.texto, selecionado ? { color: '#FFFFFF' } : null]}>{texto}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.cartao,
    marginRight: 8,
    marginBottom: 8,
  },
  texto: { fontSize: 14, color: cores.texto, fontWeight: '500' },
});
