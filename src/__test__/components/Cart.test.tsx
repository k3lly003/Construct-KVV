import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render as customRender } from '../test-utils';
import { CartPage } from '@/app/(components)/product/Cart';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(),
  useCartHydration: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 'user-1', email: 'test@example.com' },
  }),
}));

jest.mock('@/app/hooks/useTranslations', () => ({
  useTranslations: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/store/userStore', () => ({
  useUserStore: (selector: any) => selector({ email: 'test@example.com', phone: '250791322102' }),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/app/services/orderService', () => ({
  orderService: {
    placeOrder: jest.fn(),
  },
}));

jest.mock('@/app/services/paymentService', () => ({
  initiateSplitPayment: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

describe('Cart', () => {
  const mockCartItems = [
    {
      id: 'item-1',
      cartItemId: 'cart-item-1',
      productId: 'product-1',
      name: 'Cement 50kg',
      price: 50000,
      quantity: 2,
      image: '/images/cement.jpg',
      category: 'construction',
      weight: 50,
      dimensions: '50kg bag',
    },
    {
      id: 'item-2',
      cartItemId: 'cart-item-2',
      productId: 'product-2',
      name: 'Steel Bars',
      price: 30000,
      quantity: 1,
      image: '/images/steel.jpg',
      category: 'construction',
      weight: 20,
      dimensions: '6m length',
    },
  ];

  const mockCart = {
    id: 'cart-1',
    items: mockCartItems.map((item) => ({
      id: item.cartItemId,
      product: {
        id: item.productId,
        name: item.name,
        price: item.price.toString(),
        sellerId: 'seller-1',
      },
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    })),
    totalItems: 3,
    subtotal: 130000,
    total: 130000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockUseCartStore = {
    cartItems: mockCartItems,
    cart: mockCart,
    isLoading: false,
    error: null,
    updateQuantity: jest.fn().mockResolvedValue(undefined),
    removeFromCart: jest.fn().mockResolvedValue(undefined),
    clearCart: jest.fn().mockResolvedValue(undefined),
    fetchCart: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { useCartStore } = require('@/store/cartStore');
    useCartStore.mockReturnValue(mockUseCartStore);
  });

  describe('Cart display', () => {
    test('displays all cart items', () => {
      // Arrange & Act
      customRender(<CartPage />);

      // Assert
      expect(screen.getByText('Cement 50kg')).toBeInTheDocument();
      expect(screen.getByText('Steel Bars')).toBeInTheDocument();
    });

    test('displays item quantities', () => {
      // Arrange & Act
      customRender(<CartPage />);

      // Assert
      expect(screen.getByText('2')).toBeInTheDocument(); // Quantity for Cement
      expect(screen.getByText('1')).toBeInTheDocument(); // Quantity for Steel Bars
    });

    test('displays item prices correctly', () => {
      // Arrange & Act
      customRender(<CartPage />);

      // Assert
      expect(screen.getByText(/100000/i)).toBeInTheDocument(); // 2 * 50000
      expect(screen.getByText(/30000/i)).toBeInTheDocument(); // 1 * 30000
    });

    test('displays empty cart message when cart is empty', () => {
      // Arrange
      const { useCartStore } = require('@/store/cartStore');
      useCartStore.mockReturnValue({
        ...mockUseCartStore,
        cartItems: [],
        cart: null,
      });

      // Act
      customRender(<CartPage />);

      // Assert
      // The component should show empty state
      expect(screen.queryByText('Cement 50kg')).not.toBeInTheDocument();
    });
  });

  describe('Quantity updates', () => {
    test('increases item quantity when plus button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<CartPage />);

      // Act
      const plusButtons = screen.getAllByRole('button', { name: /plus/i });
      if (plusButtons.length > 0) {
        await user.click(plusButtons[0]);
      }

      // Assert
      await waitFor(() => {
        expect(mockUseCartStore.updateQuantity).toHaveBeenCalled();
      });
    });

    test('decreases item quantity when minus button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<CartPage />);

      // Act
      const minusButtons = screen.getAllByRole('button', { name: /minus/i });
      if (minusButtons.length > 0) {
        await user.click(minusButtons[0]);
      }

      // Assert
      await waitFor(() => {
        expect(mockUseCartStore.updateQuantity).toHaveBeenCalled();
      });
    });

    test('prevents quantity from going below 1', async () => {
      // Arrange
      const user = userEvent.setup();
      const { useCartStore } = require('@/store/cartStore');
      useCartStore.mockReturnValue({
        ...mockUseCartStore,
        cartItems: [
          {
            ...mockCartItems[0],
            quantity: 1,
          },
        ],
      });

      customRender(<CartPage />);

      // Act
      const minusButton = screen.getByRole('button', { name: /minus/i });
      await user.click(minusButton);

      // Assert
      await waitFor(() => {
        expect(mockUseCartStore.updateQuantity).toHaveBeenCalledWith(
          'cart-item-1',
          1
        );
      });
    });

    test('shows error when cart item ID is missing', async () => {
      // Arrange
      const user = userEvent.setup();
      const { toast } = require('sonner');
      const { useCartStore } = require('@/store/cartStore');
      useCartStore.mockReturnValue({
        ...mockUseCartStore,
        cartItems: [
          {
            ...mockCartItems[0],
            cartItemId: undefined,
          },
        ],
      });

      customRender(<CartPage />);

      // Act
      const minusButton = screen.getByRole('button', { name: /minus/i });
      await user.click(minusButton);

      // Assert
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Remove items', () => {
    test('removes item from cart when remove button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      customRender(<CartPage />);

      // Act
      const removeButtons = screen.getAllByText(/remove/i);
      if (removeButtons.length > 0) {
        await user.click(removeButtons[0]);
      }

      // Assert
      await waitFor(() => {
        expect(mockUseCartStore.removeFromCart).toHaveBeenCalledWith('cart-item-1');
      });
    });
  });

  describe('Total calculation', () => {
    test('calculates subtotal correctly', () => {
      // Arrange & Act
      customRender(<CartPage />);

      // Assert
      // Subtotal should be sum of all item prices * quantities
      // 50000 * 2 + 30000 * 1 = 130000
      expect(screen.getByText(/130000/i)).toBeInTheDocument();
    });

    test('displays total correctly', () => {
      // Arrange & Act
      customRender(<CartPage />);

      // Assert
      expect(screen.getByText(/130000/i)).toBeInTheDocument();
    });
  });

  describe('Checkout flow', () => {
    test('places order and initiates payment on checkout', async () => {
      // Arrange
      const user = userEvent.setup();
      const { orderService } = require('@/app/services/orderService');
      const { initiateSplitPayment } = require('@/app/services/paymentService');

      orderService.placeOrder.mockResolvedValue({
        data: {
          id: 'order-1',
          total: 130000,
        },
      });

      initiateSplitPayment.mockResolvedValue({});

      customRender(<CartPage />);

      // Act
      const checkoutButton = screen.getByRole('button', { name: /place order|checkout/i });
      await user.click(checkoutButton);

      // Assert
      await waitFor(() => {
        expect(orderService.placeOrder).toHaveBeenCalled();
      });
    });

    test('redirects to signin when user is not authenticated', async () => {
      // Arrange
      const user = userEvent.setup();
      const { useAuth } = require('@/hooks/useAuth');
      useAuth.mockReturnValue({
        isAuthenticated: false,
      });

      localStorage.removeItem('authToken');

      customRender(<CartPage />);

      // Act
      const checkoutButton = screen.getByRole('button', { name: /place order|checkout/i });
      await user.click(checkoutButton);

      // Assert
      await waitFor(() => {
        const { toast } = require('sonner');
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('logged in'));
      });
    });
  });

  describe('Loading states', () => {
    test('shows loading state when cart is being fetched', () => {
      // Arrange
      const { useCartStore } = require('@/store/cartStore');
      useCartStore.mockReturnValue({
        ...mockUseCartStore,
        isLoading: true,
      });

      // Act
      customRender(<CartPage />);

      // Assert
      // Component should show loading state
      expect(screen.queryByText('Cement 50kg')).not.toBeInTheDocument();
    });

    test('disables buttons during loading', () => {
      // Arrange
      const { useCartStore } = require('@/store/cartStore');
      useCartStore.mockReturnValue({
        ...mockUseCartStore,
        isLoading: true,
      });

      // Act
      customRender(<CartPage />);

      // Assert
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        if (button.textContent?.includes('Remove') || button.textContent?.includes('+') || button.textContent?.includes('-')) {
          expect(button).toBeDisabled();
        }
      });
    });
  });

  describe('Error handling', () => {
    test('displays error message when cart fetch fails', () => {
      // Arrange
      const { useCartStore } = require('@/store/cartStore');
      useCartStore.mockReturnValue({
        ...mockUseCartStore,
        error: 'Failed to fetch cart',
      });

      // Act
      customRender(<CartPage />);

      // Assert
      expect(screen.getByText(/failed to fetch cart/i)).toBeInTheDocument();
    });
  });
});


