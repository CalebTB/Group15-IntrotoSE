import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { Auth } from './Signup.jsx'

describe('Auth component', () => {
  it('allows user to sign up', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'testpassword',
      role: 'Buyer',
    }
    const createUserWithEmailAndPassword = jest.fn()
    const addDoc = jest.fn()
    createUserWithEmailAndPassword.mockReturnValueOnce(
      Promise.resolve({
        user: { uid: '123', email: mockUser.email, displayName: null },
      })
    )
    addDoc.mockReturnValueOnce(Promise.resolve())

    await act(async () => {
      render(
        <MemoryRouter>
          <Auth />
        </MemoryRouter>
      )
    })

    const emailField = screen.getByPlaceholderText(/email/i)
    const passwordField = screen.getByPlaceholderText(/password/i)
    const roleField = screen.getByLabelText(/select role/i)
    const signUpButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(emailField, { target: { value: mockUser.email } })
    fireEvent.change(passwordField, { target: { value: mockUser.password } })
    fireEvent.change(roleField, { target: { value: mockUser.role } })
    fireEvent.click(signUpButton)

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockUser.email,
        mockUser.password
      )
    )
    await waitFor(() =>
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        uid: '123',
        email: mockUser.email,
        displayName: null,
        role: mockUser.role,
      })
    )
    await waitFor(() =>
      expect(screen.getByText(/buyer page/i)).toBeInTheDocument()
    )
  })
})

describe('Auth component', () => {
  it('allows user to sign up', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'testpassword',
      role: 'Seller',
    }
    const createUserWithEmailAndPassword = jest.fn()
    const addDoc = jest.fn()
    createUserWithEmailAndPassword.mockReturnValueOnce(
      Promise.resolve({
        user: { uid: '123', email: mockUser.email, displayName: null },
      })
    )
    addDoc.mockReturnValueOnce(Promise.resolve())

    await act(async () => {
      render(
        <MemoryRouter>
          <Auth />
        </MemoryRouter>
      )
    })

    const emailField = screen.getByPlaceholderText(/email/i)
    const passwordField = screen.getByPlaceholderText(/password/i)
    const roleField = screen.getByLabelText(/select role/i)
    const signUpButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(emailField, { target: { value: mockUser.email } })
    fireEvent.change(passwordField, { target: { value: mockUser.password } })
    fireEvent.change(roleField, { target: { value: mockUser.role } })
    fireEvent.click(signUpButton)

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockUser.email,
        mockUser.password
      )
    )
    await waitFor(() =>
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        uid: '123',
        email: mockUser.email,
        displayName: null,
        role: mockUser.role,
      })
    )
    await waitFor(() =>
      expect(screen.getByText(/add product/i)).toBeInTheDocument()
    )
  })
})

describe('Auth component', () => {
  it('allows user to sign up', async () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'testpassword',
      role: 'Admin',
    }
    const createUserWithEmailAndPassword = jest.fn()
    const addDoc = jest.fn()
    createUserWithEmailAndPassword.mockReturnValueOnce(
      Promise.resolve({
        user: { uid: '123', email: mockUser.email, displayName: null },
      })
    )
    addDoc.mockReturnValueOnce(Promise.resolve())

    await act(async () => {
      render(
        <MemoryRouter>
          <Auth />
        </MemoryRouter>
      )
    })

    const emailField = screen.getByPlaceholderText(/email/i)
    const passwordField = screen.getByPlaceholderText(/password/i)
    const roleField = screen.getByLabelText(/select role/i)
    const signUpButton = screen.getByRole('button', { name: /sign up/i })

    fireEvent.change(emailField, { target: { value: mockUser.email } })
    fireEvent.change(passwordField, { target: { value: mockUser.password } })
    fireEvent.change(roleField, { target: { value: mockUser.role } })
    fireEvent.click(signUpButton)

    await waitFor(() =>
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        mockUser.email,
        mockUser.password
      )
    )
    await waitFor(() =>
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        uid: '123',
        email: mockUser.email,
        displayName: null,
        role: mockUser.role,
      })
    )
    await waitFor(() =>
      expect(screen.getByText(/delete product/i)).toBeInTheDocument()
    )
  })
})
