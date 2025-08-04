import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '../../utils/test-utils';
import InventoryList from '../../../pages/inventory/InventoryList';
import { inventoryService } from '../../../api/inventory.api';

// Mock the inventory service
jest.mock('../../../api/inventory.api', () => ({
  inventoryService: {
    getStock: jest.fn(),
    createStock: jest.fn(),
    deleteStock: jest.fn(),
    recordStockMovement: jest.fn(),
    adjustStock: jest.fn(),
  },
}));

describe('InventoryList Component', () => {
  const mockStock = [
    {
      id: 1,
      product: { id: 1, name: 'Test Product' },
      quantity: 100,
      warehouse: { id: 1, name: 'Main Warehouse' },
      minQuantity: 10,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (inventoryService.getStock as jest.Mock).mockResolvedValue(mockStock);
  });

  it('renders inventory list correctly', async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Main Warehouse')).toBeInTheDocument();
    });
  });

  it('handles stock movement', async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const moveButton = screen.getByRole('button', { name: /move/i });
    fireEvent.click(moveButton);

    expect(screen.getByText(/record stock movement/i)).toBeInTheDocument();
  });

  it('handles stock adjustment', async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const adjustButton = screen.getByRole('button', { name: /adjust/i });
    fireEvent.click(adjustButton);

    expect(screen.getByText(/adjust stock quantity/i)).toBeInTheDocument();
  });

  it('handles stock deletion', async () => {
    (inventoryService.deleteStock as jest.Mock).mockResolvedValueOnce({});
    
    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(inventoryService.deleteStock).toHaveBeenCalledWith(1);
    });
  });

  it('handles error states', async () => {
    (inventoryService.getStock as jest.Mock).mockRejectedValueOnce(new Error('Failed to load inventory'));

    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load inventory/i)).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    render(<InventoryList />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('filters inventory items', async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /search/i });
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});