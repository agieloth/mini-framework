# 🚀 Mini Framework

Un framework JavaScript léger pour créer des applications web interactives avec une approche déclarative, incluant une démo TodoMVC complète.

## ✨ Fonctionnalités

- **🎯 Virtual DOM** : Manipulation du DOM via des objets JavaScript (VNodes)
- **🧭 Routing** : Navigation hash-based avec synchronisation URL/état
- **📦 Store** : Gestion d'état global réactif avec système de souscription
- **⚡ Événements** : Système d'événements intégré
- **🔄 Réactivité** : Mise à jour automatique de l'interface
- **📱 Composants** : Architecture basée sur des composants réutilisables

## 🔧 Installation

Servir les fichiers via un serveur local :

```bash
# Avec Node.js
npx http-server .

# Ou avec Live Server (VS Code)
# Clic droit sur index.html → "Open with Live Server"
```

## 🚀 Démarrage rapide

### Structure du projet

```
mini-framework/
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

### Exemple simple

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

// Configurer et démarrer
App.defineRoutes({ '/': Counter });
App.startRouting();
store.subscribe(() => App.handleRouteChange());
```

## 📖 Concepts principaux

### 1. Virtual Nodes (VNodes)

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

```javascript
// Via attrs
{
  tag: 'button',
  attrs: {
    onclick: () => alert('Clicked!')
  },
  children: ['Click me']
}

// Via events (plus flexible)
{
  tag: 'button',
  events: {
    click: handleClick,
    mouseover: handleMouseOver
  },
  children: ['Advanced button']
}
```

### 3. Store réactif

```javascript
import { createStore } from './app/store.js';

const store = createStore({ count: 0 });

// Lire l'état
const state = store.getState();

// Modifier l'état
store.setState({ count: state.count + 1 });

// S'abonner aux changements
store.subscribe((newState) => {
  console.log('State updated:', newState);
});
```

### 4. Routing

```javascript
import { App } from './app/app.js';

// Définir les routes
App.defineRoutes({
  '/': HomePage,
  '/about': AboutPage,
  '/counter': CounterPage
});

// Démarrer le routing
App.startRouting();

// Navigation programmatique
App.navigate('/about');
```

## 🎯 TodoMVC Demo

Une implémentation complète de TodoMVC est incluse pour démontrer les capacités du framework.

### Lancer TodoMVC

1. Ouvrir `todo.html` dans votre navigateur
2. Ou ajouter `?demo=true` pour charger des données de test

### Fonctionnalités

- ✅ Ajouter/supprimer des todos
- ✅ Marquer comme complété/non complété
- ✅ Édition en place (double-clic)
- ✅ Filtrage (All/Active/Completed)
- ✅ Compteur des tâches restantes
- ✅ Supprimer toutes les tâches complétées
- ✅ Marquer tout comme complété/non complété

## 🛠 API Reference

### App (Routing)
```javascript
App.defineRoutes(routes)     // Définir les routes
App.startRouting()           // Démarrer le système de routing
App.navigate(route)          // Navigation programmatique
App.getCurrentRoute()        // Obtenir la route actuelle
```

### Store (State Management)
```javascript
const store = createStore(initialState)

store.getState()            // Obtenir l'état actuel
store.setState(newState)    // Mettre à jour l'état
store.subscribe(listener)   // S'abonner aux changements
```

### Render (DOM)
```javascript
import { render } from './app/dom.js';

const element = render(vnode)  // Convertir VNode en élément DOM
```

## 🏗 Architecture

### Flux de données
```
User Action → Store Action → State Change → Re-render → DOM Update
```

### Composants principaux

1. **DOM Abstraction** (`dom.js`) - Convertit les VNodes en éléments DOM
2. **State Management** (`store.js`) - Store réactif avec pattern Observer
3. **Routing** (`app.js`) - Hash-based routing avec synchronisation automatique
4. **Components** - Fonctions pures qui retournent des VNodes

## 💡 Exemple avancé : Composant réutilisable

```javascript
function TodoItem({ todo }) {
  const handleToggle = () => todoActions.toggleTodo(todo.id);
  const handleDestroy = () => todoActions.deleteTodo(todo.id);

  return {
    tag: 'li',
    attrs: { 
      class: todo.completed ? 'completed' : '' 
    },
    children: [
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
            events: { change: handleToggle }
          },
          {
            tag: 'label',
            children: [todo.text]
          },
          {
            tag: 'button',
            attrs: { class: 'destroy' },
            events: { click: handleDestroy }
          }
        ]
      }
    ]
  };
}
```

## 🔍 Debugging

```javascript
// Debug du store
console.log(store.getState());

// Debug des routes
console.log('Current route:', App.getCurrentRoute());
console.log('Available routes:', Object.keys(App.routes));
```

## 🚧 Limitations actuelles

- Pas de diffing/reconciliation avancée (re-render complet)
- Pas de gestion des paramètres de route
- Pas de support des hooks/état local des composants

## 📄 Licence

MIT - Libre d'utilisation pour vos projets personnels et commerciaux.

---

**Créé pour apprendre les concepts fondamentaux des frameworks JavaScript modernes.**