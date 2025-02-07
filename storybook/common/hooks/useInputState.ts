import { InputProps } from '@jezvejs/react';
import { useState } from 'react';

export function useInputState<
    T extends InputProps = InputProps
>(props: Partial<T>) {
    const [state, setState] = useState<Partial<T>>({ ...props });

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
