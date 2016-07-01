import React from 'react';
import TextField from 'material-ui/TextField';

class Password extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorText: '', value: props.value }
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
      let username = event.target.value.trim();
      if (username.length === 0) {
          this.setState({
              errorText: 'Please enter your password'
          })
          this.props.onPasswordChange('');
      } else {
          this.setState({
              errorText: ''
          })
          this.props.onPasswordChange(username);
      }
  }

  render() {
    return (
      <div>
        <TextField
          className="textFieldContainer"
          hintText="Your password"
          floatingLabelText="Password"
          type="password"
          errorText= {this.state.errorText}
          onChange={this.onChange}
        /><br />
      </div>
    )
  }
}

export default Password;
