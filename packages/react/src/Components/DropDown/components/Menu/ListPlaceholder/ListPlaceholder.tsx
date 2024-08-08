import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ListPlaceholder.scss';

const defaultProps = {
    content: null,
    active: false,
    selectable: false,
};

export const DropDownListPlaceholder = (p) => {
    const props = {
        ...defaultProps,
        ...p,
    };

    return (
        <li>
            <div
                className={classNames(
                    'dd__list-item dd__list-placeholder',
                    {
                        'dd__list-item_active': !!props.active,
                        'dd__list-placeholder_selectable': !!props.selectable,
                    },
                    props.className,
                )}
            >
                {props.content}
            </div>
        </li>
    );
};

DropDownListPlaceholder.propTypes = {
    content: PropTypes.string,
    active: PropTypes.bool,
    selectable: PropTypes.bool,
    className: PropTypes.string,
};
