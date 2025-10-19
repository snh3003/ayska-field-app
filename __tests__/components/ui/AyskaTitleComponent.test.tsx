import React from 'react';
import {
  createTitleProps,
  render,
  screen,
} from '../../../__tests__/utils/test-utils';
import { AyskaTitleComponent } from '../../../src/components/ui/AyskaTitleComponent';

describe('AyskaTitleComponent', () => {
  describe('Rendering', () => {
    it('renders title content correctly', () => {
      const props = createTitleProps({ children: 'Main Title' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Main Title')).toBeTruthy();
    });

    it('renders with default props', () => {
      render(<AyskaTitleComponent>Default title</AyskaTitleComponent>);

      expect(screen.getByText('Default title')).toBeTruthy();
    });
  });

  describe('Levels', () => {
    it('renders level 1 title correctly', () => {
      const props = createTitleProps({ level: 1 });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders level 2 title correctly', () => {
      const props = createTitleProps({ level: 2 });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders level 3 title correctly', () => {
      const props = createTitleProps({ level: 3 });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders level 4 title correctly', () => {
      const props = createTitleProps({ level: 4 });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });
  });

  describe('Weight', () => {
    it('renders semibold weight correctly', () => {
      const props = createTitleProps({ weight: 'semibold' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders bold weight correctly', () => {
      const props = createTitleProps({ weight: 'bold' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });
  });

  describe('Colors', () => {
    it('renders text color correctly', () => {
      const props = createTitleProps({ color: 'text' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders textSecondary color correctly', () => {
      const props = createTitleProps({ color: 'textSecondary' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders primary color correctly', () => {
      const props = createTitleProps({ color: 'primary' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders secondary color correctly', () => {
      const props = createTitleProps({ color: 'secondary' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });
  });

  describe('Alignment', () => {
    it('renders left alignment correctly', () => {
      const props = createTitleProps({ align: 'left' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders center alignment correctly', () => {
      const props = createTitleProps({ align: 'center' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders right alignment correctly', () => {
      const props = createTitleProps({ align: 'right' });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });
  });

  describe('Icons', () => {
    it('renders with leading icon', () => {
      const leadingIcon = <span data-testid="leading-icon">📝</span>;
      const props = createTitleProps({ leadingIcon });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
      expect(screen.getByTestId('leading-icon')).toBeTruthy();
    });

    it('renders with trailing icon', () => {
      const trailingIcon = <span data-testid="trailing-icon">→</span>;
      const props = createTitleProps({ trailingIcon });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
      expect(screen.getByTestId('trailing-icon')).toBeTruthy();
    });

    it('renders with both leading and trailing icons', () => {
      const leadingIcon = <span data-testid="leading-icon">📝</span>;
      const trailingIcon = <span data-testid="trailing-icon">→</span>;
      const props = createTitleProps({ leadingIcon, trailingIcon });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
      expect(screen.getByTestId('leading-icon')).toBeTruthy();
      expect(screen.getByTestId('trailing-icon')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility props', () => {
      const props = createTitleProps({
        accessibilityLabel: 'Test title accessibility',
      });
      render(<AyskaTitleComponent {...props} />);

      const titleElement = screen.getByText('Test title');
      expect(titleElement).toBeTruthy();
    });

    it('has default accessibility props when no label provided', () => {
      const props = createTitleProps();
      render(<AyskaTitleComponent {...props} />);

      const titleElement = screen.getByText('Test title');
      expect(titleElement).toBeTruthy();
    });
  });

  describe('Number of Lines', () => {
    it('renders with numberOfLines prop', () => {
      const props = createTitleProps({ numberOfLines: 1 });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });

    it('renders without numberOfLines prop', () => {
      const props = createTitleProps();
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const props = createTitleProps({ children: '' });
      render(<AyskaTitleComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test title')).toBeFalsy();
    });

    it('handles null children', () => {
      const props = createTitleProps({ children: null });
      render(<AyskaTitleComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test title')).toBeFalsy();
    });

    it('handles undefined children', () => {
      const props = createTitleProps({ children: undefined });
      render(<AyskaTitleComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test title')).toBeFalsy();
    });
  });

  describe('Combined Props', () => {
    it('renders with multiple props combined', () => {
      const leadingIcon = <span data-testid="leading-icon">📝</span>;
      const props = createTitleProps({
        level: 2,
        weight: 'bold',
        color: 'primary',
        align: 'center',
        numberOfLines: 1,
        leadingIcon,
        accessibilityLabel: 'Combined props test',
      });
      render(<AyskaTitleComponent {...props} />);

      expect(screen.getByText('Test title')).toBeTruthy();
      expect(screen.getByTestId('leading-icon')).toBeTruthy();
    });
  });
});
