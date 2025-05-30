// File: frontend/src/app/sys/listeners/startup.ts

// ================================================== //
// ================================================== //

function onDOMContentLoaded(cb: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb);
  } else {
    cb();
  }
}

/* --------------------------------------------------= */

function onResize(cb: () => void): void {
  window.addEventListener('resize', cb);
}

// ================================================= //
// ================================================== //

export { onDOMContentLoaded, onResize };
