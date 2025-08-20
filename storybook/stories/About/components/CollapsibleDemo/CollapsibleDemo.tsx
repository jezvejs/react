import { Button, ButtonProps, Collapsible } from '@jezvejs/react';

import EditIcon from 'common/assets/icons/edit.svg';
import DeleteIcon from 'common/assets/icons/del.svg';

import { CommonProps } from '../../types.ts';

import { ListContent } from '../ListContent/ListContent.tsx';

import './CollapsibleDemo.scss';

const EditIconCustom = (props: React.SVGProps<SVGElement>) => (
    <EditIcon {...props} className='demo-collapsible__header-icon' />
);

const DeleteIconCustom = (props: React.SVGProps<SVGElement>) => (
    <DeleteIcon {...props} className='demo-collapsible__header-icon' />
);

const CustomHeaderButton = (props: ButtonProps) => (
    <Button
        className="demo-collapsible__header-btn"
        onClick={(e) => e.stopPropagation()}
        {...props}
    />
);

const CollapsibleDemoHeader = (
    <>
        <div className="demo-collapsible__title">Hover/focus to see controls</div>
        <CustomHeaderButton icon={EditIconCustom} />
        <CustomHeaderButton icon={DeleteIconCustom} />
    </>
);

const CollapsibleDemoContent = ({ children }: CommonProps) => (
    <div className="demo-collapsible__content-container">
        {children}
    </div>
);

export const CollapsibleDemo = () => (
    <Collapsible
        className="demo-collapsible"
        header={CollapsibleDemoHeader}
        animated
    >
        <CollapsibleDemoContent>
            <ListContent itemsCount={5} prefix="collapse" />
        </CollapsibleDemoContent>
    </Collapsible>
);
