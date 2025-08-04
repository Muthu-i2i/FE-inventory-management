import inventoryReducer, {
  fetchInventory,
  createStock,
  deleteStock,
  updateStock,
} from '../../../store/slices/inventorySlice';
import { inventoryService } from '../../../api/inventory.api';

jest.mock('../../../api/inventory.api');

describe('Inventory Slice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

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
  });

  describe('reducer', () => {
    it('should handle initial state', () => {
      expect(inventoryReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle fetchInventory.pending', () => {
      const action = { type: fetchInventory.pending.type };
      const state = inventoryReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchInventory.fulfilled', () => {
      const action = {
        type: fetchInventory.fulfilled.type,
        payload: mockStock,
      };

      const state = inventoryReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockStock);
      expect(state.error).toBeNull();
    });

    it('should handle fetchInventory.rejected', () => {
      const errorMessage = 'Failed to fetch inventory';
      const action = {
        type: fetchInventory.rejected.type,
        error: { message: errorMessage },
      };

      const state = inventoryReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle createStock.fulfilled', () => {
      const newStock = {
        id: 2,
        product: { id: 2, name: 'New Product' },
        quantity: 50,
        warehouse: { id: 1, name: 'Main Warehouse' },
        minQuantity: 5,
      };

      const action = {
        type: createStock.fulfilled.type,
        payload: newStock,
      };

      const state = inventoryReducer({
        ...initialState,
        items: [...mockStock],
      }, action);

      expect(state.items).toHaveLength(2);
      expect(state.items).toContainEqual(newStock);
    });

    it('should handle deleteStock.fulfilled', () => {
      const action = {
        type: deleteStock.fulfilled.type,
        payload: 1, // ID of deleted stock
      };

      const state = inventoryReducer({
        ...initialState,
        items: [...mockStock],
      }, action);

      expect(state.items).toHaveLength(0);
    });

    it('should handle updateStock.fulfilled', () => {
      const updatedStock = {
        ...mockStock[0],
        quantity: 150,
      };

      const action = {
        type: updateStock.fulfilled.type,
        payload: updatedStock,
      };

      const state = inventoryReducer({
        ...initialState,
        items: [...mockStock],
      }, action);

      expect(state.items[0].quantity).toBe(150);
    });
  });

  describe('thunks', () => {
    it('should handle fetchInventory success', async () => {
      (inventoryService.getStock as jest.Mock).mockResolvedValueOnce(mockStock);

      const dispatch = jest.fn();
      const thunk = fetchInventory();

      await thunk(dispatch, () => ({}), {});

      const pendingAction = dispatch.mock.calls[0][0];
      const fulfilledAction = dispatch.mock.calls[1][0];

      expect(pendingAction.type).toBe(fetchInventory.pending.type);
      expect(fulfilledAction.type).toBe(fetchInventory.fulfilled.type);
      expect(fulfilledAction.payload).toEqual(mockStock);
    });

    it('should handle fetchInventory failure', async () => {
      const errorMessage = 'Failed to fetch inventory';
      (inventoryService.getStock as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

      const dispatch = jest.fn();
      const thunk = fetchInventory();

      await thunk(dispatch, () => ({}), {});

      const pendingAction = dispatch.mock.calls[0][0];
      const rejectedAction = dispatch.mock.calls[1][0];

      expect(pendingAction.type).toBe(fetchInventory.pending.type);
      expect(rejectedAction.type).toBe(fetchInventory.rejected.type);
      expect(rejectedAction.error.message).toBe(errorMessage);
    });
  });
});