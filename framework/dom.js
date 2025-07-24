// app/dom.js - Version corrigée et unifiée

export function render(vnode) {
  // Gérer les chaînes de caractères et nombres
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // Gérer les éléments DOM déjà créés
  if (vnode instanceof Element) {
    return vnode;
  }

  // Créer l'élément à partir de l'élément tag
  const el = document.createElement(vnode.tag);

  // Gérer les attributs(ex: id, class, href...) ET les événements (onClick, onMouseover…)
  for (const key in vnode.attrs || {}) {
    const value = vnode.attrs[key];
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }

  // Gérer les événements personnalisés (système alternatif)
  // if (vnode.events) {
  //   for (const [event, handler] of Object.entries(vnode.events)) {
  //     el.addEventListener(event, handler);
  //   }
  // }
  for (const evt in vnode.events || {}) {
    el.addEventListener(evt, vnode.events[evt]);
  }

  // Gérer les enfants récursivement
  if (vnode.children && Array.isArray(vnode.children)) {
    vnode.children.forEach(child => {
      // Gérer les fonctions (composants)
      if (typeof child === 'function') {
        child = child();
      }
      
      // Rendu récursif
      const childElement = render(child);
      el.appendChild(childElement);
    });
  }

  return el;
}