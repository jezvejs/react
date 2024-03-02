// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { Menu } from '@jezvejs/react';

import SelectIcon from '../assets/icons/select.svg';
import SearchIcon from '../assets/icons/search.svg';

import { CustomMenuHeader } from './components/CustomHeader/CustomMenuHeader.jsx';
import { CustomMenuFooter } from './components/CustomFooter/CustomMenuFooter.jsx';

import './Menu.stories.scss';
import { LoadingPlaceholder } from './components/LoadingPlaceholder/LoadingPlaceholder.jsx';

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

const getHorizontalItems = () => ([{
    id: 'selectBtnItem',
    title: 'Button item',
}, {
    id: 'separator1',
    type: 'separator',
}, {
    id: 'linkItem',
    type: 'link',
    title: 'Link item',
    url: '#123',
}, {
    id: 'noIconItem',
    title: 'Item 3',
}]);

const initItems = (title, count, startFrom = 1) => {
    const res = [];

    for (let ind = startFrom; ind < startFrom + count; ind += 1) {
        res.push({ id: ind.toString(), title: `${title} ${ind}` });
    }

    return res;
};


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

export const Horizontal = {
    args: {
        items: getHorizontalItems(),
        className: 'horizontal-menu',
        onItemClick: (_, e) => {
            e?.preventDefault();
        },
    },
};

export const HeaderFooter = {
    args: {
        id: 'headerFooterMenu',
        className: 'scroll-menu',
        items: initItems('Menu item', 5),
        onItemClick: (_, e) => {
            e?.preventDefault();
        },
        header: {
            title: 'Custom header',
        },
        footer: {
            title: 'Custom footer',
        },
        components: {
            Header: CustomMenuHeader,
            Footer: CustomMenuFooter,
        },
    },
};

export const Placeholder = {
    args: {
        items: [],
        components: {
            ListPlaceholder: LoadingPlaceholder,
        },
    },
};
