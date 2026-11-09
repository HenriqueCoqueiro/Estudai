// Mensagem mostrada quando uma lista não tem itens.

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../tema/cores';

type Props = {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descricao: string;
};

export function EstadoVazio({ icone, titulo, descricao }: Props) {
  return (
    <View style={estilos.container}>
      <Ionicons name={icone} size={48} color={cores.textoSuave} />
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.descricao}>{descricao}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  titulo: { fontSize: 17, fontWeight: '700', color: cores.texto, marginTop: 12 },
  descricao: { fontSize: 14, color: cores.textoSuave, textAlign: 'center', marginTop: 4 },
});
