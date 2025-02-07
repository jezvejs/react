import classNames from 'classnames';
import { Radio, RadioProps } from '@jezvejs/react';
import './RadioFieldset.scss';

export interface RadioFieldsetProps {
    className?: string;
    radioName: string;
    title: string;
    items: Partial<RadioProps>[];
    onChange: (value: string) => void;
}

export const RadioFieldset: React.FC<RadioFieldsetProps> = (props) => {
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
        id: `${item.id}${radioName}Radio`,
        value: item.value,
        label: item.label,
        name: radioName,
        checked: item.checked ?? false,
        className: item.className,
        onChange: () => {
            props?.onChange?.(item.value ?? '');
        },
    }));

    return (
        <form {...formProps}>
            <fieldset {...fieldsetProps}>
                <legend>{props.title}</legend>

                <div className="radio-fieldset__content">
                    {radios.map(({ id, ...item }) => (
                        <Radio {...item} key={id} />
                    ))}
                </div>
            </fieldset>
        </form>
    );
};
