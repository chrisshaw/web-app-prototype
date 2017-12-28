import React, { Component } from 'react'
import { connect } from 'react-redux'
import Subheader from 'material-ui/List/ListSubheader'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography/Typography'
import Divider from 'material-ui/Divider'

import Project from '../Project/Project'
import FocusAreaList from '../FocusAreaList/FocusAreaList'
import Style from './PathList.css'

import { globalGetCurrentPath, globalGetCurrentProjects } from '../../reducers'

class PathList extends Component {

    renderProject = (id, i) => {
        return (
            <Project
                projectId={id}
                key={i}
            />
        )
    }

    render() {
        return ( 
            <div className={Style.pathList}>
                {this.props.currentProjects.map(this.renderProject)}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentProjects: globalGetCurrentProjects(state),
})

export default connect(
    mapStateToProps
)(PathList)