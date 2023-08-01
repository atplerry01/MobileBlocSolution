/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';
import AndroidPrompt from '../components/AndroidPrompt';
import {decodeToken} from 'react-jwt';
import axios from 'axios';
import api, {jwtToken} from '../api/helper';

const WriteNdefScreen = props => {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [patient, setPatient] = useState('');
  const [patientData, setPatientData] = useState('');

  const androidPromptRef = useRef();

  useEffect(() => {
    getPatients();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getPatients();
    }, 10);
  }, []);

  const getPatients = useCallback(async () => {
    // return
    const providerId = await decodeToken(jwtToken)?.ProviderId;
    axios
      .get(`${api}/Patients/ByProviderId/${providerId}`)
      .then(response => {
        setPatients(response.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSelect = async id => {
    await axios
      .get(`${api}/Patients/ById/${id}`)
      .then(({data: {data}}) => {
        setPatient(data);

        // i store the patient data in the patient_Data variable
        // the patient_Data contains only the patient name,id and their patientMedicalHistory short for (pmt)

        const patient_Data = {
          patientName: data.userProfile.fullName,
          patientId: id,
          pmt: data.patientMedicalHistory.patientTreatments.map(p => ({
            treatmentName: p.treatmentName,
            treatmentMedication: p.treatmentMedication,
          })),
        };
        if (id === patientId) {
          setPatientId('');
          setPatientData(null);
        } else {
          setPatientId(id);
          setPatientData(patient_Data);
        }
        // console.log(patientData);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // This is where the writing of ndef occurs
  async function writeNdef() {
    // I am extracting the patientName, patientId and patientMedicalHistory from the patient_Data variable
    // check line 60 for reference

    const {patientName, patientId, pmt} = patientData;

    // Ndef Message can contain multiple Ndef records
    // For our instance the Ndef message contains 4 Ndef Records

    // This is the First Ndef record initialized with the patient id and Name
    const uriRecord1 = Ndef.uriRecord(
      `${JSON.stringify({
        patientName: 'Chinyere Ngozi',
        patientId: '918900ba-80cc-4a29-9c66-564e5ae6b7e2',
      })}`,
    );

    // I intialized the NdefArray with the first Ndef record
    const NdefArray = [uriRecord1];

    // here is the dynamic form but i commented it out
    // I am adding just 3 records as that is what the Ndef Message can contain
    // pmt?.slice(0, 3).forEach(item => {
    //   NdefArray.push(Ndef.uriRecord(JSON.stringify(item)));
    // });

    // I am pushing the 2nd Ndef Record to the NdefArray
    // I am also stringifying the object as the ndefRecord can contain only strings
    NdefArray.push(
      Ndef.uriRecord(
        JSON.stringify({
          treatmentName: 'Antiretroviral Therapy (ART)',
          treatmentMedication:
            'Daily meds to suppress HIV, maintain immunity, reduce transmission. Meds: Tenofovir, emtricitabine, dolutegravir, tailored to individual needs. Regular monitoring and support.',
        }),
      ),
    );

    // I am pushing the 3rd Ndef Record to the NdefArray
    NdefArray.push(
      Ndef.uriRecord(
        JSON.stringify({
          treatmentName: 'Antiretroviral Therapy (ART)',
          treatmentMedication:
            'Daily meds to suppress HIV, maintain immunity, reduce transmission. Meds: Tenofovir, emtricitabine, dolutegravir, tailored to individual needs. Regular monitoring and support.',
        }),
      ),
    );

    // I am pushing the 4th Ndef Record to the NdefArray

    NdefArray.push(
      Ndef.uriRecord(
        JSON.stringify({
          treatmentName: 'Antiretroviral Therapy (ART)',
          treatmentMedication:
            'Daily meds to suppress HIV, maintain immunity, reduce transmission. Meds: Tenofovir, emtricitabine, dolutegravir, tailored to individual needs. Regular monitoring and support.',
        }),
      ),
    );

    // Here i am encoding the array so it can be compatible with Ndef
    const bytes = Ndef.encodeMessage(NdefArray);

    try {
      if (Platform.OS === 'android') {
        androidPromptRef.current.setVisible(true);
      }
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      androidPromptRef.current.setHintText('Write success!');
    } catch (error) {
      console.log(error);
    } finally {
      await NfcManager.cancelTechnologyRequest();
      if (Platform.OS === 'android') {
        androidPromptRef.current.setVisible(false);
      }
    }
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView />
      <View style={[styles.wrapper, styles.pad]}>
        <View>
          <FlatList
            style={styles.root}
            // data={comments}
            data={patients}
            extraData={this.state}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
            keyExtractor={item => {
              return item.id;
            }}
            renderItem={item => {
              const Notification = item.item;
              return (
                <TouchableOpacity
                  style={patientId === Notification.id && styles.selected}
                  onPress={handleSelect.bind(this, Notification.id, patient)}>
                  <View style={styles.container}>
                    <Image
                      style={styles.image}
                      source={{
                        uri: 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
                      }}
                    />

                    <View style={styles.content}>
                      <View style={styles.contentHeader}>
                        <Text style={styles.name}>
                          {Notification.userProfile.fullName}
                        </Text>
                        <Text style={styles.time}>9:58 am</Text>
                      </View>
                      <Text rkType="primary3 mediumLine">
                        {Notification.userProfile.email}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListHeaderComponent={
              <Text style={{marginBottom: 5}}>List of Patients</Text>
            }
            ListFooterComponent={
              <FooterComponent
                patientData={patientData}
                writeNdef={writeNdef}
                androidPromptRef={androidPromptRef}
              />
            }
          />
        </View>
      </View>
      <SafeAreaView style={styles.bglight} />
    </View>
  );
};

const FooterComponent = ({patientData, writeNdef, androidPromptRef}) => {
  return (
    <>
      <View style={styles.data}>
        {patientData && (
          <>
            <Text>Patient data:</Text>
            <Text style={{backgroundColor: '#fff'}}>
              {JSON.stringify(patientData)}
            </Text>
          </>
        )}
      </View>
      <View>
        <TouchableOpacity style={styles.btn} onPress={writeNdef}>
          <Text>WRITE</Text>
        </TouchableOpacity>
      </View>
      <AndroidPrompt
        ref={androidPromptRef}
        onCancelPress={() => {
          NfcManager.cancelTechnologyRequest();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  pad: {
    padding: 20,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  bottom: {
    padding: 10,
    alignItems: 'center',
  },
  bglight: {
    backgroundColor: 'lightblue',
  },
  btn: {
    // width: 250,
    marginTop: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  selected: {
    backgroundColor: '#ccc',
  },
  data: {
    marginTop: 10,
  },
});

export default WriteNdefScreen;
