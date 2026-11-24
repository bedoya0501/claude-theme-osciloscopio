# Osciloscopio: tema para Claude

Tema oscuro y sobrio para la app de escritorio (y la móvil) de Claude: fondo carbón azulado, acento cian de osciloscopio, detalles en ámbar café y una rejilla con trazas de circuito casi invisible (menos del 4 %). Todo el texto cumple el contraste WCAG AA. Se aplica al iniciar cada sesión. La terminal no dibuja temas.

## Instalación

En el prompt de una sesión de Claude Code:

```
/plugin install osciloscopio --marketplace bedoya0501/claude-theme-osciloscopio
```

Responde `y` para añadir el marketplace y elige el alcance (el de usuario aplica el tema en todas tus sesiones).

Desde una terminal:

```
claude plugin install osciloscopio --marketplace bedoya0501/claude-theme-osciloscopio
```

## Ajustar colores

Todos los valores están en **un solo lugar**: el bloque `PALETTE` al inicio de `hooks/register.ts`. El sistema de diseño ajusta la luminosidad de los acentos para mantener el contraste, así que el tono se conserva aunque el hex final varíe un poco.

## Archivos

- `.claude-plugin/plugin.json`: el manifiesto
- `.claude-plugin/marketplace.json`: convierte este repositorio en un marketplace instalable
- `hooks/hooks.json`: indica qué módulo cargar
- `hooks/register.ts`: la paleta y la aplicación del tema
- `hooks/make-colors.js`, `.d.ts`: el generador de tokens del sistema de diseño. No lo edites.
- `hooks/theme.test.ts`: las pruebas (`claude plugin test .`)

## Desinstalar o volver al tema original

```
/plugin uninstall osciloscopio
```

También puedes desactivarlo sin desinstalar desde `/plugin`.
