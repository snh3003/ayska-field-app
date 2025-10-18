import {
  createTextProps,
  render,
  screen,
} from '../../../__tests__/utils/test-utils';
import { AyskaTextComponent } from '../../../src/components/ui/AyskaTextComponent';

describe('AyskaTextComponent', () => {
  describe('Rendering', () => {
    it('renders text content correctly', () => {
      const props = createTextProps({ children: 'Hello World' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('renders with default props', () => {
      render(<AyskaTextComponent>Default text</AyskaTextComponent>);

      expect(screen.getByText('Default text')).toBeTruthy();
    });

    it('renders with custom style', () => {
      const customStyle = { marginTop: 10 };
      const props = createTextProps({ style: customStyle });
      render(<AyskaTextComponent {...props} />);

      const textElement = screen.getByText('Test text');
      expect(textElement).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('renders body variant correctly', () => {
      const props = createTextProps({ variant: 'body' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders bodyLarge variant correctly', () => {
      const props = createTextProps({ variant: 'bodyLarge' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders bodySmall variant correctly', () => {
      const props = createTextProps({ variant: 'bodySmall' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });
  });

  describe('Weight', () => {
    it('renders normal weight correctly', () => {
      const props = createTextProps({ weight: 'normal' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders medium weight correctly', () => {
      const props = createTextProps({ weight: 'medium' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders semibold weight correctly', () => {
      const props = createTextProps({ weight: 'semibold' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders bold weight correctly', () => {
      const props = createTextProps({ weight: 'bold' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });
  });

  describe('Colors', () => {
    it('renders text color correctly', () => {
      const props = createTextProps({ color: 'text' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders textSecondary color correctly', () => {
      const props = createTextProps({ color: 'textSecondary' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders primary color correctly', () => {
      const props = createTextProps({ color: 'primary' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders secondary color correctly', () => {
      const props = createTextProps({ color: 'secondary' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders success color correctly', () => {
      const props = createTextProps({ color: 'success' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders warning color correctly', () => {
      const props = createTextProps({ color: 'warning' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders error color correctly', () => {
      const props = createTextProps({ color: 'error' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders info color correctly', () => {
      const props = createTextProps({ color: 'info' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });
  });

  describe('Alignment', () => {
    it('renders left alignment correctly', () => {
      const props = createTextProps({ align: 'left' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders center alignment correctly', () => {
      const props = createTextProps({ align: 'center' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders right alignment correctly', () => {
      const props = createTextProps({ align: 'right' });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('renders with leading icon', () => {
      const leadingIcon = <span data-testid="leading-icon">📝</span>;
      const props = createTextProps({ leadingIcon });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
      expect(screen.getByTestId('leading-icon')).toBeTruthy();
    });

    it('renders with trailing icon', () => {
      const trailingIcon = <span data-testid="trailing-icon">→</span>;
      const props = createTextProps({ trailingIcon });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
      expect(screen.getByTestId('trailing-icon')).toBeTruthy();
    });

    it('renders with both leading and trailing icons', () => {
      const leadingIcon = <span data-testid="leading-icon">📝</span>;
      const trailingIcon = <span data-testid="trailing-icon">→</span>;
      const props = createTextProps({ leadingIcon, trailingIcon });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
      expect(screen.getByTestId('leading-icon')).toBeTruthy();
      expect(screen.getByTestId('trailing-icon')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility props', () => {
      const props = createTextProps({
        accessibilityLabel: 'Test accessibility label',
      });
      render(<AyskaTextComponent {...props} />);

      const textElement = screen.getByText('Test text');
      expect(textElement).toBeTruthy();
    });

    it('has default accessibility props when no label provided', () => {
      const props = createTextProps();
      render(<AyskaTextComponent {...props} />);

      const textElement = screen.getByText('Test text');
      expect(textElement).toBeTruthy();
    });
  });

  describe('Number of Lines', () => {
    it('renders with numberOfLines prop', () => {
      const props = createTextProps({ numberOfLines: 2 });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });

    it('renders without numberOfLines prop', () => {
      const props = createTextProps();
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const props = createTextProps({ children: '' });
      render(<AyskaTextComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test text')).toBeFalsy();
    });

    it('handles null children', () => {
      const props = createTextProps({ children: null });
      render(<AyskaTextComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test text')).toBeFalsy();
    });

    it('handles undefined children', () => {
      const props = createTextProps({ children: undefined });
      render(<AyskaTextComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test text')).toBeFalsy();
    });
  });

  describe('Combined Props', () => {
    it('renders with multiple props combined', () => {
      const leadingIcon = <span data-testid="leading-icon">📝</span>;
      const props = createTextProps({
        variant: 'bodyLarge',
        weight: 'semibold',
        color: 'primary',
        align: 'center',
        numberOfLines: 1,
        leadingIcon,
        accessibilityLabel: 'Combined props test',
      });
      render(<AyskaTextComponent {...props} />);

      expect(screen.getByText('Test text')).toBeTruthy();
      expect(screen.getByTestId('leading-icon')).toBeTruthy();
    });
  });
});
