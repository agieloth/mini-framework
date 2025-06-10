import { render } from './dom.js';

// export const App = {
//   mount(root, vnode) {
//     const element = this.createElement(vnode);
//     root.innerHTML = "";
//     root.appendChild(render(element));
//   },

//   createElement({ tag, attrs = {}, children = [] }) {
//     const el = document.createElement(tag);

//     // Attributs et événements
//     for (const [key, value] of Object.entries(attrs)) {
//       if (key.startsWith("on") && typeof value === "function") {
//         el.addEventListener(key.slice(2).toLowerCase(), value);
//       } else {
//         el.setAttribute(key, value);
//       }
//     }

//     // Enfants
//     for (let child of children) {
//       if (typeof child === "function") {
//         // Composant : une fonction qui retourne un vnode
//         child = child();
//       }

//       const childEl =
//         typeof child === "string" || typeof child === "number"
//           ? document.createTextNode(String(child))
//           : this.createElement(child);

//       el.appendChild(render(childEl));
//     }

//     return el;
//   },

//   ////////////////////////////// AJOUT DE SYSTEME DE ROUTES /////////////////////////////////////////
//   routes: {},
//   currentRoute: '',

//   defineRoutes(routes) {
//     this.routes = routes;
//   },

//   handleRouteChange() {
//     const hash = window.location.hash.slice(1) || '/';
//     const component = this.routes[hash];

//     const root = document.getElementById('app');
//     root.innerHTML = ''; // On vide l'ancien contenu

//     if (component) {
//       const vnode = component();
//       const el = this.createElement(vnode);
//       root.appendChild(render(el));
//     } else {
//       root.textContent = '404 - Page not found';
//     }
//   },

//   startRouting() {
//     window.addEventListener('hashchange', () => this.handleRouteChange());
//     window.addEventListener('load', () => this.handleRouteChange());
//   }

// };


// app/app.js - Version corrigée


export const App = {
  routes: {},
  currentRoute: '',

  // Définir les routes de l'application
  defineRoutes(routes) {
    this.routes = routes;
  },

  // Gérer les changements de route
  handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    this.currentRoute = hash;
    
    const component = this.routes[hash];
    const root = document.getElementById('app');
    
    if (component) {
      try {
        // Appeler le composant pour obtenir le vnode
        const vnode = typeof component === 'function' ? component() : component;
        
        // Utiliser la fonction render unifiée
        const element = render(vnode);
        
        // Remplacer le contenu
        root.innerHTML = '';
        root.appendChild(element);
        
        console.log(`Route changée vers: ${hash}`);
      } catch (error) {
        console.error('Erreur lors du rendu de la route:', error);
        root.innerHTML = '<div style="color: red;">Erreur de rendu</div>';
      }
    } else {
      // Page 404
      root.innerHTML = '<div>404 - Page not found</div>';
      console.log('Route introuvable:', hash);
    }
  },

  // Démarrer le système de routing
  startRouting() {
    // Écouter les changements de hash
    window.addEventListener('hashchange', () => {
      console.log('Hash changé:', window.location.hash);
      this.handleRouteChange();
    });
    
    // Gérer le chargement initial
    window.addEventListener('load', () => {
      console.log('Application chargée');
      this.handleRouteChange();
    });
    
    // Chargement initial si la page est déjà chargée
    if (document.readyState === 'complete') {
      this.handleRouteChange();
    }
  },

  // Méthode utilitaire pour naviguer programmatiquement
  navigate(route) {
    window.location.hash = route;
  },

  // Obtenir la route actuelle
  getCurrentRoute() {
    return this.currentRoute;
  }
};