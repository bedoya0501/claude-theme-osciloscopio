import type { Register, ThemeSetArgs, ThemeStyle } from 'claude-code'

import { makeColors } from './make-colors.js'

// ═════════════════════════════════════════════════════════════
//  OSCILOSCOPIO · tema oscuro sobrio (IA · electrónica · café)
//
//  PALETA: el ÚNICO lugar para ajustar colores.
//  Cambia un valor, guarda, y el tema se recarga al terminar
//  el turno de Claude (o al reiniciar la sesión).
//  Todos los colores en hex de 6 dígitos.
// ═════════════════════════════════════════════════════════════
export const PALETTE = {
  // Superficies (de más oscura a más clara; mantenerlas cercanas)
  bg: '#0B0F14', // fondo: carbón azulado casi negro
  card: '#121820', // tarjetas y mensajes
  panel: '#161D26', // paneles
  menu: '#171E27', // menús y popovers (no aclarar mucho: rompe contraste)
  border: '#232C37', // borde fino de 1 px

  // Texto
  text: '#DCE4EB', // principal: gris claro frío (pedido ~#D6DEE6; subido un punto por contraste AA)
  textSecondary: '#AEB9C5', // intermedio
  textMuted: '#8896A5', // secundario tenue

  // Acentos
  accent: '#3DD6C6', // cian osciloscopio: enlaces, foco, botón principal, activo
  amber: '#C98A4B', // ámbar café tostado: avisos, variables en código, pads del fondo

  // Estados (afinados para no saturar)
  danger: '#E5736B',
  success: '#7CC48A',
  pro: '#A795E0',

  // Rejilla de fondo: opacidad simulada sobre `bg` (0–1). Mantener < 0.04.
  gridOpacity: 0.025,
  traceOpacity: 0.035,

  // Radios en puntos
  radiusCard: 8,
  radiusSmall: 6,
} as const
// ═════════════════════════════════════════════════════════════

const P = PALETTE

/** Mezcla `fg` sobre `bg` con opacidad `a` y devuelve un hex sólido. */
function mix(fg: string, bg: string, a: number): `#${string}` {
  const ch = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16)
  const out = [0, 1, 2].map(i => Math.round(ch(bg, i) + (ch(fg, i) - ch(bg, i)) * a))

  return `#${out.map(v => v.toString(16).padStart(2, '0')).join('')}`
}

// Colores de la app (tokens del sistema de diseño), solo modo oscuro.
const made = makeColors({
  label: 'Osciloscopio',
  id: 'osciloscopio',
  only: 'dark',
  roles: {
    accent: P.accent,
    danger: P.danger,
    success: P.success,
    warning: P.amber,
    pro: P.pro,
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': P.bg,
        'surface-1': P.card,
        'surface-2': P.panel,
        'surface-3': P.menu,
        'text-primary': P.text,
        'text-secondary': P.textSecondary,
        'text-muted': P.textMuted,
      },
    },
  },
})

export const problems = made.problems

const colors = made.theme
const dark = colors.inputs.dark

if (dark !== undefined) {
  dark['bg-user-message'] = P.card
  dark['text-user-message'] = P.text
}

// Fondo: rejilla de osciloscopio + traza de circuito, casi invisible (< 4 %).
const grid = mix(P.accent, P.bg, P.gridOpacity)
const trace = mix(P.accent, P.bg, P.traceOpacity)
const pad = mix(P.amber, P.bg, P.traceOpacity)

const backdrop: ThemeSetArgs['backdrop'] = {
  vector: {
    viewBox: 96,
    size: [96, 96],
    repeat: true,
    paths: [
      { d: 'M0 0H96V96H0Z', color: P.bg },
      {
        d: 'M0 0.5H96M0 24.5H96M0 48.5H96M0 72.5H96M0.5 0V96M24.5 0V96M48.5 0V96M72.5 0V96',
        strokeWidth: 1,
        color: grid,
      },
      { d: 'M24.5 48.5H44L56 60.5H72.5V96', strokeWidth: 1, color: trace },
      { d: 'M22 48.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0Z', color: pad },
      { d: 'M70 24.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0Z', color: pad },
    ],
  },
}

// Filas de la conversación: tipografía limpia, bordes de 1 px, sin sombras.
const style: ThemeStyle = {
  Text: { fontFamily: ['sans'] },
  Heading: { fontFamily: ['sans'], fontWeight: 'semibold', letterSpacing: 0.2 },
  UserMessage: {
    backgroundColor: P.card,
    color: P.text,
    borderColor: P.border,
    borderWidth: 1,
    radius: P.radiusCard,
    shadow: 'none',
    paddingX: 14,
    paddingY: 10,
  },
  ToolUse: {
    fontFamily: ['code'],
    color: P.textSecondary,
    backgroundColor: P.card,
    borderColor: P.border,
    borderWidth: 1,
    radius: P.radiusSmall,
    shadow: 'none',
    paddingX: 8,
  },
}

export const LOOK: ThemeSetArgs = { colors, backdrop, overrideColorScheme: 'dark', style }
const LOOK_SIN_ESTILO: ThemeSetArgs = { colors, backdrop, overrideColorScheme: 'dark' }

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(`Osciloscopio: ${unpainted}`)
    }

    try {
      const set = await $.theme.set(LOOK)

      if (!set.isDrawn) {
        $.ui.status(set.reason)
      }
    } catch (error) {
      // Una versión sin `style` lo rechaza: aplicar solo colores y fondo.
      $.ui.log(`osciloscopio: ${String(error)}`)
      await $.theme.set(LOOK_SIN_ESTILO)
    }

    return next(e)
  })
}
