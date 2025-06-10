async function t(){const s=await fetch("/assets/userManifest.json");if(!s.ok)throw new Error(`Failed to load asset manifest: ${s.statusText}`);return s.json()}export{t as loadAssetManifest};
