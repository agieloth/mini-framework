# 🚀 Mini Framework

Un framework JavaScript léger et moderne pour créer des applications web interactives avec une approche déclarative.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Installation](#-installation)
- [Démarrage rapide](#-démarrage-rapide)
- [Guide d'utilisation](#-guide-dutilisation)
- [API Documentation](#-api-documentation)
- [TodoMVC Demo](#-todomvc-demo)
- [Architecture](#-architecture)
- [Exemples](#-exemples)

## ✨ Fonctionnalités

- **🎯 Abstraction du DOM** : Manipulation du DOM via des objets JavaScript (Virtual Nodes)
- **🧭 Système de routing** : Navigation hash-based avec synchronisation URL/état
- **📦 Gestion d'état** : Store global réactif avec système de souscription
- **⚡ Gestion d'événements** : Système d'événements intégré et alternatif à `addEventListener`
- **🔄 Réactivité** : Mise à jour automatique de l'interface lors des changements d'état
- **📱 Composants** : Architecture basée sur des composants réutilisables

## 🔧 Installation

1. Cloner ou télécharger le projet
2. Servir les fichiers via un serveur local (ex: Live Server, http-server)

```bash
# Avec Node.js
npx http-server .

# Ou avec Python
python -m http.server 8000
```

## 🚀 Démarrage rapide

### Structure des fichiers

```
project/
├── index.html              # Page principale de test
├── main.js                 # Point d'entrée principal
├── todo.html               # Page TodoMVC
├── todoMain.js             # Point d'entrée TodoMVC
├── todoStyles.css          # Styles TodoMVC
├── app/
│   ├── app.js              # Système de routing
│   ├── dom.js              # Abstraction DOM et rendu
│   ├── store.js            # Gestion d'état global
│   ├── todoStore.js        # Store spécialisé pour TodoMVC
│   └── todoComponents.js   # Composants TodoMVC
└── README.md
```

### Premier exemple

```javascript
import { App } from './app/app.js';
import { createStore } from './app/store.js';

// Créer un store
const store = createStore({ count: 0 });

// Créer un composant
function Counter() {
  const state = store.getState();
  
  return {
    tag: 'div',
    children: [
      {
        tag: 'p',
        children: [`Compteur : ${state.count}`]
      },
      {
        tag: 'button',
        attrs: {
          onclick: () => store.setState({ count: state.count + 1 })
        },
        children: ['Incrémenter']
      }
    ]
  };
}

// Configurer les routes
App.defineRoutes({
  '/': Counter
});

// Démarrer l'application
App.startRouting();
store.subscribe(() => App.handleRouteChange());
```

## 📖 Guide d'utilisation

### 1. Virtual Nodes (VNodes)

Les VNodes sont des objets JavaScript qui représentent des éléments DOM :

```javascript
const vnode = {
  tag: 'div',
  attrs: { 
    class: 'container',
    id: 'main' 
  },
  children: [
    'Hello ',
    { 
      tag: 'strong', 
      children: ['World!'] 
    }
  ]
};
```

### 2. Gestion d'événements

Deux méthodes pour gérer les événements :

```javascript
// Méthode 1 : Via attrs (compatible onclick, onchange, etc.)
{
  tag: 'button',
  attrs: {
    onclick: () => alert('Clicked!')
  },
  children: ['Click me']
}

// Méthode 2 : Via events (plus flexible)
{
  tag: 'button',
  events: {
    click: handleClick,
    mouseover: handleMouseOver,
    focus: handleFocus
  },
  children: ['Advanced button']
}
```

### 3. Composants réutilisables

```javascript
function MyButton({ label, onClick, className = 'btn' }) {
  return {
    tag: 'button',
    attrs: {
      class: className,
      onclick: onClick
    },
    children: [label]
  };
}

// Utilisation
const buttonVNode = MyButton({
  label: 'Cliquez ici',
  onClick: () => console.log('Button clicked!')
});
```

### 4. Gestion d'état avec Store

```javascript
import { createStore } from './app/store.js';

// Créer un store
const store = createStore({
  user: null,
  todos: [],
  loading: false
});

// Lire l'état
const state = store.getState();

// Modifier l'état
store.setState({ 
  user: { name: 'John', id: 1 } 
});

// Modification avec fonction
store.setState(currentState => ({
  todos: [...currentState.todos, newTodo]
}));

// S'abonner aux changements
const unsubscribe = store.subscribe((newState) => {
  console.log('State updated:', newState);
  // Re-render l'application
});
```

### 5. Routing

```javascript
import { App } from './app/app.js';

// Définir les routes
App.defineRoutes({
  '/': HomePage,
  '/about': AboutPage,
  '/user/:id': UserPage,  // Paramètres non implémentés encore
  '/404': NotFoundPage
});

// Démarrer le routing
App.startRouting();

// Navigation programmatique
App.navigate('/about');

// Obtenir la route actuelle
const currentRoute = App.getCurrentRoute();
```

## 🛠 API Documentation

### App (Routing)

```javascript
App.defineRoutes(routes)     // Définir les routes
App.startRouting()           // Démarrer le système de routing
App.handleRouteChange()      // Gérer manuellement un changement de route
App.navigate(route)          // Navigation programmatique
App.getCurrentRoute()        // Obtenir la route actuelle
```

### Store (State Management)

```javascript
const store = createStore(initialState)

store.getState()            // Obtenir l'état actuel
store.setState(newState)    // Mettre à jour l'état
store.subscribe(listener)   // S'abonner aux changements
store.debug()              // Informations de débogage
```

### Render (DOM)

```javascript
import { render } from './app/dom.js';

const element = render(vnode)  // Convertir VNode en élément DOM
```

## 🎯 TodoMVC Demo

Une implémentation complète de TodoMVC est incluse pour démontrer les capacités du framework.

### Lancer TodoMVC

1. Ouvrir `todo.html` dans votre navigateur
2. Ou ajouter `?demo=true` pour charger des données de test

### Fonctionnalités TodoMVC

- ✅ Ajouter/supprimer des todos
- ✅ Marquer comme complété/non complété
- ✅ Édition en place (double-clic)
- ✅ Filtrage (All/Active/Completed)
- ✅ Compteur des tâches restantes
- ✅ Supprimer toutes les tâches complétées
- ✅ Marquer tout comme complété/non complété

### Architecture TodoMVC

```javascript
// todoStore.js - Logique métier
export const todoActions = {
  addTodo(text),
  deleteTodo(id),
  toggleTodo(id),
  // ... autres actions
};

export const todoSelectors = {
  getFilteredTodos(),
  getActiveCount(),
  // ... autres sélecteurs
};

// todoComponents.js - Composants UI
export function TodoItem({ todo })
export function TodoList()
export function TodoApp()
```

## 🏗 Architecture

### Flux de données

```
User Action → Store Action → State Change → Re-render → DOM Update
```

### Composants principaux

1. **DOM Abstraction** (`dom.js`)
   - Convertit les VNodes en éléments DOM
   - Gère les événements et attributs

2. **State Management** (`store.js`)
   - Store réactif avec pattern Observer
   - Support des updates fonctionnels

3. **Routing** (`app.js`)
   - Hash-based routing
   - Synchronisation automatique

4. **Components** (pattern fonctionnel)
   - Fonctions pures qui retournent des VNodes
   - Réutilisables et composables

## 💡 Exemples

### Exemple 1 : Liste dynamique

```javascript
function TodoList() {
  const todos = store.getState().todos;
  
  return {
    tag: 'ul',
    children: todos.map(todo => ({
      tag: 'li',
      attrs: { 
        class: todo.completed ? 'completed' : '' 
      },
      children: [todo.text]
    }))
  };
}
```

### Exemple 2 : Formulaire avec validation

```javascript
function ContactForm() {
  const state = store.getState();
  
  return {
    tag: 'form',
    events: {
      submit: (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        store.setState({ 
          message: `Hello ${formData.get('name')}!` 
        });
      }
    },
    children: [
      {
        tag: 'input',
        attrs: { 
          name: 'name',
          placeholder: 'Votre nom',
          required: true
        }
      },
      {
        tag: 'button',
        attrs: { type: 'submit' },
        children: ['Envoyer']
      },
      state.message ? {
        tag: 'p',
        children: [state.message]
      } : null
    ].filter(Boolean)
  };
}
```

### Exemple 3 : Composant avec état local simulé

```javascript
function Counter() {
  const state = store.getState();
  const count = state.count || 0;
  
  return {
    tag: 'div',
    attrs: { class: 'counter' },
    children: [
      {
        tag: 'h2',
        children: [`Count: ${count}`]
      },
      {
        tag: 'div',
        children: [
          {
            tag: 'button',
            attrs: {
              onclick: () => store.setState({ count: count - 1 })
            },
            children: ['-']
          },
          {
            tag: 'button',
            attrs: {
              onclick: () => store.setState({ count: count + 1 })
            },
            children: ['+']
          },
          {
            tag: 'button',
            attrs: {
              onclick: () => store.setState({ count: 0 })
            },
            children: ['Reset']
          }
        ]
      }
    ]
  };
}
```

## 🔍 Debugging et bonnes pratiques

### Console debugging

```javascript
// Debug du store
console.log(store.debug());

// Logging des changements de routes
App.startRouting(); // Les logs sont automatiques

// Vérification de l'état actuel
console.log('Current route:', App.getCurrentRoute());
console.log('Current state:', store.getState());
```

### Bonnes pratiques

1. **Composants purs** : Les composants doivent être des fonctions pures
2. **État immutable** : Toujours créer de nouveaux objets pour les mises à jour
3. **Sélecteurs** : Utiliser des sélecteurs pour calculer les données dérivées
4. **Actions** : Centraliser la logique métier dans des actions
5. **Gestion d'erreur** : Entourer les actions critiques de try/catch

## 🚧 Limitations actuelles

- Pas de diffing/reconciliation avancée (re-render complet)
- Pas de gestion des paramètres de route
- Pas de middleware pour le store
- Pas de support des hooks/état local des composants
- Pas de server-side rendering

## 🎯 Prochaines étapes

- [ ] Système de diffing pour optimiser les re-renders
- [ ] Support des paramètres de route (ex: `/user/:id`)
- [ ] Middleware pour le store (logging, persistance)
- [ ] Système d'hooks pour état local
- [ ] Tests unitaires
- [ ] Support TypeScript

## 📄 Licence

Ce projet est sous licence MIT. Libre d'utilisation pour vos projets personnels et commerciaux.

---

**Créé avec ❤️ pour apprendre les concepts fondamentaux des frameworks JavaScript modernes.**