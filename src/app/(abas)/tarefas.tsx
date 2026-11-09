// Tela TAREFAS: lista todas as tarefas com busca e filtros por status e disciplina.

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { CartaoTarefa } from '../../componentes/CartaoTarefa';
import { Chip } from '../../componentes/Chip';
import { EstadoVazio } from '../../componentes/EstadoVazio';
import { estaAtrasada, useEstudos } from '../../contexto/EstudosContext';
import { cores } from '../../tema/cores';
import { FiltroStatus, Tarefa } from '../../tipos/estudos';

const FILTROS: FiltroStatus[] = ['Todas', 'Pendentes', 'Atrasadas', 'Concluídas'];

export default function TelaTarefas() {
  const { tarefas, disciplinas, alternarConclusao, removerTarefa, buscarDisciplina } = useEstudos();

  // Estados locais desta tela (só os filtros; os dados vêm do contexto).
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('Todas');
  const [filtroDisciplina, setFiltroDisciplina] = useState<string | null>(null); // null = todas
  const [busca, setBusca] = useState('');

  // Verifica se uma tarefa passa no filtro de status escolhido.
  function passaNoStatus(t: Tarefa): boolean {
    switch (filtroStatus) {
      case 'Pendentes':
        return !t.concluida;
      case 'Atrasadas':
        return estaAtrasada(t);
      case 'Concluídas':
        return t.concluida;
      default:
        return true;
    }
  }

  // ---------- Processamento: filtrar e ordenar ----------
  const textoBusca = busca.trim().toLowerCase();
  const tarefasFiltradas = tarefas
    .filter(passaNoStatus)
    .filter((t) => filtroDisciplina === null || t.disciplinaId === filtroDisciplina)
    .filter((t) => t.titulo.toLowerCase().includes(textoBusca))
    // Pendentes primeiro; dentro de cada grupo, do prazo mais próximo ao mais distante.
    .sort((a, b) => Number(a.concluida) - Number(b.concluida) || a.prazo.localeCompare(b.prazo));

  function confirmarExclusao(tarefa: Tarefa) {
    Alert.alert('Excluir tarefa', `Deseja excluir "${tarefa.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removerTarefa(tarefa.id) },
    ]);
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        data={tarefasFiltradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        // Cabeçalho da lista: busca + filtros
        ListHeaderComponent={
          <View>
            <View style={estilos.busca}>
              <Ionicons name="search" size={18} color={cores.textoSuave} />
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar tarefa pelo título"
                placeholderTextColor={cores.textoSuave}
                style={estilos.inputBusca}
              />
            </View>

            <View style={estilos.linhaChips}>
              {FILTROS.map((f) => (
                <Chip
                  key={f}
                  texto={f}
                  selecionado={filtroStatus === f}
                  onPress={() => setFiltroStatus(f)}
                />
              ))}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Chip
                texto="Todas as disciplinas"
                selecionado={filtroDisciplina === null}
                onPress={() => setFiltroDisciplina(null)}
              />
              {disciplinas.map((d) => (
                <Chip
                  key={d.id}
                  texto={d.nome}
                  cor={d.cor}
                  selecionado={filtroDisciplina === d.id}
                  onPress={() => setFiltroDisciplina(d.id)}
                />
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <CartaoTarefa
            tarefa={item}
            disciplina={buscarDisciplina(item.disciplinaId)}
            onAlternar={() => alternarConclusao(item.id)}
            onExcluir={() => confirmarExclusao(item)}
          />
        )}
        ListEmptyComponent={
          <EstadoVazio
            icone="document-text-outline"
            titulo="Nenhuma tarefa encontrada"
            descricao="Mude os filtros ou toque no botão + para cadastrar uma tarefa."
          />
        }
      />

      {/* Botão flutuante para adicionar tarefa */}
      <Pressable
        style={estilos.botaoFlutuante}
        onPress={() => router.push('/nova-tarefa')}
        accessibilityLabel="Nova tarefa"
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  lista: { padding: 16, paddingBottom: 100 },
  busca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    marginBottom: 12,
    gap: 8,
  },
  inputBusca: { flex: 1, paddingVertical: 10, fontSize: 15, color: cores.texto },
  linhaChips: { flexDirection: 'row', flexWrap: 'wrap' },
  botaoFlutuante: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cores.primaria,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
