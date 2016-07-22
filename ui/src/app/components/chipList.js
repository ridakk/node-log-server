import React from 'react';
import Chip from 'material-ui/Chip';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const ChipList = ({ content, idKey, onRequestDelete,
                    labelKey }) =>
  <div style={styles.wrapper}>
    {content.map((data) =>
      <Chip
        style={styles.chip}
        key={data[idKey]}
        onRequestDelete={() => onRequestDelete(data[idKey])}
      >
        {data[labelKey]}
      </Chip>
    )}
  </div>;

ChipList.propTypes = {
  onRequestDelete: React.PropTypes.func.isRequired,
  idKey: React.PropTypes.string.isRequired,
  labelKey: React.PropTypes.string.isRequired,
  content: React.PropTypes.array.isRequired,
};

export default ChipList;
