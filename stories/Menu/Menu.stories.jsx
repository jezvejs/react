// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Menu } from '@jezvejs/react';

import SelectIcon from '../assets/icons/select.svg';
import SearchIcon from '../assets/icons/search.svg';

import './Menu.stories.scss';

const getDefaultItems = () => ([{
    id: 'selectBtnItem',
    icon: SelectIcon,
    title: 'Button item',
}, {
    id: 'separator1',
    type: 'separator',
}, {
    id: 'linkItem',
    type: 'link',
    title: 'Link item',
    icon: SearchIcon,
    url: '#123',
}, {
    id: 'noIconItem',
    title: 'No icon item',
}, {
    id: 'checkboxItem',
    type: 'checkbox',
    title: 'Checkbox item',
    selected: true,
}]);

export default {
    title: 'Components/Menu',
    component: Menu,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        items: getDefaultItems(),
    },
};

export const IconAlignment = {
    args: {
        items: getDefaultItems(),
        iconAlign: 'right',
        onItemClick: (_, e) => {
            e?.preventDefault();
        },
    },
};

export const CheckboxSide = {
    args: {
        items: [
            ...getDefaultItems(),
            {
                id: 'leftSideCheckboxItem',
                type: 'checkbox',
                title: 'Checkbox item',
                selected: true,
                checkboxSide: 'left',
            },
        ],
        checkboxSide: 'right',
        onItemClick: (_, e) => {
            e?.preventDefault();
        },
    },
};
