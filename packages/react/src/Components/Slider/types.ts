import { ReactNode } from 'react';

export interface SlideProps {
    id: string,
    className?: string;
    name?: string,
    width?: number,
    height?: number,
    content: ReactNode,
}

export interface SliderContainerProps {
    id?: string;
    className?: string;
    slideIndex?: number;

    animate?: boolean;
    vertical?: boolean;
    allowMouse?: boolean;
    allowTouch?: boolean;
    allowWheel?: boolean;

    width?: number;
    height?: number;

    items?: SlideProps[];

    content?: {
        className?: string;
    };

    updatePosition?: (position: number) => void;

    onChanged?: (slideIndex: number) => void;
}

export interface SliderProps extends SliderContainerProps {
    className?: string;
}

export interface SliderState extends SliderProps {
    position: 0,
    waitingForAnimation: false,
}
