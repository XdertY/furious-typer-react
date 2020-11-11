import React, {useState, useEffect, useRef, useCallback} from 'react'
import text from '../assets/text'


//TODO - go through the input logic to see what is working and what not. For now it is not switching to the new word and also it is not determining correctly if the written word is correct when finished typing
export const MainWrapper = (props) => {

    const [currentWord, setCurrentWord] = useState("")
    const [timerStarted, setTimerStarted]  = useState(false);
    const [correctWords, setCorrectWords] = useState(0);
    const [wrongWords, setWrongWords] =  useState(0);
    const [wpm, setWpm] =  useState(0);
    // const [secondsPassed, setSecondsPassed] = useState(0);
    const [prevInput, setPrevInput] = useState("");
    const [wordInProgress, setWordInProgress] = useState("");
    const [words, setWords] = useState(text);

    //Ref to the seconds passed - put in a ref becuase of stale closure of setInterval function
    const secondsPassed = useRef(0);
    const intervalRef = useRef();
    //100 because when setInterval fires for first time, at least 100 seconds would have passed
    const tenthsPassed =  useRef(100);
    const startAngleCoef = useRef(1.5);

    const [passedWords, setPassedWords] =  useState({
        correct: [],
        incorrect: []
    });

    useEffect(() => {
        init();
    }, [])

    //Function to handle backspace
    const handleBackspace = useCallback((event) => {
        //Check if backspace is pressed
        if(event.key === "Backspace"){
            console.log("backspace")
            //Get input word from user
            const inputValue = document.getElementById("input-box").innerText;

            //If input is empty or the handler is fired with the same input -> return
            if (!inputValue || inputValue === prevInput) return;

            //Update prevInput
            setPrevInput(inputValue);

            const lastChar = inputValue[inputValue.length - 1];
            //Decide if current character should be inserted in the text.
            if(currentWord[inputValue.length - 1] === lastChar && isWordValid(true)){
                //Get current text
                const text = document.getElementById("text-box").innerText;

                //Insert the deleted character to the text
                const newText = lastChar + text;
                document.getElementById("text-box").innerText = newText;
            }

            //Finally validate word and apply styles
            fixInputStyle(true);
        }
    })

    useEffect(() => {
        window.addEventListener('keydown', handleBackspace);

        return () => {
            window.removeEventListener('keydown', handleBackspace);
        };
    }, [handleBackspace]);



    const fetchWords = () => {
        const APIKey = "5ns9momoyv3b2af81kb1p5g3yc5nn3ccwpmrnjtssetblfipv";
        //Fetch 200 random words from an API
        // Promise.resolve(fetch(`https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=3&maxLength=10&limit=200&api_key=${APIKey}`)
        //     //Convert response to JSON
        //     .then(response => response.json())
        //     //Convert json to arr
        //     .then(json => json.map(s => s.word))
        //     //Convert arr to text
        //     .then(wordsArr => wordsArr.join(" ")))
        //     //Resolve the promise setting the text and current word.
        //     .then(text => {
        //         document.getElementById("text-box").innerText = text;
        //         currentWord = text.split(" ").filter(el => el !== "")[0];
        //     });
    }


    useEffect(() => {
        if(timerStarted) {
            const intervalId = setInterval(
            () => {
                let c = document.getElementById("timer");
                let ctx = c.getContext("2d");
                ctx.clearRect(0, 0, 150, 150);
                ctx.beginPath();
                ctx.font = "35px Arial";
                ctx.arc(75, 75, 70, startAngleCoef.current * Math.PI, 3.5 * Math.PI);

                //If time left is one digit only, we have to change the position
                //In order to remain algined
                (60 - secondsPassed.current) < 10 ?
                    ctx.fillText(60 - secondsPassed.current, 65, 85) : ctx.fillText(60 - secondsPassed.current, 55, 85);
                ctx.stroke();
                startAngleCoef.current = startAngleCoef.current + 0.003333333;
                if (tenthsPassed.current === 900) {
                    secondsPassed.current  = secondsPassed.current + 1;
                    tenthsPassed.current = 0;
                } else {
                    tenthsPassed.current = tenthsPassed.current + 100;
                }

                if (secondsPassed.current === 60) {
                    clearInterval(intervalRef.current);
                    ctx.clearRect(0, 0, 150, 150);
                    ctx.fillText("0", 65, 85);
                    //showDialog();
                }
            }, 100)
        intervalRef.current = intervalId;

        return () => clearInterval(intervalRef.current);
        }
    }, [timerStarted])

    const init = () => {
        //TODO Next line must be removed when using the Wordnik API.
        setCurrentWord(words.split(" ")[0]);

        const inputElement = document.getElementById("input-box");
        // inputElement.addEventListener("keydown",  (e) => {handleBackspace(e)} );
        // inputElement.addEventListener("input", (e)  => {handleInputChange(e)});

        //Make the modal dialog closeable
        // window.onclick = (event) => {
        //     const modal = document.getElementsByClassName("modal-wrapper")[0];
        //     const modalCloseSpan = document.getElementsByClassName("modal-close")[0];
        //     if (event.target == modal || event.target == modalCloseSpan) {
        //         modal.style.display = "none";
        //     }
        // }

        //Render timer
        renderTimer();
        //Focus input on initial load
        focusInputBox();
        //Load words from API
        fetchWords();
    }

    const getNextWord = () => {
        const text = document.getElementById("text-box").innerText;
        setCurrentWord(text.split(" ").filter(el => el !== "")[0]);
    }

    const renderTimer = () => {
        var c = document.getElementById("timer");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 150, 150);
        ctx.beginPath();
        ctx.font = "35px Arial";
        ctx.arc(75, 75, 70, 1.5 * Math.PI, 3.5 * Math.PI);
        ctx.fillText(60, 55, 85);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#fff1e6";
        ctx.stroke();
    }

    const startTimer = () => {
        //When timer is started, it means that the user has started typing
        //so we need to remove the blinking caret
        const blinkingCaret = document.getElementById("blinking-cursor");
        if(blinkingCaret)
            blinkingCaret.parentElement.removeChild(blinkingCaret);

        setTimerStarted(true);
    }

    //Function which shows the modal dialog at the end of the game
    const showDialog = () => {
        //Get the modal
        const modal = document.getElementsByClassName("modal-wrapper")[0];

        //Set WPM in the modal
        document.getElementById("modal-wpm").innerText += wpm;

        //Set accuracy in the modal
        document.getElementById("modal-accuracy").innerText += parseInt(correctWords * 100 / ( correctWords + wrongWords)) || 0 ;

        //Disable user input
        document.getElementById("input-box").contentEditable = "false";

        //Show modal
        modal.style.display = "block";

        //Finally generate tables with correct and incorrect words
        //generateTables(passedWords);
    }

    //Function which takes a string as parameter and compares it to the current word
    //The characters that are different should become red
    const setWrongCharacters = (word) => {
        let result = "";
        for (let i in currentWord){
            if(word.length < i){
                result += `<span style='color: red'>${currentWord.charAt(i)}</span>`;
            }else{
                if (word.charAt(i) !== currentWord.charAt(i)){
                    result += `<span style='color: red'>${currentWord.charAt(i)}</span>`;
                }else{
                    result += currentWord.charAt(i);
                }
            }
        }
        return result;
    }

    //Handler for written word
    //Increment wrong/right word counter
    //Calculate WPM and Accuracy
    const handleWordWritten = (wordCorrect) => {
        //Update correct/wrong words count
        wordCorrect ? setCorrectWords(correctWords + 1) : setWrongWords(wrongWords + 1) ;

        //Calculate WPM
        setWpm(parseInt(correctWords / (secondsPassed / 60)) || 0);
        //Set WPM label
        document.getElementById("wpm").innerText = wpm;

        //Calculate accuracy
        const accuracy = parseInt(correctWords * 100 / ( correctWords + wrongWords)) || 0 ;
        //Set accuracy label
        document.getElementById("accuracy").innerText = accuracy;

        //Add word to the passedWords array
        const previousBox = document.getElementById("previous-box");
        const lastWord = previousBox.children[previousBox.childElementCount - 1].innerText;
        wordCorrect ? passedWords.correct.push(currentWord) : passedWords.incorrect.push(setWrongCharacters(lastWord));
    }



    const handleSpace = () => {
        console.log("handle space")
        //Get input word from user
        let inputValue = document.getElementById("input-box").innerText;
        console.log(inputValue.length)

        //Important to prevent deleting next word.
        if(inputValue.length === 0) return;

        //If user input = " " then return
        if((inputValue.length === 1 && inputValue.charCodeAt(0) === 160) || inputValue.charAt(0) === " ") return 0;

        //Remove last char because it is the space that has just been pressed
        // inputValue = inputValue.substr(0, inputValue.length);

        //Word is correct
        console.log(inputValue, currentWord)
        if(inputValue === currentWord || currentWord === inputValue.substr(0, inputValue.length - 1)){
            //Add this word to the prev container
            const prevWordsContainer = document.getElementById("previous-box");
            const wordSpan = document.createElement("span");
            wordSpan.innerText = inputValue;
            prevWordsContainer.appendChild(wordSpan);

            //Clear text from input box
            document.getElementById("input-box").innerText = "";

            //Trim remaining text
            const remainingText = document.getElementById("text-box").innerText;
            document.getElementById("text-box").innerText = remainingText.substr(remainingText.indexOf(" ") + 1)

            handleWordWritten(true);

            //Set next word
            getNextWord();
        }else{
            //Then the word is incorrect
            //Take user's input and add it to prev container and start next word
            const prevWordsContainer = document.getElementById("previous-box");
            const wordSpan = document.createElement("span");
            wordSpan.innerText = inputValue;
            wordSpan.style.textDecoration = "line-through";
            prevWordsContainer.appendChild(wordSpan);

            //Clear text from input box
            document.getElementById("input-box").innerText = "";

            //Trim remaining text
            const remainingText = document.getElementById("text-box").innerText;
            document.getElementById("text-box").innerText = remainingText.substr(remainingText.indexOf(" ") + 1)

            handleWordWritten(false);

            //Set next word
            getNextWord();
        }
    }

    //Function to handle text insertion
    const handleInputChange = (event) => {
        //First, start the timer if not started.
        if(!timerStarted){
            startTimer();
        }
        // console.log(currentWord)
        //Get input word from user
        const inputValue = document.getElementById("input-box").innerText;

        //Check if backspace is pressed
        //If so return because we have
        //Different handler for backspace
        console.log(event.charAt(event.length - 1));

        if(event.length < wordInProgress.length) return;

        //Check if input value is space
        // else if(event.data.charAt(0) === " " || event.data.charCodeAt(0) === 160){
        else if(event.charAt(event.length - 1) === ">" || event.charAt(event.length - 1) === ";"){
            //If user input is just equal to " " return and clear input
            // if((inputValue.length === 1 && inputValue.charCodeAt(0) === 160) || inputValue.charAt(0) === " ") {
            //     document.getElementById("input-box").innerText = "";
                // return 0;
            // }

            //Else handle space
            handleSpace();
        }

        //Get last character
        const lastChar = inputValue[inputValue.length - 1];

        //Get current text
        const text = document.getElementById("text-box").innerText;

        //Get first character
        const firstChar = text[0];
        // console.log(lastChar, firstChar)

        //Compare user's last character and current text's first character
        if(isWordValid(false) && (lastChar === firstChar || (firstChar.charCodeAt(0) === 32 && lastChar.charCodeAt(0) === 160))){
            //Remove first character from text
            const newText = text.substr(1);

            //Set new text
            document.getElementById("text-box").innerText = newText;
        }

        //Finally validate word and apply styles
        fixInputStyle(false);
    }

    //Function to validate if the word that user is currently typing is correct substring of the word that he is typing.
    //${backSpace} - This parameter is used to determine whether to compare with the input length or input length - 1
    //Because when text is being written/inserted, handleInputChange function is fired when the input is updated, a.k.a
    //It uses the updated value of the input, while when handleBackspace is fired it is using the outdated one.
    const isWordValid = (backSpace) => {
        const inputValue = document.getElementById("input-box").innerText;
        // console.log("currentword", currentWord);

        //If the word is longer than the actual word it is wrong.
        if(inputValue.length > currentWord.length) return false;

        //Word is complete
        if(inputValue === currentWord) return true;

        let diff;
        if(backSpace)
            diff = findFirstDiffPos(inputValue.substr(0, inputValue.length - 1), currentWord);
        else
            diff = findFirstDiffPos(inputValue, currentWord);

        if (backSpace){
            return diff === inputValue.length - 1;
        }
        return diff === inputValue.length;

    }

    //Function to manage input style /*whether line through or normal */
    //${backSpace} - This parameter is required for isWordValid function.
    const fixInputStyle = (backSpace) => {
        const wordValid = isWordValid(backSpace);
        const inputElement = document.getElementById("input-box");
        //Input is correct
        if(wordValid){
            //Input has wrong style
            if(inputElement.classList.contains("wrong")){
                //Remove wrong style
                inputElement.classList.remove("wrong");
            }
        }
        //Input is incorrect
        else{
            //Input hasn't wrong style
            if(!inputElement.classList.contains("wrong")){
                //Add wrong style
                inputElement.classList.add("wrong");
            }
        }
    }

    //Function to compare two strings and find first differing character
    const findFirstDiffPos = (a, b) => {
        const shorterLength = Math.min(a.length, b.length);

        for (let i = 0; i < shorterLength; i++){
            if (a[i] !== b[i]) return i;
        }

        if (a.length !== b.length) return shorterLength;

        return -1;
    }

    const focusInputBox = () => {
        if(document.getElementById("input-box"))
            document.getElementById("input-box").focus()
    }


    return (
        <>
            <div id="main-wrapper">
                <header>
                    <div className="info">
                        <canvas id="timer" width="150" height="150">Your browser does not support the HTML5 canvas
                            tag.
                        </canvas>
                        <div className="info-card-wrapper">
                            <div className="info-card-content">
                                <label id="wpm">0</label>
                            </div>
                            <div className="info-card-footer">
                                words / min
                            </div>
                        </div>
                        <div className="info-card-wrapper">
                            <div className="info-card-content">
                                <label id="accuracy">0</label>
                            </div>
                            <div className="info-card-footer">
                                accuracy %
                            </div>
                        </div>
                    </div>

                </header>

                <div onClick={focusInputBox()} id="input-box-wrapper">
                    <div id="previous-box">
                        <span id="blinking-cursor">|</span>
                    </div>
                    <div id="input-box" className="single-line" contentEditable="true" onInput={(e) => handleInputChange(e.target.innerHTML)}/>
                    <div id="text-box" style={{maxWidth: "50%"}}>{words}</div>
                </div>
            </div>
        </>
    )
}
