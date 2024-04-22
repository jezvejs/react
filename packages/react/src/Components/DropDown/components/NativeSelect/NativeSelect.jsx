import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Option = (props) => (
    <option value={props.id}>{props.title}</option>
);

Option.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
};

const OptGroup = (props) => (
    <optgroup label={props.title} disabled={props.disabled}>
        {props.items.map((item) => (
            <Option key={`opt_${Date.now()}${item.id}`} {...props} />
        ))}
    </optgroup>
);

OptGroup.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    items: PropTypes.array,
};

const renderListItem = ({ type, ...props }) => (
    (type === 'group')
        ? <OptGroup key={`opt_${Date.now()}${props.id}`} {...props} />
        : <Option key={`opt_${Date.now()}${props.id}`} {...props} />
);

// eslint-disable-next-line react/display-name
export const DropDownNativeSelect = forwardRef((props, ref) => {
    const {
        id,
        multiple,
        disabled,
        onChange,
    } = props;

    const selectProps = {
        id,
        multiple,
        disabled,
        tabIndex: (disabled) ? '' : props.tabIndex,
        onChange,
    };

    return (
        <select
            {...selectProps}
            ref={ref}
        >
            {props.items.map(renderListItem)}
        </select>
    );
});

DropDownNativeSelect.propTypes = {
    id: PropTypes.string,
    tabIndex: PropTypes.number,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
    items: PropTypes.array,
};

DropDownNativeSelect.defaultProps = {
    tabIndex: 0,
    disabled: false,
    multiple: false,
    onChange: null,
};
