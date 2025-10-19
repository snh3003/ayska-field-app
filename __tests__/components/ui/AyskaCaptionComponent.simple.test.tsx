import { render } from '@testing-library/react-native';
import { AyskaCaptionComponent } from '../../../src/components/ui/AyskaCaptionComponent';

describe('AyskaCaptionComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaCaptionComponent>Test caption</AyskaCaptionComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: defaultJSON } = render(
      <AyskaCaptionComponent variant="default">
        Default caption
      </AyskaCaptionComponent>
    );
    expect(defaultJSON()).toBeTruthy();

    const { toJSON: timestampJSON } = render(
      <AyskaCaptionComponent variant="timestamp">
        Timestamp caption
      </AyskaCaptionComponent>
    );
    expect(timestampJSON()).toBeTruthy();

    const { toJSON: helperJSON } = render(
      <AyskaCaptionComponent variant="helper">
        Helper caption
      </AyskaCaptionComponent>
    );
    expect(helperJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: textSecondaryJSON } = render(
      <AyskaCaptionComponent color="textSecondary">
        Text secondary caption
      </AyskaCaptionComponent>
    );
    expect(textSecondaryJSON()).toBeTruthy();

    const { toJSON: primaryJSON } = render(
      <AyskaCaptionComponent color="primary">
        Primary color caption
      </AyskaCaptionComponent>
    );
    expect(primaryJSON()).toBeTruthy();

    const { toJSON: successJSON } = render(
      <AyskaCaptionComponent color="success">
        Success color caption
      </AyskaCaptionComponent>
    );
    expect(successJSON()).toBeTruthy();

    const { toJSON: warningJSON } = render(
      <AyskaCaptionComponent color="warning">
        Warning color caption
      </AyskaCaptionComponent>
    );
    expect(warningJSON()).toBeTruthy();

    const { toJSON: errorJSON } = render(
      <AyskaCaptionComponent color="error">
        Error color caption
      </AyskaCaptionComponent>
    );
    expect(errorJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaCaptionComponent accessibilityLabel="Test caption accessibility">
        Accessible caption
      </AyskaCaptionComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles edge cases', () => {
    const { toJSON: emptyJSON } = render(
      <AyskaCaptionComponent>{''}</AyskaCaptionComponent>
    );
    expect(emptyJSON()).toBeTruthy();

    const { toJSON: nullJSON } = render(
      <AyskaCaptionComponent>{null}</AyskaCaptionComponent>
    );
    expect(nullJSON()).toBeTruthy();
  });
});
