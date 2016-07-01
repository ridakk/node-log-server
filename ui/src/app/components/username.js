import React from 'react';
import TextField from 'material-ui/TextField';

class Username extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorText: '', value: props.value }
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
      let username = event.target.value.trim();
      if (username.length === 0) {
          this.setState({
              errorText: 'Please enter your user name'
          })
          this.props.onUsernameChange('');
      } else {
          this.setState({
              errorText: ''
          })
          this.props.onUsernameChange(username);
      }
  }

  render() {
    return (
      <div>
        <TextField
          className="textFieldContainer"
          hintText="Your user name"
          floatingLabelText="Username"
          type="username"
          errorText= {this.state.errorText}
          onChange={this.onChange}
        /><br />
      </div>
    )
  }
}

export default Username;
