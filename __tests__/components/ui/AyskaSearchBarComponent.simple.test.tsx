import { render } from '@testing-library/react-native';
import { AyskaSearchBarComponent } from '../../../src/components/ui/AyskaSearchBarComponent';

describe('AyskaSearchBarComponent - Simple Tests', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent value="" onChange={() => {}} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with value', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent value="search term" onChange={() => {}} />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with placeholder', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value=""
        onChange={() => {}}
        placeholder="Search for items..."
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders in disabled state', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent value="" onChange={() => {}} disabled />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with clear button', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value="search term"
        onChange={() => {}}
        showClearButton
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders without clear button', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value="search term"
        onChange={() => {}}
        showClearButton={false}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with search button', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value="search term"
        onChange={() => {}}
        showSearchButton
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const { toJSON: smJSON } = render(
      <AyskaSearchBarComponent value="" onChange={() => {}} size="sm" />
    );
    expect(smJSON()).toBeTruthy();

    const { toJSON: mdJSON } = render(
      <AyskaSearchBarComponent value="" onChange={() => {}} size="md" />
    );
    expect(mdJSON()).toBeTruthy();

    const { toJSON: lgJSON } = render(
      <AyskaSearchBarComponent value="" onChange={() => {}} size="lg" />
    );
    expect(lgJSON()).toBeTruthy();
  });

  it('renders with onSearch handler', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value="search term"
        onChange={() => {}}
        onSearch={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with onClear handler', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value="search term"
        onChange={() => {}}
        onClear={() => {}}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with accessibility props', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value=""
        onChange={() => {}}
        accessibilityLabel="Search input"
        accessibilityHint="Enter search terms"
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with custom style', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value=""
        onChange={() => {}}
        style={{ marginTop: 10 }}
      />
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders with both clear and search buttons', () => {
    const { toJSON } = render(
      <AyskaSearchBarComponent
        value="search term"
        onChange={() => {}}
        showClearButton
        showSearchButton
      />
    );
    expect(toJSON()).toBeTruthy();
  });
});
