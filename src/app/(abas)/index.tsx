// Tela INÍCIO: painel com o resumo dos estudos e os próximos prazos.

import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Botao } from '../../componentes/Botao';
import { CartaoResumo } from '../../componentes/CartaoResumo';
import { CartaoTarefa } from '../../componentes/CartaoTarefa';
import { EstadoVazio } from '../../componentes/EstadoVazio';
import { estaAtrasada, useEstudos } from '../../contexto/EstudosContext';
import { cores } from '../../tema/cores';

export default function TelaInicio() {
  const { tarefas, disciplinas, carregando, alternarConclusao, buscarDisciplina } = useEstudos();

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  // ---------- Processamento: cálculos a partir das tarefas ----------
  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const atrasadas = tarefas.filter(estaAtrasada).length;
  const pendentes = total - concluidas;
  const progresso = total === 0 ? 0 : Math.round((concluidas / total) * 100);

  // Próximos prazos: tarefas pendentes, ordenadas pela data, só as 3 primeiras.
  // Como o prazo está em "AAAA-MM-DD", a ordem alfabética já é a ordem das datas.
  const proximas = tarefas
    .filter((t) => !t.concluida)
    .sort((a, b) => a.prazo.localeCompare(b.prazo))
    .slice(0, 3);

  return (
    <ScrollView contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.saudacao}>Olá! 👋</Text>
      <Text style={estilos.subtitulo}>Organize suas disciplinas, tarefas e prazos.</Text>

      {/* Barra de progresso */}
      <View style={estilos.cartaoProgresso}>
        <Text style={estilos.progressoTexto}>
          {progresso}% concluído ({concluidas} de {total})
        </Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: `${progresso}%` }]} />
        </View>
      </View>

      {/* Cartões de resumo */}
      <View style={estilos.grade}>
        <CartaoResumo valor={pendentes} rotulo="Pendentes" cor={cores.primaria} />
        <CartaoResumo valor={atrasadas} rotulo="Atrasadas" cor={cores.perigo} />
        <CartaoResumo valor={concluidas} rotulo="Concluídas" cor={cores.sucesso} />
        <CartaoResumo valor={disciplinas.length} rotulo="Disciplinas" cor={cores.alerta} />
      </View>

      <Text style={estilos.secao}>Próximos prazos</Text>
      {proximas.length === 0 ? (
        <EstadoVazio
          icone="happy-outline"
          titulo="Nada pendente!"
          descricao="Você não tem tarefas pendentes no momento."
        />
      ) : (
        proximas.map((tarefa) => (
          <CartaoTarefa
            key={tarefa.id}
            tarefa={tarefa}
            disciplina={buscarDisciplina(tarefa.disciplinaId)}
            onAlternar={() => alternarConclusao(tarefa.id)}
          />
        ))
      )}

      <View style={{ marginTop: 12 }}>
        <Botao titulo="+ Nova tarefa" onPress={() => router.push('/nova-tarefa')} />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  conteudo: { padding: 16, paddingBottom: 32 },
  saudacao: { fontSize: 26, fontWeight: '800', color: cores.texto },
  subtitulo: { fontSize: 15, color: cores.textoSuave, marginTop: 4, marginBottom: 16 },
  cartaoProgresso: {
    backgroundColor: cores.primaria,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  progressoTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  barraFundo: { height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5 },
  barraPreenchida: { height: 10, backgroundColor: '#FFFFFF', borderRadius: 5 },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  secao: { fontSize: 18, fontWeight: '700', color: cores.texto, marginTop: 16, marginBottom: 10 },
});
