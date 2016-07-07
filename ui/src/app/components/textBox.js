import React from 'react';
import TextField from 'material-ui/TextField';

class TextBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = { errorText: '', value: props.value }
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
      let text = event.target.value.trim();
      if (text.length === 0) {
          this.setState({
              errorText: 'This field is required'
          })
          this.props.onChange('');
      } else {
          this.setState({
              errorText: ''
          })
          this.props.onChange(text);
      }
  }

  render() {
    return (
      <div>
        <TextField
          className="textFieldContainer"
          hintText={this.props.hint}
          floatingLabelText={this.props.floatingLabel}
          type={this.props.type}
          errorText= {this.state.errorText}
          onChange={this.onChange}
        /><br />
      </div>
    )
  }
}

export default TextBox;
