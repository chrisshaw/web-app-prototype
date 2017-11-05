import React from 'react'
import Style from './Logo.css'
import Typography from 'mui-next/Typography'

const Logo = props => {
    let sizeClass = '';
    switch (props.size) {
        case 'small':
            sizeClass = Style.small
            break;
        default:
            sizeClass = Style.default
    }

    return (
        <img
            className={`${Style.brandSpacing} ${sizeClass}`}
            src="./public/assets/img/sidekick.png"
            alt="Sidekick"
        />
    )
}

export default Logo