import baseTest from 'fixtures/test.ts';
import { DecimalInputPage } from 'pages/DecimalInput/DecimalInputPage.ts';

export interface DecimalInputPageFixture {
    decimalInputPage: DecimalInputPage;
}

const test = baseTest.extend<DecimalInputPageFixture>({
    decimalInputPage: async ({ page }, use) => {
        const decimalInputPage = new DecimalInputPage(page);
        await use(decimalInputPage);
    },
});

test.describe('DecimalInput', () => {
    test('Type to empty input', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.inputToEmpty('defaultInput', '1', '1');
        await decimalInputPage.inputToEmpty('defaultInput', '1.', '1.');
        await decimalInputPage.inputToEmpty('defaultInput', '1.0', '1.0');
        await decimalInputPage.inputToEmpty('defaultInput', '1.01', '1.01');
        await decimalInputPage.inputToEmpty('defaultInput', '1.012', '1.012');
        await decimalInputPage.inputToEmpty('defaultInput', '1.0123', '1.0123');
        await decimalInputPage.inputToEmpty('defaultInput', '1.01234', '1.01234');
        await decimalInputPage.inputToEmpty('defaultInput', '-', '-');
        await decimalInputPage.inputToEmpty('defaultInput', '-.', '-.');
        await decimalInputPage.inputToEmpty('defaultInput', '-.0', '-.0');
        await decimalInputPage.inputToEmpty('defaultInput', '-.01', '-.01');
        await decimalInputPage.inputToEmpty('defaultInput', '-0', '-0');
        await decimalInputPage.inputToEmpty('defaultInput', '-0.', '-0.');
        await decimalInputPage.inputToEmpty('defaultInput', '-0.0', '-0.0');
        await decimalInputPage.inputToEmpty('defaultInput', '-0.01', '-0.01');
        await decimalInputPage.inputToEmpty('defaultInput', '-0.012', '-0.012');
        await decimalInputPage.inputToEmpty('defaultInput', '0', '0');
        await decimalInputPage.inputToEmpty('defaultInput', '00', '0');
        await decimalInputPage.inputToEmpty('defaultInput', '01', '01');
        await decimalInputPage.inputToEmpty('defaultInput', '0.', '0.');
        await decimalInputPage.inputToEmpty('defaultInput', '0.0', '0.0');
        await decimalInputPage.inputToEmpty('defaultInput', '0.01', '0.01');
        await decimalInputPage.inputToEmpty('defaultInput', '0.012', '0.012');
        await decimalInputPage.inputToEmpty('defaultInput', '.', '.');
        await decimalInputPage.inputToEmpty('defaultInput', '.0', '.0');
        await decimalInputPage.inputToEmpty('defaultInput', '.01', '.01');
        await decimalInputPage.inputToEmpty('defaultInput', '.012', '.012');

        await decimalInputPage.loadMinMax();

        await decimalInputPage.inputToEmpty('minMaxDecInput', '1', '1');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '10', '10');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '10.', '10.');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '10.0', '10.0');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '100', '10');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '-1', '-1');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '-10', '-10');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '-10.', '-10.');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '-10.0', '-10.0');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '-100', '-10');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.inputToEmpty('digitsLimitInput', '1.012', '1.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '1.0123', '1.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '1.01234', '1.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '123.01234', '123.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '.01234', '.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '-.01234', '-.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '-0.01234', '-0.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '-1.01234', '-1.012');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '-123.01234', '-123.012');

        await decimalInputPage.loadInteger();

        await decimalInputPage.inputToEmpty('integerInput', '0', '0');
        await decimalInputPage.inputToEmpty('integerInput', '00', '0');
        await decimalInputPage.inputToEmpty('integerInput', '0.', '0');
        await decimalInputPage.inputToEmpty('integerInput', '0.1', '01');
        await decimalInputPage.inputToEmpty('integerInput', '01', '01');
        await decimalInputPage.inputToEmpty('integerInput', '01.', '01');
        await decimalInputPage.inputToEmpty('integerInput', '01.2', '012');
        await decimalInputPage.inputToEmpty('integerInput', '1', '1');
        await decimalInputPage.inputToEmpty('integerInput', '1.', '1');
        await decimalInputPage.inputToEmpty('integerInput', '1.2', '12');
        await decimalInputPage.inputToEmpty('integerInput', '-', '-');
        await decimalInputPage.inputToEmpty('integerInput', '-.', '-');
        await decimalInputPage.inputToEmpty('integerInput', '-0.', '-0');
        await decimalInputPage.inputToEmpty('integerInput', '-0.1', '-01');
        await decimalInputPage.inputToEmpty('integerInput', '-01', '-01');
        await decimalInputPage.inputToEmpty('integerInput', '-01.', '-01');
        await decimalInputPage.inputToEmpty('integerInput', '-01.2', '-012');

        await decimalInputPage.loadPositive();

        await decimalInputPage.inputToEmpty('positiveInput', '.', '.');
        await decimalInputPage.inputToEmpty('positiveInput', '0', '0');
        await decimalInputPage.inputToEmpty('positiveInput', '1', '1');
        await decimalInputPage.inputToEmpty('positiveInput', '01', '01');
        await decimalInputPage.inputToEmpty('positiveInput', '001', '01');
        await decimalInputPage.inputToEmpty('positiveInput', '-', '');
        await decimalInputPage.inputToEmpty('positiveInput', '-1', '1');
        await decimalInputPage.inputToEmpty('positiveInput', '-0', '0');
        await decimalInputPage.inputToEmpty('positiveInput', '-00', '0');
        await decimalInputPage.inputToEmpty('positiveInput', '-.', '.');
        await decimalInputPage.inputToEmpty('positiveInput', '-.0', '.0');
        await decimalInputPage.inputToEmpty('positiveInput', '-0.01', '0.01');
        await decimalInputPage.inputToEmpty('positiveInput', '-00.01', '0.01');

        await decimalInputPage.loadLeadZeros();

        await decimalInputPage.inputToEmpty('leadZerosInput', '001', '001');
        await decimalInputPage.inputToEmpty('leadZerosInput', '00.1', '00.1');
        await decimalInputPage.inputToEmpty('leadZerosInput', '-001', '-001');
        await decimalInputPage.inputToEmpty('leadZerosInput', '-00.1', '-00.1');
    });

    test('Type invalid values for current part of date', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.inputToEmpty('defaultInput', 'x', '');
        await decimalInputPage.inputToEmpty('defaultInput', '1x', '1');
        await decimalInputPage.inputToEmpty('defaultInput', '1.x', '1.');
        await decimalInputPage.inputToEmpty('defaultInput', '1.0x', '1.0');
        await decimalInputPage.inputToEmpty('defaultInput', '1.01x', '1.01');
        await decimalInputPage.inputToEmpty('defaultInput', '1-', '1');
        await decimalInputPage.inputToEmpty('defaultInput', '--', '-');
        await decimalInputPage.inputToEmpty('defaultInput', '1.2.', '1.2');
        await decimalInputPage.inputToEmpty('defaultInput', '1..2', '1.2');
        await decimalInputPage.inputToEmpty('defaultInput', '1.2.3', '1.23');
        await decimalInputPage.inputToEmpty('defaultInput', '..2', '.2');
        await decimalInputPage.inputToEmpty('defaultInput', '-x', '-');
        await decimalInputPage.inputToEmpty('defaultInput', '-.x', '-.');
        await decimalInputPage.inputToEmpty('defaultInput', '-.0x', '-.0');
        await decimalInputPage.inputToEmpty('defaultInput', '-0.x', '-0.');
        await decimalInputPage.inputToEmpty('defaultInput', '-0.0x', '-0.0');
        await decimalInputPage.inputToEmpty('defaultInput', '-0.01x', '-0.01');
        await decimalInputPage.inputToEmpty('defaultInput', '0x', '0');
        await decimalInputPage.inputToEmpty('defaultInput', '0.x', '0.');
        await decimalInputPage.inputToEmpty('defaultInput', '0.0x', '0.0');
        await decimalInputPage.inputToEmpty('defaultInput', '0.01x', '0.01');

        await decimalInputPage.loadMinMax();

        await decimalInputPage.inputToEmpty('minMaxDecInput', 'x', '');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '1x', '1');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '1.x', '1.');
        await decimalInputPage.inputToEmpty('minMaxDecInput', '10x', '10');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.inputToEmpty('digitsLimitInput', 'x', '');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '1x', '1');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '1.x', '1.');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '1.01x', '1.01');
        await decimalInputPage.inputToEmpty('digitsLimitInput', '1.012x', '1.012');

        await decimalInputPage.loadInteger();

        await decimalInputPage.inputToEmpty('integerInput', 'x', '');
        await decimalInputPage.inputToEmpty('integerInput', '1x', '1');
        await decimalInputPage.inputToEmpty('integerInput', '1.x', '1');
        await decimalInputPage.inputToEmpty('integerInput', '1.0x', '10');

        await decimalInputPage.loadPositive();

        await decimalInputPage.inputToEmpty('positiveInput', '0x', '0');
        await decimalInputPage.inputToEmpty('positiveInput', '0.x', '0.');
        await decimalInputPage.inputToEmpty('positiveInput', '0.0x', '0.0');
        await decimalInputPage.inputToEmpty('positiveInput', '0.01x', '0.01');
        await decimalInputPage.inputToEmpty('positiveInput', '1x', '1');
        await decimalInputPage.inputToEmpty('positiveInput', '01x', '01');
        await decimalInputPage.inputToEmpty('positiveInput', '.x', '.');
        await decimalInputPage.inputToEmpty('positiveInput', '-x', '');
        await decimalInputPage.inputToEmpty('positiveInput', '-.x', '.');
        await decimalInputPage.inputToEmpty('positiveInput', '-.0x', '.0');
        await decimalInputPage.inputToEmpty('positiveInput', '-.01x', '.01');
        await decimalInputPage.inputToEmpty('positiveInput', '-0x', '0');
        await decimalInputPage.inputToEmpty('positiveInput', '-0.x', '0.');
        await decimalInputPage.inputToEmpty('positiveInput', '-0.0x', '0.0');
        await decimalInputPage.inputToEmpty('positiveInput', '-0.01x', '0.01');

        await decimalInputPage.loadLeadZeros();

        await decimalInputPage.inputToEmpty('leadZerosInput', '00x', '00');
        await decimalInputPage.inputToEmpty('leadZerosInput', '001x', '001');
        await decimalInputPage.inputToEmpty('leadZerosInput', '-00x', '-00');
        await decimalInputPage.inputToEmpty('leadZerosInput', '-001x', '-001');
        await decimalInputPage.inputToEmpty('leadZerosInput', '00.x', '00.');
        await decimalInputPage.inputToEmpty('leadZerosInput', '00.1x', '00.1');
        await decimalInputPage.inputToEmpty('leadZerosInput', '-00.x', '-00.');
        await decimalInputPage.inputToEmpty('leadZerosInput', '-00.1x', '-00.1');
    });

    test('Paste text to empty input', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.pasteToEmpty('defaultInput', '1', '1');
        await decimalInputPage.pasteToEmpty('defaultInput', '1.', '1.');
        await decimalInputPage.pasteToEmpty('defaultInput', '1.0', '1.0');
        await decimalInputPage.pasteToEmpty('defaultInput', '1.01', '1.01');
        await decimalInputPage.pasteToEmpty('defaultInput', '1.012', '1.012');
        await decimalInputPage.pasteToEmpty('defaultInput', '1.0123', '1.0123');
        await decimalInputPage.pasteToEmpty('defaultInput', '1.01234', '1.01234');
        await decimalInputPage.pasteToEmpty('defaultInput', '-', '-');
        await decimalInputPage.pasteToEmpty('defaultInput', '-.', '-.');
        await decimalInputPage.pasteToEmpty('defaultInput', '-.0', '-.0');
        await decimalInputPage.pasteToEmpty('defaultInput', '-.01', '-.01');
        await decimalInputPage.pasteToEmpty('defaultInput', '-0', '-0');
        await decimalInputPage.pasteToEmpty('defaultInput', '-0.', '-0.');
        await decimalInputPage.pasteToEmpty('defaultInput', '-0.0', '-0.0');
        await decimalInputPage.pasteToEmpty('defaultInput', '-0.01', '-0.01');
        await decimalInputPage.pasteToEmpty('defaultInput', '-0.012', '-0.012');
        await decimalInputPage.pasteToEmpty('defaultInput', '0', '0');
        await decimalInputPage.pasteToEmpty('defaultInput', '01', '01');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.', '0.');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.0', '0.0');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.01', '0.01');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.012', '0.012');
        await decimalInputPage.pasteToEmpty('defaultInput', '.', '.');
        await decimalInputPage.pasteToEmpty('defaultInput', '.0', '.0');
        await decimalInputPage.pasteToEmpty('defaultInput', '.01', '.01');
        await decimalInputPage.pasteToEmpty('defaultInput', '.012', '.012');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.pasteToEmpty('digitsLimitInput', '10', '10');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '-10', '-10');

        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1.', '1.');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1.01', '1.01');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1.012', '1.012');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1234.012', '1234.012');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '-.', '-.');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '-.1', '-.1');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '-.12', '-.12');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '-.123', '-.123');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '-0.123', '-0.123');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '-1234.123', '-1234.123');

        await decimalInputPage.loadLeadZeros();

        await decimalInputPage.pasteToEmpty('leadZerosInput', '000', '000');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '001', '001');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '00.1', '00.1');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '-000', '-000');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '-0001', '-0001');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '-00.01', '-00.01');
    });

    test('Paste invalid text to empty input', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.pasteToEmpty('defaultInput', 'x', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '00', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '0x', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.x', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.0x', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.01x', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '--', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '--1', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '0.1.2', '');
        await decimalInputPage.pasteToEmpty('defaultInput', '0..1', '');

        await decimalInputPage.loadMinMax();

        await decimalInputPage.pasteToEmpty('minMaxDecInput', 'x', '');
        await decimalInputPage.pasteToEmpty('minMaxDecInput', '10x', '');
        await decimalInputPage.pasteToEmpty('minMaxDecInput', '100', '');
        await decimalInputPage.pasteToEmpty('minMaxDecInput', '-100', '');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.pasteToEmpty('digitsLimitInput', 'x', '');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1x', '');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1.x', '');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1.01x', '');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1.012x', '');
        await decimalInputPage.pasteToEmpty('digitsLimitInput', '1.0123', '');

        await decimalInputPage.loadInteger();

        await decimalInputPage.pasteToEmpty('integerInput', 'x', '');
        await decimalInputPage.pasteToEmpty('integerInput', '1x', '');
        await decimalInputPage.pasteToEmpty('integerInput', '1.x', '');
        await decimalInputPage.pasteToEmpty('integerInput', '1.0x', '');
        await decimalInputPage.pasteToEmpty('integerInput', '1.0', '');
        await decimalInputPage.pasteToEmpty('integerInput', '.', '');
        await decimalInputPage.pasteToEmpty('integerInput', '-.', '');
        await decimalInputPage.pasteToEmpty('integerInput', '-1.', '');
        await decimalInputPage.pasteToEmpty('integerInput', '-1.0', '');

        await decimalInputPage.loadPositive();

        await decimalInputPage.pasteToEmpty('positiveInput', 'x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '0x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '0.x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '01x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '1x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '1.x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '1.0x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '-x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '-0x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '-01x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '-1x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '-1.x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '-1.0x', '');
        await decimalInputPage.pasteToEmpty('positiveInput', '-1.0x', '');

        await decimalInputPage.loadLeadZeros();

        await decimalInputPage.pasteToEmpty('leadZerosInput', 'x', '');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '0x', '');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '01x', '');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '001x', '');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '-001x', '');
        await decimalInputPage.pasteToEmpty('leadZerosInput', '-00.1x', '');
    });

    test('Backspace key', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.backspaceFromPos('defaultInput', '1234.56789012', 13, '1234.5678901');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.5678901', 12, '1234.567890');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.567890', 11, '1234.56789');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.56789', 10, '1234.5678');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.5678', 9, '1234.567');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.567', 8, '1234.56');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.56', 7, '1234.5');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.5', 6, '1234.');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.', 5, '1234');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234', 4, '123');
        await decimalInputPage.backspaceFromPos('defaultInput', '123', 3, '12');
        await decimalInputPage.backspaceFromPos('defaultInput', '12', 2, '1');
        await decimalInputPage.backspaceFromPos('defaultInput', '1', 1, '');
        await decimalInputPage.backspaceFromPos('defaultInput', '', 0, '');

        await decimalInputPage.backspaceFromPos('defaultInput', '1234.567890', 8, '1234.56890');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.56890', 7, '1234.5890');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.5890', 6, '1234.890');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234.890', 5, '1234890');
        await decimalInputPage.backspaceFromPos('defaultInput', '1234890', 4, '123890');
    });

    test('Delete key', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.deleteFromPos('defaultInput', '12.3456789', 0, '2.3456789');
        await decimalInputPage.deleteFromPos('defaultInput', '2.3456789', 0, '.3456789');
        await decimalInputPage.deleteFromPos('defaultInput', '.3456789', 0, '3456789');
        await decimalInputPage.deleteFromPos('defaultInput', '-0.3456789', 0, '0.3456789');
        await decimalInputPage.deleteFromPos('defaultInput', '-.3456789', 0, '.3456789');

        await decimalInputPage.deleteFromPos('defaultInput', '12.3456789', 2, '123456789');
        await decimalInputPage.deleteFromPos('defaultInput', '12.3456789', 3, '12.456789');
        await decimalInputPage.deleteFromPos('defaultInput', '-12.3456789', 1, '-2.3456789');
    });

    test('Input text inside value', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.inputFromPos('defaultInput', '1234', 2, '.', '12.34');
        await decimalInputPage.inputFromPos('defaultInput', '1234', 2, '0', '12034');
        await decimalInputPage.inputFromPos('defaultInput', '0.1234', 2, '0', '0.01234');
        await decimalInputPage.inputFromPos('defaultInput', '.1234', 0, '0', '0.1234');
        await decimalInputPage.inputFromPos('defaultInput', '-1234', 3, '.', '-12.34');
        await decimalInputPage.inputFromPos('defaultInput', '-1234', 3, '0', '-12034');
        await decimalInputPage.inputFromPos('defaultInput', '-0.1234', 3, '0', '-0.01234');
        await decimalInputPage.inputFromPos('defaultInput', '-.1234', 1, '0', '-0.1234');
        await decimalInputPage.inputFromPos('defaultInput', '-.1234', 1, '1', '-1.1234');
        await decimalInputPage.inputFromPos('defaultInput', '-.1234', 6, '5', '-.12345');

        await decimalInputPage.loadLeadZeros();

        await decimalInputPage.inputFromPos('leadZerosInput', '1234', 0, '0', '01234');
        await decimalInputPage.inputFromPos('leadZerosInput', '01234', 0, '0', '001234');
        await decimalInputPage.inputFromPos('leadZerosInput', '.1234', 0, '0', '0.1234');
        await decimalInputPage.inputFromPos('leadZerosInput', '0.1234', 0, '0', '00.1234');
        await decimalInputPage.inputFromPos('leadZerosInput', '-.1234', 1, '0', '-0.1234');
        await decimalInputPage.inputFromPos('leadZerosInput', '-0.1234', 1, '0', '-00.1234');
    });

    test('Input invalid text inside value', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.inputFromPos('defaultInput', '1234', 0, 'x', '1234');
        await decimalInputPage.inputFromPos('defaultInput', '1234', 2, 'x', '1234');
        await decimalInputPage.inputFromPos('defaultInput', '1234', 4, 'x', '1234');
        await decimalInputPage.inputFromPos('defaultInput', '1234', 2, '-', '1234');
        await decimalInputPage.inputFromPos('defaultInput', '-1234', 1, '-', '-1234');
        await decimalInputPage.inputFromPos('defaultInput', '-1234', 5, '-', '-1234');
        await decimalInputPage.inputFromPos('defaultInput', '-1.234', 0, '-.', '-1.234');
        await decimalInputPage.inputFromPos('defaultInput', '1.234', 2, '.', '1.234');
        await decimalInputPage.inputFromPos('defaultInput', '1.234', 3, '.', '1.234');
        await decimalInputPage.inputFromPos('defaultInput', '1.234', 3, '.', '1.234');
        await decimalInputPage.inputFromPos('defaultInput', '-1.234', 0, '.', '-1.234');
        await decimalInputPage.inputFromPos('defaultInput', '-1.234', 1, '.', '-1.234');
        await decimalInputPage.inputFromPos('defaultInput', '-1.234', 2, '.', '-1.234');
        await decimalInputPage.inputFromPos('defaultInput', '-1.234', 3, '.', '-1.234');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.inputFromPos('digitsLimitInput', '123456', 0, '.', '123456');
        await decimalInputPage.inputFromPos('digitsLimitInput', '123456', 2, '.', '123456');
        await decimalInputPage.inputFromPos('digitsLimitInput', '123456', 6, 'x', '123456');
        await decimalInputPage.inputFromPos('digitsLimitInput', '-123456', 0, '.', '-123456');
        await decimalInputPage.inputFromPos('digitsLimitInput', '-123456', 1, '.', '-123456');
        await decimalInputPage.inputFromPos('digitsLimitInput', '-123456', 3, '.', '-123456');
        await decimalInputPage.inputFromPos('digitsLimitInput', '-123456', 7, 'x', '-123456');
        await decimalInputPage.inputFromPos('digitsLimitInput', '1.234', 0, 'x', '1.234');
        await decimalInputPage.inputFromPos('digitsLimitInput', '1.234', 1, 'x', '1.234');
        await decimalInputPage.inputFromPos('digitsLimitInput', '1.234', 5, 'x', '1.234');
        await decimalInputPage.inputFromPos('digitsLimitInput', '1.234', 5, '1', '1.234');
        await decimalInputPage.inputFromPos('digitsLimitInput', '1.234', 5, '0', '1.234');
        await decimalInputPage.inputFromPos('digitsLimitInput', '1.234', 5, '.', '1.234');
        await decimalInputPage.inputFromPos('digitsLimitInput', '.012', 4, '3', '.012');
        await decimalInputPage.inputFromPos('digitsLimitInput', '0.012', 5, '3', '0.012');
        await decimalInputPage.inputFromPos('digitsLimitInput', '-0.012', 6, '3', '-0.012');
        await decimalInputPage.inputFromPos('digitsLimitInput', '-.012', 5, '3', '-.012');

        await decimalInputPage.loadInteger();

        await decimalInputPage.inputFromPos('integerInput', '123456', 0, '.', '123456');
        await decimalInputPage.inputFromPos('integerInput', '123456', 1, '.', '123456');
        await decimalInputPage.inputFromPos('integerInput', '123456', 4, '.', '123456');
        await decimalInputPage.inputFromPos('integerInput', '-123456', 0, '.', '-123456');
        await decimalInputPage.inputFromPos('integerInput', '-123456', 1, '.', '-123456');
        await decimalInputPage.inputFromPos('integerInput', '-123456', 4, '.', '-123456');
        await decimalInputPage.inputFromPos('integerInput', '123456', 0, 'x', '123456');
        await decimalInputPage.inputFromPos('integerInput', '123456', 2, 'x', '123456');
        await decimalInputPage.inputFromPos('integerInput', '123456', 6, 'x', '123456');
        await decimalInputPage.inputFromPos('integerInput', '-123456', 0, 'x', '-123456');
        await decimalInputPage.inputFromPos('integerInput', '-123456', 1, 'x', '-123456');
        await decimalInputPage.inputFromPos('integerInput', '-123456', 4, 'x', '-123456');
        await decimalInputPage.inputFromPos('integerInput', '-123456', 7, 'x', '-123456');

        await decimalInputPage.loadPositive();

        await decimalInputPage.inputFromPos('positiveInput', '123456', 0, '-', '123456');
        await decimalInputPage.inputFromPos('positiveInput', '.123456', 0, '-', '.123456');
        await decimalInputPage.inputFromPos('positiveInput', '0.123456', 0, '-', '0.123456');
        await decimalInputPage.inputFromPos('positiveInput', '12.123456', 0, '-', '12.123456');
        await decimalInputPage.inputFromPos('positiveInput', '123456', 0, 'x', '123456');
        await decimalInputPage.inputFromPos('positiveInput', '123456', 2, 'x', '123456');
        await decimalInputPage.inputFromPos('positiveInput', '123456', 6, 'x', '123456');
        await decimalInputPage.inputFromPos('positiveInput', '.123456', 7, 'x', '.123456');
        await decimalInputPage.inputFromPos('positiveInput', '.123456', 0, 'x', '.123456');
        await decimalInputPage.inputFromPos('positiveInput', '0.123456', 0, 'x', '0.123456');
    });

    test('Input text into selection', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.inputToSelection('defaultInput', '123456', 2, 4, '.', '12.56');
        await decimalInputPage.inputToSelection('defaultInput', '123456', 0, 6, '-', '-');
        await decimalInputPage.inputToSelection('defaultInput', '123456', 0, 3, '0', '0456');
        await decimalInputPage.inputToSelection('defaultInput', '123456', 0, 3, '-', '-456');
    });

    test('Input invalid text into selection', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.inputToSelection('defaultInput', '123456', 2, 4, 'x', '123456');
        await decimalInputPage.inputToSelection('defaultInput', '12.3456', 3, 4, '.', '12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '12.3456', 0, 2, '.', '12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '12.3456', 0, 2, 'x', '12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '12.3456', 5, 7, 'x', '12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '12.3456', 5, 7, '-', '12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '12.3456', 5, 7, '.', '12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '12.3456', 5, 7, ' ', '12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '-12.3456', 1, 2, '-', '-12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '-12.3456', 1, 2, '.', '-12.3456');
        await decimalInputPage.inputToSelection('defaultInput', '0.3456', 1, 3, '0', '0.3456');
        await decimalInputPage.inputToSelection('defaultInput', '0.3456', 1, 3, 'x', '0.3456');
        await decimalInputPage.inputToSelection('defaultInput', '-0.3456', 1, 4, '-', '-0.3456');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.inputToSelection('digitsLimitInput', '123456', 0, 2, 'x', '123456');
        await decimalInputPage.inputToSelection('digitsLimitInput', '123456', 4, 6, 'x', '123456');
        await decimalInputPage.inputToSelection('digitsLimitInput', '123456', 0, 2, '.', '123456');
        await decimalInputPage.inputToSelection('digitsLimitInput', '123456', 1, 2, '.', '123456');
        await decimalInputPage.inputToSelection('digitsLimitInput', '12340.123', 2, 4, '.', '12340.123');
        await decimalInputPage.inputToSelection('digitsLimitInput', '-123456', 2, 3, '.', '-123456');

        await decimalInputPage.loadInteger();

        await decimalInputPage.inputToSelection('integerInput', '123456', 0, 3, 'x', '123456');
        await decimalInputPage.inputToSelection('integerInput', '123456', 2, 4, 'x', '123456');
        await decimalInputPage.inputToSelection('integerInput', '123456', 4, 6, 'x', '123456');
        await decimalInputPage.inputToSelection('integerInput', '123456', 0, 3, '.', '123456');
        await decimalInputPage.inputToSelection('integerInput', '123456', 2, 4, '.', '123456');
        await decimalInputPage.inputToSelection('integerInput', '123456', 4, 6, '.', '123456');
        await decimalInputPage.inputToSelection('integerInput', '-123456', 0, 3, '.', '-123456');
        await decimalInputPage.inputToSelection('integerInput', '-123456', 2, 4, '.', '-123456');

        await decimalInputPage.loadPositive();

        await decimalInputPage.inputToSelection('positiveInput', '123456', 0, 3, 'x', '123456');
        await decimalInputPage.inputToSelection('positiveInput', '123456', 2, 4, 'x', '123456');
        await decimalInputPage.inputToSelection('positiveInput', '123456', 4, 6, 'x', '123456');
        await decimalInputPage.inputToSelection('positiveInput', '123456', 0, 3, '-', '123456');
        await decimalInputPage.inputToSelection('positiveInput', '123456', 0, 6, '-', '123456');
        await decimalInputPage.inputToSelection('positiveInput', '.123456', 0, 3, '-', '.123456');
        await decimalInputPage.inputToSelection('positiveInput', '0.123456', 0, 1, '-', '0.123456');
    });

    test('Paste text into selection', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.pasteToSelection('defaultInput', '123456', 2, 4, '.', '12.56');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 2, 4, '00', '120056');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 6, '-', '-');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 6, '.', '.');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '0', '0456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '.', '.456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '0.', '0.456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '-', '-456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '-.', '-.456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '-0.', '-0.456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 4, 6, '.', '1234.');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 4, 6, '.5', '1234.5');
    });

    test('Paste invalid text into selection', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.pasteToSelection('defaultInput', '123456', 2, 4, 'x', '123456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 2, 4, '..', '123456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 2, 4, '-', '123456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 2, 4, ' ', '123456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '--', '123456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, 'x', '123456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '00', '123456');
        await decimalInputPage.pasteToSelection('defaultInput', '123456', 0, 3, '..', '123456');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.pasteToSelection('digitsLimitInput', '123456789', 0, 3, 'x', '123456789');
        await decimalInputPage.pasteToSelection('digitsLimitInput', '123456789', 0, 3, '.', '123456789');
        await decimalInputPage.pasteToSelection('digitsLimitInput', '-123456789', 1, 2, '.', '-123456789');
        await decimalInputPage.pasteToSelection('digitsLimitInput', '123456.789', 3, 7, '.456', '123456.789');

        await decimalInputPage.loadInteger();

        await decimalInputPage.pasteToSelection('integerInput', '123456', 0, 3, 'x', '123456');
        await decimalInputPage.pasteToSelection('integerInput', '123456', 0, 3, '.', '123456');
        await decimalInputPage.pasteToSelection('integerInput', '123456', 2, 3, '.', '123456');
        await decimalInputPage.pasteToSelection('integerInput', '-123456', 2, 3, '.', '-123456');

        await decimalInputPage.loadPositive();

        await decimalInputPage.pasteToSelection('positiveInput', '123456', 0, 3, '-', '123456');
        await decimalInputPage.pasteToSelection('positiveInput', '123.456', 0, 3, '-', '123.456');
    });

    test('Paste text inside value', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.pasteFromPos('defaultInput', '123456', 3, '.', '123.456');
        await decimalInputPage.pasteFromPos('defaultInput', '123456', 3, '00', '12300456');
        await decimalInputPage.pasteFromPos('defaultInput', '123456', 0, '-', '-123456');
        await decimalInputPage.pasteFromPos('defaultInput', '123456', 0, '.', '.123456');
        await decimalInputPage.pasteFromPos('defaultInput', '123456', 0, '0.', '0.123456');
        await decimalInputPage.pasteFromPos('defaultInput', '123456', 6, '0.1', '1234560.1');
    });

    test('Paste invalid text inside value', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.pasteFromPos('defaultInput', '1234', 0, 'x', '1234');
        await decimalInputPage.pasteFromPos('defaultInput', '1234', 2, 'x', '1234');
        await decimalInputPage.pasteFromPos('defaultInput', '1234', 4, 'x', '1234');
        await decimalInputPage.pasteFromPos('defaultInput', '1234', 2, '-', '1234');
        await decimalInputPage.pasteFromPos('defaultInput', '-1234', 1, '-', '-1234');
        await decimalInputPage.pasteFromPos('defaultInput', '-1234', 5, '-', '-1234');
        await decimalInputPage.pasteFromPos('defaultInput', '-1.234', 0, '-.', '-1.234');
        await decimalInputPage.pasteFromPos('defaultInput', '1.234', 2, '.', '1.234');
        await decimalInputPage.pasteFromPos('defaultInput', '1.234', 3, '.', '1.234');
        await decimalInputPage.pasteFromPos('defaultInput', '1.234', 3, '.', '1.234');
        await decimalInputPage.pasteFromPos('defaultInput', '-1.234', 0, '.', '-1.234');
        await decimalInputPage.pasteFromPos('defaultInput', '-1.234', 1, '.', '-1.234');
        await decimalInputPage.pasteFromPos('defaultInput', '-1.234', 2, '.', '-1.234');
        await decimalInputPage.pasteFromPos('defaultInput', '-1.234', 3, '.', '-1.234');

        await decimalInputPage.loadDigitsLimit();

        await decimalInputPage.pasteFromPos('digitsLimitInput', '123456', 0, '.', '123456');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '123456', 2, '.', '123456');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '123456', 6, 'x', '123456');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '-123456', 0, '.', '-123456');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '-123456', 1, '.', '-123456');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '-123456', 3, '.', '-123456');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '-123456', 7, 'x', '-123456');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '1.234', 0, 'x', '1.234');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '1.234', 1, 'x', '1.234');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '1.234', 5, 'x', '1.234');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '1.234', 5, '1', '1.234');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '1.234', 5, '0', '1.234');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '1.234', 5, '.', '1.234');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '.012', 4, '3', '.012');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '0.012', 5, '3', '0.012');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '-0.012', 6, '3', '-0.012');
        await decimalInputPage.pasteFromPos('digitsLimitInput', '-.012', 5, '3', '-.012');

        await decimalInputPage.loadInteger();

        await decimalInputPage.pasteFromPos('integerInput', '123456', 0, '.', '123456');
        await decimalInputPage.pasteFromPos('integerInput', '123456', 1, '.', '123456');
        await decimalInputPage.pasteFromPos('integerInput', '123456', 4, '.', '123456');
        await decimalInputPage.pasteFromPos('integerInput', '-123456', 0, '.', '-123456');
        await decimalInputPage.pasteFromPos('integerInput', '-123456', 1, '.', '-123456');
        await decimalInputPage.pasteFromPos('integerInput', '-123456', 4, '.', '-123456');
        await decimalInputPage.pasteFromPos('integerInput', '123456', 0, 'x', '123456');
        await decimalInputPage.pasteFromPos('integerInput', '123456', 2, 'x', '123456');
        await decimalInputPage.pasteFromPos('integerInput', '123456', 6, 'x', '123456');
        await decimalInputPage.pasteFromPos('integerInput', '-123456', 0, 'x', '-123456');
        await decimalInputPage.pasteFromPos('integerInput', '-123456', 1, 'x', '-123456');
        await decimalInputPage.pasteFromPos('integerInput', '-123456', 4, 'x', '-123456');
        await decimalInputPage.pasteFromPos('integerInput', '-123456', 7, 'x', '-123456');

        await decimalInputPage.loadPositive();

        await decimalInputPage.pasteFromPos('positiveInput', '123456', 0, '-', '123456');
        await decimalInputPage.pasteFromPos('positiveInput', '.123456', 0, '-', '.123456');
        await decimalInputPage.pasteFromPos('positiveInput', '0.123456', 0, '-', '0.123456');
        await decimalInputPage.pasteFromPos('positiveInput', '12.123456', 0, '-', '12.123456');
        await decimalInputPage.pasteFromPos('positiveInput', '123456', 0, 'x', '123456');
        await decimalInputPage.pasteFromPos('positiveInput', '123456', 2, 'x', '123456');
        await decimalInputPage.pasteFromPos('positiveInput', '123456', 6, 'x', '123456');
        await decimalInputPage.pasteFromPos('positiveInput', '.123456', 7, 'x', '.123456');
        await decimalInputPage.pasteFromPos('positiveInput', '.123456', 0, 'x', '.123456');
        await decimalInputPage.pasteFromPos('positiveInput', '0.123456', 0, 'x', '0.123456');
    });

    test('Backspace key with selection', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.backspaceSelection('defaultInput', '123456', 0, 3, '456');
        await decimalInputPage.backspaceSelection('defaultInput', '123.456', 2, 5, '1256');
        await decimalInputPage.backspaceSelection('defaultInput', '.123456', 4, 7, '.123');
        await decimalInputPage.backspaceSelection('defaultInput', '-123456', 4, 7, '-123');
        await decimalInputPage.backspaceSelection('defaultInput', '0.000123', 1, 3, '0.000123');
        await decimalInputPage.backspaceSelection('defaultInput', '-0.000123', 2, 4, '-0.000123');
    });

    test('Delete key with selection', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.deleteSelection('defaultInput', '123456', 0, 3, '456');
        await decimalInputPage.deleteSelection('defaultInput', '123.456', 2, 5, '1256');
        await decimalInputPage.deleteSelection('defaultInput', '.123456', 4, 7, '.123');
        await decimalInputPage.deleteSelection('defaultInput', '-123456', 4, 7, '-123');
        await decimalInputPage.deleteSelection('defaultInput', '0.000123', 1, 3, '0.000123');
        await decimalInputPage.deleteSelection('defaultInput', '-0.000123', 2, 4, '-0.000123');
    });

    test('Cut selection', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDefault();

        await decimalInputPage.cutSelection('defaultInput', '123456', 0, 3, '456');
        await decimalInputPage.cutSelection('defaultInput', '123.456', 2, 5, '1256');
        await decimalInputPage.cutSelection('defaultInput', '.123456', 4, 7, '.123');
        await decimalInputPage.cutSelection('defaultInput', '-123456', 4, 7, '-123');
        await decimalInputPage.cutSelection('defaultInput', '0.000123', 1, 3, '0.000123');
        await decimalInputPage.cutSelection('defaultInput', '-0.000123', 2, 4, '-0.000123');
    });

    test('Disabled state', async ({ decimalInputPage }) => {
        await decimalInputPage.loadDisabled();

        await decimalInputPage.toggleEnable();
        await decimalInputPage.toggleEnable();

        await decimalInputPage.changeValue();

        await decimalInputPage.toggleEnable();
    });
});
