import React from 'react'
import Typography from 'mui-next/Typography'
import Style from './EmptyState.css'

const states = {
    noPaths: {
        message: "Let's build some paths!",
    }
}

const EmptyState = props => (
    <div className={Style.emptyStateContainer}>
        <Typography type='title' align="center">
            {states[props.state]['message']}
        </Typography>
    </div>
)

export default EmptyState