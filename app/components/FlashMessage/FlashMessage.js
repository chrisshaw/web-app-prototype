import React from 'react'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar'

import { globalGetFlashMessage, globalGetFlashMessageStatus } from '../../reducers'

const FlashMessage = props => (
    <Snackbar
        open={props.open}
        message={props.message}
    />
)

const mapStateToProps = (state) => ({
    open: globalGetFlashMessageStatus(state),
    message: globalGetFlashMessage(state)
})

export default connect(mapStateToProps)(FlashMessage)