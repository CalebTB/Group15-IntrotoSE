import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Compare } from './Compare'
import { Cart } from './Cart'
import { Return } from "./Return"
import { db } from './firebase'

describe('Compare component', () => {
  test('should render the component without errors', async () => {
    render(<Compare />)
    const addToCartButtons = await screen.findAllByText('Add to Cart')
    expect(addToCartButtons.length).toBeGreaterThan(0)
  });
});

describe('Compare component', () => {
  test('should add the product to the cart when the "Add to Cart" button is clicked', async () => {
    render(<Compare />)
    const addToCartButtons = await screen.findAllByText('Add to Cart')
    const productId = 'testProductId' // replace with a valid product id
    const cartCollectionRef = collection(db, 'Cart')
    const cartQuerySnapshot = await getDocs(cartCollectionRef)
    const initialCartItemCount = cartQuerySnapshot.docs.length
    userEvent.click(addToCartButtons[0])
    const cartQuerySnapshotAfterAddition = await getDocs(cartCollectionRef)
    const finalCartItemCount = cartQuerySnapshotAfterAddition.docs.length
    const lastCartItemAdded = cartQuerySnapshotAfterAddition.docs[finalCartItemCount - 1]
    expect(finalCartItemCount).toBeGreaterThan(initialCartItemCount)
    expect(lastCartItemAdded.data().productId).toEqual(productId)
  });
});

describe('Compare component', () => {
  test('should remove the product from the compare list when the "Remove" button is clicked', async () => {
    const compareItemId = 'testCompareItemId' // replace with a valid compare item id
    const mockCompareList = [      
      {id: compareItemId,        
       productId: 'testProductId',        
       productData: 
        {
          title: 'Test Product',          
          imageUrl: 'https://testproduct.com/image.jpg',          
          price: 99.99,          
          description: 'This is a test product',        
        },
      },    
    ]
    jest.spyOn(React, 'useState').mockImplementation((initialState) => [mockCompareList, jest.fn()])
    const handleRemoveCompareSpy = jest.spyOn(Compare.prototype, 'handleRemoveCompare')
    const { getByText } = render(<Compare />)
    const removeButton = getByText('Remove')
    userEvent.click(removeButton)
    expect(handleRemoveCompareSpy).toHaveBeenCalledWith(compareItemId)
    expect(mockCompareList).toEqual([])
  });
});

describe('Cart component', () => {
  test('should render the component without errors', () => {
    render(<Cart />);
    const cartTitle = screen.getByText('Shopping Cart');
    expect(cartTitle).toBeInTheDocument();
  });

  test('should display the correct number of items in the cart', async () => {
    render(<Cart />);
    const productTitle = 'Test Product';
    const productPrice = 9.99;
    const addToCartButton = await screen.findByText('Add to Cart');
    userEvent.click(addToCartButton);
    const cartItemCount = screen.getByTestId('cart-item-count');
    expect(cartItemCount).toHaveTextContent('1');
    const cartItemTitle = screen.getByText(productTitle);
    const cartItemPrice = screen.getByText(`$${productPrice}`);
    expect(cartItemTitle).toBeInTheDocument();
    expect(cartItemPrice).toBeInTheDocument();
  });

  test('should remove an item from the cart when the "Remove" button is clicked', async () => {
    render(<Cart />);
    const productTitle = 'Test Product';
    const productPrice = 9.99;
    const addToCartButton = await screen.findByText('Add to Cart');
    userEvent.click(addToCartButton);
    const removeButton = screen.getByText('Remove');
    userEvent.click(removeButton);
    const cartItemCount = screen.getByTestId('cart-item-count');
    expect(cartItemCount).toHaveTextContent('0');
    const cartItemTitle = screen.queryByText(productTitle);
    const cartItemPrice = screen.queryByText(`$${productPrice}`);
    expect(cartItemTitle).not.toBeInTheDocument();
    expect(cartItemPrice).not.toBeInTheDocument();
  });
});

test('handles item return and shows success alert', async () => {
  // create a mock item to add to the previous order list
  const mockItem = {
    id: 'testItem',
    productId: 'testProduct',
    productData: {
      id: 'testProduct',
      title: 'Test Product',
      price: 20.99,
      description: 'This is a test product',
      imageUrl: 'https://example.com/test-product.jpg',
    },
  }
  const mockOnSnapshot = jest.fn()
  mockOnSnapshot.mockImplementation((q, callback) => {
    callback({
      docs: [{ id: mockItem.id, data: () => ({ productId: mockItem.productId }) }],
    })
    return () => {}
  })
  jest.spyOn(collection(db, 'PreviousOrders'), 'onSnapshot').mockImplementation(mockOnSnapshot)
  render(<Return />)
  expect(screen.getByText(mockItem.productData.title)).toBeInTheDocument()

  const mockDeleteDoc = jest.fn()
  jest.spyOn(window, 'alert').mockImplementation(() => {}) // mock the alert function
  jest.spyOn(doc(db, 'PreviousOrders', mockItem.id), 'delete').mockImplementation(mockDeleteDoc)
  fireEvent.click(screen.getByText('Return'))

  expect(mockDeleteDoc).toHaveBeenCalledWith()
  expect(screen.queryByText(mockItem.productData.title)).not.toBeInTheDocument()
  expect(window.alert).toHaveBeenCalledWith('Item successfully returned!')
});