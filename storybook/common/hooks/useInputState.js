import { useState } from 'react';

export function useInputState(props) {
    const [state, setState] = useState({ ...props });

    const inputProps = {
        ...state,
        onChange: (e) => setState((prev) => ({ ...prev, value: e.target.value })),
    };

    return {
        state,
        setState,
        inputProps,
    };
}
