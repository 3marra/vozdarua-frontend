export const T = {
  teal: '#0d9488',
  tealDark: '#0f766e',
  tealSoft: '#f0fdfa',
  tealMid: '#99f6e4',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray800: '#1f2937',
}

// Nomes exatamente como seedados na API (GET /status)
// Aberto e Resolvido usam um tom mais escuro que o "500/600" padrão do Tailwind: em cima do
// bg pastel do badge, a versão clara ficava abaixo de 4.5:1 (WCAG 1.4.3) no texto de 12px.
// Em análise e Aceito já passavam nas cores originais — não precisaram mudar.
export const STATUS_CFG = {
  Aberto:       { c: '#a5610a', bg: '#fef3c7', icon: 'circle', label: 'Aberto' },
  'Em análise': { c: '#7c3aed', bg: '#ede9fe', icon: 'sync', label: 'Em análise' },
  Aceito:       { c: '#0f766e', bg: '#f0fdfa', icon: 'check', label: 'Aceito' },
  Resolvido:    { c: '#047857', bg: '#d1fae5', icon: 'check_circle', label: 'Resolvido' },
}

export const UF = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
]
