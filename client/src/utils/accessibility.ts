/**
 * Accessibility utilities for improving app accessibility
 */

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus management - focus first focusable element in container
 */
export function focusFirstFocusable(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  if (firstFocusable) {
    firstFocusable.focus();
  }
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  return (
    element.getAttribute('aria-hidden') !== 'true' &&
    element.style.display !== 'none' &&
    element.style.visibility !== 'hidden' &&
    !element.hidden
  );
}

/**
 * Generate unique ID for aria-labels
 */
let idCounter = 0;
export function generateUniqueId(prefix: string = 'a11y'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Keyboard navigation helper
 */
export function handleArrowNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: 'horizontal' | 'vertical' = 'vertical'
): number {
  let newIndex = currentIndex;

  const isVertical = orientation === 'vertical';
  const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
  const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

  if (event.key === nextKey) {
    event.preventDefault();
    newIndex = (currentIndex + 1) % items.length;
  } else if (event.key === prevKey) {
    event.preventDefault();
    newIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (event.key === 'Home') {
    event.preventDefault();
    newIndex = 0;
  } else if (event.key === 'End') {
    event.preventDefault();
    newIndex = items.length - 1;
  }

  if (newIndex !== currentIndex) {
    items[newIndex].focus();
  }

  return newIndex;
}

/**
 * Add skip link for keyboard navigation
 */
export function addSkipLink(targetId: string, text: string = 'Skip to main content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: var(--primary-foreground);
    padding: 8px 16px;
    text-decoration: none;
    z-index: 100;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.prepend(skipLink);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get readable color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Simplified luminance calculation
    // In production, use a proper color library
    return 0.5; // Placeholder
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function meetsContrastRequirements(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Add aria-label if element doesn't have accessible name
 */
export function ensureAccessibleName(element: HTMLElement, defaultLabel: string) {
  const hasLabel =
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent?.trim();

  if (!hasLabel) {
    element.setAttribute('aria-label', defaultLabel);
  }
}

/**
 * Announce transaction status to screen readers
 */
export function announceTransactionStatus(
  status: 'pending' | 'completed' | 'failed',
  details: string
) {
  const messages = {
    pending: `Transaction pending: ${details}`,
    completed: `Transaction completed successfully: ${details}`,
    failed: `Transaction failed: ${details}`,
  };

  announceToScreenReader(messages[status], status === 'failed' ? 'assertive' : 'polite');
}
