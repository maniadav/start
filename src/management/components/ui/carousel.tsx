"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@management/lib/utils";
import { Button } from "@management/components/ui/button";

// Custom carousel implementation to replace embla-carousel-react
interface CarouselApi {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  scrollSnapList: () => number[];
  on: (event: string, callback: (api: CarouselApi) => void) => void;
  off: (event: string, callback: (api: CarouselApi) => void) => void;
  reInit: () => void;
}

type CarouselOptions = {
  align?: 'start' | 'center' | 'end';
  axis?: 'x' | 'y';
  containScroll?: 'trimSnaps' | 'keepSnaps' | false;
  dragFree?: boolean;
  loop?: boolean;
  skipSnaps?: boolean;
  startIndex?: number;
};

type CarouselPlugin = any; // Plugins not implemented in custom version

// Custom hook to replace useEmblaCarousel
function useCustomCarousel(options?: CarouselOptions): [React.RefObject<HTMLDivElement>, CarouselApi] {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState(options?.startIndex || 0);
  const [slideCount, setSlideCount] = React.useState(0);
  const eventCallbacks = React.useRef<Map<string, ((api: CarouselApi) => void)[]>>(new Map());
  const triggerEventRef = React.useRef<(eventName: string, api: CarouselApi) => void>();

  const canScrollPrev = React.useCallback(() => {
    if (options?.loop) return slideCount > 0;
    return currentIndex > 0;
  }, [currentIndex, slideCount, options?.loop]);

  const canScrollNext = React.useCallback(() => {
    if (options?.loop) return slideCount > 0;
    return currentIndex < slideCount - 1;
  }, [currentIndex, slideCount, options?.loop]);

  const scrollTo = React.useCallback((index: number) => {
    if (!containerRef.current) return;
    
    const slides = containerRef.current.children;
    if (slides.length === 0) return;

    let targetIndex = index;
    if (options?.loop) {
      targetIndex = ((index % slideCount) + slideCount) % slideCount;
    } else {
      targetIndex = Math.max(0, Math.min(index, slideCount - 1));
    }

    const slideWidth = containerRef.current.clientWidth;
    const slideHeight = containerRef.current.clientHeight;
    const isHorizontal = options?.axis !== 'y';
    
    const offset = isHorizontal ? targetIndex * slideWidth : targetIndex * slideHeight;
    
    containerRef.current.style.transform = isHorizontal 
      ? `translateX(-${offset}px)` 
      : `translateY(-${offset}px)`;
    
    setCurrentIndex(targetIndex);
  }, [slideCount, options?.axis, options?.loop]);

  const scrollPrev = React.useCallback(() => {
    if (options?.loop && currentIndex === 0) {
      scrollTo(slideCount - 1);
    } else {
      scrollTo(currentIndex - 1);
    }
  }, [currentIndex, slideCount, scrollTo, options?.loop]);

  const scrollNext = React.useCallback(() => {
    if (options?.loop && currentIndex === slideCount - 1) {
      scrollTo(0);
    } else {
      scrollTo(currentIndex + 1);
    }
  }, [currentIndex, slideCount, scrollTo, options?.loop]);

  const selectedScrollSnap = React.useCallback(() => currentIndex, [currentIndex]);

  const scrollSnapList = React.useCallback(() => {
    return Array.from({ length: slideCount }, (_, i) => i);
  }, [slideCount]);

  const on = React.useCallback((event: string, callback: (api: CarouselApi) => void) => {
    const callbacks = eventCallbacks.current.get(event) || [];
    callbacks.push(callback);
    eventCallbacks.current.set(event, callbacks);
  }, []);

  const off = React.useCallback((event: string, callback: (api: CarouselApi) => void) => {
    const callbacks = eventCallbacks.current.get(event) || [];
    const filteredCallbacks = callbacks.filter(cb => cb !== callback);
    eventCallbacks.current.set(event, filteredCallbacks);
  }, []);

  const reInit = React.useCallback(() => {
    if (!containerRef.current) return;
    
    const slides = containerRef.current.children;
    setSlideCount(slides.length);
    
    // Setup container styles
    const isHorizontal = options?.axis !== 'y';
    containerRef.current.style.display = 'flex';
    containerRef.current.style.flexDirection = isHorizontal ? 'row' : 'column';
    containerRef.current.style.transition = 'transform 0.3s ease-in-out';
    
    // Setup slide styles
    Array.from(slides).forEach((slide) => {
      const slideElement = slide as HTMLElement;
      slideElement.style.flexShrink = '0';
      slideElement.style.width = isHorizontal ? '100%' : 'auto';
      slideElement.style.height = isHorizontal ? 'auto' : '100%';
    });
  }, [options?.axis]);

  const api: CarouselApi = React.useMemo(() => ({
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    scrollTo,
    selectedScrollSnap,
    scrollSnapList,
    on,
    off,
    reInit
  }), [scrollPrev, scrollNext, canScrollPrev, canScrollNext, scrollTo, selectedScrollSnap, scrollSnapList, on, off, reInit]);

  // Setup event triggering function
  React.useEffect(() => {
    triggerEventRef.current = (eventName: string, api: CarouselApi) => {
      setTimeout(() => {
        const callbacks = eventCallbacks.current.get(eventName) || [];
        callbacks.forEach(callback => {
          try {
            callback(api);
          } catch (error) {
            console.warn(`Error in carousel ${eventName} callback:`, error);
          }
        });
      }, 0);
    };
  }, []);

  // Trigger select event when currentIndex changes
  React.useEffect(() => {
    if (triggerEventRef.current) {
      triggerEventRef.current('select', api);
    }
  }, [currentIndex, api]);

  // Initialize when container ref changes
  React.useEffect(() => {
    if (containerRef.current) {
      reInit();
      if (triggerEventRef.current) {
        triggerEventRef.current('reInit', api);
      }
    }
  }, [reInit, api]);

  return [containerRef, api];
}

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: React.RefObject<HTMLDivElement>;
  api: CarouselApi;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useCustomCarousel({
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    });
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div className="overflow-hidden">
      <div
        ref={(node) => {
          if (carouselRef) {
            (carouselRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
