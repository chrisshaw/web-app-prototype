import React, { Component } from 'react'
import { connect } from 'react-redux'

import DropdownList from 'react-widgets/lib/DropdownList'
import Card, { CardHeader, CardContent, CardActions } from 'mui-next/Card'
import Button from 'mui-next/Button'

import { withStyles } from 'mui-next/styles'
import { grey } from 'mui-next/colors'
import Style from './FocusAreaAdder.css'
import { FocusAreaIconButton } from '../FocusArea/FocusArea'

import {
    globalGetFocusAreaOptions
} from '../../reducers'

import {

} from '../../actions/pathbuilder/pathviewerActionCreators'

const styles = theme => ({
    rule: {
        flex: 1,
        borderBottom: `1px solid ${theme.palette.shades.light.text.lightDivider}`
    },
    button: {
        flex: 0,
        color: grey[500]
    }
})

const AddDivider = props => (
    <div className={Style.divider}>
        <div className={props.classes.rule} />
        <FocusAreaIconButton
            className={props.classes.button}
            icon='add'
            clickHandler={props.clickHandler}
        />
    </div>
)

const StyledDivider = withStyles(styles, { withTheme: true })(AddDivider)

class FocusAreaAdder extends Component {
    state = {
        isAdding: false,
        focusArea: null
    }

    handleClick = () => this.setState({ isAdding: true })

    handleChange = value => this.setState({ focusArea: value })

    handleCancel = () => this.setState({ isAdding: false })

    handleSave = () => {
        this.props.addHandler(this.state.focusArea._id)
        this.setState({ isAdding: false })
    }

    render() {
        if (!this.state.isAdding) {
            return <StyledDivider clickHandler={this.handleClick} />
        } else {
            return (
                <Card className={Style.card}>
                    <CardHeader title="Select the concept you'd like to add." />
                    <CardContent>
                        <DropdownList
                            valueField="_id"
                            textField="name"
                            value={this.state.focusArea}
                            filter="contains"
                            data={this.props.focusAreas}
                            onChange={this.handleChange}
                        />
                    </CardContent>
                    <CardActions>
                        <Button onClick={this.handleCancel} >
                            Cancel
                        </Button>
                        <Button disabled={this.state.focusArea === null} onClick={this.handleSave}>
                            Save
                        </Button>
                    </CardActions>
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