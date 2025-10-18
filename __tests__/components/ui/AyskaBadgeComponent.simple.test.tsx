import { render } from '@testing-library/react-native';
import { AyskaBadgeComponent } from '../../../src/components/ui/AyskaBadgeComponent';

describe('AyskaBadgeComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaBadgeComponent>Test badge</AyskaBadgeComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: solidJSON } = render(
      <AyskaBadgeComponent variant="solid">Solid badge</AyskaBadgeComponent>
    );
    expect(solidJSON()).toBeTruthy();

    const { toJSON: outlineJSON } = render(
      <AyskaBadgeComponent variant="outlined">
        Outlined badge
      </AyskaBadgeComponent>
    );
    expect(outlineJSON()).toBeTruthy();

    const { toJSON: subtleJSON } = render(
      <AyskaBadgeComponent variant="subtle">Subtle badge</AyskaBadgeComponent>
    );
    expect(subtleJSON()).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { toJSON: smJSON } = render(
      <AyskaBadgeComponent size="sm">Small badge</AyskaBadgeComponent>
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: mdJSON } = render(
      <AyskaBadgeComponent size="md">Medium badge</AyskaBadgeComponent>
    );
    expect(mdJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaBadgeComponent size="lg">Large badge</AyskaBadgeComponent>
    );
    expect(lgJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: primaryJSON } = render(
      <AyskaBadgeComponent color="primary">Primary badge</AyskaBadgeComponent>
    );
    expect(primaryJSON()).toBeTruthy();

    const { toJSON: secondaryJSON } = render(
      <AyskaBadgeComponent color="secondary">
        Secondary badge
      </AyskaBadgeComponent>
    );
    expect(secondaryJSON()).toBeTruthy();

    const { toJSON: successJSON } = render(
      <AyskaBadgeComponent color="success">Success badge</AyskaBadgeComponent>
    );
    expect(successJSON()).toBeTruthy();

    const { toJSON: warningJSON } = render(
      <AyskaBadgeComponent color="warning">Warning badge</AyskaBadgeComponent>
    );
    expect(warningJSON()).toBeTruthy();

    const { toJSON: errorJSON } = render(
      <AyskaBadgeComponent color="error">Error badge</AyskaBadgeComponent>
    );
    expect(errorJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaBadgeComponent accessibilityLabel="Test badge accessibility">
        Accessible badge
      </AyskaBadgeComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles edge cases', () => {
    const { toJSON: emptyJSON } = render(
      <AyskaBadgeComponent>{''}</AyskaBadgeComponent>
    );
    expect(emptyJSON()).toBeTruthy();

    const { toJSON: nullJSON } = render(
      <AyskaBadgeComponent>{null}</AyskaBadgeComponent>
    );
    expect(nullJSON()).toBeTruthy();
  });
});
