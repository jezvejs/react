// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { useState } from 'react';
import { Tags, TagsHelpers } from '@jezvejs/react';

import { defaultItems } from './data.js';
import './Tags.stories.scss';

export default {
    title: 'Components/Tags',
    component: Tags,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        items: defaultItems(),
    },
};

export const Styled = {
    args: {
        className: 'styled',
        items: defaultItems(),
    },
};

export const ActiveItem = {
    args: {
        className: 'styled',
        items: defaultItems(),
    },
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        const onItemClick = (itemId) => {
            setState((prev) => ({
                ...prev,
                activeItemId: itemId,
            }));
        };

        return (
            <Tags
                {...state}
                onItemClick={onItemClick}
            />
        );
    },
};

export const Closeable = {
    args: {
        className: 'styled',
        closeable: true,
        items: defaultItems().map((item) => (
            (item.id === '4')
                ? { ...item, closeable: false }
                : item
        )),
    },
    render: function Render(args) {
        const [state, setState] = useState({
            ...args,
        });

        const onCloseItem = (itemId) => {
            setState((prev) => (
                TagsHelpers.removeItemsById(prev, itemId)
            ));
        };

        return (
            <Tags
                {...state}
                onCloseItem={onCloseItem}
            />
        );
    },
};

export const DisabledItem = {
    args: {
        className: 'styled',
        items: defaultItems().map((item) => (
            (item.id === '2')
                ? { ...item, disabled: true }
                : item
        )),
    },
};
