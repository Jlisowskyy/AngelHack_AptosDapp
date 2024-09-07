'use client';
import React, {CSSProperties, useEffect, useRef, useState} from 'react';

export const StickySlidesComponent = ({
                                          children,
                                          slideCount,
                                          position,
                                          className,
                                      }: {
    children: React.ReactNode;
    slideCount: number;
    position: 'horizontal' | 'vertical';
    className?: string;
}) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isAnimationPlayingRef = useRef<boolean>(false);

    const lastScrollPosition = useRef<number>(0);
    const lastKnownScrollPosition = useRef<number>(0);
    const ticking = useRef<boolean>(false);

    const [, forceUpdate] = useState({});

    const isEqual = (a: number, b: number) => Math.abs(a - b) <= 2;

    useEffect(() => {
        const handleResize = () => {
            forceUpdate({});
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            lastKnownScrollPosition.current = window.scrollY;

            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    updateScrollPosition();
                    ticking.current = false;
                });

                ticking.current = true;
            }
        };

        const updateScrollPosition = () => {
            if (isAnimationPlayingRef.current) {
                window.scrollTo(0, lastScrollPosition.current);
                return;
            }

            if (parentRef.current && scrollRef.current) {
                const size = position === 'horizontal' ? scrollRef.current.scrollWidth : scrollRef.current.scrollHeight;
                const offset = position === 'horizontal' ? window.innerWidth : window.innerHeight;

                const dist = -parentRef.current.getBoundingClientRect().top;
                const slideSize = Math.ceil(size / slideCount);

                const adjustedSize = size - slideSize;
                const adjustedSlideSize = Math.ceil(adjustedSize / slideCount);

                if (0 < dist && dist < size) {
                    const currSlide = Math.min(Math.floor(dist / adjustedSlideSize), slideCount - 1);
                    const slideCord = Math.floor(currSlide * slideSize + (slideSize - offset) / 2);

                    if (
                        !isAnimationPlayingRef.current &&
                        ((position === 'horizontal' && !isEqual(scrollRef.current.scrollLeft, slideCord)) ||
                            (position === 'vertical' && !isEqual(scrollRef.current.scrollTop, slideCord)))
                    ) {
                        isAnimationPlayingRef.current = true;
                        lastScrollPosition.current = window.pageYOffset;

                        scrollRef.current.scrollTo(
                            position === 'horizontal'
                                ? {left: slideCord, behavior: 'smooth'}
                                : {top: slideCord, behavior: 'smooth'},
                        );
                        setTimeout(() => {
                            isAnimationPlayingRef.current = false;
                        }, 200);
                    }
                } else if (dist < 0) {
                    const slideCord = (slideSize - offset) / 2;
                    if (position === 'horizontal' && scrollRef.current.scrollLeft !== slideCord) {
                        scrollRef.current.scrollTo({left: slideCord, behavior: 'instant'});
                    } else if (position === 'vertical' && scrollRef.current.scrollTop !== slideCord) {
                        scrollRef.current.scrollTo({top: slideCord, behavior: 'instant'});
                    }
                }
            }
        };

        const preventScroll = (e: Event) => {
            if (isAnimationPlayingRef.current) {
                e.preventDefault();
            }
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        window.addEventListener('wheel', preventScroll, {passive: false});
        window.addEventListener('touchmove', preventScroll, {passive: false});

        updateScrollPosition();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', preventScroll);
            window.removeEventListener('touchmove', preventScroll);
        };
    }, [slideCount, position]);

    const redrawStyle: CSSProperties =
        position === 'horizontal'
            ? {height: `${scrollRef.current ? scrollRef.current.scrollWidth : 0}px`}
            : {height: `${scrollRef.current ? scrollRef.current.scrollHeight : 0}px`};

    return (
        <div className={className}>
            <div className={`w-screen max-w-full`} style={{...redrawStyle}} ref={parentRef}>
                <div
                    className={`w-screen h-auto max-h-screen max-w-full overflow-hidden sticky top-[4.5rem] scroll-smooth`}
                    ref={scrollRef}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
