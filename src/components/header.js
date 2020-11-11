import React from 'react'
import './header.css'

export const Header = (props) => {

    let activeItem = "play";

    const handleMenuClick = (item) => {
        //Remove active style for previous item
        if(document.getElementById("menu-" + activeItem))
            document.getElementById("menu-"+activeItem).classList.remove("menu-item-active");

        //Add active style for new item
        if(document.getElementById("menu-" + item))
            document.getElementById("menu-"+item).classList.add("menu-item-active");

        //Set new selected item
        activeItem = item;
    }

    return (
        <>
            <header id="main-header">
                <nav>
                    <h2>Furious Typer</h2>
                    <ul>
                        <li>
                            <a id="menu-play" className="menu-item-active" onClick={() => handleMenuClick('play')}
                               href="#">Play</a>
                        </li>
                        <li>
                            <a id="menu-highscore" onClick={() => handleMenuClick('highscore')} href="#">High score</a>
                        </li>
                    </ul>
                </nav>
            </header>

        </>
    )
}

