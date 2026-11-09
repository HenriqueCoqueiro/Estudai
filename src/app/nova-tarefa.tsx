// Tela NOVA TAREFA (abre como modal): formulário com validação dos campos.

import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Botao } from '../componentes/Botao';
import { CampoTexto } from '../componentes/CampoTexto';
import { Chip } from '../componentes/Chip';
import { EstadoVazio } from '../componentes/EstadoVazio';
import { useEstudos } from '../contexto/EstudosContext';
import { cores } from '../tema/cores';
import { TIPOS_TAREFA, TipoTarefa } from '../tipos/estudos';
import { aplicarMascaraData, brParaIso, diasAte } from '../utils/datas';

// Objeto com uma mensagem de erro (opcional) para cada campo.
type Erros = {
  titulo?: string;
  disciplina?: string;
  prazo?: string;
};

export default function TelaNovaTarefa() {
  const { disciplinas, adicionarTarefa } = useEstudos();

  // ---------- Estados do formulário ----------
  const [titulo, setTitulo] = useState('');
  const [disciplinaId, setDisciplinaId] = useState<string | null>(null);
  const [tipo, setTipo] = useState<TipoTarefa>('Trabalho');
  const [prazo, setPrazo] = useState(''); // texto digitado "DD/MM/AAAA"
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState<Erros>({});

  // Sem disciplinas não dá para criar tarefa: mostramos uma orientação.
  if (disciplinas.length === 0) {
    return (
      <View style={estilos.conteudo}>
        <EstadoVazio
          icone="alert-circle-outline"
          titulo="Cadastre uma disciplina primeiro"
          descricao="Toda tarefa pertence a uma disciplina."
        />
        <Botao
          titulo="Ir para Disciplinas"
          onPress={() => {
            router.back();
            router.navigate('/disciplinas');
          }}
        />
      </View>
    );
  }

  // ---------- Validação ----------
  // Retorna true se tudo estiver certo; senão, preenche "erros" e retorna false.
  function validar(): boolean {
    const novosErros: Erros = {};

    if (titulo.trim() === '') {
      novosErros.titulo = 'Informe o título da tarefa.';
    } else if (titulo.trim().length < 3) {
      novosErros.titulo = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!disciplinaId) {
      novosErros.disciplina = 'Selecione uma disciplina.';
    }

    if (prazo === '') {
      novosErros.prazo = 'Informe a data de entrega.';
    } else {
      const iso = brParaIso(prazo);
      if (!iso) {
        novosErros.prazo = 'Data inválida. Use o formato DD/MM/AAAA.';
      } else if (diasAte(iso) < 0) {
        novosErros.prazo = 'O prazo não pode estar no passado.';
      }
    }

    setErros(novosErros);
    // Se o objeto não tem nenhuma chave, não há erros.
    return Object.keys(novosErros).length === 0;
  }

  // ---------- Evento do botão Salvar ----------
  function salvar() {
    if (!validar()) return;

    adicionarTarefa({
      titulo,
      disciplinaId: disciplinaId!, // "!" = já validamos que não é null
      tipo,
      prazo: brParaIso(prazo)!,
      observacao,
    });

    router.back(); // fecha o modal e volta para a tela anterior
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
        <CampoTexto
          rotulo="Título"
          obrigatorio
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex.: Lista de exercícios 3"
          erro={erros.titulo}
        />

        <Text style={estilos.rotulo}>
          Disciplina <Text style={{ color: cores.perigo }}>*</Text>
        </Text>
        <View style={estilos.linhaChips}>
          {disciplinas.map((d) => (
            <Chip
              key={d.id}
              texto={d.nome}
              cor={d.cor}
              selecionado={disciplinaId === d.id}
              onPress={() => setDisciplinaId(d.id)}
            />
          ))}
        </View>
        {erros.disciplina ? <Text style={estilos.erro}>{erros.disciplina}</Text> : null}

        <Text style={[estilos.rotulo, { marginTop: 8 }]}>Tipo</Text>
        <View style={estilos.linhaChips}>
          {TIPOS_TAREFA.map((t) => (
            <Chip key={t} texto={t} selecionado={tipo === t} onPress={() => setTipo(t)} />
          ))}
        </View>

        <View style={{ marginTop: 8 }}>
          <CampoTexto
            rotulo="Prazo de entrega"
            obrigatorio
            value={prazo}
            // A máscara coloca as barras automaticamente enquanto o usuário digita.
            onChangeText={(texto) => setPrazo(aplicarMascaraData(texto))}
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            maxLength={10}
            erro={erros.prazo}
          />
        </View>

        <CampoTexto
          rotulo="Observação"
          value={observacao}
          onChangeText={setObservacao}
          placeholder="Opcional (ex.: capítulos, local da prova...)"
          multiline
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />

        <View style={{ gap: 10 }}>
          <Botao titulo="Salvar tarefa" onPress={salvar} />
          <Botao titulo="Cancelar" variante="secundario" onPress={() => router.back()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  conteudo: { padding: 16, paddingBottom: 40 },
  rotulo: { fontSize: 14, fontWeight: '600', color: cores.texto, marginBottom: 8 },
  linhaChips: { flexDirection: 'row', flexWrap: 'wrap' },
  erro: { color: cores.perigo, fontSize: 13, marginBottom: 8 },
});
