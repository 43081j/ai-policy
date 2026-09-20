import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'forced-color-adjust': 'preserve-parent-color',
      },
      warn: true,
      scale: 1.2,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: {
    btn: 'min-w-21 rounded-lg border border-ui-border bg-ui-surface px-3.5 py-2 text-sm font-medium text-ui-text transition-colors hover:border-ui-faint',
    'btn-primary':
      'border-ui-text bg-ui-text text-ui-bg hover:(border-ui-text opacity-88)',
    caption:
      'font-mono text-xs font-medium uppercase tracking-wider text-ui-muted',
  },
  theme: {
    font: {
      sans: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
      mono: "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace",
    },
    colors: {
      ui: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--text-muted)',
        faint: 'var(--text-faint)',
        permits: 'var(--permits)',
        'permits-bg': 'var(--permits-bg)',
        requires: 'var(--requires)',
        'requires-bg': 'var(--requires-bg)',
        forbids: 'var(--forbids)',
        'forbids-bg': 'var(--forbids-bg)',
      },
    },
  },
});
