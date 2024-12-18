import React from 'react'

export default function PracticeJavaScript() {
    let arr = ['apple', 'banana', 'cherry'];
    let obj = arr.reduce((acc, curr, index) => {
        acc[index] = curr;
        return acc;
    }, {});
    console.log(obj, "obj");  // {0: 'apple', 1: 'banana', 2: 'cherry'}

    return (
        <div></div>
    )
}
