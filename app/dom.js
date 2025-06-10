// export function render(vnode) {
//   if (typeof vnode === 'string') {
//     return document.createTextNode(vnode);
//   }

//   const $el = document.createElement(vnode.tag);

//   // Gérer les attributs HTML (ex: class, id, type, etc.)
//   if (vnode.attrs) {
//     for (const [key, value] of Object.entries(vnode.attrs)) {
//       $el.setAttribute(key, value);
//     }
//   }

//   // Gérer les événements personnalisés (sans onClick)
//   if (vnode.events) {
//     for (const [event, handler] of Object.entries(vnode.events)) {
//       $el.addEventListener(event, handler);
//     }
//   }

//   // Gérer les enfants récursivement
//   if (vnode.children) {
//     vnode.children.forEach(child => {
//       $el.appendChild(render(child));
//     });
//   }

//   return $el;
// }


// Gardez seulement render() dans dom.js et utilisez-le partout

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

  // Créer l'élément
  const $el = document.createElement(vnode.tag);

  // Gérer les attributs ET les événements onClick
  if (vnode.attrs) {
    for (const [key, value] of Object.entries(vnode.attrs)) {
      if (key.startsWith('on') && typeof value === 'function') {
        // Convertir onClick -> click, onMouseover -> mouseover, etc.
        const eventName = key.slice(2).toLowerCase();
        $el.addEventListener(eventName, value);
      } else {
        $el.setAttribute(key, value);
      }
    }
  }

  // Gérer les événements personnalisés (système alternatif)
  if (vnode.events) {
    for (const [event, handler] of Object.entries(vnode.events)) {
      $el.addEventListener(event, handler);
    }
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
      $el.appendChild(childElement);
    });
  }

  return $el;
}