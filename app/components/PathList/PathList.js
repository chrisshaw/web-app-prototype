import React, { Component } from 'react'
import { connect } from 'react-redux'
import Subheader from 'mui-next/List/ListSubheader'
import Button from 'mui-next/Button'
import Typography from 'mui-next/Typography/Typography'
import Divider from 'mui-next/Divider'

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