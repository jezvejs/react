# JezveJS React
Components and utilities to organize development of pet project.

This package is adoptation of <a href="https://henryfeesler.com/jezvejs/">JezveJS library</a> for React architecture.

<h2 align="left">Installation and usage</h2>

Install using NPM
```bash
npm install @jezvejs/react
```

Import required component

```js
import { Button } from '@jezvejs/react';
```

Use it in your application:

```jsx
<div>
        <Button icon={PlusIcon} type="link">Click me</Button>
</div>
```

<h2 align="left">Development</h2>
Start local Storybook server:

```bash
npm start
```

<h2 align="left">Run tests</h2>
Run test scenarios with Playwright

```bash
npm test
```

<h3 align="left">Components</h3>

- Button
- Checkbox
- CloseButton
- Collapsible
- DatePicker
- Header
- IndetermProgress
- Offcanvas
- Paginator
- Popup
- Progress
- Radio
- RangeSlider
- Slider
- Sortable
- Spinner
- Switch
- TabList
- Tags

<h3 align="left">Charts</h3>

- Histogram
- LineChart
- PieChart
- RangeScrollChart


<h2 align="left">Hooks</h2>

- useDebounce
- useEmptyClick
- usePopupPosition
- useResizeObserver

<h3 align="left">Input</h3>

- ColorInput
- ControlledInput
- DateInput
- DecimalInput
- Input
- InputGroup

<h3 align="left">Menu</h3>

- DropDown
- Menu
- PopupMenu
- WeekDaySelect


<h2 align="left">Utilities</h2>

- Drag'n'Drop
