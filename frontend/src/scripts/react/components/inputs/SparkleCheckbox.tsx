// File: frontend/src/scripts/react/components/inputs/SparkleCheckbox.tsx

import type { SparkleCheckboxProps } from '../../../types/index.js';
import { JSX } from 'react';

// =================================================== //
// =================================================== //

export function SparkleCheckbox({ sparkle, setSparkle }: SparkleCheckboxProps): JSX.Element {
  return (
    <label id="sparkle-checkbox-label">
      <input type="checkbox" checked={sparkle} onChange={e => setSparkle(e.target.checked)} />
      Sparkle
    </label>
  );
}
