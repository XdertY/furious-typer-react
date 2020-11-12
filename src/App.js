import React from 'react'
import logo from './logo.svg';
import './App.css';
import {Header} from "./components/header";
import { Game } from './components/game';

export const App = () => {
  return (
      <>
        <Header/>
        <Game/>
    </>
  );
}
