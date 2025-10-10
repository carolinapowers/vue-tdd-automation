# Testing Approach Comparison

This document shows the differences between Vue Test Utils and Testing Library approaches.

## Example: Testing a Button Component

### Vue Test Utils Approach
```typescript
import { mount } from '@vue/test-utils'

it('emits click event when clicked', async () => {
  const wrapper = mount(Button, {
    props: { label: 'Click me' }
  })
  
  // Find by data-test attribute
  const button = wrapper.find('[data-test="button"]')
  
  // Trigger click
  await button.trigger('click')
  
  // Check emission
  expect(wrapper.emitted('click')).toBeTruthy()
})
```

### Testing Library Approach
```typescript
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

it('emits click event when clicked', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  
  render(Button, {
    props: { 
      label: 'Click me',
      onClick: handleClick
    }
  })
  
  // Find by accessible role and name
  const button = screen.getByRole('button', { name: /click me/i })
  
  // Simulate real user interaction
  await user.click(button)
  
  // Check handler was called
  expect(handleClick).toHaveBeenCalled()
})
```

## Key Differences

### 1. Element Selection

| Vue Test Utils | Testing Library |
|---|---|
| `wrapper.find('[data-test="input"]')` | `screen.getByRole('textbox')` |
| `wrapper.find('.error-message')` | `screen.getByText(/error/i)` |
| `wrapper.findAll('li')` | `screen.getAllByRole('listitem')` |
| `wrapper.get('#submit')` | `screen.getByRole('button', { name: /submit/i })` |

### 2. User Interactions

| Vue Test Utils | Testing Library |
|---|---|
| `await input.setValue('text')` | `await user.type(input, 'text')` |
| `await button.trigger('click')` | `await user.click(button)` |
| `await checkbox.setChecked()` | `await user.click(checkbox)` |
| `await select.setValue('option')` | `await user.selectOptions(select, 'option')` |

### 3. Assertions

| Vue Test Utils | Testing Library |
|---|---|
| `expect(wrapper.text()).toContain('Hello')` | `expect(screen.getByText('Hello')).toBeInTheDocument()` |
| `expect(input.element.value).toBe('test')` | `expect(input).toHaveValue('test')` |
| `expect(button.attributes('disabled')).toBeDefined()` | `expect(button).toBeDisabled()` |
| `expect(wrapper.classes()).toContain('active')` | `expect(element).toHaveClass('active')` |

### 4. Accessibility Testing

Testing Library has built-in accessibility focus:

```typescript
// Testing Library encourages accessible queries
const submitButton = screen.getByRole('button', { name: /submit form/i })
const emailInput = screen.getByLabelText(/email address/i)
const navigation = screen.getByRole('navigation')

// Custom accessibility assertions
expect(submitButton).toHaveAccessibleName('Submit Form')
expect(emailInput).toBeRequired()
expect(navigation).toHaveAttribute('aria-label', 'Main navigation')
```

## When to Use Each

### Use Vue Test Utils When:
- Testing Vue-specific implementation details
- Working with complex component internals
- Testing computed properties or watchers directly
- Dealing with Suspense or async components
- Need fine-grained control over component lifecycle

### Use Testing Library When:
- Testing from the user's perspective
- Ensuring accessibility compliance
- Testing user workflows and interactions
- Want to avoid implementation details
- Building confidence that the app works for users

## Hybrid Approach

You can use both in the same test suite:

```typescript
import { mount } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

describe('SearchForm', () => {
  // Use Testing Library for user interaction tests
  it('allows user to search', async () => {
    const user = userEvent.setup()
    render(SearchForm)
    
    const searchInput = screen.getByRole('searchbox')
    await user.type(searchInput, 'Vue.js')
    
    const submitButton = screen.getByRole('button', { name: /search/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/searching for: Vue.js/i)).toBeInTheDocument()
  })
  
  // Use Vue Test Utils for component internals
  it('validates search query length', async () => {
    const wrapper = mount(SearchForm)
    
    // Access component internals directly
    await wrapper.setData({ query: 'ab' })
    
    // Check computed property
    expect(wrapper.vm.isValid).toBe(false)
    expect(wrapper.vm.errorMessage).toBe('Query must be at least 3 characters')
  })
})
```

## Best Practices

1. **Start with Testing Library** - Try to test from the user's perspective first
2. **Use semantic queries** - Prefer getByRole, getByLabelText over test IDs
3. **Fall back to Vue Test Utils** - When you need component internals
4. **Keep accessibility in mind** - If Testing Library can't find it, can screen readers?
5. **Don't test implementation** - Focus on behavior, not how it works

## Migration Path

If migrating from Vue Test Utils to Testing Library:

```typescript
// Before (Vue Test Utils)
const wrapper = mount(Component)
const input = wrapper.find('[data-test="email-input"]')
await input.setValue('test@example.com')
const button = wrapper.find('[data-test="submit-button"]')
await button.trigger('click')
expect(wrapper.emitted('submit')).toBeTruthy()

// After (Testing Library)
const { user } = render(Component)
const input = screen.getByLabelText(/email/i)
await user.type(input, 'test@example.com')
const button = screen.getByRole('button', { name: /submit/i })
await user.click(button)
// Component would be tested through its effect, not events
expect(screen.getByText(/form submitted/i)).toBeInTheDocument()
```

## Conclusion

Both libraries have their place in a comprehensive test suite. Testing Library helps ensure your app is accessible and works for users, while Vue Test Utils provides the tools for detailed component testing when needed.
