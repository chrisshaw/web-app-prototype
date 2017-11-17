import React, { Component } from 'react';
import QueryBuilder from '../QueryBuilder/QueryBuilder';
import helper from '../../helper';
import {connect } from 'react-redux';
import Paper from 'mui-next/Paper';
import PathViewer from '../PathViewer/PathViewer';
import Style from './PathBuilder.css'

const Loader = () => (
    <div className="loader-container">
        <div className="text-center loader"></div>
    </div>
)

const PathBuilderDrawer = props => (
    <Paper elevation={3}>     
        <QueryBuilder />
    </Paper>
)

class PathBuilder extends Component{

    render() {
        return (
            <main id="pathbuilder">
                <PathBuilderDrawer
                    id="query-area"
                /> 
                <Paper id="path-area" className={Style.centered} elevation={0}>
                    {this.props.searching ? (
                        <Loader />
                    ) : (
                        <PathViewer
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
const mapStateToProps = (store, ownProps) => {
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


