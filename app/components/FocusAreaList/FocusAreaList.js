import React, { Component } from 'react';
import { connect } from 'react-redux';

import FocusArea from '../FocusArea/FocusArea'
import SubjectIcon from '../SubjectIcon/SubjectIcon'
// import Style from './FocusAreaList.css'

import { selectFocusArea } from '../../actions/focusAreas'
import {
    removeFocusAreaInPathViewer,
    moveUpFocusAreaInPathViewer,
    moveDownFocusAreaInPathViewer
} from '../../actions/pathbuilder/pathviewerActionCreators'
import { globalGetPathIndex } from '../../reducers/index';

export class FocusAreaList extends Component {

    // handleMoveUp
    handleMoveUp = index => () => {
        this.props.moveUpFocusAreaInPathViewer(this.props.projectId, index)
    }

    // handleMoveDown
    handleMoveDown = index => () => {
        this.props.moveDownFocusAreaInPathViewer(this.props.projectId, index)
    }

    // handleAdd
    handleAdd = index => () => {

    }

    // handleRemove
    handleRemove = index => () => {
        this.props.removeFocusAreaInPathViewer(this.props.projectId, index)
    }

    // handleViewDetails
    handleViewDetails = focusAreaId => this.props.selectFocusArea(focusAreaId)

    renderFocusArea = (focusAreaId, i, focusAreas) => {
        const handle = `${this.props.handlePrefix}/${i}`
        let actions = [
            { type: 'details', handler: (e) => this.handleViewDetails(focusAreaId) },
        ]
        if (i !== 0) actions = [...actions, { type: 'up', handler: this.handleMoveUp(i) }]
        if (i !== focusAreas.length - 1) actions = [...actions, { type: 'down', handler: this.handleMoveDown(i) }]
        actions = [
            ...actions,
            // { type: 'add', handler: this.handleAdd(i) },
            { type: 'remove', handler: this.handleRemove(i) }
        ]

        return (
            <FocusArea
                key={i}
                focusAreaId={focusAreaId}
                actions={actions}
            />
        )
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.props.focusAreas.map(this.renderFocusArea)}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    pathIndex: globalGetPathIndex(state),
})

export default connect(
    mapStateToProps,
    {
        selectFocusArea,
        removeFocusAreaInPathViewer,
        moveUpFocusAreaInPathViewer,
        moveDownFocusAreaInPathViewer,
    }
)(FocusAreaList)