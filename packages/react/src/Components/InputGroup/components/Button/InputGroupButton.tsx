import { Button, ButtonProps } from '../../../Button/Button.tsx';
import './InputGroupButton.scss';

export type InputGroupButtonProps = ButtonProps;

export const InputGroupButton = (props: InputGroupButtonProps) => {
    const {
        children,
        ...buttonProps
    } = props;

    const content = children && (
        <div className="input-group__btn-title">
            {children}
        </div>
    );

    return (
        <Button {...buttonProps} className="input-group__btn">
            {content}
        </Button>
    );
};
