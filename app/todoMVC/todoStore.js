// app/todoStore.js - Store spécialisé pour TodoMVC

import { createStore } from '../../framework/store.js';

// État initial des todos
const initialState = {
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  nextId: 1
};

// Créer le store des todos
export const todoStore = createStore(initialState);

// Actions pour les todos
export const todoActions = {
  // Ajouter un todo
  addTodo(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    
    const state = todoStore.getState();
    const newTodo = {
      id: state.nextId,
      text: trimmedText,
      completed: false,
      editing: false
    };
    
    todoStore.setState({
      todos: [...state.todos, newTodo],
      nextId: state.nextId + 1
    });
  },

  // Supprimer un todo
  deleteTodo(id) {
    const state = todoStore.getState();
    todoStore.setState({
      todos: state.todos.filter(todo => todo.id !== id)
    });
  },

  // Basculer le statut completed d'un todo
  toggleTodo(id) {
    const state = todoStore.getState();
    todoStore.setState({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  },

  // Éditer un todo
  startEditing(id) {
    const state = todoStore.getState();
    todoStore.setState({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, editing: true } : { ...todo, editing: false }
      )
    });
  },

  // Sauvegarder l'édition
  saveEdit(id, newText) {
    const trimmedText = newText.trim();
    const state = todoStore.getState();
    
    if (!trimmedText) {
      // Si le texte est vide, supprimer le todo
      this.deleteTodo(id);
    } else {
      todoStore.setState({
        todos: state.todos.map(todo =>
          todo.id === id 
            ? { ...todo, text: trimmedText, editing: false }
            : todo
        )
      });
    }
  },

  // Annuler l'édition
  cancelEdit(id) {
    const state = todoStore.getState();
    todoStore.setState({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, editing: false } : todo
      )
    });
  },

  // Basculer tous les todos
  toggleAll() {
    const state = todoStore.getState();
    const allCompleted = state.todos.every(todo => todo.completed);
    
    todoStore.setState({
      todos: state.todos.map(todo => ({
        ...todo,
        completed: !allCompleted
      }))
    });
  },

  // Supprimer tous les todos complétés
  clearCompleted() {
    const state = todoStore.getState();
    todoStore.setState({
      todos: state.todos.filter(todo => !todo.completed)
    });
  },

  // Changer le filtre
  setFilter(filter) {
    todoStore.setState({ filter });
  }
};

// Sélecteurs pour calculer les données dérivées
export const todoSelectors = {
  // Tous les todos
  getAllTodos() {
    return todoStore.getState().todos;
  },

  // Todos filtrés selon le filtre actuel
  getFilteredTodos() {
    const state = todoStore.getState();
    const { todos, filter } = state;
    
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },

  // Nombre de todos actifs
  getActiveCount() {
    const todos = this.getAllTodos();
    return todos.filter(todo => !todo.completed).length;
  },

  // Nombre de todos complétés
  getCompletedCount() {
    const todos = this.getAllTodos();
    return todos.filter(todo => todo.completed).length;
  },

  // Y a-t-il des todos complétés ?
  hasCompletedTodos() {
    return this.getCompletedCount() > 0;
  },

  // Tous les todos sont-ils complétés ?
  areAllCompleted() {
    const todos = this.getAllTodos();
    return todos.length > 0 && todos.every(todo => todo.completed);
  },

  // Filtre actuel
  getCurrentFilter() {
    return todoStore.getState().filter;
  }
};