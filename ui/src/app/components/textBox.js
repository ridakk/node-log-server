import React from 'react';
import TextField from 'material-ui/TextField';

class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const text = event.target.value.trim();

    if (text.length === 0) {
      if (!this.props.disableErrorText) {
        this.setState({
          errorText: 'This field is required',
        });
      }
      this.props.onChange('');
    } else {
      this.setState({
        errorText: '',
      });
      this.props.onChange(text);
    }
  }

  render() {
    return (
      <div>
        <TextField
          defaultValue={this.props.value}
          className="textFieldContainer"
          fullWidth={this.props.fullWidth}
          hintText={this.props.hint}
          floatingLabelText={this.props.floatingLabel}
          type={this.props.type}
          errorText={this.state.errorText}
          onChange={this.onChange}
        /><br />
      </div>
    );
  }
}

TextBox.propTypes = {
  fullWidth: React.PropTypes.bool.isRequired,
  disableErrorText: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired,
  hint: React.PropTypes.string.isRequired,
  floatingLabel: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  errorText: React.PropTypes.string.isRequired,
};

export default TextBox;
