import React from 'react'
import Chip from 'mui-next/Chip'
import Typography from 'mui-next/Typography'
import Style from './DetailDrawerContent.css'
import Toolbar from 'mui-next/Toolbar'
import IconButton from 'mui-next/IconButton'
import Icon from 'mui-next/Icon'

import ChipList from '../ChipList/ChipList'

export const DetailLineItem = ({ item, itemType, actionComponent: ActionComponent, actionProps }) => (
    <div className={Style.detailLineItem}>
        {itemType === 'chips'
            ? (
                <ChipList items={item} align='left' {...actionProps}/>
            ) : (
                    [
                        <Typography key='item' type={itemType}>
                            {item && item}
                        </Typography>,
                        ActionComponent && <ActionComponent key='action' {...actionProps} />
                    ]
            )
        }
    </div>
)

export const DetailSection = ({ header, children }) => (
    <div className={Style.detailSection}>
        <Typography type='title' gutterBottom>
            {header}
        </Typography>
        {children && children}
    </div>
)

export const TextLink = ({link, text}) => (
    <a href={link} target="_blank" rel="noopener noreferrer">
        <Typography type='body2'>
            {text}
        </Typography>
    </a>
)

export const RelatedProjectDetail = ({ projectName, drivingQuestion, topics, link }) => (
    <div className={Style.relatedProject}>
        <DetailLineItem item={projectName}
                        itemType='subheading'
                        actionComponent={TextLink}
                        actionProps={{
                            link: link,
                            text: 'View Source'
                        }}
        />
        <DetailLineItem item={drivingQuestion}
                        itemType='body2'
        />
        <DetailLineItem item={topics}
                        itemType='chips'
        />
    </div>
)

export const RelatedProjectsDetails = ({ details: relatedProjects }) => {
    const projects = relatedProjects.map( (project, i) => <RelatedProjectDetail    
                                                            projectName={project.name}
                                                            drivingQuestion={project.drivingQuestion}
                                                            topics={project.topics}
                                                            link={project.link}
                                                            key={project._id}
                                                        />
    )
    
    return (
        <DetailSection header='Related Projects'>
            {projects}
        </DetailSection>
    )
}

export const FocusAreaDetails = ({ details: focusArea }) => (
    <div>
        <DetailSection header="Related Standards">
            <DetailLineItem
                item={focusArea.standards.map(standard => standard._key)}
                itemType='chips'
            />
        </DetailSection>
        <DetailSection header="Related Focus Areas">
            {focusArea.focusAreas.length
                ? focusArea.focusAreas.map( f => (
                    <DetailLineItem
                        key={f._id}
                        item={f.name}
                        itemType='subheading'
                        actionComponent={TextLink}
                        actionProps={{
                            text: f.course
                        }}
                    />
                ) )
                : (
                    <DetailLineItem item={'No related focus areas'} itemType='body1' />
                )
            }
        </DetailSection>
        <DetailSection header="Potential Peer Teachers">
            {focusArea.potentialPeerTeachers.length
                ? focusArea.potentialPeerTeachers.map( t => (
                    <DetailLineItem 
                        key={t._id}
                        item={t.name}
                        itemType='subheading'
                        actionComponent={TextLink}
                        actionProps={{
                            text: `Mastered ${t.lastMastered} days ago`
                        }}
                    />
                ) )
                : (
                    <DetailLineItem item={'No potential peer teachers yet'} itemType='body1' />
                )
            }
        </DetailSection>
    </div>
)

const DetailDrawerContent = ({title, closeHandler, children}) => (
    <div className={Style.detailDrawerContent}>
        <Toolbar 
            className={Style.detailDrawerHeader}
            disableGutters
        >
            <Typography type='display1'>
                {title}
            </Typography>
            <IconButton
                onClick={closeHandler}
            >
                <Icon>
                    close
                </Icon>
            </IconButton>
        </Toolbar>
        {children && children}
    </div>
)

export default DetailDrawerContent