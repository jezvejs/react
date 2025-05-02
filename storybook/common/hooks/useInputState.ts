import { InputProps } from '@jezvejs/react';
import { useEffect, useState } from 'react';

export function useInputState<
    T extends InputProps = InputProps
>(props: Partial<T>) {
    const [state, setState] = useState<Partial<T>>({ ...props });

    useEffect(() => {
        setState((prev) => ({ ...prev, disabled: props.disabled }));
    }, [props.disabled]);

    useEffect(() => {
        setState((prev) => ({ ...prev, value: props.value }));
    }, [props.value]);

    const inputProps = {
        ...state,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, value: e.target.value }));
        },
    };

    return {
        state,
        setState,
        inputProps,
    };
}
