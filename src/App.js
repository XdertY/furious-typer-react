import React from 'react'
import logo from './logo.svg';
import './App.css';
import {Header} from "./components/header";
import {MainWrapper} from "./components/main-wrapper";

export const App = () => {
  return (
      <>
        <Header/>
        <MainWrapper/>
    </>
  );
}
