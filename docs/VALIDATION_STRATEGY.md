# Validation Strategy: Form Submission vs Draft Saving

This document explains how validation is separated between form submission and draft saving in the Driver Qualification Tool.

## Overview

The application uses different validation strategies depending on the context:

1. **Draft Saving**: Relaxed validation that allows partial data
2. **Step Progression**: Step-specific validation for moving between form steps
3. **Final Submission**: Strict validation requiring all mandatory fields

## Validation Modes

### 1. Draft Validation (`draftValidationSchema`)

**Purpose**: Allow users to save partial progress without completing all fields.

**Characteristics**:

- All fields are optional
- Only critical format errors are blocked (invalid email, invalid SSN format)
- Missing required fields are logged as warnings but don't prevent saving
- Users can save drafts with minimal information (just email is sufficient)

**Use Cases**:

- Auto-saving during form completion
- Manual draft saving
- Resuming incomplete applications

### 2. Step Validation (`stepSchemas`)

**Purpose**: Validate individual steps before allowing progression to the next step.

**Characteristics**:

- Validates only the current step's fields
- All fields in the current step must be valid
- Prevents progression if validation fails
- Shows specific error messages for the current step

**Use Cases**:

- Moving between form steps
- Ensuring step completion before proceeding

### 3. Complete Form Validation (`completeFormSchema`)

**Purpose**: Validate the entire form for final submission.

**Characteristics**:

- All mandatory fields must be completed
- All format validations must pass
- All business rules must be satisfied
- Prevents submission if any validation fails

**Use Cases**:

- Final form submission
- Pre-submission validation checks

## Implementation Details

### Schema Definitions

```typescript
// Strict validation for form submission
export const stepSchemas = [
  // Each step has strict validation rules
  Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    // ... other required fields
  }),
];

// Relaxed validation for draft saving
export const draftValidationSchema = Yup.object().shape({
  firstName: Yup.string().optional(),
  // ... all fields optional
});
```

### Validation Utilities

The `validationUtils.ts` file provides helper functions:

```typescript
// Validate for draft saving
export const validateForDraftSaving = async (
  data: Partial<DriverFormValues>
) => {
  return validateFormData(data, "draft");
};

// Validate for final submission
export const validateForSubmission = async (data: DriverFormValues) => {
  return validateFormData(data, "submission");
};
```

### Hook Integration

The form hooks use different validation strategies:

```typescript
// useDriverApplicationForm.ts
const validateForDraft = useCallback(async () => {
  const result = await validateForDraftSaving(values);
  // Only show critical errors, log warnings
});

const validateForFinalSubmission = useCallback(async () => {
  const result = await validateForSubmission(values);
  // Show all errors and prevent submission
});
```

## Error Handling Strategy

### Draft Validation Errors

**Critical Errors** (prevent saving):

- Invalid email format
- Invalid SSN format
- Invalid ZIP code format

**Warnings** (logged but don't prevent saving):

- Missing required fields
- Invalid date ranges
- Missing signatures

### Step Validation Errors

**All Errors** (prevent progression):

- Missing required fields for current step
- Invalid format for current step fields
- Business rule violations for current step

### Submission Validation Errors

**All Errors** (prevent submission):

- Any missing required field
- Any format validation failure
- Any business rule violation

## User Experience

### Draft Saving

1. **Auto-save**: Happens automatically every 2 seconds when step changes
2. **Manual save**: User can click "Save Draft" button
3. **Error feedback**: Only critical errors prevent saving
4. **Success feedback**: Toast notification confirms draft saved

### Step Progression

1. **Validation**: Current step validated before proceeding
2. **Error display**: Field-level error messages shown
3. **Progression blocked**: Cannot proceed until current step is valid

### Final Submission

1. **Pre-validation**: Entire form validated before submission
2. **Error summary**: All validation errors displayed
3. **Submission blocked**: Cannot submit until all errors resolved

## Server-Side Validation

The server also uses different schemas:

```typescript
// Strict validation for final submission
export const insertDriverApplicationSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  // ... all fields required
});

// Relaxed validation for draft saving
export const saveDraftSchema = z.object({
  first_name: z.string().optional(),
  // ... all fields optional
});
```

## Benefits

1. **User-Friendly**: Users can save progress without completing everything
2. **Data Integrity**: Final submissions are thoroughly validated
3. **Flexibility**: Different validation rules for different contexts
4. **Error Prevention**: Clear feedback at each validation level
5. **Maintainability**: Centralized validation logic with clear separation

## Best Practices

1. **Always validate on both client and server**
2. **Use appropriate validation mode for each context**
3. **Provide clear error messages**
4. **Log warnings for debugging**
5. **Test all validation scenarios**
6. **Keep validation rules in sync between client and server**

## Testing

Test scenarios should include:

1. **Draft saving with minimal data**
2. **Draft saving with invalid formats**
3. **Step progression with missing fields**
4. **Step progression with invalid data**
5. **Final submission with complete valid data**
6. **Final submission with missing required fields**
7. **Final submission with invalid formats**





