import { expect, test } from 'claude-code/testing'

import { LOOK, PALETTE, problems } from './register'

test('el tema se construye y Desktop lo pinta (sin líneas bloqueantes)', async () => {
  const blocking = problems.filter(line => line.startsWith("Desktop won't paint"))
  expect(blocking).toEqual([])
  // Ningún problema de contraste sobre texto: solo quedan bordes decorativos.
  expect(problems.filter(line => line.startsWith('text-'))).toEqual([])
})

test('modo oscuro, paleta y fondo de rejilla', async () => {
  expect(LOOK.overrideColorScheme).toBe('dark')
  expect(LOOK.colors?.label).toBe('Osciloscopio')
  expect(LOOK.colors?.inputs.dark?.['bg-user-message']).toBe(PALETTE.card)
  expect(LOOK.colors?.inputs.light).toBeUndefined()
  expect(LOOK.backdrop).toBeDefined()
  expect(LOOK.style?.UserMessage).toBeDefined()
  expect(PALETTE.gridOpacity < 0.04 && PALETTE.traceOpacity < 0.04).toBe(true)
})
