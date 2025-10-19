import { render } from '@testing-library/react-native';
import { AyskaTextComponent } from '../../../src/components/ui/AyskaTextComponent';

// Simple test that focuses on component rendering without complex queries
describe('AyskaTextComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaTextComponent>Test text</AyskaTextComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: bodyJSON } = render(
      <AyskaTextComponent variant="body">Body text</AyskaTextComponent>
    );
    expect(bodyJSON()).toBeTruthy();

    const { toJSON: bodyLargeJSON } = render(
      <AyskaTextComponent variant="bodyLarge">
        Body large text
      </AyskaTextComponent>
    );
    expect(bodyLargeJSON()).toBeTruthy();

    const { toJSON: bodySmallJSON } = render(
      <AyskaTextComponent variant="bodySmall">
        Body small text
      </AyskaTextComponent>
    );
    expect(bodySmallJSON()).toBeTruthy();
  });

  it('renders with different weights', () => {
    const { toJSON: normalJSON } = render(
      <AyskaTextComponent weight="normal">Normal text</AyskaTextComponent>
    );
    expect(normalJSON()).toBeTruthy();

    const { toJSON: boldJSON } = render(
      <AyskaTextComponent weight="bold">Bold text</AyskaTextComponent>
    );
    expect(boldJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: textJSON } = render(
      <AyskaTextComponent color="text">Text color</AyskaTextComponent>
    );
    expect(textJSON()).toBeTruthy();

    const { toJSON: primaryJSON } = render(
      <AyskaTextComponent color="primary">Primary color</AyskaTextComponent>
    );
    expect(primaryJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaTextComponent accessibilityLabel="Test accessibility">
        Accessible text
      </AyskaTextComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with icons', () => {
    const leadingIcon = <span data-testid="leading-icon">📝</span>;
    const { toJSON } = render(
      <AyskaTextComponent leadingIcon={leadingIcon}>
        Text with icon
      </AyskaTextComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles edge cases', () => {
    const { toJSON: emptyJSON } = render(
      <AyskaTextComponent>{''}</AyskaTextComponent>
    );
    expect(emptyJSON()).toBeTruthy();

    const { toJSON: nullJSON } = render(
      <AyskaTextComponent>{null}</AyskaTextComponent>
    );
    expect(nullJSON()).toBeTruthy();
  });
});
