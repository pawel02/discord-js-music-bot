import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux"
import App from './App';
import { store } from './app/store';
import { BrowserRouter } from "react-router-dom"
import './index.css';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);