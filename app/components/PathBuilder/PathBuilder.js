import React, { Component } from 'react';
import QueryBuilder from '../QueryBuilder/QueryBuilder';
import helper from '../../helper';
import {connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import PathViewer from '../PathViewer/PathViewer';
import Style from './Pathbuilder.css'
import DetailDrawer from '../DetailDrawer/DetailDrawer'

import {
    globalGetFocusAreaLoaderStatus,
    globalGetRelatedProjectsLoaderStatus,
    globalGetFocusArea,
    globalGetRelatedProjects,
    globalGetPathCount
} from '../../reducers'

const PathBuilderDrawer = props => (
    <Paper elevation={3} {...props} >     
        <QueryBuilder />
    </Paper>
)

class PathBuilder extends Component{

    render() {
        const {
            isFocusAreaFetching,
            isRelatedProjectsFetching,
            currentFocusArea,
            currentPathRelatedProjects,
            ...props
        } = this.props

        const isLoading = isFocusAreaFetching || isRelatedProjectsFetching
        const openDrawer = isLoading || currentFocusArea !== null || currentPathRelatedProjects !== null

        return (
            <main className={Style.pathbuilder}>
                <PathBuilderDrawer className={Style.queryArea}/> 
                <PathViewer className={`${Style.pathArea} ${openDrawer && Style.withDetails}`}/>
                {props.pathCount > 0 && <DetailDrawer className={Style.detailArea} open={openDrawer} loading={isLoading} />}
            </main>
        )
    }
}

const mapStateToProps = state => ({
    pathCount: globalGetPathCount(state),
    currentFocusArea: globalGetFocusArea(state),
    isFocusAreaInfoFetching: globalGetFocusAreaLoaderStatus(state),
    currentPathRelatedProjects: globalGetRelatedProjects(state),
    isRelatedProjectsFetching: globalGetRelatedProjectsLoaderStatus(state)
})

export default connect(
    mapStateToProps
)(PathBuilder);


