import { Button } from '../../../Button/Button.tsx';
import './InputGroupButton.scss';

export const InputGroupButton = ({ children, ...props }) => {
    const content = children && (
        <div className="input-group__btn-title">
            {children}
        </div>
    );

    return (
        <Button {...props} className="input-group__btn">
            {content}
        </Button>
    );
};

InputGroupButton.propTypes = {
    ...Button.propTypes,
};
