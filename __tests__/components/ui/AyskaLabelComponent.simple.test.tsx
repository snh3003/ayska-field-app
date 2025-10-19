import { render } from '@testing-library/react-native';
import { AyskaLabelComponent } from '../../../src/components/ui/AyskaLabelComponent';

describe('AyskaLabelComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaLabelComponent>Test label</AyskaLabelComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: defaultJSON } = render(
      <AyskaLabelComponent variant="default">Default label</AyskaLabelComponent>
    );
    expect(defaultJSON()).toBeTruthy();

    const { toJSON: uppercaseJSON } = render(
      <AyskaLabelComponent variant="uppercase">
        Uppercase label
      </AyskaLabelComponent>
    );
    expect(uppercaseJSON()).toBeTruthy();

    const { toJSON: smallJSON } = render(
      <AyskaLabelComponent variant="small">Small label</AyskaLabelComponent>
    );
    expect(smallJSON()).toBeTruthy();
  });

  it('renders with required prop', () => {
    const { toJSON: requiredJSON } = render(
      <AyskaLabelComponent required>Required label</AyskaLabelComponent>
    );
    expect(requiredJSON()).toBeTruthy();

    const { toJSON: notRequiredJSON } = render(
      <AyskaLabelComponent required={false}>
        Not required label
      </AyskaLabelComponent>
    );
    expect(notRequiredJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: textJSON } = render(
      <AyskaLabelComponent color="text">Text color label</AyskaLabelComponent>
    );
    expect(textJSON()).toBeTruthy();

    const { toJSON: primaryJSON } = render(
      <AyskaLabelComponent color="primary">
        Primary color label
      </AyskaLabelComponent>
    );
    expect(primaryJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaLabelComponent accessibilityLabel="Test label accessibility">
        Accessible label
      </AyskaLabelComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles edge cases', () => {
    const { toJSON: emptyJSON } = render(
      <AyskaLabelComponent>{''}</AyskaLabelComponent>
    );
    expect(emptyJSON()).toBeTruthy();

    const { toJSON: nullJSON } = render(
      <AyskaLabelComponent>{null}</AyskaLabelComponent>
    );
    expect(nullJSON()).toBeTruthy();
  });
});
