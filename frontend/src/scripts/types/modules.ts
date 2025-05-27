// File: frontend/src/scripts/types/modules.ts

// ================================================== //
// ================================================== //

export interface UIModules {
  dom: {
    attachRandomHoverEffect: (selector: string) => void;
  };
}

// ================================================== //
// ================================================== //

export interface Modules {
  ui: UIModules;
}
