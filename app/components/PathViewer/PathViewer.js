import React from 'react';
import ReactDOM from "react-dom";
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';
import uuid from 'uuid';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import {
  red500,
  grey500,
  greenA700,
} from 'material-ui/styles/colors';
import SvgIcon from 'material-ui/SvgIcon';
import PathList from '../PathList/PathList'

// MUI-NEXT MIGRATION
import Paper from 'mui-next/Paper'
import Button from 'mui-next/Button'
import Tabs, { Tab } from 'mui-next/Tabs'
import IconButton from 'mui-next/IconButton'
import Icon from 'mui-next/Icon'
import Chip from 'mui-next/Chip'

import ChipList from '../ChipList/ChipList'
import Loader from '../Loader/Loader'
import EmptyState from '../EmptyState/EmptyState'
import Style from './PathViewer.css'

import { globalGetLoaderState, globalGetPathCount, globalGetStudentGroups, globalGetCurrentStudentGroup, globalGetPathIndex } from '../../reducers'

import {
    changeCurrentPathInPathViewer
} from '../../actions/pathbuilder/pathviewerActionCreators'

class PathViewer extends React.Component {

    handleChange = (event, value) => {
        this.props.changeCurrentPathInPathViewer(value)
    }

    renderStudentPathTab = (studentGroup, i) => {
        const count = studentGroup.length
        return (
            <Tab key={i} label={`${count} Student${count > 1 ? 's' : ''}`}/>
        )
    }

    render() {
        const { className, ...others } = this.props
        let content = null
        if (this.props.isLoading) {
            content = <Loader {...this.props} />
        } else if (this.props.pathCount) {
            content = [
                <div key="pathData" className={Style.pathData}>
                    <Tabs
                        value={this.props.pathIndex}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        scrollable
                    >
                        {this.props.studentGroups.map(this.renderStudentPathTab)}
                    </Tabs>
                    <ChipList items={this.props.currentStudentGroup} align='center'/>
                </div>,
                <PathList key="pathList" />
            ]
        } else {
            content = <EmptyState state="noPaths" {...this.props} />
        }
        return (
            <section className={`${className} ${Style.pathviewer}`}>
                {content}
            </section>
        )
    }
}

const mapStateToProps = (state) => ({
    isLoading: globalGetLoaderState(state),
    pathCount: globalGetPathCount(state),
    pathIndex: globalGetPathIndex(state),
    studentGroups: globalGetStudentGroups(state),
    currentStudentGroup: globalGetCurrentStudentGroup(state)
});

export default connect(
  mapStateToProps,
  {
      changeCurrentPathInPathViewer
  }
)(PathViewer);


  
