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
import FocusAreaDrawer from '../FocusAreaDrawer';
import RelatedProjectsDrawer from '../RelatedProjectsDrawer';

import { selectFocusArea } from '../../actions/focusAreas';
import { selectPath } from '../../actions/relatedProjects';

const iconStyles = {
  marginRight: 24,
  fill: 'red500'
};
const styles = {
  iconButton : {
    disabledTextColor: '#808080'
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    textAlign: 'left',
    overflowX: 'none',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  focusAreaHeader: {
    display: 'inline-block',
  },
  focusAreaRelevanceLabel: {
    display: 'inline-block',
    margin: '0 0 7px 12px',
  },
};

// MUI-NEXT MIGRATION
import Button from 'mui-next/Button'
import Tabs, { Tab } from 'mui-next/Tabs'
import IconButton from 'mui-next/IconButton'
import Icon from 'mui-next/Icon'


class PathViewer extends React.Component {
    state = {
        value: 0
    }

    handleViewDetails(focusArea) {
        this.props.selectFocusArea(focusArea);
        this.setState({ isFocusAreaDrawerOpen: true });
    }

    handleCloseFocusAreaDrawer() {
        this.setState({ isFocusAreaDrawerOpen: false });
    }

    handleViewRelatedProjects(pathName) {
        this.props.selectPath(pathName);
        this.setState({ isRelatedProjectsDrawerOpen: true });
    }

    handleCloseRelatedProjectsDrawer() {
        this.setState({ isRelatedProjectsDrawerOpen: false });
    }

    handleChange = (event, value) => {
        this.setState( { value } )
    }

    render() {
        return (
            // <div>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                >
                    <Tab
                        label="Value 0"
                    />
                    <Tab
                        label="Value 1"
                    />
                </Tabs>
                /* <FocusAreaDrawer open={this.state.isFocusAreaDrawerOpen}
                    focusArea={this.props.currentFocusArea}
                    isFocusAreaFetching={this.props.isFocusAreaInfoFetching}
                    onCloseClick={this.handleCloseFocusAreaDrawer}
                    paths={this.props.paths}
                />
                <RelatedProjectsDrawer open={this.state.isRelatedProjectsDrawerOpen}
                            relatedProjects={this.props.currentPathRelatedProjects}
                            isRelatedProjectsFetching={this.props.isRelatedProjectsFetching}
                            onCloseClick={this.handleCloseRelatedProjectsDrawer}
                />
            </div> */
        )
    }
}

const mapStateToProps = (state) => ({
  currentFocusArea: state.mainState.currentFocusArea,
  isFocusAreaInfoFetching: state.mainState.isFocusAreaInfoFetching,
  paths: state.mainState.paths,
  currentPathRelatedProjects: state.mainState.currentPathRelatedProjects,
  isRelatedProjectsFetching: state.mainState.isRelatedProjectsFetching,
});

const mapDispatchToProps = (dispatch) => {
  const boundActions = bindActionCreators({
      selectFocusArea,
      selectPath,
  }, dispatch);
  return {dispatch, ...boundActions};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PathViewer);


  
