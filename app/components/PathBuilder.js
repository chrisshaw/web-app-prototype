import React, { Component } from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import QueryBuilder from './QueryBuilder.js';
import RaisedButton from 'material-ui/RaisedButton';
import helper from '../helper';
import {connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import GroupTabs from './GroupTabs';


const style = {
    span: {
        color: '#FFFFFF',
    
    },
    button: {
        marginTop: 12,
        marginBottom: 12,
        fontColor: '#FFFFFF',
        mariginLeft: '10px'

    },
    paper: {
        // width: '100%',
        textAlign: 'center',
        overflow: 'auto'
    }
}

const Loader = () => (
    <div className="loader-container">
        <div className="text-center loader"></div>
    </div>
)

const PathBuilderDrawer = props => (
    <Paper zDepth={3}>     
        <QueryBuilder {...props}/>
    </Paper>
)

class PathBuilder extends Component{
   constructor(props) {
        super(props);
        // this.handleClose = this.handleClose.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    handleSend() {
        // used by the "send to Sidekick" button in QueryBuilder
        helper.sendToSidekick(this.props)   
    }
    render() {
        return (
            <main id="pathbuilder">
                <PathBuilderDrawer
                    id="query-area"
                    handleSend={this.handleSend}
                /> 
                <Paper id="path-area" style={style.paper} zDepth={0}>
                    {this.props.searching ? (
                        <Loader />
                    ) : (
                        <GroupTabs
                            falist={this.props.falist}
                            selectedfa={this.props.selectedfa}
                            fa={this.props.fa}
                            username={this.props.username}
                            paths={this.props.paths}
                            changed={this.props.changed}
                        />
                    )}                     
                </Paper>        
            </main>
        )
    }
}

// *** NB: the HOC in validate permissions injects {...props} which include router props and the loggedIn prop
const mapStateToProps = (store,ownProps) => {
    return {
        paths: store.mainState.paths,
        searching: store.mainState.searching,
        changed: store.mainState.changed,
        fa: store.mainState.fa,
        selectedfa: store.mainState.selectedfa,
        falist: store.mainState.falist
    }
}

export default connect(mapStateToProps)(PathBuilder);


