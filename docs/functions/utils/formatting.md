# Formatting Utilities Documentation

## Date Formatting Functions

### `formatDate`
Formats dates consistently across the application.

```typescript
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'iso' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dayjs(dateObj).format('DD/MM/YYYY');
    case 'long':
      return dayjs(dateObj).format('DD MMMM YYYY');
    case 'iso':
      return dayjs(dateObj).format('YYYY-MM-DD');
    default:
      return dayjs(dateObj).format('DD/MM/YYYY');
  }
}
```

### `formatDateTime`
Formats date and time.

```typescript
export function formatDateTime(
  date: Date | string,
  format: 'short' | 'long' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dayjs(dateObj).format('DD/MM/YYYY HH:mm');
    case 'long':
      return dayjs(dateObj).format('DD MMMM YYYY HH:mm:ss');
    default:
      return dayjs(dateObj).format('DD/MM/YYYY HH:mm');
  }
}
```

### `getRelativeTime`
Returns relative time string.

```typescript
export function getRelativeTime(date: Date | string): string {
  return dayjs(date).fromNow();
}
```

## Number Formatting Functions

### `formatCurrency`
Formats numbers as currency.

```typescript
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
```

### `formatNumber`
Formats numbers with thousands separators.

```typescript
export function formatNumber(
  number: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}
```

### `formatPercentage`
Formats numbers as percentages.

```typescript
export function formatPercentage(
  value: number,
  decimals: number = 1,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
```

## String Formatting Functions

### `truncateText`
Truncates text with ellipsis.

```typescript
export function truncateText(
  text: string,
  maxLength: number = 50,
  ellipsis: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}
```

### `formatPhoneNumber`
Formats phone numbers consistently.

```typescript
export function formatPhoneNumber(
  phone: string,
  format: 'national' | 'international' = 'national'
): string {
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  if (format === 'national') {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  
  return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
}
```

## File Size Formatting

### `formatFileSize`
Formats file sizes with appropriate units.

```typescript
export function formatFileSize(
  bytes: number,
  decimals: number = 2
): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
```

## Usage Examples

### Date Formatting
```typescript
// Format dates
const shortDate = formatDate(new Date(), 'short'); // "25/03/2024"
const longDate = formatDate(new Date(), 'long');   // "25 March 2024"
const isoDate = formatDate(new Date(), 'iso');     // "2024-03-25"

// Format date and time
const timestamp = formatDateTime(new Date(), 'long'); // "25 March 2024 15:30:45"

// Get relative time
const relative = getRelativeTime('2024-03-24'); // "1 day ago"
```

### Number Formatting
```typescript
// Format currency
const price = formatCurrency(1234.56);        // "$1,234.56"
const euro = formatCurrency(1234.56, 'EUR');  // "€1,234.56"

// Format numbers
const number = formatNumber(1234567.89, 2);   // "1,234,567.89"
const percent = formatPercentage(0.1234);     // "12.3%"
```

### String Formatting
```typescript
// Truncate text
const text = truncateText('Long text here...', 10); // "Long te..."

// Format phone
const phone = formatPhoneNumber('1234567890');    // "(123) 456-7890"
const intl = formatPhoneNumber('11234567890', 'international'); // "+1 (123) 456-7890"

// Format file size
const size = formatFileSize(1234567); // "1.18 MB"
```