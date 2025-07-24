// todoMain.js - Point d'entrée pour TodoMVC

import { App } from '../../framework/app.js';
import { render } from '../../framework/dom.js';
import { todoStore, todoActions } from './todoStore.js';
import { TodoApp } from './todoComponents.js';

// Fonction pour re-render l'application
function renderApp() {
  const root = document.getElementById('app');
  const vnode = TodoApp();
  const element = render(vnode);
  
  root.innerHTML = '';
  root.appendChild(element);
}

// Gestion du routing pour les filtres
function handleRouting() {
  const hash = window.location.hash.slice(1) || '/';
  
  let filter = 'all';
  if (hash === '/active') {
    filter = 'active';
  } else if (hash === '/completed') {
    filter = 'completed';
  }
  
  todoActions.setFilter(filter);
}

// Écouter les changements de hash pour le routing
window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);

// S'abonner aux changements du store pour re-render
todoStore.subscribe(() => {
  renderApp();
});

// Rendu initial
handleRouting();
renderApp();

// Données de test (optionnel - à supprimer en production)
if (window.location.search.includes('demo=true')) {
  console.log('Chargement des données de démonstration...');
  todoActions.addTodo('Learn about TodoMVC');
  todoActions.addTodo('Try the Mini Framework');
  todoActions.addTodo('Build something awesome');
  todoActions.toggleTodo(1); // Marquer le premier comme complété
}

console.log('TodoMVC application initialized!');
console.log('Available routes: #/, #/active, #/completed');
console.log('Add ?demo=true to URL for demo data');