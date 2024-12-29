import { forwardRef } from 'react';
import './PopupContainer.scss';

export const PopupContainer = forwardRef((_, ref) => (
    <div ref={ref} className='popup-container'>
        <div className='popup-header'>Popup content</div>
        <div className='popup-list-item'>Item 1</div>
        <div className='popup-list-item'>Item 2</div>
        <div className='popup-list-item'>Item 3</div>
        <div className='popup-list-item'>Item 4</div>
        <div className='popup-list-item'>Item 5</div>
    </div>
));

PopupContainer.displayName = 'PopupContainer';
