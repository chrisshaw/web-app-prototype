import React, { Component } from 'react'
import { connect } from 'react-redux'
import Style from './Project.css'

import Divider from 'material-ui/Divider'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import FocusAreaList from '../FocusAreaList/FocusAreaList'
import { globalGetProjectById } from '../../reducers/index';
import { selectPath } from '../../actions/relatedProjects'

class Project extends Component {

    // handleViewRelatedProjects
    handleViewRelatedProjects = () => {
        this.props.selectPath(this.props.project.name)
    }

    render() {

        return (
            <div className={Style.project}>
                <aside className={Style.projectNames}>
                    <div className={Style.projectName}>
                        <Divider light />
                        <Typography type='title'>{this.props.project.name}</Typography>
                        <Button
                            dense
                            onClick={this.handleViewRelatedProjects}
                            className={Style.projectButton}
                            disableRipple
                        >
                            View Projects
                        </Button>
                    </div>
                </aside>
                {this.props.project.fa.length
                    ? <FocusAreaList
                        projectName={this.props.project.name}
                        className={Style.focusAreaList}
                        projectId={this.props.projectId}
                        relevantFocusAreas={this.props.project.fa}
                        recommendations={this.props.project.recommendations}
                    />
                    : <Typography
                        type='subheading'
                        align='center'>
                        No focus areas found for this topic.
                    </Typography>
                }
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    project: globalGetProjectById(state, props.projectId),
})

export default connect(
    mapStateToProps,
    {
        selectPath
    }
)(Project)