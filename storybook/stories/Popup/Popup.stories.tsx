import type { Meta, StoryObj } from '@storybook/react';

import '@jezvejs/react/style.scss';
import { Popup, PopupProps } from '@jezvejs/react';
import { useState } from 'react';

import { usePortalElement } from '../../common/hooks/usePortalElement.tsx';

import { ActionButton } from '../../common/Components/ActionButton/ActionButton.tsx';
import { OkBtn } from '../../common/Components/ActionButton/OkBtn.tsx';
import { CancelBtn } from '../../common/Components/ActionButton/CancelBtn.tsx';

import './Popup.stories.scss';

export type Story = StoryObj<typeof Popup>;

const meta: Meta<typeof Popup> = {
    title: 'Components/Popup',
    component: Popup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;

const placeholderMsg = 'Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.';

type LaunchPopupState = {
    visible: boolean,
    result: boolean | null,
};

const LaunchPopupForResult = (args: PopupProps) => {
    const portalElement = usePortalElement();
    const [state, setState] = useState<LaunchPopupState>({
        visible: false,
        result: null,
    });

    const showPopup = (visible: boolean) => setState((prev) => ({ ...prev, visible }));
    const setResultAndClose = (result: boolean) => (
        setState((prev) => ({
            ...prev,
            result,
            visible: false,
        }))
    );

    return (
        <>
            <ActionButton title='Show popup' onClick={() => showPopup(true)} />
            {(state.result !== null) && (
                <div>Result: {state.result ? 'ok' : 'cancel'}</div>
            )}
            {state.visible && (
                <Popup
                    {...args}
                    show={true}
                    onClose={() => showPopup(false)}
                    container={portalElement}
                    footer={
                        <>
                            <OkBtn onClick={() => setResultAndClose(true)} />
                            <CancelBtn onClick={() => setResultAndClose(false)} />
                        </>
                    }
                />
            )}
        </>
    );
};

const LaunchPopup = (args: PopupProps) => {
    const portalElement = usePortalElement();
    const [state, setState] = useState({
        visible: false,
    });

    const showPopup = (visible: boolean) => setState((prev) => ({ ...prev, visible }));

    return (
        <>
            <ActionButton title='Show popup' onClick={() => showPopup(true)} />
            {state.visible && (
                <Popup
                    {...args}
                    show={true}
                    onClose={() => showPopup(false)}
                    container={portalElement}
                />
            )}
        </>
    );
};

export const Default: Story = {
    args: {
        title: 'Full width',
        className: 'full-width',
        children: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Control buttons are added and both will close popup.`,
    },
    render: LaunchPopupForResult,
};

export const CloseButton: Story = {
    args: {
        title: 'Close button',
        className: 'full-width',
        closeButton: true,
        children: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Close button is added. Control buttons will not close popup.
                On small screen message will overflow and whole popup should be scrolled

                ${placeholderMsg}${placeholderMsg}`,
    },
    render: LaunchPopupForResult,
};

export const MessageScroll: Story = {
    args: {
        title: 'Fullwidth popup',
        className: 'full-width',
        closeButton: true,
        scrollMessage: true,
        children: `This popup is dynamically created and have content on the center of screen with fullwidth background.
                Close button is added. Control buttons will not close popup.
                On small screen message will overflow and whole popup should be scrolled

                ${placeholderMsg}${placeholderMsg}`,
    },
    render: LaunchPopupForResult,
};

export const CenterOnly: Story = {
    args: {
        title: 'Center',
        className: 'center_only',
        closeButton: true,
        children: 'This popup is dynamically created and have only center background.',
    },
    render: LaunchPopup,
};

export const NoDim: Story = {
    args: {
        title: 'No dimming',
        className: 'center_only border_popup',
        closeButton: true,
        nodim: true,
        children: 'This popup is dynamically created and doesn\'t dim page background.',
    },
    render: LaunchPopup,
};
