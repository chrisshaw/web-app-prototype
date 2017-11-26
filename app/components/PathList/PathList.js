import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'mui-next/styles'
import Subheader from 'mui-next/List/ListSubheader'
import Button from 'mui-next/Button'
import Typography from 'mui-next/Typography/Typography'
import Divider from 'mui-next/Divider'

import FocusAreaList from '../FocusAreaList/FocusAreaList'
import Style from './PathList.css'

import { globalGetCurrentPath } from '../../reducers'

import { selectPath } from '../../actions/relatedProjects'

const Project = props => (
    <div className={Style.project}>
        <aside className={Style.projectNames}>
            <div className={Style.projectName}>
                <Divider light />
                <Typography type='title'>{props.name}</Typography>
                <Button
                    dense
                    onClick={props.relatedProjectsHandler}
                    className={Style.projectButton}
                    disableRipple
                >
                    View Projects
                </Button>
            </div>
        </aside>
        {props.children.length ? 
            <FocusAreaList
                className={Style.focusAreaList}
                handlePrefix={props.name}
                focusAreas={props.children}
            /> : 
            <Typography type='subheading' align='center'>No focus areas found for this topic.</Typography>
        }
    </div>
)

class PathList extends Component {

    // handleViewRelatedProjects
    handleViewRelatedProjects = project => {
        this.props.selectPath(project)
    }

    renderProject = ({name, fa: focusAreas}) => {
        return (
            <Project
                key={name}
                name={name}
                relatedProjectsHandler={() => this.handleViewRelatedProjects(name)}
            >
                {focusAreas}
            </Project>
        )
    }

    render() {
        return ( 
            <div className={Style.pathList}>
                {this.props.currentPath.map(this.renderProject)}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentPath: globalGetCurrentPath(state),
})

export default connect(
    mapStateToProps,
    {
        selectPath
    }
)(PathList)