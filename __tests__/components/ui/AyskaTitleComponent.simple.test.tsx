import { render } from '@testing-library/react-native';
import { AyskaTitleComponent } from '../../../src/components/ui/AyskaTitleComponent';

describe('AyskaTitleComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaTitleComponent>Test title</AyskaTitleComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different levels', () => {
    const { toJSON: level1JSON } = render(
      <AyskaTitleComponent level={1}>Level 1 title</AyskaTitleComponent>
    );
    expect(level1JSON()).toBeTruthy();

    const { toJSON: level2JSON } = render(
      <AyskaTitleComponent level={2}>Level 2 title</AyskaTitleComponent>
    );
    expect(level2JSON()).toBeTruthy();

    const { toJSON: level3JSON } = render(
      <AyskaTitleComponent level={3}>Level 3 title</AyskaTitleComponent>
    );
    expect(level3JSON()).toBeTruthy();

    const { toJSON: level4JSON } = render(
      <AyskaTitleComponent level={4}>Level 4 title</AyskaTitleComponent>
    );
    expect(level4JSON()).toBeTruthy();
  });

  it('renders with different weights', () => {
    const { toJSON: semiboldJSON } = render(
      <AyskaTitleComponent weight="semibold">
        Semibold title
      </AyskaTitleComponent>
    );
    expect(semiboldJSON()).toBeTruthy();

    const { toJSON: boldJSON } = render(
      <AyskaTitleComponent weight="bold">Bold title</AyskaTitleComponent>
    );
    expect(boldJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: textJSON } = render(
      <AyskaTitleComponent color="text">Text color title</AyskaTitleComponent>
    );
    expect(textJSON()).toBeTruthy();

    const { toJSON: primaryJSON } = render(
      <AyskaTitleComponent color="primary">
        Primary color title
      </AyskaTitleComponent>
    );
    expect(primaryJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaTitleComponent accessibilityLabel="Test title accessibility">
        Accessible title
      </AyskaTitleComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with icons', () => {
    const leadingIcon = <span data-testid="leading-icon">📝</span>;
    const { toJSON } = render(
      <AyskaTitleComponent leadingIcon={leadingIcon}>
        Title with icon
      </AyskaTitleComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles edge cases', () => {
    const { toJSON: emptyJSON } = render(
      <AyskaTitleComponent>{''}</AyskaTitleComponent>
    );
    expect(emptyJSON()).toBeTruthy();

    const { toJSON: nullJSON } = render(
      <AyskaTitleComponent>{null}</AyskaTitleComponent>
    );
    expect(nullJSON()).toBeTruthy();
  });
});
