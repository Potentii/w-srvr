/**
 * All the available hooks events
 * @readonly
 * @enum {string}
 */
const HOOKS_ENUM = Object.freeze({
   BEFORE_SETUP: 'before-setup',

   BEFORE_API_SETUP: 'before-api-setup',
   AFTER_API_SETUP: 'after-api-setup',
   
   BEFORE_STATIC_SETUP: 'before-static-setup',
   AFTER_STATIC_SETUP: 'after-static-setup',

   AFTER_SETUP: 'after-setup'
});



// *Exporting this module:
module.exports = { HOOKS: HOOKS_ENUM };
