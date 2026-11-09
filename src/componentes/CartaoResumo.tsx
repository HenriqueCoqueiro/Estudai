// Pequeno cartão com um número e um rótulo (usado no painel da tela Início).

import { StyleSheet, Text, View } from 'react-native';

import { cores } from '../tema/cores';

type Props = {
  valor: number;
  rotulo: string;
  cor: string;
};

export function CartaoResumo({ valor, rotulo, cor }: Props) {
  return (
    <View style={estilos.cartao}>
      <Text style={[estilos.valor, { color: cor }]}>{valor}</Text>
      <Text style={estilos.rotulo}>{rotulo}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: 16,
  },
  valor: { fontSize: 28, fontWeight: '800' },
  rotulo: { fontSize: 14, color: cores.textoSuave, marginTop: 2 },
});
