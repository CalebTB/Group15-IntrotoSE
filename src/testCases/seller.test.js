import { render, screen, fireEvent } from '@testing-library/react'
import { Seller } from './Seller'

// Mocking Firebase methods
jest.mock('./firebase.js', () => ({
  db: {
    collection: jest.fn(() => ({
      addDoc: jest.fn(() => Promise.resolve()),
      getDocs: jest.fn(() =>
        Promise.resolve({
          docs: [
            {
              data: () => ({
                id: 1,
                title: 'Product 1',
                price: 10,
                imageUrl: 'https://example.com/product1.jpg',
              }),
            },
            {
              data: () => ({
                id: 2,
                title: 'Product 2',
                price: 20,
                imageUrl: 'https://example.com/product2.jpg',
              }),
            },
            {
              data: () => ({
                id: 3,
                title: 'Product 3',
                price: 30,
                imageUrl: 'https://example.com/product3.jpg',
              }),
            },
          ],
        })
      ),
    })),
  },
  storage: {
    ref: jest.fn(() => ({
      put: jest.fn(() =>
        Promise.resolve({
          ref: {
            getDownloadURL: jest.fn(() =>
              Promise.resolve('https://example.com/product1.jpg')
            ),
          },
        })
      ),
    })),
  },
  auth: {
    signOut: jest.fn(() => Promise.resolve()),
  },
}))

describe('Seller', () => {
  beforeEach(() => {
    render(<Seller />)
  })

  test('renders product list', async () => {
    // Wait for the products to load
    await screen.findByText('Product 1')

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
    expect(screen.getByText('$20')).toBeInTheDocument()
    expect(screen.getByText('Product 3')).toBeInTheDocument()
    expect(screen.getByText('$30')).toBeInTheDocument()
  })

  test('adds a new product', async () => {
    // Wait for the products to load
    await screen.findByText('Product 1')

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Product title...'), {
      target: { value: 'New Product' },
    })
    fireEvent.change(screen.getByPlaceholderText('Product price...'), {
      target: { value: '40' },
    })
    const file = new File(['(⌐□_□)'], 'product.jpg', { type: 'image/jpeg' })
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    })

    // Submit the form
    fireEvent.click(screen.getByText('Add Product'))

    // Wait for the products to reload
    await screen.findByText('Product 1')

    expect(screen.getByText('New Product')).toBeInTheDocument()
    expect(screen.getByText('$40')).toBeInTheDocument()
  })

  test('does not add a new product without a title', async () => {
    // Wait for the products to load
    await screen.findByText('Product 1')

    // Fill in the form without a title
    fireEvent.change(screen.getByPlaceholderText('Product price...'), {
      target: { value: '40' },
    })
    const file = new File(['(⌐□_□)'], 'product.jpg', { type: 'image/jpeg' })
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [file] },
    })

    // Submit the form
    fireEvent.click(screen.getByText('Add Product'))

    // Wait for the products to reload
    await screen.findByText('Product 1')

    expect(screen.queryByText('$40')).not.toBeInTheDocument()
  })

  test('submit product with no title should show error message', async () => {
    const { getByPlaceholderText, getByText } = render(<Seller />)
    const inputPrice = getByPlaceholderText('Product price...')
    const inputFile = getByPlaceholderText('Upload product image...')
    const submitButton = getByText('Add Product')

    fireEvent.change(inputPrice, { target: { value: 10 } })
    fireEvent.change(inputFile, {
      target: {
        files: [new File(['file contents'], 'test.png', { type: 'image/png' })],
      },
    })
    fireEvent.click(submitButton)

    await waitFor(() =>
      expect(getByText('Please enter a product title.')).toBeInTheDocument()
    )
  })

  test('clicking logout button should call signOut function', async () => {
    const signOutMock = jest.fn()
    jest.spyOn(firebaseAuth, 'signOut').mockImplementation(signOutMock)
    const { getByText } = render(<Seller />)
    const logoutButton = getByText('Logout')

    fireEvent.click(logoutButton)

    await waitFor(() => expect(signOutMock).toHaveBeenCalledTimes(1))
  })
})
