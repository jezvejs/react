import { ActionButton } from '../../../../common/Components/ActionButton/ActionButton.tsx';
import './CustomDatePickerFooter.scss';

export type CustomDatePickerFooterProps = {
    title: string;
    onSubmit?: () => void;
};

export const CustomDatePickerFooter: React.FC<CustomDatePickerFooterProps> = (props) => (
    <div className="custom-footer">
        <div className="custom-footer__title">{props.title}</div>
        <ActionButton onClick={props.onSubmit}>Ok</ActionButton>
    </div>
);
