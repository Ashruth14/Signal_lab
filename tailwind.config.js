/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        geist: {
          canvas: '#fafafa',
          elevated: '#ffffff',
          ink: '#171717',
          body: '#4d4d4d',
          mute: '#8f8f8f',
          faint: '#a1a1a1',
          hairline: '#ebebeb',
          hairlineSoft: '#f2f2f2',
          link: '#0070f3',
          linkDeep: '#0761d1',
          linkSoft: '#d3e5ff',
          error: '#ee0000',
          errorDeep: '#c50000',
          warning: '#f5a623',
          warningSoft: '#ffefcf',
          warningDeep: '#ab570a',
          violet: '#7928ca',
          violetSoft: '#d8ccf1',
          cyan: '#50e3c2',
          cyanSoft: '#aaffec',
          pink: '#ff0080',
          magenta: '#eb367f',
        },
        surface: {
          card: '#ffffff',
          cardHover: '#fafafa',
          border: '#ebebeb',
          borderSubtle: '#f2f2f2',
          input: '#ffffff',
          canvas: '#fafafa',
        },
        // Legacy compat maps
        stoneDark: {
          850: '#f5f5f5',
          900: '#f2f2f2',
          925: '#ebebeb',
          950: '#fafafa',
          975: '#ffffff',
        },
        ember: {
          500: '#171717',
          600: '#171717',
          700: '#171717',
          800: '#000000',
          900: '#000000',
          950: '#f5f5f5',
        },
        amberGold: {
          300: '#f5a623',
          400: '#f5a623',
          500: '#f5a623',
          600: '#ab570a',
          700: '#ab570a',
          800: '#ab570a',
          900: '#ab570a',
          950: '#ffefcf',
        }
      },
      fontFamily: {
        display: ['Geist', 'Inter', 'Arial', 'sans-serif'],
        sans: ['Geist', 'Inter', 'Arial', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        'pill-category': '64px',
        pill: '100px',
      },
      boxShadow: {
        'whisper': '0px 1px 2px rgba(0, 0, 0, 0.04)',
        'floating': '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px -4px rgba(0, 0, 0, 0.08)',
        'modal': '0px 8px 30px rgba(0, 0, 0, 0.12)',
        'glow-terracotta': '0px 2px 4px rgba(0, 0, 0, 0.08)',
        'glow-amber': '0px 2px 4px rgba(0, 0, 0, 0.08)',
      },
      letterSpacing: {
        'display-xl': '-2.4px',
        'heading-lg': '-1.28px',
        'heading-md': '-0.4px',
        'label-sm': '-0.28px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out forwards',
        'scale-in': 'scaleIn 0.12s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      }
    },
  },
  plugins: [],
}
