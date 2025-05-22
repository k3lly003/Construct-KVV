'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProgressBarProvider({ children }: any) {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#e0d902"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
}