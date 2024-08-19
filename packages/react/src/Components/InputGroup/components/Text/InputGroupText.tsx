import './InputGroupText.scss';

export interface InputGroupTextProps {
    title: string,
}

export const InputGroupText = ({ title }: InputGroupTextProps) => (
    <div className="input-group__text">{title}</div>
);
