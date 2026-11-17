import { createApp } from 'vue'
import App from './App.vue'
import { i18n, ready } from './i18n'
import './style.css'

// espera o idioma salvo carregar, para a primeira tela já aparecer no idioma certo
ready.then(() => createApp(App).use(i18n).mount('#app'))
