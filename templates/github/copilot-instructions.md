# GitHub Copilot Instructions for Vue TDD Testing

This file provides instructions to GitHub Copilot for generating high-quality Vue component tests following TDD best practices.

## Testing Framework & Tools

- **Test Runner**: Vitest
- **Component Testing**: @vue/test-utils
- **User-Centric Testing**: @testing-library/vue
- **Assertions**: Vitest expect + @testing-library/jest-dom matchers

## Core Testing Principles

### 1. Test User-Visible Behavior, Not Implementation

❌ **Avoid:**
```typescript
// Testing implementation details
expect(wrapper.vm.internalCounter).toBe(5);
expect(wrapper.find('.hidden-class').exists()).toBe(true);
```

✅ **Prefer:**
```typescript
// Testing user-visible behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument();
expect(screen.queryByRole('status')).toBeVisible();
```

### 2. Use Semantic Queries

**Query Priority (from most to least preferred):**

1. **Accessible by everyone**: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2. **Semantic**: `getByAltText`, `getByTitle`
3. **Test IDs**: `getByTestId` (last resort only)

✅ **Good Examples:**
```typescript
// Best - accessible queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email address');
screen.getByPlaceholderText('Enter your email');

// Good - semantic queries
screen.getByAltText('User profile photo');
screen.getByText('Welcome back!');

// Last resort only
screen.getByTestId('complex-component');
```

### 3. Always Include Accessibility Tests

Every component test suite must include:

```typescript
describe('Accessibility', () => {
  it('should be accessible to screen readers', () => {
    render(ComponentName);

    // Check for proper ARIA attributes
    const button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Clear form');

    // Verify semantic HTML
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('should be keyboard navigable', async () => {
    const { user } = render(ComponentName);

    // Test tab navigation
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();

    // Test Enter/Space for activation
    await user.keyboard('{Enter}');
    expect(screen.getByText('Action completed')).toBeInTheDocument();
  });
});
```

## Test Structure

### Standard Test Template

```typescript
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@/test/helpers/testing-library';
import { mount } from '@vue/test-utils';
import ComponentName from './ComponentName.vue';

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Render', () => {
    it('should display expected initial state', () => {
      render(ComponentName, {
        props: { /* realistic props */ }
      });

      expect(screen.getByRole('heading')).toHaveTextContent('Expected Title');
    });
  });

  describe('User Interactions', () => {
    it('should handle user click events', async () => {
      const { user } = render(ComponentName);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should react to prop changes', async () => {
      const { rerender } = render(ComponentName, {
        props: { count: 0 }
      });

      expect(screen.getByText('Count: 0')).toBeInTheDocument();

      await rerender({ count: 5 });

      expect(screen.getByText('Count: 5')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('should emit events with correct payload', async () => {
      const onSubmit = vi.fn();
      const { user } = render(ComponentName, {
        props: { onSubmit }
      });

      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
    });
  });

  describe('Accessibility', () => {
    // Always include accessibility tests
  });
});
```

## Best Practices

### Async Operations

Always use proper async/await patterns:

```typescript
// ✅ Good - proper async handling
it('should load and display data', async () => {
  render(UserProfile, { props: { userId: '123' } });

  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});

// ✅ Good - using user-event (already async)
it('should handle form submission', async () => {
  const { user } = render(LoginForm);

  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByText('Welcome back!')).toBeInTheDocument();
});
```

### Mocking

Keep mocks focused and clean:

```typescript
// ✅ Good - clear mock setup
describe('API Integration', () => {
  const mockApi = {
    fetchUser: vi.fn()
  };

  beforeEach(() => {
    mockApi.fetchUser.mockResolvedValue({
      id: '1',
      name: 'John Doe'
    });
  });

  it('should fetch and display user data', async () => {
    render(UserProfile, {
      global: {
        provide: {
          api: mockApi
        }
      }
    });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(mockApi.fetchUser).toHaveBeenCalledWith('1');
  });
});
```

### TypeScript Types

Always use proper TypeScript types:

```typescript
import type { VueWrapper } from '@vue/test-utils';

describe('TypedComponent', () => {
  let wrapper: VueWrapper;

  interface TestProps {
    title: string;
    count: number;
  }

  const defaultProps: TestProps = {
    title: 'Test Title',
    count: 0
  };

  it('should handle typed props', () => {
    wrapper = mount(TypedComponent, {
      props: defaultProps
    });

    expect(wrapper.text()).toContain('Test Title');
  });
});
```

## Common Patterns

### Testing Forms

```typescript
describe('Form Validation', () => {
  it('should validate email format', async () => {
    const { user } = render(ContactForm);

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'invalid-email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('should submit valid form data', async () => {
    const onSubmit = vi.fn();
    const { user } = render(ContactForm, {
      props: { onSubmit }
    });

    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });
});
```

### Testing Loading States

```typescript
describe('Loading States', () => {
  it('should show loading spinner while fetching', async () => {
    render(DataList);

    // Initially loading
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
```

### Testing Error States

```typescript
describe('Error Handling', () => {
  it('should display error message on API failure', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(UserProfile, {
      global: {
        provide: { fetchUser: mockFetch }
      }
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to load user');
    });
  });
});
```

### Testing Conditional Rendering

```typescript
describe('Conditional Display', () => {
  it('should show admin controls for admin users', () => {
    render(UserDashboard, {
      props: {
        user: { id: '1', role: 'admin' }
      }
    });

    expect(screen.getByRole('button', { name: /delete user/i })).toBeInTheDocument();
  });

  it('should hide admin controls for regular users', () => {
    render(UserDashboard, {
      props: {
        user: { id: '1', role: 'user' }
      }
    });

    expect(screen.queryByRole('button', { name: /delete user/i })).not.toBeInTheDocument();
  });
});
```

## Test Organization

### Group Related Tests

```typescript
describe('UserProfile Component', () => {
  describe('Display', () => {
    // Tests for rendering and display
  });

  describe('Interactions', () => {
    // Tests for user interactions
  });

  describe('Data Loading', () => {
    // Tests for async data
  });

  describe('Error Handling', () => {
    // Tests for error states
  });

  describe('Accessibility', () => {
    // Tests for a11y
  });
});
```

## What NOT to Test

❌ Avoid testing:
- Vue framework internals
- Third-party library behavior
- CSS styling (unless it affects accessibility)
- Private component methods
- Implementation details that users can't see

✅ Focus on testing:
- User-visible behavior
- Component output for given inputs
- User interaction responses
- Accessibility features
- Error handling
- Edge cases users might encounter

## TDD Workflow

When implementing a new component:

1. **RED**: Write a failing test describing expected behavior
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Improve code while keeping tests green

```typescript
// 1. RED - Write failing test
it('should display user greeting', () => {
  render(Greeting, { props: { name: 'John' } });
  expect(screen.getByText('Hello, John!')).toBeInTheDocument();
});

// 2. GREEN - Implement minimal solution
// <template><div>Hello, {{ name }}!</div></template>

// 3. REFACTOR - Improve while tests pass
// Add better formatting, accessibility, etc.
```

## Quick Reference

### Common Matchers

```typescript
// DOM presence
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');

// Accessibility
expect(element).toHaveAccessibleName('name');
expect(element).toHaveAccessibleDescription('desc');

// Form elements
expect(input).toHaveValue('value');
expect(checkbox).toBeChecked();
expect(input).toBeDisabled();

// User state
expect(element).toHaveFocus();
expect(element).toHaveClass('active');
```

### Common Queries

```typescript
// By role (best)
screen.getByRole('button', { name: /submit/i });
screen.getByRole('heading', { level: 1 });
screen.getByRole('textbox', { name: /email/i });

// By label
screen.getByLabelText('Email address');

// By text
screen.getByText('Welcome!');
screen.getByText(/welcome/i); // Case-insensitive

// Query vs Get vs Find
screen.getBy...()    // Throws if not found (use for assertions)
screen.queryBy...()  // Returns null if not found (use for absence)
screen.findBy...()   // Returns Promise (use for async)
```

## Remember

- **Test behavior, not implementation**
- **Prefer accessible queries**
- **Always include accessibility tests**
- **Use async/await properly**
- **Keep tests focused and readable**
- **Follow TDD: Red → Green → Refactor**

---

For more information, see:
- [Testing Library Documentation](https://testing-library.com/docs/vue-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- Project Architecture: `ARCHITECTURE.md`
