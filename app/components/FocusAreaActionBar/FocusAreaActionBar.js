import React from 'react';

import Icon from 'mui-next/Icon'
import Button from 'mui-next/Button'
import { CardActions } from 'mui-next/Card'


export const FocusAreaIconButton = props => {
    let ligature = ''
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
            ligature = 'settings'
    }

    return (
        <Button onClick={props.clickHandler}>
            <Icon>
                {ligature}
            </Icon>
            {props.icon}
        </Button>
    )
}

const FocusAreaActionBar = props => {
    const actions = props.actions
    
    return (
        <CardActions>
            {Object.entries(props.actions).map( ([icon, clickHandler], i) => (
                <FocusAreaIconButton
                    key={i}
                    icon={icon}
                    clickHandler={clickHandler}
                />
            ) )}
        </CardActions>
    )
}

export default FocusAreaActionBar