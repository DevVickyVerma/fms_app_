import React from 'react'

export default function PracticeJavaScript() {
    let arr = ['Site 1', 'Site 2', 'Site 3'];
    let obj = arr.reduce((acc, curr, index) => {
        acc[index] = curr;
        return acc;
    }, {});

    return (
        <div></div>
    )
}
