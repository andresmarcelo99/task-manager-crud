describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should redirect to login page when not authenticated', () => {
    cy.url().should('include', '/login')
    cy.contains('Sign In').should('be.visible')
  })

  it('should display login form', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign In')
  })

  it('should display registration form', () => {
    cy.visit('/register')
    cy.get('input[name="name"]').should('be.visible')
    cy.get('input[type="email"]').should('be.visible')
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('contain', 'Sign Up')
  })

  it('should show validation errors for invalid login', () => {
    cy.visit('/login')
    cy.get('button[type="submit"]').click()
    
    // Check for HTML5 validation or custom validation
    cy.get('input[type="email"]:invalid').should('exist')
  })

  it('should navigate between login and register pages', () => {
    cy.visit('/login')
    cy.contains('Sign Up').click()
    cy.url().should('include', '/register')
    
    cy.contains('Sign In').click()
    cy.url().should('include', '/login')
  })

  // Note: This test would require a test user account in AWS Cognito
  // For demo purposes, we'll skip actual authentication
  it.skip('should login successfully with valid credentials', () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('test@example.com')
    cy.get('input[type="password"]').type('testpassword')
    cy.get('button[type="submit"]').click()
    
    cy.url().should('include', '/tasks')
    cy.contains('My Tasks').should('be.visible')
  })
})