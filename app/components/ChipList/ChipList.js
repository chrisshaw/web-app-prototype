import React from 'react'
import Chip from 'material-ui/Chip'
import Style from './ChipList.css'

const ChipList = props => (
    <div className={`${Style.chipList} ${{
                            left: Style.leftAligned,
                            right: Style.rightAligned,
                            center: Style.centered
                        }[props.align]}
                    `}
    >
        {props.items.map( (item, i) => <Chip
                                            key={i}
                                            label={item}
                                            className={Style.chip}
                                            onClick={props.clickHandler}
                                        />
        )}
    </div>
)

export default ChipList