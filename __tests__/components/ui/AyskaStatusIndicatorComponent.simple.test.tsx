import { render } from '@testing-library/react-native';
import { AyskaStatusIndicatorComponent } from '../../../src/components/ui/AyskaStatusIndicatorComponent';

describe('AyskaStatusIndicatorComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaStatusIndicatorComponent status="info" message="Test message" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different status types', () => {
    const { toJSON: successJSON } = render(
      <AyskaStatusIndicatorComponent
        status="success"
        message="Success message"
      />
    );
    expect(successJSON()).toBeTruthy();

    const { toJSON: warningJSON } = render(
      <AyskaStatusIndicatorComponent
        status="warning"
        message="Warning message"
      />
    );
    expect(warningJSON()).toBeTruthy();

    const { toJSON: errorJSON } = render(
      <AyskaStatusIndicatorComponent status="error" message="Error message" />
    );
    expect(errorJSON()).toBeTruthy();

    const { toJSON: infoJSON } = render(
      <AyskaStatusIndicatorComponent status="info" message="Info message" />
    );
    expect(infoJSON()).toBeTruthy();
  });

  it('renders with title', () => {
    const { toJSON } = render(
      <AyskaStatusIndicatorComponent
        status="success"
        message="Success message"
        title="Success Title"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders as dismissible', () => {
    const { toJSON } = render(
      <AyskaStatusIndicatorComponent
        status="info"
        message="Dismissible message"
        dismissible
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with onDismiss handler', () => {
    const { toJSON } = render(
      <AyskaStatusIndicatorComponent
        status="info"
        message="Dismissible message"
        dismissible
        onDismiss={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaStatusIndicatorComponent
        status="info"
        message="Accessible message"
        accessibilityLabel="Status indicator"
        accessibilityHint="This is a status message"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaStatusIndicatorComponent
        status="info"
        message="Styled message"
        style={{ marginTop: 10 }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
