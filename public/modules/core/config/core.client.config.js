'use strict';

// Configuring the core module's topbar.
angular.module('core').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'The Team', 'the-team', '', '/the-team', true);
		Menus.addMenuItem('topbar', 'Classes', 'classes', '', '/classes', true);
		Menus.addMenuItem('topbar', 'Events', 'events', '', '/events', true);
	}
]);
