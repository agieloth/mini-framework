// main.js - Version corrigée avec exemples de test

import { App } from './app/app.js';
import { createStore } from './app/store.js';

// Créer le store global
const store = createStore({ 
  count: 0, 
  message: 'Bonjour Framework!' 
});

// ==================== COMPOSANTS DE TEST ====================

// Composant bouton réutilisable
function MyButton({ label, onClick, className = 'my-button' }) {
  return {
    tag: 'button',
    attrs: {
      onclick: onClick,
      class: className,
      style: 'margin: 5px; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;'
    },
    children: [label]
  };
}

// Page d'accueil
function Home() {
  return {
    tag: 'div',
    attrs: { class: 'home-page' },
    children: [
      {
        tag: 'h1',
        children: ['🏠 Page d\'accueil']
      },
      {
        tag: 'p',
        children: ['Bienvenue dans mon framework personnalisé !']
      },
      {
        tag: 'div',
        children: [
          MyButton({
            label: 'Aller à About',
            onClick: () => App.navigate('/about')
          }),
          MyButton({
            label: 'Aller au Counter',
            onClick: () => App.navigate('/counter')
          })
        ]
      }
    ]
  };
}

// Page à propos
function About() {
  return {
    tag: 'div',
    attrs: { class: 'about-page' },
    children: [
      {
        tag: 'h1',
        children: ['📖 À propos']
      },
      {
        tag: 'p',
        children: ['Ce framework implémente :']
      },
      {
        tag: 'ul',
        children: [
          { tag: 'li', children: ['✅ Abstraction du DOM'] },
          { tag: 'li', children: ['✅ Système de routing'] },
          { tag: 'li', children: ['✅ Gestion d\'état'] },
          { tag: 'li', children: ['✅ Gestion d\'événements'] }
        ]
      },
      MyButton({
        label: 'Retour à l\'accueil',
        onClick: () => App.navigate('/')
      })
    ]
  };
}

// Compteur avec state management
function Counter() {
  const state = store.getState();

  return {
    tag: 'div',
    attrs: { class: 'counter-page' },
    children: [
      {
        tag: 'h1',
        children: ['🔢 Compteur']
      },
      {
        tag: 'div',
        attrs: { 
          style: 'padding: 20px; border: 2px solid #ddd; border-radius: 8px; margin: 20px 0;'
        },
        children: [
          {
            tag: 'p',
            attrs: { style: 'font-size: 24px; font-weight: bold;' },
            children: [`Valeur : ${state.count}`]
          },
          {
            tag: 'p',
            children: [`Message : ${state.message}`]
          }
        ]
      },
      {
        tag: 'div',
        children: [
          MyButton({
            label: '➕ Incrémenter',
            onClick: () => store.setState({ count: state.count + 1 })
          }),
          MyButton({
            label: '➖ Décrémenter', 
            onClick: () => store.setState({ count: state.count - 1 })
          }),
          MyButton({
            label: '🔄 Reset',
            onClick: () => store.setState({ count: 0 })
          }),
          MyButton({
            label: '📝 Changer message',
            onClick: () => store.setState({ 
              message: `Mis à jour à ${new Date().toLocaleTimeString()}` 
            })
          })
        ]
      },
      MyButton({
        label: 'Retour à l\'accueil',
        onClick: () => App.navigate('/')
      })
    ]
  };
}

// Test des événements personnalisés
function EventsTest() {
  return {
    tag: 'div',
    attrs: { class: 'events-test' },
    children: [
      {
        tag: 'h1',
        children: ['🎯 Test des événements']
      },
      {
        tag: 'div',
        attrs: { style: 'margin: 20px 0;' },
        children: [
          {
            tag: 'button',
            attrs: {
              onclick: () => alert('Événement via attrs.onclick'),
              style: 'margin: 5px; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px;'
            },
            children: ['Click via attrs']
          },
          {
            tag: 'button',
            events: {
              click: () => alert('Événement via events.click'),
              mouseover: () => console.log('Survol détecté!')
            },
            attrs: {
              style: 'margin: 5px; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 4px;'
            },
            children: ['Click via events']
          },
          {
            tag: 'input',
            attrs: {
              type: 'text',
              placeholder: 'Tapez quelque chose...',
              style: 'margin: 5px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;'
            },
            events: {
              input: (e) => console.log('Input value:', e.target.value),
              focus: () => console.log('Input focused'),
              blur: () => console.log('Input blurred')
            }
          }
        ]
      },
      MyButton({
        label: 'Retour à l\'accueil',
        onClick: () => App.navigate('/')
      })
    ]
  };
}

// Page 404 personnalisée
function NotFound() {
  return {
    tag: 'div',
    attrs: { 
      class: 'not-found',
      style: 'text-align: center; padding: 50px;'
    },
    children: [
      {
        tag: 'h1',
        attrs: { style: 'color: #dc3545; font-size: 48px;' },
        children: ['404']
      },
      {
        tag: 'p',
        children: ['Page introuvable']
      },
      MyButton({
        label: 'Retour à l\'accueil',
        onClick: () => App.navigate('/')
      })
    ]
  };
}

// ==================== CONFIGURATION ====================

// Définir les routes
App.defineRoutes({
  '/': Home,
  '/about': About,
  '/counter': Counter,
  '/events': EventsTest,
  '/404': NotFound
});

// Démarrer le routing
App.startRouting();

// S'abonner aux changements de state pour re-render
const unsubscribe = store.subscribe(() => {
  console.log('State changé, re-render...');
  App.handleRouteChange();
});

// Debug info
console.log('Framework initialisé!');
console.log('Routes disponibles:', Object.keys(App.routes));
console.log('Store initial:', store.debug());