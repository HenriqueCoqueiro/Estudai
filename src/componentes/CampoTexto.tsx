// Campo de entrada com rótulo e mensagem de erro (usado nos formulários).

import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { cores } from '../tema/cores';

// Aceita todas as props normais do TextInput + rótulo e erro.
type Props = TextInputProps & {
  rotulo: string;
  erro?: string;
  obrigatorio?: boolean;
};

export function CampoTexto({ rotulo, erro, obrigatorio, style, ...resto }: Props) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>
        {rotulo}
        {obrigatorio && <Text style={{ color: cores.perigo }}> *</Text>}
      </Text>
      <TextInput
        placeholderTextColor={cores.textoSuave}
        style={[estilos.input, erro ? estilos.inputErro : null, style]}
        {...resto}
      />
      {/* A mensagem de erro só aparece quando existe um erro */}
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { marginBottom: 16 },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: 6 },
  input: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: cores.texto,
  },
  inputErro: { borderColor: cores.perigo },
  erro: { color: cores.perigo, fontSize: 13, marginTop: 4 },
});
