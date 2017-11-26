import React, { Compoenent } from 'react'
import SvgIcon from 'mui-next/SvgIcon'
import Icon from 'mui-next/Icon'

export const MathIcon = props => (
    <SvgIcon {...props}>
        <path d="M13,4.2V3C13,2.4 12.6,2 12,2V4.2C9.8,4.6 9,5.7 9,7C9,7.8 9.3,8.5 9.8,9L4,19.9V22L6.2,20L11.6,10C11.7,10 11.9,10 12,10C13.7,10 15,8.7 15,7C15,5.7 14.2,4.6 13,4.2M12.9,7.5C12.7,7.8 12.4,8 12,8C11.4,8 11,7.6 11,7C11,6.8 11.1,6.7 11.1,6.5C11.3,6.2 11.6,6 12,6C12.6,6 13,6.4 13,7C13,7.2 12.9,7.3 12.9,7.5M20,19.9V22H20L17.8,20L13.4,11.8C14.1,11.6 14.7,11.3 15.2,10.9L20,19.9Z" />
    </SvgIcon>
)

export const EnglishIcon = props => (
    <SvgIcon {...props}>
        <path d="M13,12H20V13.5H13M13,9.5H20V11H13M13,14.5H20V16H13M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M21,19H12V6H21" />
    </SvgIcon>
)

export const ScienceIcon = props => (
    <SvgIcon {...props}>
        <path d="M3,3H21V5A2,2 0 0,0 19,7V19A2,2 0 0,1 17,21H7A2,2 0 0,1 5,19V7A2,2 0 0,0 3,5V3M7,5V7H12V8H7V9H10V10H7V11H10V12H7V13H12V14H7V15H10V16H7V19H17V5H7Z" />
    </SvgIcon>
)

export const SocialScienceIcon = props => (
    <Icon>
        gavel
    </Icon>
)

export const LanguageIcon = props => (
    <SvgIcon {...props}>
        <path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </SvgIcon>
)

export const SchoolIcon = props => (
    <Icon>
        school
    </Icon>
)

export default props => {
    switch (props.subject) {
        case 'math':
            return <MathIcon />
        case 'english':
            return <EnglishIcon />
        case 'science':
            return <ScienceIcon />
        case 'social studies':
            return <SocialScienceIcon />
        case 'world language':
            return <LanguageIcon />
        default:
            return <SchoolIcon />
    }
}