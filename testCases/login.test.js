import { render, screen, fireEvent } from '@testing-library/react'
import { Login } from './Login'
import { auth } from './firebase'

jest.mock('./firebase')

describe('Login', () => {
  test('it should render the login form', () => {
    // Arrange
    render(<Login />)

    // Act
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const roleSelect = screen.getByLabelText(/role/i)
    const signInButton = screen.getByRole('button', { name: /sign in/i })

    // Assert
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(roleSelect).toBeInTheDocument()
    expect(signInButton).toBeInTheDocument()
  })

  test('it should call auth.signInWithEmailAndPassword when the form is submitted', async () => {
    // Arrange
    const email = 'test@example.com'
    const password = 'password'
    const role = 'buyer'
    auth.signInWithEmailAndPassword.mockResolvedValueOnce({ user: { role } })
    render(<Login />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const roleSelect = screen.getByLabelText(/role/i)
    const signInButton = screen.getByRole('button', { name: /sign in/i })

    // Act
    fireEvent.change(emailInput, { target: { value: email } })
    fireEvent.change(passwordInput, { target: { value: password } })
    fireEvent.change(roleSelect, { target: { value: role } })
    fireEvent.click(signInButton)

    // Assert
    expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      email,
      password
    )
  })

  test('it should redirect to the appropriate page when the user has the selected role', async () => {
    // Arrange
    const role = 'buyer'
    auth.signInWithEmailAndPassword.mockResolvedValueOnce({ user: { role } })
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        href: '',
      },
      writable: true,
    })
    render(<Login />)
    const roleSelect = screen.getByLabelText(/role/i)
    const signInButton = screen.getByRole('button', { name: /sign in/i })

    // Act
    fireEvent.change(roleSelect, { target: { value: role } })
    fireEvent.click(signInButton)

    // Assert
    expect(window.location.href).toBe(`/${role}`)
  })

  test('it should log an error message when the user does not have the selected role', async () => {
    // Arrange
    const role = 'buyer'
    auth.signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { role: 'admin' },
    })
    console.log = jest.fn()
    render(<Login />)
    const roleSelect = screen.getByLabelText(/role/i)
    const signInButton = screen.getByRole('button', { name: /sign in/i })

    // Act
    fireEvent.change(roleSelect, { target: { value: role } })
    fireEvent.click(signInButton)

    // Assert
    expect(console.log).toHaveBeenCalledWith('User does not have role')
  })
})
