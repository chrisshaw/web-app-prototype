import React, { Component } from 'react'
import { connect } from 'react-redux'

import Button from 'mui-next/Button'
import Icon from 'mui-next/Icon'
import Avatar from 'mui-next/Avatar'
import Card, { CardHeader, CardContent, CardActions } from 'mui-next/Card'

import { withStyles, withTheme } from 'mui-next/styles'
import Style from './FocusArea.css'

import FocusAreaAdder from '../FocusAreaAdder/FocusAreaAdder'
import SubjectIcon from '../SubjectIcon/SubjectIcon'

import {
    globalGetFocusAreaWithRelevanceById,
} from '../../reducers'

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

export const FocusAreaIconButton = props => (
    <Button className={props.className} onClick={props.clickHandler}>
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
        } else if (relevance === 'Added') {
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
            subheader={course}
        />
    )
}

export const FocusArea = props => (
    <div>
        <Card className={Style.focusArea}>
            <FocusAreaHeader
                name={props.focusArea.name}
                subject={props.focusArea.subject}
                course={props.focusArea.course}
                relevance={props.focusArea.relevance}
            />
            <FocusAreaActionBar actions={props.actions} />
        </Card>
        <FocusAreaAdder addHandler={props.addHandler} />
    </div>
)

const mapStateToProps = (state, props) => ({
    focusArea: globalGetFocusAreaWithRelevanceById(state, props.relevantFocusAreaId)
})

export default connect(
    mapStateToProps
)(FocusArea)