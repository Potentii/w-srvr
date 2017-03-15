/**
 * All the available hooks events
 * @readonly
 * @enum {string}
 */
const HOOKS_ENUM = Object.freeze({
   BEFORE_SETUP: 'before-setup',
   AFTER_SETUP: 'after-setup'
});



// *Exporting this module:
module.exports = { HOOKS: HOOKS_ENUM };
