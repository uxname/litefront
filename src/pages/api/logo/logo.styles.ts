import React from 'react';

interface ILogoStyles {
    wrapper: React.CSSProperties,
    textFirst: React.CSSProperties,
    textSecond: React.CSSProperties
}

export const logoStyles: ILogoStyles = {
    wrapper: {
        background: 'white',
        width: '600px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textFirst: {
        color: 'black',
        fontSize: '80px',
        fontFamily: 'San Francisco'
    },
    textSecond: {
        color: '#AD2323',
        fontSize: '80px',
        fontFamily: 'San Francisco'
    }
};
