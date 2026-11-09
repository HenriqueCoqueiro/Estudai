// Tela DISCIPLINAS: formulário para cadastrar disciplinas + lista das cadastradas.

import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Botao } from '../../componentes/Botao';
import { CampoTexto } from '../../componentes/CampoTexto';
import { EstadoVazio } from '../../componentes/EstadoVazio';
import { useEstudos } from '../../contexto/EstudosContext';
import { cores, coresDisciplinas } from '../../tema/cores';
import { Disciplina } from '../../tipos/estudos';

export default function TelaDisciplinas() {
  const { disciplinas, tarefas, adicionarDisciplina, removerDisciplina } = useEstudos();

  // Estados do formulário
  const [nome, setNome] = useState('');
  const [professor, setProfessor] = useState('');
  const [cor, setCor] = useState(coresDisciplinas[0]);
  const [erroNome, setErroNome] = useState('');

  // ---------- Validação + cadastro ----------
  function salvar() {
    const nomeLimpo = nome.trim();

    if (nomeLimpo === '') {
      setErroNome('Informe o nome da disciplina.');
      return;
    }
    if (nomeLimpo.length < 3) {
      setErroNome('O nome deve ter pelo menos 3 caracteres.');
      return;
    }
    const jaExiste = disciplinas.some((d) => d.nome.toLowerCase() === nomeLimpo.toLowerCase());
    if (jaExiste) {
      setErroNome('Já existe uma disciplina com esse nome.');
      return;
    }

    adicionarDisciplina(nomeLimpo, professor, cor);

    // Limpa o formulário depois de salvar
    setNome('');
    setProfessor('');
    setErroNome('');
    Alert.alert('Pronto!', `Disciplina "${nomeLimpo}" cadastrada.`);
  }

  function confirmarExclusao(disciplina: Disciplina) {
    const qtd = tarefas.filter((t) => t.disciplinaId === disciplina.id).length;
    const aviso = qtd > 0 ? `\n\n${qtd} tarefa(s) desta disciplina também serão excluídas.` : '';

    Alert.alert('Excluir disciplina', `Deseja excluir "${disciplina.nome}"?${aviso}`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => removerDisciplina(disciplina.id) },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        {/* ---------- Formulário ---------- */}
        <View style={estilos.cartao}>
          <Text style={estilos.titulo}>Nova disciplina</Text>

          <CampoTexto
            rotulo="Nome"
            obrigatorio
            value={nome}
            onChangeText={(texto) => {
              setNome(texto);
              if (erroNome) setErroNome(''); // apaga o erro quando o usuário volta a digitar
            }}
            placeholder="Ex.: Cálculo II"
            erro={erroNome}
          />

          <CampoTexto
            rotulo="Professor(a)"
            value={professor}
            onChangeText={setProfessor}
            placeholder="Opcional"
          />

          <Text style={estilos.rotulo}>Cor</Text>
          <View style={estilos.linhaCores}>
            {coresDisciplinas.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCor(c)}
                style={[estilos.bolinha, { backgroundColor: c }, cor === c && estilos.bolinhaAtiva]}
                accessibilityLabel={`Cor ${c}`}
              />
            ))}
          </View>

          <Botao titulo="Adicionar disciplina" onPress={salvar} />
        </View>

        {/* ---------- Lista ---------- */}
        <Text style={estilos.secao}>Minhas disciplinas ({disciplinas.length})</Text>

        {disciplinas.length === 0 ? (
          <EstadoVazio
            icone="book-outline"
            titulo="Nenhuma disciplina"
            descricao="Cadastre sua primeira disciplina no formulário acima."
          />
        ) : (
          disciplinas.map((d) => {
            const daDisciplina = tarefas.filter((t) => t.disciplinaId === d.id);
            const pendentes = daDisciplina.filter((t) => !t.concluida).length;

            return (
              <View key={d.id} style={[estilos.item, { borderLeftColor: d.cor }]}>
                <View style={{ flex: 1 }}>
                  <Text style={estilos.itemNome}>{d.nome}</Text>
                  {d.professor ? <Text style={estilos.itemDetalhe}>{d.professor}</Text> : null}
                  <Text style={estilos.itemDetalhe}>
                    {daDisciplina.length} tarefa(s) · {pendentes} pendente(s)
                  </Text>
                </View>
                <Pressable onPress={() => confirmarExclusao(d)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={22} color={cores.perigo} />
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, paddingBottom: 32 },
  cartao: { backgroundColor: cores.cartao, borderRadius: 14, padding: 16 },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto, marginBottom: 12 },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: 8 },
  linhaCores: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  bolinha: { width: 34, height: 34, borderRadius: 17 },
  bolinhaAtiva: { borderWidth: 3, borderColor: cores.texto },
  secao: { fontSize: 18, fontWeight: '700', color: cores.texto, marginTop: 24, marginBottom: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  itemNome: { fontSize: 16, fontWeight: '600', color: cores.texto },
  itemDetalhe: { fontSize: 13, color: cores.textoSuave, marginTop: 2 },
});
