/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

// Enable layout animations on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Accordion = ({title, content}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.titleContainer} onPress={toggleAccordion}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.contentContainer}>
          <>{content}</>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  titleContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    color: '#000',
  },
  contentContainer: {
    padding: 10,
    backgroundColor: '#ffffff',
  },
  content: {
    fontSize: 14,
  },
});

export default Accordion;
