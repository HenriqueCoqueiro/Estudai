// Cartão que mostra uma tarefa na lista.
// Tocar no círculo conclui/desmarca; o ícone de lixeira exclui.

import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { estaAtrasada } from '../contexto/EstudosContext';
import { cores } from '../tema/cores';
import { Disciplina, Tarefa } from '../tipos/estudos';
import { descreverPrazo, isoParaBr } from '../utils/datas';

type Props = {
  tarefa: Tarefa;
  disciplina?: Disciplina;
  onAlternar: () => void;
  onExcluir?: () => void; // opcional: na tela Início não mostramos a lixeira
};

export function CartaoTarefa({ tarefa, disciplina, onAlternar, onExcluir }: Props) {
  const atrasada = estaAtrasada(tarefa);
  const corDisciplina = disciplina?.cor ?? cores.textoSuave;

  // Cor do texto do prazo muda conforme a situação da tarefa.
  let corPrazo = cores.textoSuave;
  if (tarefa.concluida) corPrazo = cores.sucesso;
  else if (atrasada) corPrazo = cores.perigo;

  return (
    <View style={[estilos.cartao, { borderLeftColor: corDisciplina }]}>
      <Pressable onPress={onAlternar} hitSlop={10} accessibilityLabel="Concluir tarefa">
        <Ionicons
          name={tarefa.concluida ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={tarefa.concluida ? cores.sucesso : cores.textoSuave}
        />
      </Pressable>

      <View style={estilos.info}>
        <Text style={[estilos.titulo, tarefa.concluida && estilos.tituloConcluido]}>
          {tarefa.titulo}
        </Text>
        <Text style={estilos.detalhe}>
          {tarefa.tipo} · {disciplina?.nome ?? 'Sem disciplina'}
        </Text>
        <Text style={[estilos.prazo, { color: corPrazo }]}>
          {isoParaBr(tarefa.prazo)} — {tarefa.concluida ? 'Concluída' : descreverPrazo(tarefa.prazo)}
        </Text>
        {tarefa.observacao ? <Text style={estilos.observacao}>{tarefa.observacao}</Text> : null}
      </View>

      {onExcluir && (
        <Pressable onPress={onExcluir} hitSlop={10} accessibilityLabel="Excluir tarefa">
          <Ionicons name="trash-outline" size={22} color={cores.perigo} />
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
    gap: 12,
  },
  info: { flex: 1 },
  titulo: { fontSize: 16, fontWeight: '600', color: cores.texto },
  tituloConcluido: { textDecorationLine: 'line-through', color: cores.textoSuave },
  detalhe: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
  prazo: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  observacao: { fontSize: 13, color: cores.texto, marginTop: 4, fontStyle: 'italic' },
});
