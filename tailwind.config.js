module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    minWidth: {
     '0': '0',
     '1/4': '25%',
     '1/2': '50%',
     '3/4': '75%',
     'full': '100%',
    },
    screens: {
      'iphone5se': '330px',
      'iphone': '430px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1200px',
      'desktop': '1280px',
    },
    extend: {
      spacing: {
        '13': '50px',
        '81': '300px',
        '82': '330px',
      }
    }
  },
  corePlugins: {
//    preflight: false,//tailwind独自の調整をオフにする
  },
  variants: {},
  plugins: [
    //require('@tailwindcss/custom-forms'),
    //require('@tailwindcss/ui'),
  ],
};
