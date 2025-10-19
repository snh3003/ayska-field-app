import { render } from '@testing-library/react-native';
import { AyskaStackComponent } from '../../../src/components/ui/AyskaStackComponent';

describe('AyskaStackComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaStackComponent>
        <div>Test content</div>
      </AyskaStackComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different directions', () => {
    const { toJSON: verticalJSON } = render(
      <AyskaStackComponent direction="vertical">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(verticalJSON()).toBeTruthy();

    const { toJSON: horizontalJSON } = render(
      <AyskaStackComponent direction="horizontal">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(horizontalJSON()).toBeTruthy();
  });

  it('renders with different spacing', () => {
    const { toJSON: smJSON } = render(
      <AyskaStackComponent spacing="sm">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaStackComponent spacing="lg">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(lgJSON()).toBeTruthy();
  });

  it('renders with different alignments', () => {
    const { toJSON: centerJSON } = render(
      <AyskaStackComponent align="center">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(centerJSON()).toBeTruthy();

    const { toJSON: endJSON } = render(
      <AyskaStackComponent align="end">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(endJSON()).toBeTruthy();
  });

  it('renders with different justify options', () => {
    const { toJSON: spaceBetweenJSON } = render(
      <AyskaStackComponent justify="space-between">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(spaceBetweenJSON()).toBeTruthy();

    const { toJSON: centerJSON } = render(
      <AyskaStackComponent justify="center">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(centerJSON()).toBeTruthy();
  });

  it('renders with padding and margin', () => {
    const { toJSON } = render(
      <AyskaStackComponent padding="md" margin="lg">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with background color and border radius', () => {
    const { toJSON } = render(
      <AyskaStackComponent backgroundColor="card" borderRadius="md">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with wrap enabled', () => {
    const { toJSON } = render(
      <AyskaStackComponent wrap>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </AyskaStackComponent>
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaStackComponent accessibilityLabel="Test stack accessibility">
        <div>Item 1</div>
        <div>Item 2</div>
      </AyskaStackComponent>
    );
    expect(toJSON()).toBeTruthy();
  });
});
