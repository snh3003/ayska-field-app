import { render } from '@testing-library/react-native';
import { AyskaIconComponent } from '../../../src/components/ui/AyskaIconComponent';

describe('AyskaIconComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AyskaIconComponent name="home" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { toJSON: smJSON } = render(
      <AyskaIconComponent name="home" size="sm" />
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: mdJSON } = render(
      <AyskaIconComponent name="home" size="md" />
    );
    expect(mdJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaIconComponent name="home" size="lg" />
    );
    expect(lgJSON()).toBeTruthy();

    const { toJSON: xlJSON } = render(
      <AyskaIconComponent name="home" size="xl" />
    );
    expect(xlJSON()).toBeTruthy();
  });

  it('renders with different colors', () => {
    const { toJSON: textJSON } = render(
      <AyskaIconComponent name="home" color="text" />
    );
    expect(textJSON()).toBeTruthy();

    const { toJSON: primaryJSON } = render(
      <AyskaIconComponent name="home" color="primary" />
    );
    expect(primaryJSON()).toBeTruthy();

    const { toJSON: secondaryJSON } = render(
      <AyskaIconComponent name="home" color="secondary" />
    );
    expect(secondaryJSON()).toBeTruthy();

    const { toJSON: successJSON } = render(
      <AyskaIconComponent name="home" color="success" />
    );
    expect(successJSON()).toBeTruthy();

    const { toJSON: warningJSON } = render(
      <AyskaIconComponent name="home" color="warning" />
    );
    expect(warningJSON()).toBeTruthy();

    const { toJSON: errorJSON } = render(
      <AyskaIconComponent name="home" color="error" />
    );
    expect(errorJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaIconComponent
        name="home"
        accessibilityLabel="Test icon accessibility"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders different icon names', () => {
    const { toJSON: homeJSON } = render(<AyskaIconComponent name="home" />);
    expect(homeJSON()).toBeTruthy();

    const { toJSON: personJSON } = render(<AyskaIconComponent name="person" />);
    expect(personJSON()).toBeTruthy();

    const { toJSON: settingsJSON } = render(
      <AyskaIconComponent name="settings" />
    );
    expect(settingsJSON()).toBeTruthy();
  });
});
