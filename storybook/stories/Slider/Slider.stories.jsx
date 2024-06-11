// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';

import { ControlledSlider } from './components/ControlledSlider/ControlledSlider.jsx';
import { SlideContent } from './components/SlideContent/SlideContent.jsx';

import './Slider.stories.scss';

export default {
    title: 'Components/Slider',
    component: ControlledSlider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

const getSliderItems = (options = {}) => {
    const {
        itemsCount = 3,
        idPrefix = 'slide',
    } = options;
    const res = [];

    for (let i = 1; i <= itemsCount; i += 1) {
        res.push({
            id: `${idPrefix}-${i}`,
            name: `${idPrefix}-${i}`,
            content: <SlideContent>{`Slide ${i}`}</SlideContent>,
        });
    }

    return res;
};

export const Default = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
    },
};

export const Vertical = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        vertical: true,
    },
};

/**
 * Enabled \'allowMouse\' option
 */
export const AllowMouse = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        allowMouse: true,
    },
};

/**
 * Disabled 'allowTouch' option
 */
export const DisableTouch = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        allowTouch: false,
    },
};

/**
 * Disabled 'allowWheel' option
 */
export const DisableWheel = {
    args: {
        width: 300,
        height: 200,
        items: getSliderItems(),
        allowWheel: false,
    },
};
