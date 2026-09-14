// O backend (Comment) não tem campo de imagem — pra anexar a foto de comprovação de
// resolução sem mudar a API, embutimos a URL numa última linha marcada no texto do
// comentário, e desfazemos essa marcação só na exibição.
const MARCADOR = '[[foto]]'

export function montarTextoComFoto(texto, fotoUrl) {
  return [texto?.trim(), `${MARCADOR}${fotoUrl}`].filter(Boolean).join('\n')
}

export function extrairFoto(texto) {
  if (!texto) return { texto: '', fotoUrl: null }
  const linhas = texto.split('\n')
  const ultima = linhas[linhas.length - 1]
  if (ultima?.startsWith(MARCADOR)) {
    return { texto: linhas.slice(0, -1).join('\n').trim(), fotoUrl: ultima.slice(MARCADOR.length) }
  }
  return { texto, fotoUrl: null }
}
