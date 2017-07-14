import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';


/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class DialogExampleModal extends React.Component {

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.props.handleCancel}
      />,
      <FlatButton
        label="Submit"
        secondary={true}
        onTouchTap={this.props.handleSubmit}
      />,
    ];
    if (this.props.selectedRow){
         var data = <div>{this.props.selectedRow.firstName}</div>;
    //  console.log("selectedRow", this.props.selectedRow)

    }
   
    return (
      <div>
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={true}
          open={this.props.open}
        >
         {data}
        </Dialog>
      </div>
    );
  }
}