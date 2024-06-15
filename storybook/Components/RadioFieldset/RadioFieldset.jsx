import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Radio } from '@jezvejs/react';
import './RadioFieldset.scss';

export const RadioFieldset = (props) => {
    const {
        radioName,
        items,
    } = props;

    const formProps = {
        className: classNames('radio-form', props.className),
    };

    const fieldsetProps = {
        className: 'radio-fieldset',
    };

    const radios = items.map((item) => ({
        id: `${item.value}${radioName}Radio`,
        value: item.value,
        label: item.label,
        name: radioName,
        checked: item.checked ?? false,
        className: item.className,
        onChange: () => {
        console.log('RadioFieldset onChange() item.value: ', item.value);
            props?.onChange?.(item.value)
        },
    }));

    return (
        <form {...formProps}>
            <fieldset {...fieldsetProps}>
                <legend>{props.title}</legend>

                <div className="radio-fieldset__content">
                    {radios.map((item) => (
                        <Radio {...item} key={item.id} />
                    ))}
                </div>
            </fieldset>
        </form>
    );
};

RadioFieldset.propTypes = {
    className: PropTypes.string,
    radioName: PropTypes.string,
    inputId: PropTypes.string,
    title: PropTypes.string,
    onInput: PropTypes.func,
    onChange: PropTypes.func,
};
