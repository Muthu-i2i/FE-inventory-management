# Inventory Slice Documentation

## State Interface
```typescript
interface InventoryState {
  items: StockItem[];
  loading: boolean;
  error: string | null;
  filters: {
    warehouse: number | null;
    category: number | null;
    search: string;
    lowStock: boolean;
  };
  selectedItem: StockItem | null;
}
```

## Initial State
```typescript
const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    warehouse: null,
    category: null,
    search: '',
    lowStock: false,
  },
  selectedItem: null,
};
```

## Thunk Actions

### `fetchInventory`
```typescript
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (filters?: Partial<InventoryState['filters']>) => {
    const response = await inventoryService.getStock(filters);
    return response;
  }
);
```

### `createStockEntry`
```typescript
export const createStockEntry = createAsyncThunk(
  'inventory/createStock',
  async (data: CreateStockData) => {
    const response = await inventoryService.createStock(data);
    return response;
  }
);
```

### `recordStockMovement`
```typescript
export const recordStockMovement = createAsyncThunk(
  'inventory/recordMovement',
  async ({ stockId, data }: { 
    stockId: number; 
    data: StockMovementData;
  }) => {
    const response = await inventoryService.recordStockMovement(stockId, data);
    return response;
  }
);
```

## Reducers

### Regular Reducers
```typescript
reducers: {
  setFilters: (state, action: PayloadAction<Partial<InventoryState['filters']>>) => {
    state.filters = {
      ...state.filters,
      ...action.payload,
    };
  },
  
  selectItem: (state, action: PayloadAction<StockItem | null>) => {
    state.selectedItem = action.payload;
  },
  
  clearError: (state) => {
    state.error = null;
  },
},
```

### Extra Reducers
```typescript
extraReducers: (builder) => {
  // Fetch Inventory
  builder.addCase(fetchInventory.pending, (state) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase(fetchInventory.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload;
  });
  builder.addCase(fetchInventory.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || 'Failed to fetch inventory';
  });

  // Create Stock Entry
  builder.addCase(createStockEntry.fulfilled, (state, action) => {
    state.items.push(action.payload);
  });

  // Record Stock Movement
  builder.addCase(recordStockMovement.fulfilled, (state, action) => {
    const index = state.items.findIndex(
      item => item.id === action.payload.stockId
    );
    if (index !== -1) {
      state.items[index].quantity = action.payload.newQuantity;
    }
  });
},
```

## Selectors

### `selectInventory`
```typescript
export const selectInventory = (state: RootState) => state.inventory;
```

### `selectInventoryItems`
```typescript
export const selectInventoryItems = (state: RootState) => state.inventory.items;
```

### `selectInventoryFilters`
```typescript
export const selectInventoryFilters = (state: RootState) => 
  state.inventory.filters;
```

### `selectLowStockItems`
```typescript
export const selectLowStockItems = createSelector(
  selectInventoryItems,
  (items) => items.filter(item => item.quantity <= item.minQuantity)
);
```

## Usage Examples

### In Components
```typescript
// Using hooks
const dispatch = useDispatch();
const { items, loading } = useSelector(selectInventory);

// Fetch inventory
useEffect(() => {
  dispatch(fetchInventory());
}, [dispatch]);

// Record movement
const handleMovement = async (data: StockMovementData) => {
  try {
    await dispatch(recordStockMovement({
      stockId: selectedItem.id,
      data
    })).unwrap();
    enqueueSnackbar('Stock movement recorded', { variant: 'success' });
  } catch (error) {
    enqueueSnackbar(error.message, { variant: 'error' });
  }
};
```

### With Filters
```typescript
// Update filters
dispatch(setFilters({ warehouse: 1, lowStock: true }));

// Filter items in component
const filteredItems = useMemo(() => {
  return items.filter(item => {
    if (filters.warehouse && item.warehouse.id !== filters.warehouse) {
      return false;
    }
    if (filters.lowStock && item.quantity > item.minQuantity) {
      return false;
    }
    return true;
  });
}, [items, filters]);
```

## Error Handling
```typescript
if (error) {
  enqueueSnackbar(error, { 
    variant: 'error',
    action: (
      <Button color="inherit" onClick={() => dispatch(clearError())}>
        Dismiss
      </Button>
    ),
  });
}
```

## Side Effects
- Updates local storage cache for quick loading
- Triggers notifications on stock movements
- Updates related analytics data

## Related Files
- `src/api/inventory.api.ts`
- `src/types/inventory.types.ts`
- `src/pages/inventory/InventoryList.tsx`
- `src/components/StockMovementDialog.tsx`