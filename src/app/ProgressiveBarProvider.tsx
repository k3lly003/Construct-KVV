'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ReactNode } from 'react';

interface Props{
    children: ReactNode
}
export default function ProgressBarProvider({ children }:Props) {
    return (
        <>
            {children}
            <ProgressBar
                height="4px"
                color="#007bff"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </>
    );
}