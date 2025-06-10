const o=()=>({modulo(t,r){return(t%r+r)%r},roundToStep(t,r){return Math.round(t/r)*r},toDegrees(t){return t*(180/Math.PI)},toRadians(t){return t*(Math.PI/180)}});export{o as mathUtilityFactory};
