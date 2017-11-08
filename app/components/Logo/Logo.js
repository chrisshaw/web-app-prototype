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
        <div>
            <img
                className={`${Style.brandSpacing} ${sizeClass}`}
                src='./public/assets/img/logo-symmetrical.svg'
                alt="Sidekick"
            />
        </div>
    )
}

export default Logo