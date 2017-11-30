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
        <div className={`${Style.brand} ${props.upper && Style.brandTopSpacing} ${props.middle && Style.brandTopSpacing} ${props.middle && Style.brandBottomSpacing} ${props.lower && Style.brandBottomSpacing}`}>
            <img
                className={sizeClass}
                src='./public/assets/img/logo-symmetrical.svg'
                alt="Sidekick"
            />
        </div>
    )
}

export default Logo