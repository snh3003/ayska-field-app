import { render } from '@testing-library/react-native';
import { AyskaFormFieldComponent } from '../../../src/components/ui/AyskaFormFieldComponent';

describe('AyskaFormFieldComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Test Field"
        value=""
        onChange={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with label', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with placeholder', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
        placeholder="Enter your email"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with value', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value="test@example.com"
        onChange={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders as required field', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
        required
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders in disabled state', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
        disabled
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with error', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
        error="Invalid email address"
        touched
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders as multiline', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Description"
        value=""
        onChange={() => {}}
        multiline
        numberOfLines={4}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders as password field', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Password"
        value=""
        onChange={() => {}}
        secureTextEntry
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with password toggle', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Password"
        value=""
        onChange={() => {}}
        showPasswordToggle
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different keyboard types', () => {
    const { toJSON: emailJSON } = render(
      <AyskaFormFieldComponent
        label="Email"
        value=""
        onChange={() => {}}
        keyboardType="email-address"
      />
    );
    expect(emailJSON()).toBeTruthy();

    const { toJSON: numericJSON } = render(
      <AyskaFormFieldComponent
        label="Phone"
        value=""
        onChange={() => {}}
        keyboardType="phone-pad"
      />
    );
    expect(numericJSON()).toBeTruthy();
  });

  it('renders with leading icon', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Search"
        value=""
        onChange={() => {}}
        leadingIcon={<div>🔍</div>}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with trailing icon', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Search"
        value=""
        onChange={() => {}}
        trailingIcon={<div>✓</div>}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
        accessibilityLabel="Email input field"
        accessibilityHint="Enter your email address"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
        style={{ marginTop: 10 }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with onBlur handler', () => {
    const { toJSON } = render(
      <AyskaFormFieldComponent
        label="Email Address"
        value=""
        onChange={() => {}}
        onBlur={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
