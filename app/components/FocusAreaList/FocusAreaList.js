import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles, withTheme } from 'mui-next/styles'
import Icon from 'mui-next/Icon'
import Button from 'mui-next/Button'
import IconButton from 'mui-next/IconButton' // <-- Don't think I need this with the current implementation
import Card, { CardHeader, CardContent, CardActions } from 'mui-next/Card'
import Avatar from 'mui-next/Avatar'
import Tooltip from 'mui-next/Tooltip'
import Typography from 'mui-next/Typography'
import Style from './FocusAreaList.css'
import SubjectIcon from '../SubjectIcon/SubjectIcon'

import { selectFocusArea } from '../../actions/focusAreas'
import { globalGetPathIndex } from '../../reducers/index';

export const FocusAreaIcon = props => {
    let ligature = 'school'
    switch(props.icon) {
        case 'down':
            ligature = 'arrow_downward'
            break
        case 'up':
            ligature = 'arrow_upward'
            break
        case 'left':
            ligature = 'chevron_left'
            break
        case 'right':
            ligature = 'chevron_right'
            break
        case 'remove':
            ligature = 'delete'
            break
        case 'add':
            ligature = 'add_circle'
            break
        case 'details':
            ligature = 'info'
            break
        default:
            ligature = ligature
    }
    return (
        <Icon className={props.className}>
            {ligature}
        </Icon>
    )
}

const FocusAreaIconButton = props => (
    <Button onClick={props.clickHandler}>
        {!props.disableIcon && <FocusAreaIcon icon={props.icon} className={Style.iconButton}/>}
        {props.icon}
    </Button>
)

class FocusAreaActionBar extends Component {

    renderAction = ({ type, handler }, i) => (
        <FocusAreaIconButton
            key={i}
            icon={type}
            clickHandler={handler}
            disableIcon
        />
    )
    
    render() {
        return (
            <CardActions className={Style.actions}>
                {this.props.actions.map(this.renderAction)}
            </CardActions>
        )
    }
}

const ColoredAvatar = props => {
    const classes = props.classes

    return (
        <Avatar className={classes[props.color]}>
            {props.children}
        </Avatar>
    )
}
const styles = theme => ({
    primary: {
        backgroundColor: theme.palette.primary[500]
    },
    softPrimary: {
        backgroundColor: theme.palette.primary[200]
    },
    secondary: {
        backgroundColor: theme.palette.secondary[500]
    }
})

const StyledAvatar = withStyles(styles, { withTheme: true })(ColoredAvatar)

const RelevanceIndicator = ({subject, relevance}) => {
    let color = null
    if (relevance !== 'Supporting Concept') {
        if (relevance === 'Highly Relevant') {
            color = 'primary'
        } else if (relevance === 'Relevant') {
            color = 'softPrimary'
        } else if (relvance === 'Added') {
            color = 'secondary'
        }
    }

    return (
        <StyledAvatar color={color}>
            <SubjectIcon subject={subject} />
        </StyledAvatar>
    )
}

const FocusAreaHeader = props => {
    const { subject, name, relevance, course, ...rest } = props
    
    const focusAreaAvatar = <RelevanceIndicator subject={subject} relevance={relevance} />

    return (
        <CardHeader
            avatar={focusAreaAvatar}
            title={name}
            subheader='Course' // {course}
        />
    )
}

export const FocusArea = props => (
    <Card id={props.id} data-handler={props.handle} className={Style.focusArea}>
        <FocusAreaHeader
            subject={props.subject}
            course={props.course}
            name={props.name}
            relevance={props.relevance}
        />
        <FocusAreaActionBar actions={props.actions} />
    </Card>
)

export class FocusAreaList extends Component {

    // handleMoveUp

    // handleMoveDown

    // handleAdd

    // handleRemove

    // handleViewDetails
    handleViewDetails = focusAreaId => this.props.selectFocusArea(focusAreaId)

    renderFocusArea = (focusArea, i, focusAreas) => {
        const handle = `${this.props.handlePrefix}/${i}`
        let actions = [
            { type: 'details', handler: (e) => this.handleViewDetails(focusArea._id) },
        ]
        if (i !== 0) actions = [...actions, { type: 'up', handler: this.props.handleMoveUp }]
        if (i !== focusAreas.length - 1) actions = [...actions, { type: 'down', handler: this.props.handleMoveDown }]
        actions = [
            ...actions,
            // { type: 'add', handler: this.props.handleAdd },
            { type: 'remove', handler: this.props.handleRemove }
        ]

        return (
            <FocusArea
                key={i}
                handle={handle}
                id={focusArea._id}
                name={focusArea.name}
                course={focusArea.course}
                subject={focusArea.subject}
                relevance={focusArea.relevance}
                actions={actions}
            />
        )
    }

    render() {
        return (
            <div className={`${Style.focusAreaList} ${this.props.className}`}>
                {this.props.focusAreas.map(this.renderFocusArea)}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    pathIndex: globalGetPathIndex(state),

})

export default connect(
    mapStateToProps,
    {
        selectFocusArea
    }
)(FocusAreaList)