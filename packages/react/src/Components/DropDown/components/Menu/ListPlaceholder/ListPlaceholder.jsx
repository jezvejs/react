import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ListPlaceholder.scss';

export const DropDownListPlaceholder = (props) => (
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

DropDownListPlaceholder.propTypes = {
    content: PropTypes.string,
    active: PropTypes.bool,
    selectable: PropTypes.bool,
    className: PropTypes.string,
};

DropDownListPlaceholder.defaultProps = {
    content: null,
    active: false,
    selectable: false,
};
