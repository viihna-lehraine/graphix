// File: frontend/src/app/sys/events/dom.ts

export function onDOMContentLoaded(cb: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cb);
  } else {
    cb();
  }
}

// ================================================== //

export function onResize(cb: () => void): void {
  window.addEventListener('resize', cb);
}
