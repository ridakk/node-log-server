import React from 'react';
import Chip from 'material-ui/Chip';
import Button from './button';

class ChipList extends React.Component {
  constructor(props) {
    super(props);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.state = {
      chipData: this.props.content ? this.props.content : []
    }
  }

  handleRequestDelete(key){
    console.log('chip delete for item: ' + key)

    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
  };

  render() {
    let self = this;
    return (
      <div>
        {self.state.chipData.map(function(data) {
            return <Chip
                    key={data[self.props.idKey]}
                    onRequestDelete={() => self.handleRequestDelete(data[self.props.idKey])}
                  >
                    {data[self.props.labelKey]}
                  </Chip>
        })}
      </div>
    )
  }
}

export default ChipList;
