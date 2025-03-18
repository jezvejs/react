import { InputProps } from '@jezvejs/react';
import { useInputState } from '../hooks/useInputState.ts';

export function withInputState<
    T extends InputProps = InputProps
>(InputComponent: React.ComponentType): React.FC<T> {
    return function WrappedWithInputState(props) {
        const { inputProps } = useInputState(props);
        return <InputComponent {...inputProps} />;
    };
}
