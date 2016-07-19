import React from 'react';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  }
};

class ChipList extends React.Component {

  render() {
    const self = this;

    return (
      <div style={styles.wrapper}>
        {self.props.content.map((data) => {
            return <Chip
                      style={styles.chip}
                      key={data[self.props.idKey]}
                      onRequestDelete={() => self.props.onRequestDelete(data[self.props.idKey])}
                   >
                      {data[self.props.labelKey]}
                   </Chip>
        })}
      </div>
    );
  }
}

export default ChipList;
