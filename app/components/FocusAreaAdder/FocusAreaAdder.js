import React, { Component } from 'react'
import { connect } from 'react-redux'

import { DropDownList } from 'react-widgets'
import Card from 'mui-next/Card'
import Style from './FocusAreaAdder.css'
import { FocusAreaIconButton } from '../FocusArea/FocusArea'

import {
    globalGetFocusAreaOptions
} from '../../reducers'

const AddDivider = props => (
    <div className={Style.divier}>
        <hr className={Style.rule} />
        <FocusAreaIconButton
            icon='add'
            clickHandler={props.clickHandler}
        />
    </div>
)

class FocusAreaAdder extends Component {
    state = {
        isAdding: false 
    }

    handleClick = () => this.setState({ isAdding: true })

    render() {
        if (!this.state.isAdding) {
            return <AddDivider clickHandler={this.handleClick} />
        } else {
            return (
                <Card>
                    <DropDownList
                        valueField="_id"
                        textField="name"
                        data={this.props.focusAreas}
                        onChange={this.props.addHandler}
                    />
                </Card>
            )
        }
    }
}

const mapStateToProps = state => ({
    focusAreas: globalGetFocusAreaOptions(state)
})

export default connect(
    mapStateToProps
)(FocusAreaAdder)