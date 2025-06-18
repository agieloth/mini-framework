// app/store.js - Version améliorée
export function createStore(initialState = {}) {
  let state = { ...initialState }; // crée une copie de initialState dans la variable state
  const listeners = [];

  function getState() {
    // Retourner une copie pour éviter les mutations directes
    return { ...state };
  }

  function setState(newState) {
    const oldState = { ...state };
    
    // Mise à jour du state
    if (typeof newState === 'function') {
      // Support pour les fonctions de mise à jour
      state = { ...state, ...newState(state) };
    } else {
      state = { ...state, ...newState };
    }
    
    // Dirty checking - seulement notifier si quelque chose a changé
    if (JSON.stringify(oldState) !== JSON.stringify(state)) {
      console.log('State mis à jour:', { oldState, newState: state });
      listeners.forEach((listener) => {
        try {
          listener(state);
        } catch (error) {
          console.error('Erreur dans un listener:', error);
        }
      });
    }
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Le listener doit être une fonction');
    }
    
    listeners.push(listener);
    console.log(`Nouveau listener ajouté. Total: ${listeners.length}`);
    
    // Retourner une fonction pour se désabonner
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
        console.log(`Listener supprimé. Total: ${listeners.length}`);
      }
    };
  }

  // Méthode pour déboguer
  function debug() {
    return {
      state: { ...state },
      listenersCount: listeners.length
    };
  }

  return {
    getState,
    setState,
    subscribe,
    debug
  };
}