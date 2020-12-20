import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  MouseEvent,
  RefObject,
  CSSProperties,
  TransitionEvent
} from 'react';

type CalculateStyleOptions = Pick<CSSProperties, 'overflow'> & {
  duration: number;
  easing: string;
  isExpanded?: boolean;
  contentHeight?: number;
  expandedHeight?: number;
  isDisabled?: boolean;
  initiallyExpanded?: boolean;
};

function calculateStyles({
  duration,
  easing,
  isExpanded,
  contentHeight,
  expandedHeight,
  isDisabled,
  overflow
}: CalculateStyleOptions): CSSProperties {
  let maxHeight;

  if (isExpanded) {
    // When expanded, use contentHeight if it is defined
    if (typeof contentHeight !== 'undefined') {
      maxHeight = contentHeight;
    }
  } else if (typeof expandedHeight !== 'undefined') {
    // When collapsed, use expandedHeight if it is defined
    maxHeight = Math.max(expandedHeight, 0);
  } else if (!isDisabled) {
    // Otherwise use 0 when expander is not disabled
    maxHeight = '0';
  }

  if (typeof maxHeight !== 'undefined') {
    // Use the pixel value when maxHeight is defined
    maxHeight = `${maxHeight}px`;
  }

  return {
    overflow,
    transition: `max-height ${duration}ms ${easing}`,
    // Unset maxHeight when it is undefined
    maxHeight
  };
}

export type CollapseState<T extends Element> = {
  contentRef: RefObject<T>;
  getCollapseProps: () => {
    style: CSSProperties;
    onTransitionEnd(event: TransitionEvent): void;
  };
  getToggleProps: () => {
    type: string;
    role: string;
    onClick(event: MouseEvent): void;
  };
  isExpanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
};

export type UseCollapseOptions<T> = {
  duration?: number;
  easing?: string;
  initiallyExpanded?: boolean;
  contentRef: RefObject<T>;
  isDisabled?: boolean;
};

export function useCollapse<T extends Element>({
  duration = 250,
  easing = 'ease-out',
  initiallyExpanded,
  contentRef,
  isDisabled
}: UseCollapseOptions<T>): CollapseState<T> {
  const [isExpanded, setExpanded] = useState(initiallyExpanded ?? false);
  const [styles, setStyles] = useState<CSSProperties>({
    overflow: isExpanded ? 'visible' : 'hidden',
    maxHeight: isExpanded ? undefined : '0px'
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(([entry]) => {
      requestAnimationFrame(() => {
        if (!entry) {
          return;
        }

        const {height} = entry.target.getBoundingClientRect();

        setStyles(({overflow}) =>
          calculateStyles({
            overflow,
            duration,
            easing,
            isExpanded,
            isDisabled,
            contentHeight: height
          })
        );
      });
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [contentRef, duration, easing, isExpanded]);

  function handleTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'max-height') {
      setStyles((oldStyles) => ({
        ...oldStyles,
        overflow: isExpanded ? 'visible' : 'hidden'
      }));
    }
  }

  function getCollapseProps() {
    return {
      style: styles,
      onTransitionEnd: handleTransitionEnd
    };
  }

  function getToggleProps() {
    return {
      type: 'button',
      role: 'button',
      onClick() {
        setExpanded((expanded) => !expanded);
        setStyles((oldStyles) => ({
          ...oldStyles,
          overflow: 'hidden'
        }));
      }
    };
  }

  return {
    contentRef,
    getCollapseProps,
    getToggleProps,
    isExpanded,
    setExpanded
  };
}