
// Include the Main React Dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import routes from "./routes.js";
import configureStore from './store';
import { Provider } from 'react-redux'
// import {syncHistoryWithStore} from 'react-router-redux';
import {Router, browserHistory} from 'react-router';


// // This file should not need to be changed
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import { green, purple, gray } from 'material-ui/colors'

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: purple
    }
})

const App = () => (
    <MuiThemeProvider theme={theme}>
        <Provider store={configureStore()}>
            {routes}
        </Provider>
    </MuiThemeProvider>
)

ReactDOM.render(
    <App />,
    document.getElementById("app")
);


