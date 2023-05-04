import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Admin } from './Admin'

describe('Admin component', () => {
  test('renders user list', async () => {
    const { findByText } = render(<Admin />)
    const userHeader = await findByText(/User List/i)
    expect(userHeader).toBeInTheDocument()
  })

  test('renders product list', async () => {
    const { findByText } = render(<Admin />)
    const productHeader = await findByText(/Products/i)
    expect(productHeader).toBeInTheDocument()
  })

  test('deletes user when delete button is clicked', async () => {
    const { findByText } = render(<Admin />)
    const deleteUserBtn = await screen.findByText('Delete User')
    fireEvent.click(deleteUserBtn)
    const deletedUser = await findByText('User deleted from state')
    expect(deletedUser).toBeInTheDocument()
  })

  test('deletes product when remove button is clicked', async () => {
    const { findByText } = render(<Admin />)
    const removeProductBtn = await screen.findByText('Remove Product')
    fireEvent.click(removeProductBtn)
    const deletedProduct = await findByText('Products')
    expect(deletedProduct).toBeInTheDocument()
  })

  test('logs out when logout button is clicked', async () => {
    const { findByText } = render(<Admin />)
    const logoutBtn = await screen.findByText('Logout')
    fireEvent.click(logoutBtn)
    const loggedOut = await findByText('Login')
    expect(loggedOut).toBeInTheDocument()
  })
})
