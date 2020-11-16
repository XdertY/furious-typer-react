import React, {useState, useEffect} from 'react'
import "./table.css"

export const Table = ({tableId, columns, data, title}) => {

    const [tableData,setTableData] = useState();

    const [tableRows, setTableRows] = useState();

    const APIKey = "5ns9momoyv3b2af81kb1p5g3yc5nn3ccwpmrnjtssetblfipv";

    const generateColumns = () => {
        return columns.map(name =>  <th>{name}</th>)
    }

    const generateData = () => {
        if(tableData) {
            let counter = -1;
            let tempTableData = tableData.map(word => {
                counter++;
                console.log(word.definition)
                return (
                    <tr>
                        <td><p>{word.word}</p></td>
                        <td>
                            {word.definition === "" ? <button key={`${counter} ${word.word}`}
                                                              onMouseEnter={e => handleMouseHover(e._targetInst.key)}>View</button>
                                : <p>{word.definition}</p>}
                        </td>

                    </tr>
                )
            })
            setTableRows(tempTableData);
        }
    }

    useEffect(() => {
       setTableData(data.map(word => {
            return {
                word: word,
                definition: ""
            }
        }))
    }, [])

    useEffect(() => {
        generateData()
    }, [tableData])

    const handleMouseHover = (key) => {
        let [index, word] = key.split(" ");
        console.log(tableData[index]);

        fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=${APIKey}`)
            .then(response => {
                return response.json();
            }).then(definitionResp => {
                let tempTableData = JSON.parse(JSON.stringify(tableData));
                tempTableData[index].definition = definitionResp[0].text
                setTableData(tempTableData)
        }).catch(err => {
                console.log(`Definition for ${word} could not be fetched.`);
            });
    }


    return (
        <>
            <table id={tableId} style={{border: "1px solid black"}}>
                <caption>{title}</caption>
                <tr>
                    {generateColumns()}
                </tr>
                {tableRows}
            </table>
        </>
    )
}
