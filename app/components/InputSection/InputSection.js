import React, { Component } from 'react';
import helper from '../../helper';
import { connect } from 'react-redux';
import Chip from 'mui-next/Chip';
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css'
import Typography from 'mui-next/Typography'
import Style from './InputSection.css'

class InputSection extends Component {
    state = {
        value: [],
        options: []
    }

    // function called when list items are selected
    handleChange = (e, i, values) => {
        let lastElem = values.length;
        // make sure a full word supplied is in list
        if ((values[lastElem-1] !== []) && (values[lastElem-1]._id !== -1 )) {
            // verify if to be added or removed   
            if (this.props.selectedlist && this.props.selectedlist.length > 0 && this.props.selectedlist.indexOf(values[lastElem-1]) !== -1){
                // remove it       
                helper.removeChip(values[lastElem-1]._id, this.props.queryitem, this.props.dispatch);
            } else {
                helper.updateSelected(values[lastElem-1], this.props.queryitem, this.props.dispatch);
            }
        }
    }

        handleRequestDelete = id => {
        // filter list based on id
        helper.removeChip(id, this.props.queryitem, this.props.dispatch);
    }

    render() {
        return (
            <div className={Style.spacing}>
                <Typography
                    type="title"
                    gutterBottom
                >
                    {this.props.header}
                </Typography>
                <Multiselect
                    placeholder={this.props.placeholder}
                    value={this.props.value}
                    data={this.props.data}
                    valueField="id"
                    textField="name"
                    filter="contains"
                />
            </div>
        );
    }
}

export default connect()(InputSection);