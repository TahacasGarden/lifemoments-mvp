import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  bg:    { 900:'#0b0f14', 800:'#0f141b', 700:'#151c24' },
  panel: { 900:'#0f141b', 800:'#121924', 700:'#182231' },
  text:  { 100:'#e6edf3', 300:'#c2c9d1', 500:'#9aa6b2' },
  brand: { 500:'#6aa8ff', 600:'#4f8fff', 700:'#2f6ee6' },
  accent:{ 500:'#22d3ee' },
  danger:{ 500:'#ef4444' }
};

const shadows = {
  sm: '0 1px 2px rgba(0,0,0,.25)',
  md: '0 6px 16px rgba(0,0,0,.35)',
};

export default extendTheme({
  config,
  styles: {
    global: {
      'html, body': { background: colors.bg[900], color: colors.text[100] },
      hr: { borderColor: '#233042' }
    }
  },
  colors,
  radii: { md: '14px', lg: '18px', xl: '24px' },
  shadows,
  components: {
    Button: { baseStyle: { rounded: 'lg' }, variants: {
      solid: { bg: 'brand.600', _hover:{ bg:'brand.700' }, color:'white' },
      outline: { borderColor:'#2b3b51', _hover:{ bg:'panel.800' } }
    }},
    Input: { variants: { outline: { field: { bg:'panel.800', borderColor:'#243245' }}}},
    Textarea: { variants: { outline: { bg:'panel.800', borderColor:'#243245' }}},
    Select: { variants: { outline: { field: { bg:'panel.800', borderColor:'#243245' }}}},
  }
});
