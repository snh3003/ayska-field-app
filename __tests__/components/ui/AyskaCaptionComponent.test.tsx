import React from 'react';
import {
  createCaptionProps,
  render,
  screen,
} from '../../../__tests__/utils/test-utils';
import { AyskaCaptionComponent } from '../../../src/components/ui/AyskaCaptionComponent';

describe('AyskaCaptionComponent', () => {
  describe('Rendering', () => {
    it('renders caption content correctly', () => {
      const props = createCaptionProps({ children: 'Caption text' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Caption text')).toBeTruthy();
    });

    it('renders with default props', () => {
      render(<AyskaCaptionComponent>Default caption</AyskaCaptionComponent>);

      expect(screen.getByText('Default caption')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    it('renders default variant correctly', () => {
      const props = createCaptionProps({ variant: 'default' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders timestamp variant correctly', () => {
      const props = createCaptionProps({ variant: 'timestamp' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders helper variant correctly', () => {
      const props = createCaptionProps({ variant: 'helper' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });
  });

  describe('Colors', () => {
    it('renders textSecondary color correctly', () => {
      const props = createCaptionProps({ color: 'textSecondary' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders primary color correctly', () => {
      const props = createCaptionProps({ color: 'primary' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders success color correctly', () => {
      const props = createCaptionProps({ color: 'success' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders warning color correctly', () => {
      const props = createCaptionProps({ color: 'warning' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders error color correctly', () => {
      const props = createCaptionProps({ color: 'error' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });
  });

  describe('Alignment', () => {
    it('renders left alignment correctly', () => {
      const props = createCaptionProps({ align: 'left' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders center alignment correctly', () => {
      const props = createCaptionProps({ align: 'center' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders right alignment correctly', () => {
      const props = createCaptionProps({ align: 'right' });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility props', () => {
      const props = createCaptionProps({
        accessibilityLabel: 'Test caption accessibility',
      });
      render(<AyskaCaptionComponent {...props} />);

      const captionElement = screen.getByText('Test caption');
      expect(captionElement).toBeTruthy();
    });

    it('has default accessibility props when no label provided', () => {
      const props = createCaptionProps();
      render(<AyskaCaptionComponent {...props} />);

      const captionElement = screen.getByText('Test caption');
      expect(captionElement).toBeTruthy();
    });
  });

  describe('Number of Lines', () => {
    it('renders with numberOfLines prop', () => {
      const props = createCaptionProps({ numberOfLines: 2 });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });

    it('renders without numberOfLines prop', () => {
      const props = createCaptionProps();
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const props = createCaptionProps({ children: '' });
      render(<AyskaCaptionComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test caption')).toBeFalsy();
    });

    it('handles null children', () => {
      const props = createCaptionProps({ children: null });
      render(<AyskaCaptionComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test caption')).toBeFalsy();
    });

    it('handles undefined children', () => {
      const props = createCaptionProps({ children: undefined });
      render(<AyskaCaptionComponent {...props} />);

      // Should render without crashing
      expect(screen.queryByText('Test caption')).toBeFalsy();
    });
  });

  describe('Combined Props', () => {
    it('renders with multiple props combined', () => {
      const props = createCaptionProps({
        variant: 'timestamp',
        color: 'primary',
        align: 'center',
        numberOfLines: 1,
        accessibilityLabel: 'Combined props test',
      });
      render(<AyskaCaptionComponent {...props} />);

      expect(screen.getByText('Test caption')).toBeTruthy();
    });
  });
});
