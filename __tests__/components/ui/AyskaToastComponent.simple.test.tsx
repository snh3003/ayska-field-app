import { render } from '@testing-library/react-native';
import { AyskaToastComponent } from '../../../src/components/ui/AyskaToastComponent';

describe('AyskaToastComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaToastComponent message="Test toast" visible />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different types', () => {
    const { toJSON: successJSON } = render(
      <AyskaToastComponent message="Success toast" type="success" visible />
    );
    expect(successJSON()).toBeTruthy();

    const { toJSON: warningJSON } = render(
      <AyskaToastComponent message="Warning toast" type="warning" visible />
    );
    expect(warningJSON()).toBeTruthy();

    const { toJSON: errorJSON } = render(
      <AyskaToastComponent message="Error toast" type="error" visible />
    );
    expect(errorJSON()).toBeTruthy();

    const { toJSON: infoJSON } = render(
      <AyskaToastComponent message="Info toast" type="info" visible />
    );
    expect(infoJSON()).toBeTruthy();
  });

  it('renders with different positions', () => {
    const { toJSON: topJSON } = render(
      <AyskaToastComponent message="Top toast" position="top" visible />
    );
    expect(topJSON()).toBeTruthy();

    const { toJSON: bottomJSON } = render(
      <AyskaToastComponent message="Bottom toast" position="bottom" visible />
    );
    expect(bottomJSON()).toBeTruthy();

    const { toJSON: centerJSON } = render(
      <AyskaToastComponent message="Center toast" position="center" visible />
    );
    expect(centerJSON()).toBeTruthy();
  });

  it('renders with duration', () => {
    const { toJSON } = render(
      <AyskaToastComponent message="Timed toast" duration={5000} visible />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with no auto dismiss', () => {
    const { toJSON } = render(
      <AyskaToastComponent message="Persistent toast" duration={0} visible />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with onDismiss handler', () => {
    const { toJSON } = render(
      <AyskaToastComponent
        message="Dismissible toast"
        visible
        onDismiss={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders when not visible', () => {
    const { toJSON } = render(
      <AyskaToastComponent message="Hidden toast" visible={false} />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaToastComponent
        message="Accessible toast"
        visible
        accessibilityLabel="Toast notification"
        accessibilityHint="This is a toast message"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaToastComponent
        message="Styled toast"
        visible
        style={{ marginTop: 10 }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
