import React, { Component } from 'react';
import { connect } from 'react-redux';

import FocusArea from '../FocusArea/FocusArea'
import SubjectIcon from '../SubjectIcon/SubjectIcon'
// import Style from './FocusAreaList.css'

import { selectFocusArea } from '../../actions/focusAreas'
import {
    removeFocusAreaInPathViewer,
    moveUpFocusAreaInPathViewer,
    moveDownFocusAreaInPathViewer,
    addFocusAreaInPathViewer
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
    handleAdd = index => focusAreaId => {
        this.props.addFocusAreaInPathViewer(this.props.projectId, index, focusAreaId)
    }

    // handleRemove
    handleRemove = index => () => {
        this.props.removeFocusAreaInPathViewer(this.props.projectId, index)
    }

    // handleViewDetails
    handleViewDetails = relevantFocusAreaId => this.props.selectFocusArea(relevantFocusAreaId)

    renderFocusArea = (focusAreaId, i, focusAreas) => {
        const handle = `${this.props.handlePrefix}/${i}`
        let actions = [
            { type: 'details', handler: (e) => this.handleViewDetails(focusAreaId) },
        ]
        if (i !== 0) actions = [...actions, { type: 'up', handler: this.handleMoveUp(i) }]
        if (i !== focusAreas.length - 1) actions = [...actions, { type: 'down', handler: this.handleMoveDown(i) }]
        actions = [
            ...actions,
            { type: 'remove', handler: this.handleRemove(i) }
        ]

        return (
            <FocusArea
                projectName={this.props.projectName}
                key={i}
                relevantFocusAreaId={focusAreaId}
                actions={actions}
                addHandler={this.handleAdd(i)}
                recommendations={this.props.recommendations}
            />
        )
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.props.relevantFocusAreas.map(this.renderFocusArea)}
            </div>
        )
    }
}

export default connect(
    null,
    {
        selectFocusArea,
        removeFocusAreaInPathViewer,
        moveUpFocusAreaInPathViewer,
        moveDownFocusAreaInPathViewer,
        addFocusAreaInPathViewer
    }
)(FocusAreaList)