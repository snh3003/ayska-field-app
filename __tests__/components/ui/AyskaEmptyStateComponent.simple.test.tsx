import { render } from '@testing-library/react-native';
import { AyskaEmptyStateComponent } from '../../../src/components/ui/AyskaEmptyStateComponent';

describe('AyskaEmptyStateComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<AyskaEmptyStateComponent />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with title', () => {
    const { toJSON } = render(<AyskaEmptyStateComponent title="No Data" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with message', () => {
    const { toJSON } = render(
      <AyskaEmptyStateComponent message="No items found" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with title and message', () => {
    const { toJSON } = render(
      <AyskaEmptyStateComponent title="No Data" message="No items found" />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom icon', () => {
    const { toJSON } = render(
      <AyskaEmptyStateComponent
        title="No Data"
        message="No items found"
        icon="folder-outline"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { toJSON: defaultJSON } = render(
      <AyskaEmptyStateComponent
        title="Default"
        message="Default variant"
        variant="default"
      />
    );
    expect(defaultJSON()).toBeTruthy();

    const { toJSON: minimalJSON } = render(
      <AyskaEmptyStateComponent
        title="Minimal"
        message="Minimal variant"
        variant="minimal"
      />
    );
    expect(minimalJSON()).toBeTruthy();

    const { toJSON: prominentJSON } = render(
      <AyskaEmptyStateComponent
        title="Prominent"
        message="Prominent variant"
        variant="prominent"
      />
    );
    expect(prominentJSON()).toBeTruthy();
  });

  it('renders with action button', () => {
    const { toJSON } = render(
      <AyskaEmptyStateComponent
        title="No Data"
        message="No items found"
        actionLabel="Add Item"
        onAction={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaEmptyStateComponent
        title="No Data"
        message="No items found"
        accessibilityLabel="Empty state"
        accessibilityHint="No data is available"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaEmptyStateComponent
        title="No Data"
        message="No items found"
        style={{ marginTop: 10 }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with only icon', () => {
    const { toJSON } = render(
      <AyskaEmptyStateComponent icon="document-outline" />
    );
    expect(toJSON()).toBeTruthy();
  });
});
