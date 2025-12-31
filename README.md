# 🚀 Mini Framework

Un framework JavaScript léger créé **from scratch** sans utiliser React, Angular, Vue ou autres frameworks existants.

## ✨ Caractéristiques

- **🎯 Virtual DOM** : Manipulation du DOM via des Virtual Nodes (VNodes)
- **🧭 Routing** : Système de navigation hash-based (#/)
- **📦 State Management** : Store réactif avec pattern Observer/Publisher-Subscriber
- **⚡ Event Handling** : Système d'événements custom (alternative à addEventListener)
- **📱 Composants** : Architecture basée sur des composants réutilisables
- **🔄 Réactivité** : Mise à jour automatique de l'interface lors des changements d'état

## 🎯 Projet TodoMVC Inclus

Une implémentation complète de [TodoMVC](https://todomvc.com/) est fournie comme démonstration des capacités du framework.

**Fonctionnalités TodoMVC :**
- ✅ Ajouter/supprimer des tâches
- ✅ Marquer comme complété/non complété
- ✅ Édition en place (double-clic)
- ✅ Filtrage (All/Active/Completed)
- ✅ Compteur des tâches restantes
- ✅ Supprimer toutes les tâches complétées
- ✅ Marquer tout comme complété/non complété

---

## 🚀 Démarrage Rapide

### Prérequis

Un serveur HTTP local pour servir les fichiers (requis pour les modules ES6).

### Installation

```bash
# Option 1 : Avec Node.js/npx
npx http-server .

# Option 2 : Avec Python
python -m http.server 8080

# Option 3 : Avec Live Server (VS Code)
# Installer l'extension "Live Server" puis clic droit sur le fichier HTML
```

### Lancer TodoMVC

```bash
# Démarrer le serveur
npx http-server .

# Ouvrir dans le navigateur
http://localhost:8080/app/todoMVC/todo.html

# Avec données de démonstration
http://localhost:8080/app/todoMVC/todo.html?demo=true
```

### Lancer les exemples

```bash
# Ouvrir dans le navigateur
http://localhost:8080/app/exemples/index.html
```

---

## 📖 Documentation Complète

**La documentation technique détaillée se trouve dans :** [`framework/README.md`](framework/README.md)

Elle contient :
- Guide d'utilisation complet
- API Reference
- Exemples de code avancés
- Architecture du framework
- Explications des concepts

---

## 💡 Exemple Simple

```javascript
import { App } from './framework/app.js';
import { createStore } from './framework/store.js';

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

// Configurer l'application
App.defineRoutes({ '/': Counter });
App.startRouting();

// Réactivité : re-render à chaque changement
store.subscribe(() => App.handleRouteChange());
```

---

## 🏗️ Structure du Projet

```
mini-framework/
├── README.md              # Ce fichier
├── framework/             # Core du framework
│   ├── README.md         # Documentation technique détaillée
│   ├── app.js            # Système de routing
│   ├── dom.js            # Abstraction DOM (Virtual Nodes)
│   └── store.js          # Gestion d'état global
└── app/                  # Applications de démonstration
    ├── exemples/         # Exemples de test du framework
    │   ├── index.html   # Page HTML
    │   └── main.js      # Code de test (routing, state, events)
    └── todoMVC/          # Application TodoMVC complète
        ├── todo.html        # Page HTML
        ├── todoStyles.css   # Styles conforme TodoMVC
        ├── todoStore.js     # Store spécialisé pour todos
        ├── todoComponents.js # Composants TodoMVC
        └── todoMain.js      # Point d'entrée
```

---

## 🔧 API du Framework

### 1. Créer un élément (Virtual Node)

```javascript
const element = {
  tag: 'div',
  attrs: { 
    class: 'container',
    id: 'main',
    style: 'color: blue;'
  },
  children: ['Hello World!']
};
```

### 2. Imbriquer des éléments

```javascript
const nested = {
  tag: 'div',
  children: [
    {
      tag: 'h1',
      children: ['Titre']
    },
    {
      tag: 'ul',
      children: [
        { tag: 'li', children: ['Item 1'] },
        { tag: 'li', children: ['Item 2'] }
      ]
    }
  ]
};
```

### 3. Ajouter des événements

```javascript
// Méthode 1 : Via attrs (simple)
{
  tag: 'button',
  attrs: {
    onclick: () => alert('Clicked!')
  },
  children: ['Click me']
}

// Méthode 2 : Via events (recommandée)
{
  tag: 'button',
  events: {
    click: handleClick,
    mouseover: handleHover
  },
  children: ['Advanced button']
}
```

### 4. State Management

```javascript
import { createStore } from './framework/store.js';

// Créer un store
const store = createStore({ count: 0, user: null });

// Lire l'état
const state = store.getState();

// Modifier l'état
store.setState({ count: state.count + 1 });

// S'abonner aux changements
store.subscribe((newState) => {
  console.log('State updated:', newState);
});
```

### 5. Routing

```javascript
import { App } from './framework/app.js';

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

// Obtenir la route actuelle
const current = App.getCurrentRoute();
```

### 6. Rendu

```javascript
import { render } from './framework/dom.js';

const vnode = {
  tag: 'div',
  children: ['Hello']
};

const element = render(vnode);
document.getElementById('app').appendChild(element);
```

---

## 🎓 Concepts Implémentés

### Virtual DOM

Le framework utilise des **Virtual Nodes (VNodes)** - des objets JavaScript qui représentent la structure du DOM. Ces VNodes sont ensuite convertis en vrais éléments DOM par la fonction `render()`.

**Pourquoi ?**
- Approche déclarative (on décrit CE qu'on veut, pas COMMENT le faire)
- Plus maintenable
- Pattern utilisé par React, Vue, etc.

### Routing Hash-Based

Navigation basée sur le hash de l'URL (#/). Le framework écoute les changements de hash et affiche le composant correspondant.

**Pourquoi ?**
- Permet de créer des Single Page Applications (SPA)
- Pas de rechargement de page
- Historique de navigation

### State Management

Store centralisé avec pattern **Observer/Publisher-Subscriber**. Quand l'état change, tous les composants abonnés sont notifiés et se re-rendent automatiquement.

**Pourquoi ?**
- État global accessible partout
- Évite le "props drilling"
- Centralise la logique métier
- Réactivité automatique

### Event Handling

Système d'événements déclaratif qui simplifie l'attachement d'événements aux éléments.

**Pourquoi ?**
- Plus lisible que `addEventListener()` direct
- Intégré dans la structure des VNodes
- Facile à maintenir

---

## 🛠️ Technologies

- **JavaScript ES6+** (modules, arrow functions, destructuring, spread operator)
- **HTML5**
- **CSS3**
- **Aucune dépendance externe** (vanilla JavaScript uniquement)

---

## 🧪 Tests Recommandés

### Pour TodoMVC

1. Ajouter plusieurs tâches
2. Marquer certaines comme complétées
3. Tester les filtres (All/Active/Completed)
4. Double-cliquer pour éditer une tâche
5. Utiliser "Toggle all"
6. Utiliser "Clear completed"
7. Vérifier le compteur "X items left"

### Pour les exemples

1. Naviguer entre les pages
2. Tester le compteur (increment/decrement)
3. Tester les événements (click, hover, input)
4. Vérifier qu'il n'y a pas d'erreurs dans la console (F12)

---

## 📚 Pour Aller Plus Loin

### Consulter la documentation technique

Pour plus de détails sur l'implémentation et des exemples avancés :

📖 **[framework/README.md](framework/README.md)**

### Comprendre l'architecture

```
User Action → Event Handler → Store Action → State Change → 
  → Listeners Notified → Re-render → DOM Update
```

**Flux unidirectionnel :** Les données circulent dans une seule direction, ce qui rend l'application prévisible et facile à débugger.

---

## 🎯 Objectifs Pédagogiques

Ce projet permet d'apprendre :

- Comment fonctionnent les frameworks modernes (React, Vue, Angular)
- Le concept de Virtual DOM
- Les systèmes de routing
- La gestion d'état réactive
- L'architecture basée sur des composants
- Les patterns de conception (Observer, Publisher-Subscriber)

---

## 🚧 Limitations

**Ce framework est éducatif.** Il ne contient pas :

- Diffing/reconciliation avancée (re-render complet à chaque changement)
- Paramètres de route dynamiques
- Hooks ou état local des composants
- Optimisations de performance avancées
- Support TypeScript

**Pour la production, utilisez des frameworks établis (React, Vue, Svelte, etc.)**

---

## 📄 Licence

MIT - Libre d'utilisation pour vos projets personnels et pédagogiques.

---

## 🆘 Support

En cas de problème :

1. Vérifier la console navigateur (F12)
2. Vérifier que le serveur HTTP est lancé
3. Vérifier les chemins d'import des modules
4. Consulter la documentation technique : `framework/README.md`

---

**Créé pour comprendre les fondamentaux des frameworks JavaScript modernes.**

Bon apprentissage ! 🚀