// File: frontend/src/scripts/react/App.tsx

import '../../styles/main.css';
import { JSX } from 'react';
import { GraphicBuilder } from './components/GraphicBuilder.js';

// ================================================== //
// ================================================== //

export function App(): JSX.Element {
  return (
    <div id="app-root">
      <main id="main-element">
        <div className="w-full flex justify-center gap-2 mb-2">
          <img src="static/borders/01.gif" alt="" className="h-7" />
          <img src="static/borders/02.gif" alt="" className="h-7" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold font-mono text-pink-600 drop-shadow sparkle">
          Glitter Graphix
        </h1>
        <p className="text-lg text-center text-fuchsia-600 mb-4">
          ✨ Make your own blinkies and retro web graphics! ✨
        </p>
        <GraphicBuilder />
      </main>
    </div>
  );
}
