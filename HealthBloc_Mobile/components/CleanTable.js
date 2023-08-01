import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CleanTable = ({ data }) => {
  return (
    <View style={styles.container}>
      {/* Table Headers */}
      <View style={styles.row}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Age</Text>
        <Text style={styles.headerCell}>Occupation</Text>
      </View>

      {/* Table Rows */}
      {data.map((item, index) => (
        <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]} key={index}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.age}</Text>
          <Text style={styles.cell}>{item.occupation}</Text>
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
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  oddRow: {
    backgroundColor: '#fff',
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

export default CleanTable;
