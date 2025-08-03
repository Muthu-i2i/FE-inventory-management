import { mockProductService } from '../../mocks/mockProductService';

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const result = await mockProductService.getProducts();
      
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('next');
      expect(result).toHaveProperty('previous');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('should filter products by category', async () => {
      const result = await mockProductService.getProducts({ category: 1 });
      
      expect(result.results.every(product => product.category === 1)).toBe(true);
    });

    it('should filter products by supplier', async () => {
      const result = await mockProductService.getProducts({ supplier: 1 });
      
      expect(result.results.every(product => product.supplier === 1)).toBe(true);
    });

    it('should filter products by warehouse', async () => {
      const result = await mockProductService.getProducts({ warehouse: 1 });
      
      expect(result.results.every(product => product.warehouse === 1)).toBe(true);
    });

    it('should filter products by search term', async () => {
      const result = await mockProductService.getProducts({ search: 'Laptop' });
      
      expect(result.results.some(product => 
        product.name.toLowerCase().includes('laptop') ||
        product.sku.toLowerCase().includes('laptop') ||
        product.barcode.toLowerCase().includes('laptop')
      )).toBe(true);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Test Product',
        sku: 'TEST001',
        barcode: '123456',
        category: 1,
        supplier: 1,
        warehouse: 1,
        unit_price: 100,
        price: 150,
      };

      const result = await mockProductService.createProduct(newProduct);

      expect(result).toEqual(expect.objectContaining({
        ...newProduct,
        id: expect.any(Number),
      }));
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 200,
      };

      const result = await mockProductService.updateProduct(1, updateData);

      expect(result).toEqual(expect.objectContaining({
        ...updateData,
        id: 1,
      }));
    });

    it('should throw error for non-existent product', async () => {
      await expect(mockProductService.updateProduct(999, { name: 'Test' }))
        .rejects.toThrow('Product not found');
    });
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const result = await mockProductService.getCategories();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });
  });

  describe('getSuppliers', () => {
    it('should return all suppliers', async () => {
      const result = await mockProductService.getSuppliers();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('email');
    });
  });

  describe('getWarehouses', () => {
    it('should return all warehouses', async () => {
      const result = await mockProductService.getWarehouses();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('capacity');
      expect(result[0]).toHaveProperty('address');
    });
  });
});