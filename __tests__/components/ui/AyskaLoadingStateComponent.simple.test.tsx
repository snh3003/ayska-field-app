import { render } from '@testing-library/react-native';
import { AyskaLoadingStateComponent } from '../../../src/components/ui/AyskaLoadingStateComponent';

describe('AyskaLoadingStateComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AyskaLoadingStateComponent />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with message', () => {
    const { toJSON } = render(
      <AyskaLoadingStateComponent message="Loading data..." />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: inlineJSON } = render(
      <AyskaLoadingStateComponent variant="inline" />
    );
    expect(inlineJSON()).toBeTruthy();

    const { toJSON: centeredJSON } = render(
      <AyskaLoadingStateComponent variant="centered" />
    );
    expect(centeredJSON()).toBeTruthy();

    const { toJSON: fullscreenJSON } = render(
      <AyskaLoadingStateComponent variant="fullscreen" />
    );
    expect(fullscreenJSON()).toBeTruthy();

    const { toJSON: overlayJSON } = render(
      <AyskaLoadingStateComponent variant="overlay" />
    );
    expect(overlayJSON()).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { toJSON: smallJSON } = render(
      <AyskaLoadingStateComponent size="small" />
    );
    expect(smallJSON()).toBeTruthy();

    const { toJSON: mediumJSON } = render(
      <AyskaLoadingStateComponent size="medium" />
    );
    expect(mediumJSON()).toBeTruthy();

    const { toJSON: largeJSON } = render(
      <AyskaLoadingStateComponent size="large" />
    );
    expect(largeJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: primaryJSON } = render(
      <AyskaLoadingStateComponent color="primary" />
    );
    expect(primaryJSON()).toBeTruthy();

    const { toJSON: secondaryJSON } = render(
      <AyskaLoadingStateComponent color="secondary" />
    );
    expect(secondaryJSON()).toBeTruthy();

    const { toJSON: successJSON } = render(
      <AyskaLoadingStateComponent color="success" />
    );
    expect(successJSON()).toBeTruthy();

    const { toJSON: warningJSON } = render(
      <AyskaLoadingStateComponent color="warning" />
    );
    expect(warningJSON()).toBeTruthy();

    const { toJSON: errorJSON } = render(
      <AyskaLoadingStateComponent color="error" />
    );
    expect(errorJSON()).toBeTruthy();

    const { toJSON: textJSON } = render(
      <AyskaLoadingStateComponent color="text" />
    );
    expect(textJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaLoadingStateComponent
        message="Loading..."
        accessibilityLabel="Loading indicator"
        accessibilityHint="Content is being loaded"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaLoadingStateComponent style={{ marginTop: 10 }} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without message', () => {
    const { toJSON } = render(<AyskaLoadingStateComponent message="" />);
    expect(toJSON()).toBeTruthy();
  });
});
