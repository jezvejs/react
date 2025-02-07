import './SectionControls.scss';

type SectionControlsProps = {
    children: React.ReactNode;
};

export const SectionControls: React.FC<SectionControlsProps> = ({ children }) => (
    <div className="section-controls">
        {children}
    </div>
);
