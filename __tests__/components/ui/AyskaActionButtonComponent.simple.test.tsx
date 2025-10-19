import { render } from '@testing-library/react-native';
import { AyskaActionButtonComponent } from '../../../src/components/ui/AyskaActionButtonComponent';

describe('AyskaActionButtonComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaActionButtonComponent label="Test Button" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: primaryJSON } = render(
      <AyskaActionButtonComponent label="Primary" variant="primary" />
    );
    expect(primaryJSON()).toBeTruthy();

    const { toJSON: secondaryJSON } = render(
      <AyskaActionButtonComponent label="Secondary" variant="secondary" />
    );
    expect(secondaryJSON()).toBeTruthy();

    const { toJSON: successJSON } = render(
      <AyskaActionButtonComponent label="Success" variant="success" />
    );
    expect(successJSON()).toBeTruthy();

    const { toJSON: warningJSON } = render(
      <AyskaActionButtonComponent label="Warning" variant="warning" />
    );
    expect(warningJSON()).toBeTruthy();

    const { toJSON: errorJSON } = render(
      <AyskaActionButtonComponent label="Error" variant="error" />
    );
    expect(errorJSON()).toBeTruthy();

    const { toJSON: ghostJSON } = render(
      <AyskaActionButtonComponent label="Ghost" variant="ghost" />
    );
    expect(ghostJSON()).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { toJSON: smJSON } = render(
      <AyskaActionButtonComponent label="Small" size="sm" />
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: mdJSON } = render(
      <AyskaActionButtonComponent label="Medium" size="md" />
    );
    expect(mdJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaActionButtonComponent label="Large" size="lg" />
    );
    expect(lgJSON()).toBeTruthy();
  });

  it('renders with icon', () => {
    const { toJSON } = render(
      <AyskaActionButtonComponent label="With Icon" icon="person" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders in disabled state', () => {
    const { toJSON } = render(
      <AyskaActionButtonComponent label="Disabled" disabled />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders in loading state', () => {
    const { toJSON } = render(
      <AyskaActionButtonComponent label="Loading" loading />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with full width', () => {
    const { toJSON } = render(
      <AyskaActionButtonComponent label="Full Width" fullWidth />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with onPress handler', () => {
    const mockPress = jest.fn();
    const { toJSON } = render(
      <AyskaActionButtonComponent label="Pressable" onPress={mockPress} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaActionButtonComponent
        label="Accessible"
        accessibilityLabel="Test button accessibility"
        accessibilityHint="Press to test"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaActionButtonComponent label="Styled" style={{ marginTop: 10 }} />
    );
    expect(toJSON()).toBeTruthy();
  });
});
