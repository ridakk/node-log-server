import React from 'react';
import Chip from 'material-ui/Chip';
import Button from './button';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

class ChipList extends React.Component {
  constructor(props) {
    super(props);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
  }

  handleRequestDelete(key){
    console.log('chip delete for item: ' + key)
  };

  render() {
    let self = this;
    return (
      <div style={styles.wrapper}>
        {self.props.content.map(function(data) {
            return <Chip
                      style={styles.chip}
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
