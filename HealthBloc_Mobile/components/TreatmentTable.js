import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TreatmentTable = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.headerCell}>{item.label}</Text>
          <Text style={styles.cell}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cell: {
    flex: 1,
    fontSize: 16,
  },
});

export default TreatmentTable;
