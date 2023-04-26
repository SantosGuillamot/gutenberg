/**
 * Internal dependencies
 */
import { store } from '../utils/interactivity';

const raf = window.requestAnimationFrame;
// Until useSignalEffects is fixed: https://github.com/preactjs/signals/issues/228
const tick = () => new Promise( ( r ) => raf( () => raf( r ) ) );

store( {
	actions: {
		core: {
			showLightbox: ( { context } ) => {
				context.core.initialized = true;
				context.core.lightboxEnabled = true;
				context.core.lastFocusedElement = window.document.activeElement;
			},
			hideLightbox: ( { context } ) => {
				context.core.lightboxEnabled = false;
				context.core.lastFocusedElement.focus();
			},
			handleKeydown: ( { context, actions, event } ) => {
				if ( context.core.lightboxEnabled ) {
					if (
						event.key === 'Escape' ||
						event.keyCode === 27 ||
						event.key === 'Tab' ||
						event.keyCode === 9
					) {
						actions.core.hideLightbox( { context } );
					}
				}
			},
		},
	},
	effects: {
		core: {
			initLightbox: async ( { context, ref } ) => {
				if ( context.core.lightboxEnabled ) {
					await tick();
					ref.querySelector( '.close-button' ).focus();
				}
			},
		},
	},
} );
