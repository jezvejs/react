import type { Meta, StoryObj } from '@storybook/react';

import {
    Button,
    Checkbox,
    CloseButton,
    ColorInput,
    ControlledInput,
    ControlledInputProps,
    DateInput,
    DatePicker,
    DecimalInput,
    DecimalInputProps,
    DropDown,
    Header,
    Histogram,
    IndetermProgress,
    Input,
    InputGroup,
    InputGroupButton,
    InputGroupInnerButton,
    InputGroupInput,
    InputGroupInputProps,
    InputGroupText,
    LineChart,
    Menu,
    Paginator,
    PieChart,
    Progress,
    Radio,
    RangeScrollChart,
    Slider,
    Spinner,
    Switch,
    Tags,
    WeekDaySelect,
} from '@jezvejs/react';
import '@jezvejs/react/style.scss';

// Icons
import SmallCloseIcon from '../../common/assets/icons/close-sm.svg';
import MenuIcon from '../../common/assets/icons/menu.svg';

// Common data
import { initGroupItems } from '../../common/assets/data/dropDownData.ts';
import { chartMultiData, chartShortMultiData } from '../../common/assets/data/index.ts';
import { getDefaultItems } from '../../common/assets/data/menuData.ts';
import { getNestedMenuItems } from '../../common/assets/data/popupMenuData.ts';

// Utils
import { getSliderItems } from '../../common/utils/getSliderItems.tsx';
import { getSortableItems } from '../../common/utils/getSortableItems.tsx';
import { getTabListItems } from '../../common/utils/getTabListItems.tsx';
import { withInputState } from '../../common/utils/withInputState.tsx';

// Common components
import { DragOriginalDemo } from '../../common/Components/DragnDrop/DragOriginalDemo.tsx';
import { LaunchPopup } from '../../common/Components/LaunchPopup/LaunchPopup.tsx';
import { OpenOffcanvas } from '../../common/Components/OpenOffcanvas/OpenOffcanvas.tsx';
import { PopupMenuDemo } from '../../common/Components/PopupMenuDemo/PopupMenuDemo.tsx';
import { ProvidedSortable } from '../../common/Components/ProvidedSortable/ProvidedSortable.tsx';
import { RangeSliderStyled } from '../../common/Components/RangeSliderStyled/RangeSliderStyled.tsx';
import { SortableListItem } from '../../common/Components/SortableListItem/SortableListItem.tsx';
import { TabListStyled } from '../../common/Components/TabListStyled/TabListStyled.tsx';

// Local components
import { CodeBlock } from './components/CodeBlock/CodeBlock.tsx';
import { CollapsibleDemo } from './components/CollapsibleDemo/CollapsibleDemo.tsx';
import { ComponentCard } from './components/ComponentCard/ComponentCard.tsx';
import { ComponentsSection } from './components/ComponentsSection/ComponentsSection.tsx';
import { ComponentsSectionHeader } from './components/ComponentsSectionHeader/ComponentsSectionHeader.tsx';
import { ListContent } from './components/ListContent/ListContent.tsx';
import { LogoHeader } from './components/LogoHeader/LogoHeader.tsx';
import { MainText } from './components/MainText/MainText.tsx';
import './About.stories.scss';

const InputWithState = withInputState(Input);
const DecimalInputWithState = withInputState<DecimalInputProps>(DecimalInput);
const ControlledInputWithState = withInputState<ControlledInputProps>(ControlledInput);
const InputGroupInputWithState = withInputState<InputGroupInputProps>(InputGroupInput);

const AboutComponent = () => (
    <main>
        <LogoHeader />

        <MainText>This package is adoptation of <a href="https://henryfeesler.com/jezvejs/">
            JezveJS library</a> for React architecture.</MainText>

        <h2 className="main-header">Installation and usage</h2>
        <MainText>Install using NPM</MainText>
        <CodeBlock>npm install @jezvejs/react</CodeBlock>
        <MainText>Import required component</MainText>
        <CodeBlock>{'import { Button } from \'@jezvejs/react\';'}</CodeBlock>
        <MainText>Use it in your application.</MainText>
        <CodeBlock>{
            `<div>
    <Button icon={PlusIcon} type="link" url="#">Click me</Button>
</div>`
        }</CodeBlock>

        <h2 className="main-header">Components</h2>
        <ComponentsSection>
            <ComponentsSectionHeader>Common</ComponentsSectionHeader>

            <ComponentCard
                title="Button"
                url="./?path=/docs/components-button--docs"
                description="Common button and link component. Supports additional icon."
            >
                <Button className="primary-btn">Click me</Button>
            </ComponentCard>

            <ComponentCard
                title="Checkbox"
                url="./?path=/docs/components-checkbox--docs"
                description="Form checkbox component."
            >
                <Checkbox className="demo-checkbox" value="" label="Option 1" />
            </ComponentCard>

            <ComponentCard
                title="CloseButton"
                url="./?path=/docs/components-closebutton--docs"
                description="Button with predefined close icon."
            >
                <CloseButton />
                <CloseButton small={false} />
            </ComponentCard>

            <ComponentCard
                title="Collapsible"
                url="./?path=/docs/components-collapsible--docs"
                description="Component able to collapse/expand content."
            >
                <CollapsibleDemo />
            </ComponentCard>

            <ComponentCard
                title="DatePicker"
                url="./?path=/docs/components-datepicker--docs"
                description="Renders calendar to view and select single, multiple or range of dates."
            >
                <DatePicker inline fixedHeight animated />
            </ComponentCard>

            <ComponentCard
                title="Header"
                url="./?path=/docs/components-header--docs"
                description="Main page header component."
            >
                <Header className="full-width">
                    <Button
                        className="header-menu-btn"
                        icon={MenuIcon}
                    />
                    <Button
                        className="nav-header__logo"
                        type="link"
                        url="#"
                        title="Header component"
                    />
                </Header>
            </ComponentCard>

            <ComponentCard
                title="IndetermProgress"
                url="./?path=/docs/components-indetermprogress--docs"
                description="Renders infinite sliding dots animation."
            >
                <IndetermProgress />
            </ComponentCard>

            <ComponentCard
                title="Offcanvas"
                url="./?path=/docs/components-offcanvas--docs"
                description="Top level container attached to the edge of screen."
            >
                <OpenOffcanvas>
                    <ListContent itemsCount={5} prefix="offcvn" />
                </OpenOffcanvas>
            </ComponentCard>

            <ComponentCard
                title="Paginator"
                url="./?path=/docs/components-paginator--docs"
                description="Pages navigation component."
            >
                <Paginator className="styled" pagesCount={10} onChange={() => { }} />
            </ComponentCard>

            <ComponentCard
                title="Popup"
                url="./?path=/docs/components-popup--docs"
                description="Top level centered container."
            >
                <LaunchPopup
                    className="center_only"
                    title="Popup"
                    closeButton
                >
                    This popup is dynamically created and have only center background.
                </LaunchPopup>
            </ComponentCard>

            <ComponentCard
                title="Progress"
                url="./?path=/docs/components-progress--docs"
                description="Completed portion in relation to total volume"
                vertical
            >
                <Progress className="w-500 green-progress thin-progress" value={25} />
                <Progress className="w-500 border-progress" value={75} />
            </ComponentCard>

            <ComponentCard
                title="Radio"
                url="./?path=/docs/components-radio--docs"
                description="Form checkbox component."
                vertical
            >
                <Radio label="Radio 1" name="radio1" value="1" />
                <Radio label="Radio 2" name="radio1" value="2" />
            </ComponentCard>

            <ComponentCard
                title="RangeSlider"
                url="./?path=/docs/components-rangeslider--docs"
                description="Range value input component."
            >
                <RangeSliderStyled start={30} end={70} range />
            </ComponentCard>

            <ComponentCard
                title="Slider"
                url="./?path=/docs/components-slider--docs"
            >
                <Slider
                    width={300}
                    allowMouse
                    items={getSliderItems()}
                />
            </ComponentCard>

            <ComponentCard
                title="Sortable"
                url="./?path=/docs/components-sortable--docs"
            >
                <ProvidedSortable
                    id="list"
                    items={getSortableItems()}
                    className="list-area"
                    selector=".sortable-list-item"
                    placeholderClass="sortable-list-item__placeholder"
                    group="list"
                    animated
                    copyWidth
                    components={{
                        ListItem: SortableListItem,
                    }}
                />
            </ComponentCard>

            <ComponentCard
                title="Spinner"
                url="./?path=/docs/components-spinner--docs"
            >
                <Spinner />
            </ComponentCard>

            <ComponentCard
                title="Switch"
                url="./?path=/docs/components-spinner--docs"
            >
                <Switch label="Switch" />
            </ComponentCard>

            <ComponentCard
                title="TabList"
                url="./?path=/docs/components-tablist--docs"
            >
                <TabListStyled
                    items={getTabListItems(true)}
                />
            </ComponentCard>

            <ComponentCard
                title="Tags"
                url="./?path=/docs/components-tags--docs"
            >
                <Tags
                    items={[
                        { id: '1', title: 'Item 1' },
                        { id: '2', title: 'Item 2' },
                        { id: '3', title: 'Item 3' },
                    ]}
                />
            </ComponentCard>
        </ComponentsSection>

        <ComponentsSection>
            <ComponentsSectionHeader>Inputs</ComponentsSectionHeader>

            <ComponentCard
                title="ColorInput"
                url="./?path=/docs/input-colorinput--docs"
                description="Color select component."
            >
                <ColorInput />
            </ComponentCard>

            <ComponentCard
                title="ControlledInput"
                url="./?path=/docs/input-controlledinput--docs"
                description="Input component with value change validation"
            >
                <ControlledInputWithState
                    placeholder="Accept digits only"
                    isValidValue={(value: string) => (/^\d*$/.test(value))}
                />
            </ComponentCard>

            <ComponentCard
                title="DateInput"
                url="./?path=/docs/input-dateinput--docs"
                description="Date specific ControlledInput"
            >
                <DateInput />
            </ComponentCard>

            <ComponentCard
                title="DecimalInput"
                url="./?path=/docs/input-dateinput--docs"
                description="Number specific ControlledInput"
            >
                <DecimalInputWithState placeholder="0.1234567" />
            </ComponentCard>

            <ComponentCard
                title="Input"
                url="./?path=/docs/input-input--docs"
                description="Simple input"
            >
                <InputWithState />
            </ComponentCard>

            <ComponentCard
                title="InputGroup"
                url="./?path=/docs/input-inputgroup--docs"
                description="Input groupped with text, buttons and other components"
            >
                <InputGroup className="input-group__input-outer">
                    <InputGroupButton title="€" />
                    <InputGroupInputWithState
                        className="amount-input"
                        placeholder="0"
                    />
                    <InputGroupInnerButton icon={SmallCloseIcon} />
                    <InputGroupText title=".00" />
                </InputGroup>
            </ComponentCard>
        </ComponentsSection>

        <ComponentsSection>
            <ComponentsSectionHeader>Menus</ComponentsSectionHeader>

            <ComponentCard
                title="DropDown"
                url="./?path=/docs/menu-dropdown--docs"
                description="Combo box with popup menu to select single or multiple items from list"
            >
                <div>
                    <DropDown
                        enableFilter
                        openOnFocus
                        multiple
                        fixedMenu
                        placeholder="Type to filter"
                        items={initGroupItems()}
                    />
                </div>
            </ComponentCard>

            <ComponentCard
                title="Menu"
                url="./?path=/docs/menu-menu--docs"
                description="List of selectable action items"
            >
                <Menu
                    preventNavigation
                    multiple
                    items={getDefaultItems()}
                />
            </ComponentCard>

            <ComponentCard
                title="PopupMenu"
                url="./?path=/docs/menu-popupmenu--docs"
                description="Attachable floating menu"
            >
                <PopupMenuDemo
                    multiple
                    hideOnScroll={false}
                    position={{
                        position: 'right-start',
                        margin: 2,
                    }}
                    items={getNestedMenuItems()}
                />
            </ComponentCard>

            <ComponentCard
                title="WeekDaySelect"
                url="./?path=/docs/menu-weekdayselect--docs"
                description="Day of week select menu"
            >
                <WeekDaySelect multiple />
            </ComponentCard>
        </ComponentsSection>

        <ComponentsSection>
            <ComponentsSectionHeader>Charts</ComponentsSectionHeader>

            <ComponentCard
                title="Histogram"
                url="./?path=/docs/charts-histogram--docs"
                description="Columns chart"
            >
                <div className="chart-container">
                    <Histogram
                        data={chartShortMultiData}
                        maxColumnWidth={40}
                        fitToWidth
                        xAxisGrid
                        activateOnClick
                        activateOnHover
                        alignColumns="center"
                    />
                </div>
            </ComponentCard>

            <ComponentCard
                title="LineChart"
                url="./?path=/docs/charts-linechart--docs"
                description="Polygonal chain"
            >
                <div className="chart-container">
                    <LineChart
                        data={chartShortMultiData}
                        maxColumnWidth={40}
                        fitToWidth
                        xAxisGrid
                        activateOnClick
                        activateOnHover
                        alignColumns="center"
                    />
                </div>
            </ComponentCard>

            <ComponentCard
                title="PieChart"
                url="./?path=/docs/charts-piechart--docs"
                description="Сircular statistical graphic for proportions illustration"
            >
                <PieChart
                    className="middle_pie"
                    radius={80}
                    offset={10}
                    data={[
                        {
                            id: 1,
                            value: 10,
                            title: 'First category',
                            offset: 10,
                        },
                        { id: 2, value: 10, title: 'Second category' },
                        { id: 3, value: 10, title: 'Third category' },
                        { id: 4, value: 20, title: 'Fourth category' },
                    ]}
                />
            </ComponentCard>

            <ComponentCard
                className="range-chart-card"
                title="RangeScrollChart"
                url="./?path=/docs/charts-rangescrollchart--docs"
                description="Horizontal chart with range slider scrollbar"
            >
                <div className="chart-container">
                    <RangeScrollChart
                        type="histogram"
                        mainChart={{
                            data: chartMultiData,
                            maxColumnWidth: 40,
                        }}
                        navigationChart={{
                            showLegend: true,
                        }}
                    />
                </div>
            </ComponentCard>
        </ComponentsSection>

        <ComponentsSection>
            <ComponentsSectionHeader>Utils</ComponentsSectionHeader>

            <ComponentCard
                title="Drag'n'Drop"
                url="./?path=/docs/utils-drag-n-drop--docs"
            >
                <DragOriginalDemo />
            </ComponentCard>
        </ComponentsSection>
    </main>
);

type Story = StoryObj<typeof AboutComponent>;

const meta: Meta<typeof AboutComponent> = {
    title: 'About',
    component: AboutComponent,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['!autodocs'],
};
export default meta;

export const About: Story = {
    args: {
    },
};
