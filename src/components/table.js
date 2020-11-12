import React from 'react'

export const Table = ({tableId, columns, data, title}) => {

    const generateColumns = () => {
        console.log(columns)
        let cols =  columns.map(name =>  <th>{name}</th>)
        console.log(cols)
        return cols;
    }
    return (
        <>
            <table id={tableId} style={{border: "1px solid black"}}>
                <caption>{title}</caption>
                <tr>
                    {generateColumns()}
                </tr>
                <tr>
                    <td><p>Till</p></td>
                    <td>Smith</td>
                </tr>
            </table>
        </>
    )
}
