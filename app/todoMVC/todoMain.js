// todoMain.js

import { render } from '../../framework/dom.js';
import { todoStore, todoActions } from './todoStore.js';
import { TodoAppContent, InfoFooter } from './todoComponents.js';

// Rendre dans body au lieu de #app
function renderApp() {

  const activeElement = document.activeElement;
  const wasNewTodoFocused = activeElement?.id === 'todo-input';
  const wasEditingFocused = activeElement?.classList.contains('edit');
  const editingValue = wasEditingFocused ? activeElement.value : null;

  // Trouver ou créer la section todoapp
  let todoappSection = document.querySelector('section.todoapp');
  
  if (!todoappSection) {
    // Créer la section si elle n'existe pas
    todoappSection = document.createElement('section');
    todoappSection.className = 'todoapp';
    todoappSection.id = 'root';
    document.body.appendChild(todoappSection);
  }
  
  // Rendre le contenu de la todoapp
  const contentVnode = TodoAppContent();
  todoappSection.innerHTML = '';
  contentVnode.forEach(vnode => {
    const element = render(vnode);
    todoappSection.appendChild(element);
  });
  
  // Rendre le footer.info
  let infoFooter = document.querySelector('footer.info');
  if (!infoFooter) {
    infoFooter = document.createElement('footer');
    infoFooter.className = 'info';
    document.body.appendChild(infoFooter);
  }
  
  const footerVnode = InfoFooter();
  const footerElement = render(footerVnode);
  infoFooter.innerHTML = '';
  footerElement.childNodes.forEach(node => {
    infoFooter.appendChild(node.cloneNode(true));
  });

  // Restaurer le focus si nécessaire
  if (wasNewTodoFocused) {
    const newTodoInput = document.getElementById('todo-input');
    if (newTodoInput) {
      newTodoInput.focus();
    }
  } else if (wasEditingFocused) {
    const editInput = document.querySelector('.edit');
    if (editInput) {
      editInput.focus();
      if (editingValue !== null) {
        editInput.value = editingValue;
        editInput.setSelectionRange(editingValue.length, editingValue.length);
      }
    }
  }
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
  todoActions.toggleTodo(1);
}

console.log('TodoMVC application initialized!');
console.log('Available routes: #/, #/active, #/completed');
console.log('Add ?demo=true to URL for demo data');