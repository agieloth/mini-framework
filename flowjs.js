/**
 * FlowJS Framework
 * Un framework JavaScript moderne avec Virtual DOM et API fluide
 */

class FlowJS {
  constructor() {
    this.state = {};
    this.components = new Map();
    this.routes = new Map();
    this.currentRoute = window.location.pathname || '/';
    this.vdom = null;
    this.realDOM = null;
    this.stateListeners = [];
    this.eventHandlers = new Map();
  }

  // ============ VIRTUAL DOM ============
  
  /**
   * Créer un élément virtuel
   */
  createElement(tag, attrs = {}, children = []) {
    return {
      tag,
      attrs,
      children: Array.isArray(children) ? children : [children],
      key: attrs.key || null
    };
  }

  /**
   * Convertir le VDOM en vrai DOM
   */
  render(vnode) {
    if (typeof vnode === 'string' || typeof vnode === 'number') {
      return document.createTextNode(vnode);
    }

    if (!vnode || !vnode.tag) {
      return document.createTextNode('');
    }

    const element = document.createElement(vnode.tag);
    
    // Ajouter les attributs
    Object.keys(vnode.attrs).forEach(attr => {
      if (attr.startsWith('on')) {
        // Gérer les événements
        const eventType = attr.slice(2).toLowerCase();
        element.addEventListener(eventType, vnode.attrs[attr]);
      } else if (attr !== 'key') {
        if (attr === 'className') {
          element.className = vnode.attrs[attr];
        } else {
          element.setAttribute(attr, vnode.attrs[attr]);
        }
      }
    });

    // Ajouter les enfants
    vnode.children.forEach(child => {
      if (child !== null && child !== undefined) {
        element.appendChild(this.render(child));
      }
    });

    return element;
  }

  /**
   * Comparer deux vnodes pour le diff (version simplifiée)
   */
  diff(oldVNode, newVNode) {
    if (!oldVNode) return { type: 'CREATE', newVNode };
    if (!newVNode) return { type: 'REMOVE' };
    if (this.changed(oldVNode, newVNode)) return { type: 'REPLACE', newVNode };
    if (newVNode.tag) {
      return {
        type: 'UPDATE',
        children: this.diffChildren(oldVNode.children, newVNode.children)
      };
    }
  }

  changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
           (typeof node1 === 'string' && node1 !== node2) ||
           node1.tag !== node2.tag;
  }

  diffChildren(oldChildren, newChildren) {
    const patches = [];
    const maxLength = Math.max(oldChildren.length, newChildren.length);
    
    for (let i = 0; i < maxLength; i++) {
      patches[i] = this.diff(oldChildren[i], newChildren[i]);
    }
    
    return patches;
  }

  // ============ STATE MANAGEMENT ============
  
  /**
   * Mettre à jour l'état global
   */
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyStateListeners();
    this.rerender();
  }

  /**
   * Obtenir l'état actuel
   */
  getState() {
    return { ...this.state };
  }

  /**
   * S'abonner aux changements d'état
   */
  subscribe(listener) {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  /**
   * Notifier tous les listeners
   */
  notifyStateListeners() {
    this.stateListeners.forEach(listener => listener(this.state));
  }

  // ============ ROUTING SYSTEM ============
  
  /**
   * Définir une route
   */
  route(path, component) {
    this.routes.set(path, component);
    return this;
  }

  /**
   * Naviguer vers une route
   */
  navigate(path) {
    if (this.routes.has(path)) {
      this.currentRoute = path;
      history.pushState(null, '', path);
      this.rerender();
    }
  }

  /**
   * Obtenir le composant de la route actuelle
   */
  getCurrentComponent() {
    return this.routes.get(this.currentRoute) || (() => this.div('404 - Page not found'));
  }

  /**
   * Initialiser le routeur
   */
  initRouter() {
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname;
      this.rerender();
    });
  }

  // ============ EVENT HANDLING ============
  
  /**
   * Ajouter un gestionnaire d'événement personnalisé
   */
  on(element, event, handler) {
    const key = `${element}_${event}`;
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, []);
    }
    this.eventHandlers.get(key).push(handler);
  }

  /**
   * Émettre un événement personnalisé
   */
  emit(element, event, data) {
    const key = `${element}_${event}`;
    if (this.eventHandlers.has(key)) {
      this.eventHandlers.get(key).forEach(handler => handler(data));
    }
  }

  // ============ FLUENT API - ÉLÉMENTS HTML ============
  
  div(content) { return new FlowElement('div', content, this); }
  span(content) { return new FlowElement('span', content, this); }
  p(content) { return new FlowElement('p', content, this); }
  h1(content) { return new FlowElement('h1', content, this); }
  h2(content) { return new FlowElement('h2', content, this); }
  h3(content) { return new FlowElement('h3', content, this); }
  h4(content) { return new FlowElement('h4', content, this); }
  h5(content) { return new FlowElement('h5', content, this); }
  h6(content) { return new FlowElement('h6', content, this); }
  button(content) { return new FlowElement('button', content, this); }
  input() { return new FlowElement('input', '', this); }
  textarea(content) { return new FlowElement('textarea', content, this); }
  select() { return new FlowElement('select', '', this); }
  option(content) { return new FlowElement('option', content, this); }
  ul() { return new FlowElement('ul', '', this); }
  ol() { return new FlowElement('ol', '', this); }
  li(content) { return new FlowElement('li', content, this); }
  section() { return new FlowElement('section', '', this); }
  header() { return new FlowElement('header', '', this); }
  footer() { return new FlowElement('footer', '', this); }
  main() { return new FlowElement('main', '', this); }
  nav() { return new FlowElement('nav', '', this); }
  article() { return new FlowElement('article', '', this); }
  aside() { return new FlowElement('aside', '', this); }
  form() { return new FlowElement('form', '', this); }
  label(content) { return new FlowElement('label', content, this); }
  a(content) { return new FlowElement('a', content, this); }
  img() { return new FlowElement('img', '', this); }
  br() { return new FlowElement('br', '', this); }
  hr() { return new FlowElement('hr', '', this); }

  // ============ LIFECYCLE ============
  
  /**
   * Monter l'application sur un élément du DOM
   */
  mount(selector, component) {
    this.realDOM = document.querySelector(selector);
    if (!this.realDOM) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
    this.rootComponent = component;
    this.initRouter();
    this.rerender();
  }

  /**
   * Re-rendre l'application
   */
  rerender() {
    if (this.realDOM && this.rootComponent) {
      const newVDOM = this.rootComponent();
      this.realDOM.innerHTML = '';
      this.realDOM.appendChild(this.render(newVDOM));
      this.vdom = newVDOM;
    }
  }
}

/**
 * Classe pour les éléments avec API fluide
 */
class FlowElement {
  constructor(tag, content, framework) {
    this.tag = tag;
    this.content = content;
    this.framework = framework;
    this.attrs = {};
    this.children = [];
    
    if (content && (typeof content === 'string' || typeof content === 'number')) {
      this.children.push(content);
    }
  }

  // ============ ATTRIBUTS ============
  
  /**
   * Ajouter un attribut
   */
  attr(name, value) {
    this.attrs[name] = value;
    return this;
  }

  /**
   * Ajouter une ou plusieurs classes CSS
   */
  class(className) {
    this.attrs.class = (this.attrs.class || '') + ' ' + className;
    this.attrs.class = this.attrs.class.trim();
    return this;
  }

  /**
   * Définir l'ID de l'élément
   */
  id(id) {
    this.attrs.id = id;
    return this;
  }

  /**
   * Ajouter des styles inline
   */
  style(styleString) {
    this.attrs.style = styleString;
    return this;
  }

  /**
   * Attributs spécifiques aux inputs
   */
  type(type) {
    this.attrs.type = type;
    return this;
  }

  placeholder(text) {
    this.attrs.placeholder = text;
    return this;
  }

  value(val) {
    this.attrs.value = val;
    return this;
  }

  name(name) {
    this.attrs.name = name;
    return this;
  }

  /**
   * Attributs spécifiques aux liens
   */
  href(url) {
    this.attrs.href = url;
    return this;
  }

  /**
   * Attributs spécifiques aux images
   */
  src(url) {
    this.attrs.src = url;
    return this;
  }

  alt(text) {
    this.attrs.alt = text;
    return this;
  }

  // ============ ENFANTS ============
  
  /**
   * Ajouter des éléments enfants
   */
  child(...children) {
    this.children.push(...children.map(child => {
      if (child instanceof FlowElement) {
        return child.build();
      } else if (Array.isArray(child)) {
        return child.map(c => c instanceof FlowElement ? c.build() : c);
      } else {
        return child;
      }
    }).flat());
    return this;
  }

  /**
   * Ajouter du texte
   */
  text(content) {
    this.children.push(content);
    return this;
  }

  // ============ ÉVÉNEMENTS ============
  
  onClick(handler) {
    this.attrs.onclick = handler;
    return this;
  }

  onInput(handler) {
    this.attrs.oninput = handler;
    return this;
  }

  onChange(handler) {
    this.attrs.onchange = handler;
    return this;
  }

  onKeyPress(handler) {
    this.attrs.onkeypress = handler;
    return this;
  }

  onKeyUp(handler) {
    this.attrs.onkeyup = handler;
    return this;
  }

  onKeyDown(handler) {
    this.attrs.onkeydown = handler;
    return this;
  }

  onSubmit(handler) {
    this.attrs.onsubmit = handler;
    return this;
  }

  onFocus(handler) {
    this.attrs.onfocus = handler;
    return this;
  }

  onBlur(handler) {
    this.attrs.onblur = handler;
    return this;
  }

  onMouseOver(handler) {
    this.attrs.onmouseover = handler;
    return this;
  }

  onMouseOut(handler) {
    this.attrs.onmouseout = handler;
    return this;
  }

  onDoubleClick(handler) {
    this.attrs.ondblclick = handler;
    return this;
  }

  // ============ BUILD ============
  
  /**
   * Construire l'élément virtuel final
   */
  build() {
    return this.framework.createElement(this.tag, this.attrs, this.children);
  }
}

// Instance globale du framework
const Flow = new FlowJS();

// Export pour Node.js si disponible
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FlowJS, FlowElement, Flow };
}