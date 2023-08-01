/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Accordion from './Accordion';

const TabUI = props => {
  const {
    patientTreatments,
    showTreatmentInput,
    newTreatment,
    handleTreatmentChange,
    handleTreatmentSubmit,
    loadingTreatment,
    allergies,
    showAllergyInput,
    newAllergy,
    setNewAllergy,
    handleAllergySubmit,
    loadingAllergy,
  } = props;

  const [activeTab, setActiveTab] = useState('Tab 1');

  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Tab 1' && styles.activeTab]}
          onPress={() => handleTabPress('Tab 1')}>
          <Text style={styles.tabText}>Patient Medical Information</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Tab 2' && styles.activeTab]}
          onPress={() => handleTabPress('Tab 2')}>
          <Text style={styles.tabText}>Patient allergy list</Text>
        </TouchableOpacity>
      </View>

      {/* Content for each tab */}
      {activeTab === 'Tab 1' && (
        <View style={styles.tabContent}>
          {/* <Text>Content for Tab 1</Text> */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Medical Information</Text>
            <View style={styles.sectionContent}>
              {patientTreatments?.length === 0 ? (
                <Text className="fs-5 fw-semibold mb-2">
                  No Medical treatment added yet
                </Text>
              ) : (
                patientTreatments.map(item => (
                  <Accordion
                    key={item.id}
                    title={item.treatmentName}
                    content={
                      <>
                        <View
                          style={{display: 'flex', flexDirection: 'column'}}>
                          <Text style={styles.sectionItemTitle}>
                            Treatment Details:
                          </Text>
                          <Text> {item.treatmentDetails} </Text>
                        </View>
                        <View
                          style={{display: 'flex', flexDirection: 'column'}}>
                          <Text style={styles.sectionItemTitle}>
                            Treatment Medication:
                          </Text>
                          <Text> {item.treatmentMedication} </Text>
                        </View>
                      </>
                    }
                  />
                ))
              )}
            </View>
            {showTreatmentInput && (
              <>
                <View style={styles.inputView}>
                  <TextInput
                    style={{
                      ...styles.sectionItemDesc,
                      borderWidth: 1,
                      marginBottom: 10,
                      padding: 5,
                      borderColor: '#888',
                    }}
                    value={newTreatment.treatmentName}
                    placeholder="Enter treatment name"
                    placeholderTextColor="#003f5c"
                    onChangeText={handleTreatmentChange.bind(
                      this,
                      'treatmentName',
                    )}
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    style={{
                      ...styles.sectionItemDesc,
                      borderWidth: 1,
                      marginBottom: 10,
                      padding: 5,
                      borderColor: '#888',
                    }}
                    value={newTreatment.treatmentDetails}
                    placeholder="Enter treatment details"
                    placeholderTextColor="#003f5c"
                    onChangeText={handleTreatmentChange.bind(
                      this,
                      'treatmentDetails',
                    )}
                  />
                </View>
                <View style={styles.inputView}>
                  <TextInput
                    style={{
                      ...styles.sectionItemDesc,
                      borderWidth: 1,
                      marginBottom: 10,
                      padding: 5,
                      borderColor: '#888',
                    }}
                    value={newTreatment.treatmentMedication}
                    placeholder="Enter treatment medication"
                    placeholderTextColor="#003f5c"
                    onChangeText={handleTreatmentChange.bind(
                      this,
                      'treatmentMedication',
                    )}
                  />
                </View>
              </>
            )}
            <TouchableOpacity
              onPress={handleTreatmentSubmit}
              style={{
                ...styles.loginBtn,
                backgroundColor: '#00bcc9',
                width: '50%',
                padding: 1,
              }}>
              <Text style={{color: '#fff'}}>
                {loadingTreatment ? 'Adding...' : 'Add New Treatment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {activeTab === 'Tab 2' && (
        <View style={styles.tabContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient allergy list</Text>
            <View style={styles.sectionContent}>
              <View style={styles.sectionItem}>
                {allergies?.length === 0 ? (
                <Text className="fs-5 fw-semibold mb-2">
                  No allergies
                </Text>
              ) : allergies.map(item => (
                  <Text
                    key={item.id}
                    style={{
                      ...styles.sectionItemDesc,
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      marginBottom: 10,
                      padding: 3,
                      paddingLeft: 10,
                      borderColor: '#888',
                    }}>
                    {item.name}
                  </Text>
                ))}
                {showAllergyInput && (
                  <View style={styles.inputView}>
                    <TextInput
                      style={{
                        ...styles.sectionItemDesc,
                        borderWidth: 1,
                        marginBottom: 10,
                        padding: 5,
                        borderColor: '#888',
                      }}
                      value={newAllergy}
                      placeholder="Enter Allergy"
                      placeholderTextColor="#003f5c"
                      onChangeText={setNewAllergy}
                    />
                  </View>
                )}
                <TouchableOpacity
                  onPress={handleAllergySubmit}
                  style={{
                    ...styles.loginBtn,
                    backgroundColor: '#00bcc9',
                    width: '50%',
                    padding: 1,
                  }}>
                  <Text style={{color: '#fff'}}>
                    {loadingAllergy ? 'Adding...' : 'Add New Allergy'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 1,
  },
  sectionTitle: {
    fontSize: 19,
    paddingBottom:10,
    fontWeight: '600',
    color: '#000',
  },
  sectionContent: {
    marginTop: 2,
  },
  sectionItem: {
    marginVertical: 3,
    color: '#000',
  },
  sectionItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 5,
    color: '#000',
  },
  sectionItemDesc: {
    fontSize: 14,
    color: '#000',
  },
  loginBtn: {
    width: '40%',
    borderRadius: 25,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: 'cyan',
  },
});

export default TabUI;
