import { render } from '@testing-library/react-native';
import { AyskaContainerComponent } from '../../../src/components/ui/AyskaContainerComponent';

describe('AyskaContainerComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaContainerComponent>
        <div>Test content</div>
      </AyskaContainerComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different max widths', () => {
    const { toJSON: smJSON } = render(
      <AyskaContainerComponent maxWidth="sm">
        <div>Small container</div>
      </AyskaContainerComponent>
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaContainerComponent maxWidth="lg">
        <div>Large container</div>
      </AyskaContainerComponent>
    );
    expect(lgJSON()).toBeTruthy();

    const { toJSON: fullJSON } = render(
      <AyskaContainerComponent maxWidth="full">
        <div>Full width container</div>
      </AyskaContainerComponent>
    );
    expect(fullJSON()).toBeTruthy();
  });

  it('renders with different padding', () => {
    const { toJSON: smJSON } = render(
      <AyskaContainerComponent padding="sm">
        <div>Small padding</div>
      </AyskaContainerComponent>
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaContainerComponent padding="lg">
        <div>Large padding</div>
      </AyskaContainerComponent>
    );
    expect(lgJSON()).toBeTruthy();
  });

  it('renders with different margins', () => {
    const { toJSON: smJSON } = render(
      <AyskaContainerComponent margin="sm">
        <div>Small margin</div>
      </AyskaContainerComponent>
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaContainerComponent margin="lg">
        <div>Large margin</div>
      </AyskaContainerComponent>
    );
    expect(lgJSON()).toBeTruthy();
  });

  it('renders with center alignment', () => {
    const { toJSON: centerJSON } = render(
      <AyskaContainerComponent center>
        <div>Centered container</div>
      </AyskaContainerComponent>
    );
    expect(centerJSON()).toBeTruthy();

    const { toJSON: noCenterJSON } = render(
      <AyskaContainerComponent center={false}>
        <div>Non-centered container</div>
      </AyskaContainerComponent>
    );
    expect(noCenterJSON()).toBeTruthy();
  });

  it('renders with background color and border radius', () => {
    const { toJSON } = render(
      <AyskaContainerComponent backgroundColor="card" borderRadius="md">
        <div>Styled container</div>
      </AyskaContainerComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaContainerComponent accessibilityLabel="Test container accessibility">
        <div>Accessible container</div>
      </AyskaContainerComponent>
    );
    expect(toJSON()).toBeTruthy();
  });
});
