import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MenuItem } from '@jezvejs/react';

const customColorsMap = {
    1: 'blue',
    2: 'red',
    3: 'green',
    4: 'yellow',
    5: 'pink',
    6: 'purple',
    7: 'orange',
    8: 'grey',
    9: 'brown',
    10: 'cyan',
    11: 'magenta',
};

const defaultProps = {
    selected: false,
    active: false,
    hidden: false,
    disabled: false,
    multiple: false,
    group: null,
};

export const CustomListItem = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    const color = customColorsMap[props.id];

    const before = (
        <span className='dd__custom-list-item_color' data-color={color}>
            {props.multiple && (
                <span className='dd__custom-list-item_check'>&times;</span>
            )}
        </span>
    );

    return (
        <MenuItem
            {...props}
            before={before}
            className={classNames('dd__list-item', props.className)}
        />
    );
};

CustomListItem.selector = '.dd__list-item';

CustomListItem.propTypes = {
    id: PropTypes.string,
    selected: PropTypes.bool,
    active: PropTypes.bool,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    group: PropTypes.string,
    className: PropTypes.string,
};
