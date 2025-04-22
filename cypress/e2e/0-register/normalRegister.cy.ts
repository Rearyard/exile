describe('Normal Register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/register')
    })
    it('should open the register page', () => {
        cy.visit('http://localhost:3000/register')
    })
    it('should have a form with email, password, and invite code fields', () => {
        cy.get('input[name="email"]').should('exist')
        cy.get('input[name="password"]').should('exist')
        cy.get('input[name="inviteCode"]').should('exist')
    })
    it('should have a submit button', () => {
        cy.get('button[type="submit"]').should('exist')
    })

    it('should have a captcha', () => {
        cy.get('div[id="captcha"]').should('exist')
    })


    // user email test
    it('should not be able to register with an invalid email', () => {
        cy.get('input[name="email"]').type('invalid-email')
        cy.get('button[type="submit"]').click()
        cy.get('[data-cy="email-form-item"] #reka-v-0-0-form-item-message').should('exist').should('have.text', 'Invalid email')
    })

    it('should not be able to register with empty password', () => {
        cy.get('input[name="password"]').type(' ')
        cy.get('button[type="submit"]').click()
        cy.get('[data-cy="password-form-item"] #reka-v-0-1-form-item-message').should('exist')
    })

    it('should not be able to register with captcha not verified', () => {
        cy.get('input[name="email"]').type('test@test.com')
        cy.get('input[name="password"]').type('testtest')
        cy.get('input[name="inviteCode"]').type('123456')
        cy.get('button[type="submit"]').click()
        
        // data-sonner-toast="true", data-visible="true", data-type="error" > data-title
        cy.get('[data-sonner-toast="true"][data-visible="true"][data-type="error"] [data-title]').should('exist').should('have.text', '请完成验证码验证')
    })

    // d
})
