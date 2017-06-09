import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const styles = {
  title: {
    cursor: 'pointer',
  },
};

function handleTouchTap() {
  alert('onTouchTap triggered on the title component');
}

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#FFFFFF',
   
    // color: '#2196F3' 
  },
  appBar: {
    // position: "fixed",
    top: 0,
    height: 300,
    textColor: '#',
    color: "#2FBB2F",
 
  },
   zIndex: 1000
});

const MyAppNav = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <AppBar
      title={<div className="text-center"><span style={styles.title}><img src="./public/assets/img/sidekick.png" className="logo" alt="Sidekick" /></span></div>}
      onTitleTouchTap={handleTouchTap}
      iconElementLeft={<IconButton><NavigationClose /></IconButton>}
      iconElementRight={<FlatButton label="Save" />}
    />
  </MuiThemeProvider>
);


 
export default MyAppNav;