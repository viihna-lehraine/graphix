// File: frontend/src/scripts/react/components/GraphicBuilder.tsx

import '../../../styles/main.css';
import { JSX, useRef, useState } from 'react';
import { DownloadButton } from './buttons/Download.jsx';
import { GraphicPreview } from './GraphicPreview.jsx';
import { SparkleCheckbox } from './inputs/SparkleCheckbox.jsx';

// =================================================== //
// =================================================== //

export function GraphicBuilder(): JSX.Element {
  const [text, setText] = useState('GLITTER GRAPHIX');
  const [bgColor, setBgColor] = useState('#ff00cc');
  const [textColor, setTextColor] = useState('#ffffff');
  /* @ts-ignore */
  const [sparkle, setSparkle] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <form
      className="w-full max-w-lg flex flex-col items-center gap-5 bg-fuchsia-50/50 rounded-2xl p-6 border border-fuchsia-200 shadow-inner"
      autoComplete="off"
      spellCheck="false"
      onSubmit={e => e.preventDefault()}
    >
      <div className="flex flex-col sm:flex-row w-full gap-4 items-center justify-center">
        <label className="flex flex-col items-start w-full max-w-xs gap-1 text-fuchsia-700 font-semibold">
          Text
          <input
            className="rounded-lg px-4 py-2 border-2 border-fuchsia-300 text-lg font-mono bg-white/90 shadow-inner w-full"
            value={text}
            maxLength={24}
            onChange={e => setText(e.target.value)}
          />
        </label>

        <label className="flex flex-col items-center gap-1 text-pink-700 font-semibold">
          BG Color
          <input
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="border-2 border-pink-400 rounded cursor-pointer h-9 w-9 bg-white shadow"
          />
        </label>

        <label className="flex flex-col items-center gap-1 text-blue-700 font-semibold">
          Text Color
          <input
            type="color"
            value={textColor}
            onChange={e => setTextColor(e.target.value)}
            className="border-2 border-blue-400 rounded cursor-pointer h-9 w-9 bg-white shadow"
          />
        </label>
      </div>

      <div className="flex items-center gap-4 w-full max-w-xs">
        <SparkleCheckbox sparkle={sparkle} setSparkle={setSparkle} />
      </div>

      <div className="w-full flex justify-center mt-1">
        <GraphicPreview
          ref={previewRef}
          text={text}
          bgColor={bgColor}
          textColor={textColor}
          sparkle={sparkle}
        />
      </div>

      <div className="flex justify-center mt-2 w-full">
        <DownloadButton targetRef={previewRef} fileName={`${text}.png`} />
      </div>
    </form>
  );
}
