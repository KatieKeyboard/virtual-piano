Cypress.on('uncaught:exception', (err, runnable) => {
	// We expect Uncaught TypeErrors in the application under test
	if (err.message.includes('> Script error')) {
		return false;
	}
});

//A custom Cypress command to click on a piano key, followed by a waiting period. This type of command would typically be referenced from a cypress/support/commands.js file.
Cypress.Commands.add('piano', (key, wait) => {
	cy.get('[data-note=' + key + ']').click();
	cy.wait(wait);
});

describe('Musicca Virtual Piano', () => {
	it('Plays a Theme Song from Musical Notes', () => {
		cy.visit('https://www.musicca.com/piano/');

		cy.intercept('/lydfiler/piano/63.mp3').as('tone63');
		cy.wait('@tone63').its('response.statusCode').should('eq', 200);

		cy.fixture('composition.json').then((arrangement) => {
			for (const property in arrangement) {
				cy.piano(arrangement[property].key, arrangement[property].wait);
			}
		});
	});
});
