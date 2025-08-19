# ISTQB Test Design Techniques Guide

## Overview

This guide provides detailed information on how to apply ISTQB (International Software Testing Qualifications Board) test design techniques within the context of the Demo-ContactApp testing framework.

## Test Design Techniques

### 1. Equivalence Partitioning (EP)

#### Definition
Equivalence Partitioning divides the input domain into equivalence classes where all values in a class are expected to be treated the same way by the system.

#### Application in Contact Management
**Contact Name Field:**
- **Valid Equivalence Classes:**
  - Alphabetic characters (a-z, A-Z): "John Doe"
  - Names with spaces: "Mary Jane"
  - Names with hyphens: "Anne-Marie"
  - Names with apostrophes: "O'Connor"
  - International characters: "José", "München"

- **Invalid Equivalence Classes:**
  - Empty string: ""
  - Only numbers: "12345"
  - Special characters only: "@#$%"
  - Extremely long names: > 100 characters

**Email Field:**
- **Valid Equivalence Classes:**
  - Standard format: "user@domain.com"
  - Multiple domains: "user@sub.domain.com"
  - Plus addressing: "user+tag@domain.com"
  - Numbers in local part: "user123@domain.com"

- **Invalid Equivalence Classes:**
  - Missing @ symbol: "userdomain.com"
  - Multiple @ symbols: "user@@domain.com"
  - Invalid domain: "user@"
  - Invalid characters: "user@domain..com"

#### Test Case Design Strategy
```javascript
// Example test case structure
describe('Contact Name Validation - Equivalence Partitioning', () => {
  test('Valid Names - Alphabetic Characters', () => {
    // Test with names containing only letters
    expect(validateContactName('John')).toBe(true);
    expect(validateContactName('María')).toBe(true);
  });
  
  test('Invalid Names - Numbers Only', () => {
    // Test with numeric-only input
    expect(validateContactName('12345')).toBe(false);
  });
});
```

### 2. Boundary Value Analysis (BVA)

#### Definition
Boundary Value Analysis focuses on testing at the boundaries of equivalence classes, as errors often occur at these boundary conditions.

#### Application in Contact Management
**Contact Name Length Boundaries:**
- **Lower Boundary**: 1 character (minimum valid)
  - Test values: 0 chars (invalid), 1 char (valid), 2 chars (valid)
- **Upper Boundary**: 100 characters (maximum valid)
  - Test values: 99 chars (valid), 100 chars (valid), 101 chars (invalid)

**Phone Number Length Boundaries:**
- **Lower Boundary**: 10 digits (minimum valid)
  - Test values: 9 digits (invalid), 10 digits (valid), 11 digits (valid)
- **Upper Boundary**: 15 digits (maximum valid per E.164)
  - Test values: 14 digits (valid), 15 digits (valid), 16 digits (invalid)

#### Test Case Design Strategy
```javascript
describe('Contact Field Boundaries - BVA', () => {
  test('Name Length Boundaries', () => {
    expect(validateContactName('')).toBe(false);           // 0 chars - below minimum
    expect(validateContactName('A')).toBe(true);           // 1 char - minimum valid
    expect(validateContactName('A'.repeat(100))).toBe(true); // 100 chars - maximum valid
    expect(validateContactName('A'.repeat(101))).toBe(false); // 101 chars - above maximum
  });
});
```

### 3. Decision Table Testing

#### Definition
Decision Table Testing uses tables to represent complex business rules with multiple conditions and their corresponding actions.

#### Application in Contact Management
**Contact Validation Rules Decision Table:**

| Condition | Rule 1 | Rule 2 | Rule 3 | Rule 4 | Rule 5 | Rule 6 | Rule 7 | Rule 8 |
|-----------|--------|--------|--------|--------|--------|--------|--------|--------|
| Name Valid | T | T | T | T | F | F | F | F |
| Email Valid | T | T | F | F | T | T | F | F |
| Phone Valid | T | F | T | F | T | F | T | F |
| **Action** |
| Save Contact | X | - | - | - | - | - | - | - |
| Show Error | - | X | X | X | X | X | X | X |
| Error Type | - | Phone | Email | Both | Name | Name+Phone | Name+Email | All |

#### Test Case Design Strategy
```javascript
describe('Contact Validation - Decision Table', () => {
  test('Rule 1: All fields valid - Save contact', () => {
    const contact = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    };
    expect(validateContact(contact)).toEqual({
      valid: true,
      action: 'save',
      errors: []
    });
  });
  
  test('Rule 2: Invalid phone - Show phone error', () => {
    const contact = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: 'invalid'
    };
    expect(validateContact(contact)).toEqual({
      valid: false,
      action: 'show_error',
      errors: ['phone']
    });
  });
});
```

### 4. State Transition Testing

#### Definition
State Transition Testing models the system as a finite state machine and tests the transitions between different states.

#### Application in Contact Management
**Contact Record State Machine:**

```
States:
- New (initial state)
- Draft (data entered but not saved)
- Saved (persisted to database)
- Editing (modification in progress)
- Deleted (marked for deletion)

Transitions:
New → Draft: User enters data
Draft → Saved: User saves valid contact
Draft → New: User cancels/clears form
Saved → Editing: User clicks edit
Editing → Saved: User saves changes
Editing → Saved: User cancels edit (no changes)
Saved → Deleted: User confirms deletion
```

#### Test Case Design Strategy
```javascript
describe('Contact State Transitions', () => {
  test('New to Draft transition', () => {
    const contact = new Contact();
    expect(contact.state).toBe('new');
    
    contact.enterData({ name: 'John' });
    expect(contact.state).toBe('draft');
  });
  
  test('Draft to Saved transition', () => {
    const contact = new Contact();
    contact.enterData({ name: 'John', email: 'john@example.com' });
    
    contact.save();
    expect(contact.state).toBe('saved');
  });
  
  test('Invalid state transition prevention', () => {
    const contact = new Contact();
    expect(contact.state).toBe('new');
    
    // Should not allow direct transition from new to deleted
    expect(() => contact.delete()).toThrow('Invalid state transition');
  });
});
```

### 5. Experience-Based Testing

#### Definition
Experience-Based Testing relies on the tester's knowledge, skills, and intuition to design and execute tests based on experience with similar applications.

#### Application in Contact Management
**Common Error-Prone Areas:**
- **Unicode Handling**: Names with special characters, emojis
- **Edge Cases**: Very long inputs, unusual email formats
- **User Behavior**: Copy-paste operations, browser back/forward
- **Integration Points**: Database connectivity, API timeouts

**Exploratory Testing Focus Areas:**
- **Data Entry Patterns**: How users actually enter contact information
- **Error Recovery**: What happens when operations fail
- **Performance**: System behavior with large contact lists
- **Usability**: Real-world user workflow effectiveness

#### Test Case Design Strategy
```javascript
describe('Experience-Based Testing - Contact Management', () => {
  test('Unicode name handling', () => {
    const unicodeNames = [
      '👨‍💼 John Smith', // Emoji in name
      'José María García-López', // Spanish characters
      '李小明', // Chinese characters
      'محمد الأحمد' // Arabic characters
    ];
    
    unicodeNames.forEach(name => {
      expect(validateContactName(name)).toBe(true);
    });
  });
  
  test('Copy-paste behavior', () => {
    // Test pasting email with extra whitespace
    const emailWithSpaces = '  john@example.com  ';
    expect(normalizeEmail(emailWithSpaces)).toBe('john@example.com');
  });
  
  test('Performance with large datasets', async () => {
    const contacts = generateLargeContactList(10000);
    const startTime = Date.now();
    
    const results = await searchContacts('John', contacts);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(1000); // Should complete in < 1 second
  });
});
```

## Test Design Technique Selection Matrix

| Scenario | EP | BVA | DT | ST | EB | Primary Technique | Rationale |
|----------|----|----|----|----|----|--------------------|-----------|
| Input Validation | ✓ | ✓ | - | - | ✓ | EP + BVA | Clear input domains and boundaries |
| Business Rules | ✓ | - | ✓ | - | - | Decision Table | Complex rule combinations |
| Workflow Testing | - | - | - | ✓ | ✓ | State Transition | Clear state-based behavior |
| Error Handling | ✓ | ✓ | ✓ | - | ✓ | Experience-Based | Based on common error patterns |
| Performance | - | ✓ | - | - | ✓ | Experience-Based | Load and stress testing |
| Usability | - | - | - | - | ✓ | Experience-Based | User behavior focus |

## Implementation Guidelines

### 1. Technique Combination
- **Use Multiple Techniques**: Combine techniques for comprehensive coverage
- **Primary-Secondary Approach**: Choose primary technique, supplement with others
- **Risk-Based Selection**: Use higher rigor for high-risk areas

### 2. Test Case Documentation
```markdown
## Test Case Template
**ID**: TC_[Technique]_[Component]_[Number]
**Technique**: [Primary ISTQB technique used]
**Objective**: [What is being tested]
**Preconditions**: [System state before test]
**Test Data**: [Input values and test data]
**Steps**: [Execution steps]
**Expected Result**: [Expected outcome]
**Actual Result**: [To be filled during execution]
**Status**: [Pass/Fail/Blocked]
```

### 3. Coverage Measurement
- **Equivalence Class Coverage**: Percentage of classes tested
- **Boundary Coverage**: Percentage of boundaries tested
- **Decision Coverage**: Percentage of decision combinations tested
- **State Coverage**: Percentage of states and transitions tested
- **Experience Coverage**: Subjective assessment of real-world scenarios

## Quality Metrics for Test Design

### Effectiveness Metrics
- **Defect Detection Rate**: Defects found per technique
- **Test Efficiency**: Defects found per test case
- **Coverage Achievement**: Requirements coverage per technique

### Process Metrics
- **Design Time**: Time to create test cases per technique
- **Maintenance Effort**: Time to update tests when requirements change
- **Execution Time**: Time to run tests per technique

This guide ensures systematic application of ISTQB test design techniques for comprehensive and effective testing of the Contact Management application.