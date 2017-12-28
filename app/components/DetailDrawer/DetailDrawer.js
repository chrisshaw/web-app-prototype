import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from 'mui-next/styles'
import Style from './DetailDrawer.css'
import Drawer from 'mui-next/Drawer';
import Toolbar from 'mui-next/Toolbar';
import Icon from 'mui-next/Icon'
import IconButton from 'mui-next/IconButton';
import Typography from 'mui-next/Typography'

import DetailDrawerContent, { FocusAreaDetails, RelatedProjectsDetails } from '../DetailDrawerContent/DetailDrawerContent'
import Loader from '../Loader/Loader'

import { closeDetailDrawerInPathViewer } from '../../actions/pathbuilder/pathviewerActionCreators'

import {
  globalGetPaths,
  globalGetFocusArea,
  globalGetFocusAreaLoaderStatus,
  globalGetRelatedProjects,
  globalGetRelatedProjectsLoaderStatus,
  globalGetDetailType,
  globalGetPotentialPeerTeachers,
  globalGetTopic,
  globalGetDetailFocusArea
} from '../../reducers/index';

const styles = {
    paper: {
        position: 'static',
        height: '100%',
        top: 'auto',
        zIndex: 0
    }
};

const DetailDrawer = props => {
    const {
        className,
        open,
        currentFocusArea,
        detailFocusArea,
        potentialPeerTeachers,
        isFocusAreaFetching,
        currentTopic,
        currentPathRelatedProjects,
        isRelatedProjectsFetching,
        closeDetailDrawerInPathViewer,
        detailType,
        classes
    } = props

    let title = 'Closing'
    if (detailType === 'focus area' && currentFocusArea) {
        title = detailFocusArea.name
    } else if (detailType === 'related projects' && currentPathRelatedProjects) {
        title = currentTopic
    }

    return (
        <Drawer open={open}
            anchor={'right'}
            type='persistent'
            className={className}
            classes={{
                paper: classes.paper
            }}
        >
            <DetailDrawerContent
                title={title}
                closeHandler={closeDetailDrawerInPathViewer}
            >
                {detailType === 'focus area' && currentFocusArea && <FocusAreaDetails details={{ ...currentFocusArea, potentialPeerTeachers }} />}
                {detailType === 'related projects' && currentPathRelatedProjects && <RelatedProjectsDetails details={currentPathRelatedProjects} />}
                {isFocusAreaFetching || isRelatedProjectsFetching && <Loader />}
            </DetailDrawerContent>
        </Drawer>
    );
}

const mapStateToProps = state => ({
    detailType: globalGetDetailType(state),
    currentFocusArea: globalGetFocusArea(state),
    detailFocusArea: globalGetDetailFocusArea(state),
    currentTopic: globalGetTopic(state),
    potentialPeerTeachers: globalGetPotentialPeerTeachers(state),
    isFocusAreaFetching: globalGetFocusAreaLoaderStatus(state),
    currentPathRelatedProjects: globalGetRelatedProjects(state),
    isRelatedProjectsFetching: globalGetRelatedProjectsLoaderStatus(state)
})

export default connect(
    mapStateToProps,
    {
        closeDetailDrawerInPathViewer
    }
)(withStyles(styles)(DetailDrawer));
