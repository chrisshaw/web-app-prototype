import React from 'react';
import { connect } from 'react-redux';

import Icon from 'mui-next/Icon'
import IconButton from 'mui-next/IconButton'
import Card from 'mui-next/Card'
import FocusAreaActionBar from '../FocusAreaActionBar/FocusAreaActionBar'


const FocusArea = props => {
    const actions = [
        { add: props.handleAdd },
        { remove: props.handleRemove },
        { up: props.handleMoveUp },
        { down: props.handleMoveDown }
    ]

    return (
        <Card>
            <FocusAreaContent />
            <FocusAreaActionBar actions={actions} />
        </Card>
    )
}

export default FocusArea