import { render } from '@testing-library/react-native';
import { AyskaHeadingComponent } from '../../../src/components/ui/AyskaHeadingComponent';

describe('AyskaHeadingComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaHeadingComponent>Test heading</AyskaHeadingComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: sectionJSON } = render(
      <AyskaHeadingComponent variant="section">
        Section heading
      </AyskaHeadingComponent>
    );
    expect(sectionJSON()).toBeTruthy();

    const { toJSON: cardJSON } = render(
      <AyskaHeadingComponent variant="card">Card heading</AyskaHeadingComponent>
    );
    expect(cardJSON()).toBeTruthy();

    const { toJSON: listJSON } = render(
      <AyskaHeadingComponent variant="list">List heading</AyskaHeadingComponent>
    );
    expect(listJSON()).toBeTruthy();
  });

  it('renders with different weights', () => {
    const { toJSON: semiboldJSON } = render(
      <AyskaHeadingComponent weight="semibold">
        Semibold heading
      </AyskaHeadingComponent>
    );
    expect(semiboldJSON()).toBeTruthy();

    const { toJSON: mediumJSON } = render(
      <AyskaHeadingComponent weight="medium">
        Medium heading
      </AyskaHeadingComponent>
    );
    expect(mediumJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: textJSON } = render(
      <AyskaHeadingComponent color="text">
        Text color heading
      </AyskaHeadingComponent>
    );
    expect(textJSON()).toBeTruthy();

    const { toJSON: primaryJSON } = render(
      <AyskaHeadingComponent color="primary">
        Primary color heading
      </AyskaHeadingComponent>
    );
    expect(primaryJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaHeadingComponent accessibilityLabel="Test heading accessibility">
        Accessible heading
      </AyskaHeadingComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('handles edge cases', () => {
    const { toJSON: emptyJSON } = render(
      <AyskaHeadingComponent>{''}</AyskaHeadingComponent>
    );
    expect(emptyJSON()).toBeTruthy();

    const { toJSON: nullJSON } = render(
      <AyskaHeadingComponent>{null}</AyskaHeadingComponent>
    );
    expect(nullJSON()).toBeTruthy();
  });
});
