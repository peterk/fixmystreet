it('loads the right front page', function() {
    cy.visit('http://northamptonshire.localhost:3001/');
    cy.contains('Northamptonshire');
});

it('prevents clicking unless asset selected, desktop flow', function() {
  cy.server();
  cy.route('**/northants.staging/**', 'fixture:bus_stops_none.json').as('empty-bus_stops-layer');
  cy.route('**/32602/21575/**', 'fixture:bus_stops.json').as('bus_stops-layer');
  cy.route('/report/new/ajax*').as('report-ajax');
  cy.visit('http://northamptonshire.localhost:3001/');
  cy.get('[name=pc]').type('NN1 1NS');
  cy.get('[name=pc]').parents('form').submit();

  cy.get('#map_box').click();
  cy.wait('@report-ajax');

  cy.get('[id=category_group]').select('Shelter Damaged');

  cy.wait('@bus_stops-layer');
  cy.wait('@empty-bus_stops-layer');
  cy.contains(/Please select a.*bus stop.*from the map/).should('be.visible');
  cy.get('.js-reporting-page--next:visible').should('be.disabled');
});

it('prevents clicking unless asset selected, mobile flow', function() {
  cy.server();
  cy.route('**/northants.staging/**', 'fixture:bus_stops_none.json').as('empty-bus_stops-layer');
  cy.route('**/32602/21575/**', 'fixture:bus_stops.json').as('bus_stops-layer');
  cy.route('/report/new/ajax*').as('report-ajax');
  cy.viewport(480, 800);
  cy.visit('http://northamptonshire.localhost:3001/');
  cy.get('[name=pc]').type('NN1 1NS');
  cy.get('[name=pc]').parents('form').submit();

  cy.get('#map_box').click();
  cy.wait('@report-ajax');
  cy.get('#mob_ok').click();

  cy.get('[id=category_group]').select('Shelter Damaged');

  cy.wait('@bus_stops-layer');
  cy.wait('@empty-bus_stops-layer');
  cy.contains(/Please select a.*bus stop.*from the map/).should('not.be.visible');
  cy.get('.js-reporting-page--next:visible').click();
  cy.get('.mobile-map-banner').should('be.visible');
  cy.contains(/Please select a.*bus stop.*from the map/).should('be.visible');
  cy.get('#mob_ok').should('not.be.visible');
});

it('selecting an asset allows a report, mobile flow', function() {
  cy.server();
  cy.route('**/northants.staging/**', 'fixture:bus_stops_none.json').as('empty-bus_stops-layer');
  cy.route('**/32603/21575/**', 'fixture:bus_stops.json').as('bus_stops-layer');
  cy.route('/report/new/ajax*').as('report-ajax');
  cy.viewport(480, 800);
  cy.visit('http://northamptonshire.localhost:3001/');
  cy.get('[name=pc]').type('NN1 2NS');
  cy.get('[name=pc]').parents('form').submit();

  cy.get('#map_box').click();
  cy.wait('@report-ajax');
  cy.get('#mob_ok').click();

  cy.get('[id=category_group]').select('Shelter Damaged');

  cy.wait('@bus_stops-layer');
  cy.wait('@empty-bus_stops-layer');
  cy.contains(/Please select a.*bus stop.*from the map/).should('not.be.visible');
  cy.get('.js-reporting-page--next:visible').click();
  cy.get('.mobile-map-banner').should('be.visible');
  cy.get('#mob_ok').click();
  cy.get('.js-reporting-page--next:visible').click(); // No photo
  cy.get('#js-councils_text').should('be.visible');
});

it('selecting an asset allows a report, desktop flow', function() {
  cy.server();
  cy.route('**/northants.staging/**', 'fixture:bus_stops_none.json').as('empty-bus_stops-layer');
  cy.route('**/32602/21575/**', 'fixture:bus_stops.json').as('bus_stops-layer');
  cy.route('/report/new/ajax*').as('report-ajax');
  cy.visit('http://northamptonshire.localhost:3001/');
  cy.get('[name=pc]').type('NN1 2NS');
  cy.get('[name=pc]').parents('form').submit();

  cy.get('#map_box').click();
  cy.wait('@report-ajax');

  cy.get('[id=category_group]').select('Shelter Damaged');

  cy.wait('@bus_stops-layer');
  cy.wait('@empty-bus_stops-layer');

  cy.get('.js-reporting-page--next:visible').click();
  cy.get('.js-reporting-page--next:visible').click(); // No photo
  cy.get('#js-councils_text').should('be.visible');
});

it('detects multiple assets at same location', function() {
  cy.server();
  cy.route('**/northants.staging/**', 'fixture:bus_stops_none.json').as('empty-bus_stops-layer');
  cy.route('**/32602/21575/**', 'fixture:bus_stops.json').as('bus_stops-layer');
  cy.route('**/32602/21576/**', 'fixture:bus_stops.json').as('bus_stops-layer2');
  cy.route('/report/new/ajax*').as('report-ajax');
  cy.visit('http://northamptonshire.localhost:3001/');
  cy.get('[name=pc]').type('NN1 2NS');
  cy.get('[name=pc]').parents('form').submit();

  cy.get('#map_box').click();
  cy.wait('@report-ajax');

  cy.get('[id=category_group]').select('Shelter Damaged');

  cy.wait('@bus_stops-layer');
  cy.wait('@bus_stops-layer2');
  cy.wait('@empty-bus_stops-layer');
  cy.get('.js-reporting-page--next:visible').click();

  cy.contains('more than one bus stop at this location').should('be.visible');
});

it('shows the emergency message', function() {
  cy.server();
  cy.route('/report/new/ajax*').as('report-ajax');
  cy.visit('http://northamptonshire.localhost:3001/');
  cy.get('[name=pc]').type('NN1 2NS');
  cy.get('[name=pc]').parents('form').submit();
  cy.get('#map_box').click();
  cy.wait('@report-ajax');
  cy.get('[id=category_group]').select('Very Urgent');
  cy.contains('Please call us instead, it is very urgent.').should('be.visible');
  cy.get('#form_title').should('not.be.visible');
});
