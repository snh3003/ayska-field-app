import { render } from '@testing-library/react-native';
import { AyskaListItemComponent } from '../../../src/components/ui/AyskaListItemComponent';

describe('AyskaListItemComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AyskaListItemComponent title="Test Item" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with title only', () => {
    const { toJSON } = render(<AyskaListItemComponent title="Title Only" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with title and subtitle', () => {
    const { toJSON } = render(
      <AyskaListItemComponent title="Title" subtitle="Subtitle text" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with avatar', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="With Avatar"
        subtitle="Has avatar"
        avatar={<div>Avatar</div>}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with leading content', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="With Leading"
        subtitle="Has leading content"
        leading={<div>Leading</div>}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with trailing content', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="With Trailing"
        subtitle="Has trailing content"
        trailing={<div>Trailing</div>}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with onPress handler', () => {
    const mockPress = jest.fn();
    const { toJSON } = render(
      <AyskaListItemComponent
        title="Pressable"
        subtitle="Can be pressed"
        onPress={mockPress}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders in disabled state', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="Disabled"
        subtitle="Cannot be pressed"
        disabled
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without divider', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="No Divider"
        subtitle="No bottom border"
        showDivider={false}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different padding', () => {
    const { toJSON: smJSON } = render(
      <AyskaListItemComponent title="Small Padding" padding="sm" />
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaListItemComponent title="Large Padding" padding="lg" />
    );
    expect(lgJSON()).toBeTruthy();

    const { toJSON: noneJSON } = render(
      <AyskaListItemComponent title="No Padding" padding="none" />
    );
    expect(noneJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="Accessible"
        subtitle="Has accessibility props"
        accessibilityLabel="Test list item accessibility"
        accessibilityHint="Press to select"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="Styled"
        subtitle="Has custom styling"
        style={{ backgroundColor: '#f0f0f0' }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without onPress (non-interactive)', () => {
    const { toJSON } = render(
      <AyskaListItemComponent
        title="Non-Interactive"
        subtitle="Just displays content"
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
