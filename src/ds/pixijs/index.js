var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


var ds = root.ds = root.ds || {};
/** @namespace ds.pixijs */
ds.core = ds.pixijs || {};