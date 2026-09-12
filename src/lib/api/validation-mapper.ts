/**
 * Maps backend validation field paths to frontend form field names.
 * Backend typically uses camelCase or snake_case, frontend uses camelCase.
 * This utility handles common path transformations.
 */

export interface ValidationError {
  field: string
  message: string
}

export function mapValidationErrors(
  details: unknown,
  fieldMap?: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!details || typeof details !== 'object') {
    return errors
  }

  // Handle array of validation errors
  if (Array.isArray(details)) {
    details.forEach((error) => {
      if (error && typeof error === 'object' && 'field' in error && 'message' in error) {
        const field = String(error.field)
        const message = String(error.message)
        const mappedField = fieldMap?.[field] || mapFieldName(field)
        errors[mappedField] = message
      }
    })
  } 
  // Handle object with field keys
  else {
    Object.entries(details).forEach(([field, message]) => {
      const mappedField = fieldMap?.[field] || mapFieldName(field)
      errors[mappedField] = Array.isArray(message) ? message.join(' ') : String(message)
    })
  }

  return errors
}

/**
 * Common field name transformations from backend to frontend.
 * Add mappings as needed based on backend API contracts.
 */
function mapFieldName(field: string): string {
  const commonMappings: Record<string, string> = {
    // Customer fields
    'customerName': 'name',
    'customerPhone': 'phone',
    'customerEmail': 'email',
    
    // Vehicle fields
    'vehicleMake': 'make',
    'vehicleModel': 'model',
    'vehiclePlate': 'plateNumber',
    'vehicleYear': 'manufactureYear',
    'vehicleVin': 'vin',
    'vehicleTransmission': 'transmission',
    
    // Maintenance fields
    'visitReasonIds': 'visitReasonIds',
    'conditionOptionIds': 'conditionOptionIds',
    'itemOptionIds': 'itemOptionIds',
    'requiredWorks': 'requiredWorks',
    
    // Work item fields (nested)
    'requiredWorks.description': 'requiredWorks.description',
    'requiredWorks.estimatedCost': 'requiredWorks.estimatedCost',
  }

  return commonMappings[field] || field
}
