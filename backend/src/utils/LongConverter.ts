/**
 * Converts protobufjs Long objects (used for 64-bit integers) to simple JavaScript numbers.
 * This is necessary for displaying SparkplugB timestamps and metrics properly.
 * 
 * Long objects have the structure: { low, high, unsigned }
 * We convert them to regular numbers using BigInt to maintain precision.
 */
export function convertLongToNumber(value: any): any {
  // Check if this is a Long object from protobufjs
  if (value && typeof value === 'object' && 'low' in value && 'high' in value && 'unsigned' in value) {
    try {
      // Convert using BigInt to maintain precision for 64-bit unsigned integers
      const bigIntValue = (BigInt(value.high >>> 0) << BigInt(32)) | BigInt(value.low >>> 0)
      return Number(bigIntValue)
    } catch (e) {
      // Fallback if conversion fails
      console.warn('Failed to convert Long value:', value, 'error:', e)
      return value
    }
  }

  // Recursively handle arrays
  if (Array.isArray(value)) {
    return value.map(item => convertLongToNumber(item))
  }

  // Recursively handle nested objects
  if (value && typeof value === 'object') {
    const converted: any = {}
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        converted[key] = convertLongToNumber(value[key])
      }
    }
    return converted
  }

  // Return primitive values unchanged
  return value
}
