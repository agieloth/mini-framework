// app/todoComponents.js - Composants pour TodoMVC

import { todoActions, todoSelectors } from './todoStore.js';

// Composant pour un todo individuel
export function TodoItem({ todo }) {
  const handleToggle = () => todoActions.toggleTodo(todo.id);
  const handleDestroy = () => todoActions.deleteTodo(todo.id);
  const handleEdit = () => todoActions.startEditing(todo.id);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      todoActions.saveEdit(todo.id, e.target.value);
    } else if (e.key === 'Escape') {
      todoActions.cancelEdit(todo.id);
    }
  };

  const handleBlur = (e) => {
    if (todo.editing) {
      todoActions.saveEdit(todo.id, e.target.value);
    }
  };

  // Classes CSS conditionnelles
  const liClass = [
    todo.completed ? 'completed' : '',
    todo.editing ? 'editing' : ''
  ].filter(Boolean).join(' ');

  return {
    tag: 'li',
    attrs: { class: liClass },
    children: [
      // Vue normale
      {
        tag: 'div',
        attrs: { class: 'view' },
        children: [
          {
            tag: 'input',
            attrs: {
              class: 'toggle',
              type: 'checkbox',
              ...(todo.completed ? { checked: 'checked' } : {})
            },
            events: {
              change: handleToggle
            }
          },
          {
            tag: 'label',
            children: [todo.text],
            events: {
              dblclick: handleEdit
            }
          },
          {
            tag: 'button',
            attrs: { class: 'destroy' },
            events: {
              click: handleDestroy
            }
          }
        ]
      },
      // Input d'édition
      {
        tag: 'input',
        attrs: {
          class: 'edit',
          value: todo.text
        },
        events: {
          keydown: handleKeyDown,
          blur: handleBlur,
          focus: (e) => {
            // Sélectionner tout le texte lors du focus
            e.target.select();
          }
        }
      }
    ]
  };
}

// Composant pour la liste des todos
export function TodoList() {
  const filteredTodos = todoSelectors.getFilteredTodos();

  return {
    tag: 'ul',
    attrs: { class: 'todo-list' },
    children: filteredTodos.map(todo => TodoItem({ todo }))
  };
}

// Composant pour l'input de nouveau todo
export function NewTodoInput() {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const text = e.target.value.trim();
      if (text) {
        todoActions.addTodo(text);
        e.target.value = '';
      }
    }
  };

  return {
    tag: 'input',
    attrs: {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: 'autofocus'
    },
    events: {
      keydown: handleKeyDown
    }
  };
}

// Composant pour le bouton "toggle all"
export function ToggleAllButton() {
  const allCompleted = todoSelectors.areAllCompleted();
  const hasAnyTodos = todoSelectors.getAllTodos().length > 0;

  if (!hasAnyTodos) {
    return null;
  }

  return {
    tag: 'div',
    children: [
      {
        tag: 'input',
        attrs: {
          id: 'toggle-all',
          class: 'toggle-all',
          type: 'checkbox',
          ...(allCompleted ? { checked: 'checked' } : {})
        },
        events: {
          change: () => todoActions.toggleAll()
        }
      },
      {
        tag: 'label',
        attrs: { for: 'toggle-all' },
        children: ['Mark all as complete']
      }
    ]
  };
}

// Composant pour les filtres
export function TodoFilters() {
  const currentFilter = todoSelectors.getCurrentFilter();

  const filters = [
    { key: 'all', label: 'All', hash: '#/' },
    { key: 'active', label: 'Active', hash: '#/active' },
    { key: 'completed', label: 'Completed', hash: '#/completed' }
  ];

  return {
    tag: 'ul',
    attrs: { class: 'filters' },
    children: filters.map(filter => ({
      tag: 'li',
      children: [
        {
          tag: 'a',
          attrs: {
            href: filter.hash,
            class: currentFilter === filter.key ? 'selected' : ''
          },
          children: [filter.label],
          events: {
            click: (e) => {
              e.preventDefault();
              todoActions.setFilter(filter.key);
              window.location.hash = filter.hash;
            }
          }
        }
      ]
    }))
  };
}

// Composant pour le footer
export function TodoFooter() {
  const activeCount = todoSelectors.getActiveCount();
  const hasCompletedTodos = todoSelectors.hasCompletedTodos();
  const allTodos = todoSelectors.getAllTodos();

  if (allTodos.length === 0) {
    return null;
  }

  const itemText = activeCount === 1 ? 'item' : 'items';

  return {
    tag: 'footer',
    attrs: { class: 'footer' },
    children: [
      {
        tag: 'span',
        attrs: { class: 'todo-count' },
        children: [
          {
            tag: 'strong',
            children: [String(activeCount)]
          },
          ` ${itemText} left`
        ]
      },
      TodoFilters(),
      {
        tag: 'button',
        attrs: { 
          class: 'clear-completed'
        },
        children: ['Clear completed'],
        events: {
          click: () => todoActions.clearCompleted()
        }
      }
    ].filter(Boolean)
  };
}

// Composant principal TodoMVC
export function TodoApp() {
  const allTodos = todoSelectors.getAllTodos();
  const hasAnyTodos = allTodos.length > 0;

  return {
    tag: 'div',
    children: [
      {
        tag: 'section',
        attrs: { class: 'todoapp' },
        children: [
          {
            tag: 'header',
            attrs: { class: 'header' },
            children: [
              {
                tag: 'h1',
                children: ['todos']
              },
              NewTodoInput()
            ]
          },
          hasAnyTodos ? {
            tag: 'section',
            attrs: { class: 'main' },
            children: [
              ToggleAllButton(),
              TodoList()
            ].filter(Boolean)
          } : null,
          TodoFooter()
        ].filter(Boolean)
      },
      {
        tag: 'footer',
        attrs: { class: 'info' },
        children: [
          {
            tag: 'p',
            children: ['Double-click to edit a todo']
          },
          {
            tag: 'p',
            children: [
              'Created with ',
              {
                tag: 'strong',
                children: ['Mini Framework']
              }
            ]
          }
        ]
      }
    ]
  };
}