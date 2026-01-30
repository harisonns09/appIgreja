import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Se você estiver usando o 'base' para o GitHub Pages, pode remover ou deixar '/' para Vercel
  // A Vercel geralmente lida bem com a raiz, então pode deixar sem o 'base' ou '/'
  
  build: {
    rollupOptions: {
      input: {
        // Liste AQUI todas as páginas do seu site
        main: resolve(__dirname, 'index.html'),
        
        // Páginas da pasta 'pages'
        login: resolve(__dirname, 'pages/login.html'),
        inscricao: resolve(__dirname, 'pages/inscricao.html'),
        eventos: resolve(__dirname, 'pages/eventos.html'),
        evento: resolve(__dirname, 'pages/evento.html'),
        membros: resolve(__dirname, 'pages/members.html'), // verifique se o nome é members ou membros
        novomembro: resolve(__dirname, 'pages/membro.html'),
        ministerios: resolve(__dirname, 'pages/ministerios.html'),
        novoministerio: resolve(__dirname, 'pages/ministerio.html'),
        // adicione qualquer outra página .html que faltar aqui
      },
    },
  },
});
