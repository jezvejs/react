import type { StoryObj } from '@storybook/react';

import { DropDown } from '@jezvejs/react';

import { AttachedToBlock } from './components/AttachedToBlock/AttachedToBlock.tsx';
import { ToggleEnable } from './components/ToggleEnable/ToggleEnable.tsx';

export type DropDownStory = StoryObj<typeof DropDown>;

export type ToggleEnableDropDownStory = StoryObj<typeof ToggleEnable>;

export type AttachedToBlockStory = StoryObj<typeof AttachedToBlock>;

export type MultipleSelectionTag = {
    id: string;
    title: string;
};

export type MultipleSelectionTagsState = {
    items: MultipleSelectionTag[];
};
