# InventoryList Component Documentation

## Component Overview
`InventoryList` is a complex component that handles the display and management of inventory items.

## Props
None (Component uses Redux for state management)

## Internal Functions

### `useInventoryList` (Custom Hook)
```typescript
function useInventoryList() {
  // State management for inventory list
  return {
    items: StockItem[];
    loading: boolean;
    error: string | null;
    filters: FilterState;
    pagination: PaginationState;
  }
}
```

### `handleStockMovement`
```typescript
async function handleStockMovement(
  stockId: number,
  data: StockMovementData
): Promise<void>
```
Records stock movement (in/out) for a specific item.

#### Example Usage
```typescript
await handleStockMovement(1, {
  movement_type: 'IN',
  quantity: 10,
  reason: 'Restock'
});
```

### `handleStockAdjustment`
```typescript
async function handleStockAdjustment(
  stockId: number,
  data: StockAdjustmentData
): Promise<void>
```
Adjusts stock quantity with reason.

### `handleDelete`
```typescript
async function handleDelete(stockId: number): Promise<void>
```
Deletes a stock item after confirmation.

### `handleFilterChange`
```typescript
function handleFilterChange(
  field: keyof FilterState,
  value: any
): void
```
Updates filter criteria for the list.

### `handleSearch`
```typescript
const handleSearch = debounce((term: string): void => {
  // Search implementation
}, 300);
```
Debounced search function for inventory items.

## State Management

### Local State
```typescript
const [filters, setFilters] = useState<FilterState>({
  warehouse: null,
  category: null,
  search: '',
});

const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
```

### Redux State
```typescript
const { items, loading } = useSelector((state: RootState) => state.inventory);
```

## Event Handlers

### `onMovementSubmit`
```typescript
async function onMovementSubmit(data: StockMovementFormData): Promise<void>
```
Handles stock movement form submission.

### `onAdjustmentSubmit`
```typescript
async function onAdjustmentSubmit(data: StockAdjustmentFormData): Promise<void>
```
Handles stock adjustment form submission.

## Render Functions

### `renderActionButtons`
```typescript
function renderActionButtons(item: StockItem): JSX.Element
```
Renders action buttons for each inventory item.

### `renderFilters`
```typescript
function renderFilters(): JSX.Element
```
Renders filter controls for the inventory list.

## Effects

### Load Data
```typescript
useEffect(() => {
  dispatch(fetchInventory(filters));
}, [filters, dispatch]);
```

### Update Search
```typescript
useEffect(() => {
  handleSearch(searchTerm);
  return () => handleSearch.cancel();
}, [searchTerm]);
```

## Example Usage
```typescript
// In a parent component
<InventoryList />

// With custom wrapper
<PageContainer>
  <InventoryList />
</PageContainer>
```

## Related Components
- `StockMovementDialog`
- `StockAdjustmentDialog`
- `DeleteConfirmDialog`
- `FilterPanel`