# AgroNexis Backend - Error Handling Implementation

## Overview
This document outlines the comprehensive error handling mechanism implemented across the AgroNexis Backend API.

## Components Implemented

### 1. Global Exception Handler Middleware (`GlobalExceptionHandlerMiddleware.cs`)

**Location:** `/Middleware/GlobalExceptionHandlerMiddleware.cs`

**Purpose:** Centralized exception handling for all API requests

**Features:**
- Catches unhandled exceptions across the entire application
- Maps specific exception types to appropriate HTTP status codes
- Returns consistent API response format
- Logs all exceptions with correlation IDs
- Supports multiple exception types:
  - `ArgumentNullException` → 400 Bad Request
  - `ArgumentException` → 400 Bad Request
  - `UnauthorizedAccessException` → 401 Unauthorized
  - `KeyNotFoundException` → 404 Not Found
  - `InvalidOperationException` → 400 Bad Request
  - `TimeoutException` → 408 Request Timeout
  - `NotImplementedException` → 501 Not Implemented
  - Generic exceptions → 500 Internal Server Error

### 2. Base Controller (`BaseController.cs`)

**Location:** `/Controllers/BaseController.cs`

**Purpose:** Provides common functionality for all controllers

**Features:**
- Correlation ID extraction and generation
- Standard response creation methods
- Input validation utilities
- Reduces code duplication across controllers

### 3. Updated Constants (`Constants.cs`)

**Location:** `/Agronexis.Common/Constants.cs`

**Enhancements:**
- Added `ServerStatusCodes` enum for consistent status code usage
- Extended `ApiResponseMessage` with additional error messages
- Standardized response codes across the application

### 4. Enhanced Controllers

**Updated Controllers:**
- `AuthController.cs` - Authentication endpoints (✅ Completed)
- `ProductController.cs` - Product management (✅ Completed)
- `CategoryController.cs` - Category management (✅ Completed)
- `BrandController.cs` - Brand management (✅ Completed)
- `RoleController.cs` - Role management (✅ Completed)
- `CheckoutController.cs` - Order/Checkout management (✅ Completed)

**Features Added:**
- Dependency injection for `ILogger`
- Input validation with meaningful error messages
- Correlation ID tracking
- Structured logging with contextual information
- Exception throwing instead of returning null responses
- Proper HTTP status code returns

### 5. Business Layer Enhancements (`ConfigService.cs`)

**Features Added:**
- Logging integration
- Input validation
- Exception handling and re-throwing
- Contextual logging with correlation IDs

## Error Handling Flow

```
1. Client Request → Controller
2. Controller validates input and throws specific exceptions
3. If exception occurs → GlobalExceptionHandlerMiddleware catches it
4. Middleware maps exception to HTTP status code
5. Middleware logs the exception with correlation ID
6. Middleware returns standardized API response
7. Client receives consistent error response
```

## API Response Format

### Success Response
```json
{
  "info": {
    "code": "200",
    "message": "success"
  },
  "data": { ... }
}
```

### Error Response
```json
{
  "info": {
    "code": "400",
    "message": "Invalid input parameters"
  }
}
```

## Correlation ID Usage

Every request is tracked with a correlation ID:
- Extracted from `X-Correlation-ID` header if provided
- Auto-generated GUID if not provided
- Logged with every operation for traceability
- Returned in error responses for debugging

## Logging Strategy

### Log Levels Used:
- **Information:** Successful operations, endpoint calls
- **Warning:** Business logic failures, not found scenarios
- **Error:** Exception details with stack traces

### Log Format:
- All logs include correlation ID
- Structured logging with parameter interpolation
- Context-aware messages

## Usage Examples

### Controller Exception Throwing
```csharp
// Input validation
if (model == null)
    throw new ArgumentNullException(nameof(model), "Model cannot be null");

// Business logic validation  
if (string.IsNullOrWhiteSpace(id))
    throw new ArgumentException("ID cannot be empty", nameof(id));

// Not found scenarios
if (result == null)
    throw new KeyNotFoundException($"Product with ID {id} not found");

// Unauthorized access
if (!isAuthorized)
    throw new UnauthorizedAccessException("Invalid credentials");
```

### Logging Examples
```csharp
_logger.LogInformation("Processing login for correlation ID: {CorrelationId}", correlationId);
_logger.LogWarning("Product not found for id: {Id}, correlation ID: {CorrelationId}", id, correlationId);
_logger.LogError(ex, "Error processing request for correlation ID: {CorrelationId}", correlationId);
```

## Configuration

### Program.cs Setup
```csharp
// Add global exception handler (early in pipeline)
app.UseGlobalExceptionHandler();

// Add logging configuration
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});
```

## Benefits

1. **Consistency:** All errors follow the same response format
2. **Traceability:** Correlation IDs allow end-to-end request tracking
3. **Maintainability:** Centralized error handling reduces code duplication
4. **Debugging:** Comprehensive logging aids in troubleshooting
5. **User Experience:** Meaningful error messages for client applications
6. **Monitoring:** Structured logs enable better application monitoring

## Future Enhancements

1. Add custom exception types for business-specific errors
2. Implement error response localization
3. Add retry logic for transient failures
4. Implement circuit breaker pattern for external dependencies
5. Add metrics collection for error rates and types
6. Implement log correlation across microservices

## Testing

To test the error handling:

1. Send requests with invalid data to trigger validation errors
2. Send requests with missing correlation ID to verify auto-generation
3. Test various error scenarios to verify appropriate status codes
4. Check logs to ensure proper correlation ID tracking
5. Verify consistent error response format across all endpoints

## Implementation Status

### ✅ Completed Components
- **Global Exception Handler Middleware:** Fully implemented and registered
- **Base Controller:** Created with common error handling utilities
- **All Controllers:** Refactored to use consistent error handling patterns
  - AuthController (Authentication endpoints)
  - ProductController (Product CRUD operations)
  - CategoryController (Category management)
  - BrandController (Brand management)
  - RoleController (Role management)
  - CheckoutController (Order/checkout operations)
- **Business Layer:** ConfigService enhanced with error handling and logging
- **Constants:** Updated with new status codes and error messages
- **Program.cs:** Updated with middleware registration and logging configuration

### 📊 Summary
- **6/6 Controllers** refactored ✅
- **1 Global Middleware** implemented ✅
- **1 Base Controller** created ✅
- **1 Business Service** enhanced ✅
- **Error Documentation** completed ✅

All error handling implementation is **COMPLETE** and ready for testing and deployment.
