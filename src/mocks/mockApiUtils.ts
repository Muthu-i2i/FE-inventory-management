// Generic paginated response type
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Helper to create paginated responses
export const createPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalCount = data.length;

  return {
    count: totalCount,
    next: endIndex < totalCount ? `?page=${page + 1}&page_size=${pageSize}` : null,
    previous: page > 1 ? `?page=${page - 1}&page_size=${pageSize}` : null,
    results: paginatedData,
  };
};

// Simulate network delay
export const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock error response
export class MockApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'MockApiError';
  }
}

// Helper to simulate API errors
export const throwError = (status: number, message: string, errors?: Record<string, string[]>) => {
  throw new MockApiError(status, message, errors);
};