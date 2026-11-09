// Funções auxiliares para trabalhar com datas.
//
// Guardamos os prazos como texto "AAAA-MM-DD" (formato ISO), mas o usuário
// digita e lê no formato brasileiro "DD/MM/AAAA".
//
// Atenção: new Date("2026-11-20") interpreta a data em UTC, e no Brasil
// (UTC-3) isso vira o dia anterior às 21h! Por isso sempre montamos a data
// com new Date(ano, mes - 1, dia), que usa o fuso horário local.

const MS_POR_DIA = 1000 * 60 * 60 * 24;

/** Converte "AAAA-MM-DD" em um objeto Date no horário local (meia-noite). */
function isoParaDate(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

/** Converte um Date em "AAAA-MM-DD". */
export function dateParaIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

/** Retorna a data de hoje somada a N dias, em "AAAA-MM-DD". */
export function hojeMaisDias(dias: number): string {
  const hoje = new Date();
  hoje.setDate(hoje.getDate() + dias);
  return dateParaIso(hoje);
}

/**
 * Máscara de digitação: transforma "20112026" em "20/11/2026"
 * enquanto o usuário digita. Remove tudo que não for número.
 */
export function aplicarMascaraData(texto: string): string {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

/**
 * Converte "DD/MM/AAAA" em "AAAA-MM-DD".
 * Retorna null se a data não existir (ex.: 31/02/2026).
 */
export function brParaIso(textoBr: string): string | null {
  const partes = textoBr.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return null;

  const [dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);

  // Se o dia/mês não "baterem" depois de criar a data, ela era inválida.
  // Ex.: new Date(2026, 1, 31) vira 3 de março, então 31/02 é rejeitado.
  const valida =
    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;

  return valida ? dateParaIso(data) : null;
}

/** Converte "AAAA-MM-DD" em "DD/MM/AAAA" para mostrar na tela. */
export function isoParaBr(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

/** Quantos dias faltam até a data (negativo = já passou). */
export function diasAte(iso: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((isoParaDate(iso).getTime() - hoje.getTime()) / MS_POR_DIA);
}

/** Texto amigável sobre o prazo: "Hoje", "Amanhã", "Em 5 dias", "Atrasada há 2 dias". */
export function descreverPrazo(iso: string): string {
  const dias = diasAte(iso);
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Amanhã';
  if (dias > 1) return `Em ${dias} dias`;
  if (dias === -1) return 'Atrasada há 1 dia';
  return `Atrasada há ${Math.abs(dias)} dias`;
}
