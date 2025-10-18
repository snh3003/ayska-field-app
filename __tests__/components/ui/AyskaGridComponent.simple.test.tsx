import { render } from '@testing-library/react-native';
import { AyskaGridComponent } from '../../../src/components/ui/AyskaGridComponent';

describe('AyskaGridComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaGridComponent>
        <div>Test content</div>
      </AyskaGridComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different column counts', () => {
    const { toJSON: twoColJSON } = render(
      <AyskaGridComponent columns={2}>
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaGridComponent>
    );
    expect(twoColJSON()).toBeTruthy();

    const { toJSON: threeColJSON } = render(
      <AyskaGridComponent columns={3}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </AyskaGridComponent>
    );
    expect(threeColJSON()).toBeTruthy();
  });

  it('renders with different gaps', () => {
    const { toJSON: smJSON } = render(
      <AyskaGridComponent gap="sm">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaGridComponent>
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaGridComponent gap="lg">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaGridComponent>
    );
    expect(lgJSON()).toBeTruthy();
  });

  it('renders with auto-fit enabled', () => {
    const { toJSON } = render(
      <AyskaGridComponent autoFit>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </AyskaGridComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with auto-fill enabled', () => {
    const { toJSON } = render(
      <AyskaGridComponent autoFill>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </AyskaGridComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with padding and margin', () => {
    const { toJSON } = render(
      <AyskaGridComponent padding="md" margin="lg">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaGridComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with background color and border radius', () => {
    const { toJSON } = render(
      <AyskaGridComponent backgroundColor="card" borderRadius="md">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaGridComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaGridComponent accessibilityLabel="Test grid accessibility">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaGridComponent>
    );
    expect(toJSON()).toBeTruthy();
  });
});
