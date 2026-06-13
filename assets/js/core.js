/* ================================
   ZenTools Ultra Core Engine
================================ */

const ZenTools = {

  state: {
    tools: [],
    tutorials: [],
    reviews: [],
    plugins: []
  },

  events: {},

  /* =========================
     Event Bus
  ========================= */

  on(event, fn){

    if(!this.events[event])
      this.events[event] = [];

    this.events[event].push(fn);

  },

  emit(event, data){

    (this.events[event] || []).forEach(fn => fn(data));

  },

  /* =========================
     Tool Registry
  ========================= */

  registerTool(tool){

    this.state.tools.push(tool);

    this.emit("tool:added", tool);

  },

  registerTutorial(t){

    this.state.tutorials.push(t);

  },

  registerReview(r){

    this.state.reviews.push(r);

  }

};
