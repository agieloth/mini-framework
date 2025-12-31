// app/app.js - gestion de l'application et du routing

import { render } from './dom.js';

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
    const root = document.getElementById('root');
    
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