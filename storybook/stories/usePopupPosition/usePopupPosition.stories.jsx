// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';

import { MenuPopup } from './components/MenuPopup/MenuPopup.jsx';
import './usePopupPosition.stories.scss';

const positions = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
];

const defaultDecorator = (Story) => (
    <div className="rel-container">
        <Story />
    </div>
);

const scrollDecorator = (Story) => (
    <div className="ref-scroller">
        <div className="ref-container">
            <Story />
        </div>
    </div>
);

export default {
    title: 'Hooks/usePopupPosition',
    component: MenuPopup,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [defaultDecorator],
    tags: ['autodocs'],
};

const argTypes = {
    position: {
        options: [...positions],
        control: { type: 'radio' },
    },
    allowFlip: {
        type: 'boolean',
    },
    allowHorizontalFlip: {
        type: 'boolean',
    },
    allowChangeAxis: {
        type: 'boolean',
    },
    scrollOnOverflow: {
        type: 'boolean',
    },
    allowResize: {
        type: 'boolean',
    },
    margin: {
        type: 'number',
    },
    screenPadding: {
        type: 'number',
    },
};

export const Default = {
    args: {
    },
    argTypes,
};

export const ScrollParent = {
    args: {
        position: 'top',
    },
    decorators: [scrollDecorator],
    argTypes,
};
