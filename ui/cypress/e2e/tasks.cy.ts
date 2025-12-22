describe('Task Management', () => {
  beforeEach(() => {
    // For this demo, we'll mock the authentication
    // In a real scenario, you'd use cy.login() with valid credentials
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'mock-jwt-token')
    })
    cy.visit('/tasks')
  })

  it('should display tasks page layout', () => {
    cy.contains('My Tasks').should('be.visible')
    cy.get('[data-testid="add-task-fab"]').should('be.visible')
  })

  it('should open create task dialog', () => {
    cy.get('[aria-label="add task"]').click()
    cy.get('[role="dialog"]').should('be.visible')
    cy.contains('Create New Task').should('be.visible')
    cy.get('input[name="title"]').should('be.visible')
  })

  it('should validate task creation form', () => {
    cy.get('[aria-label="add task"]').click()
    cy.get('button').contains('Create').click()
    
    // Should show validation error for empty title
    cy.get('input[name="title"]:invalid').should('exist')
  })

  it('should close dialog on cancel', () => {
    cy.get('[aria-label="add task"]').click()
    cy.get('button').contains('Cancel').click()
    cy.get('[role="dialog"]').should('not.exist')
  })

  // Note: These tests would require the backend API to be running
  // For demo purposes, we'll skip actual API interactions
  it.skip('should create a new task', () => {
    cy.get('[aria-label="add task"]').click()
    cy.get('input[name="title"]').type('Test Task')
    cy.get('textarea[name="description"]').type('Test Description')
    cy.get('button').contains('Create').click()
    
    cy.contains('Test Task').should('be.visible')
  })

  it.skip('should mark task as done', () => {
    // Assuming a task exists
    cy.get('[data-testid="task-card"]').first().within(() => {
      cy.get('[aria-label="mark as done"]').click()
    })
    
    cy.contains('Completed').should('be.visible')
  })
})