import React, { Component } from 'react';
import helper from '../../helper';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css'
import Typography from 'material-ui/Typography'
import Style from './InputSection.css'

class InputSection extends Component {

    handlChange = (v, e) => {
        const { action, dataItem, ...rest } = e
        this.props.changeHandler({ action, dataItem })
    }

    render() {
        const { placeholder, value, data, ...theRest } = this.props
        return (
            <div className={Style.spacing}>
                <Typography
                    type="title"
                    gutterBottom
                >
                    {this.props.header}
                </Typography>
                <Multiselect
                    placeholder={placeholder}
                    value={value}
                    data={data}
                    onChange={this.handlChange}
                    {...theRest}
                    filter="contains"
                />
            </div>
        );
    }
}

export default InputSection;