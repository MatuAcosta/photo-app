/** @type {import('tailwindcss').Config} */
module.exports = {
  important:true,
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        'fade': ' fadeIn 3s ease-in-out;',
        'spin': 'spinSlower .5s linear ',
      },
      keyframes: {
        'fadeIn': {
          '0%': {
            opacity: '0'
          },
          '100%': {
            opacity: '1'
          }
        },
        'spinSlower':{
          'from':{
            transform: 'translateX(10px)'
          } ,
          'to': {
            transform: 'translateX(0px)'
          }
        }

      }
    },
  },
  variants: {
    extend:{
      transform:['active']
    }
  },
  plugins: [],
}

