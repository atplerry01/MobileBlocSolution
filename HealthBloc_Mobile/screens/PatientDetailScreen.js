/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import TabUI from '../components/Tab';
import NfcManager, { Ndef, NfcTech, NdefMessage } from 'react-native-nfc-manager';

const api = 'http://healthbloc.whycespace.com/api';

function createStringArray(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i += 1) {
    var strg1 = toCSV(arr[i], "|");
    result.push(strg1);
  }
  return result;
}

function toCSV(obj, separator) {
  var arr = [];

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      arr.push(obj[key]);
    }
  }

  return arr.join(separator || ",");
}


function buildUrlPayload(valueToWrite) {

  console.log('valueToWrite: ', valueToWrite);

  var allergies = valueToWrite.allergies;
  var patientInfo = valueToWrite.patientInfo;
  var treatments = valueToWrite.treatments;

  var allergyData = Ndef.uriRecord(JSON.stringify(allergies))
  var patientInfoData = Ndef.uriRecord(JSON.stringify(patientInfo))
  var treatmentData = Ndef.uriRecord(JSON.stringify(treatments))

  const NdefArray = [];

  NdefArray.push(patientInfoData);
  NdefArray.push(allergyData);
  NdefArray.push(treatmentData);

  return Ndef.encodeMessage(NdefArray);

}

function transformEntityDate(data) {
  var res = data.split("|");
  var dateX = res[3];

  const date = new Date(dateX) // Thu Dec 16 2021 15:49:39 GMT-0600
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }
  var newDate = new Intl.DateTimeFormat('en-US', options).format(date) // '12/02/2021'

  res[3] = newDate;
  var result = toCSV(res, "|")

  return result;
}

const PatientDetailScreen = ({ route }) => {
  const [patient, setPatient] = useState(null);
  const [patientSummary, setPatientSummary] = useState(null);
  const {
    params: { patientId, providerId },
  } = route;

  const [loadingAllergy, setLoadingAllergy] = useState(false);
  const [showAllergyInput, setShowAllergyInput] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');

  const [loadingTreatment, setLoadingTreatment] = useState(false);
  const [showTreatmentInput, setShowTreatmentInput] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    patientId,
    healthProviderId: providerId,
    treatmentName: '',
    treatmentDetails: '',
    treatmentMedication: '',
  });

  useEffect(() => {
    getPatient();
  }, [getPatient]);

  const handleAllergySubmit = async event => {
    event.preventDefault();
    if (!showAllergyInput) {
      setShowAllergyInput(true);
    } else if (newAllergy) {
      setNewAllergy('');
      setLoadingAllergy(true); // Set loading state to true
      axios
        .post(`${api}/PatientHistory/${patientId}/Allery/create`, {
          patientId: patientId,
          name: newAllergy,
        })
        .then(response => {
          getPatient();
          setLoadingAllergy(false);
          setShowAllergyInput(false);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setShowAllergyInput(false);
    }
  };

  const handleTreatmentChange = (name, value) => {
    setNewTreatment({ ...newTreatment, [name]: value });
  };

  const handleTreatmentSubmit = event => {
    event.preventDefault();
    if (!showTreatmentInput) {
      setShowTreatmentInput(true);
    } else if (
      newTreatment.treatmentName &&
      newTreatment.treatmentDetails &&
      newTreatment.treatmentMedication
    ) {
      setLoadingTreatment(true); // Set loading state to true
      axios
        .post(`${api}/PatientHistory/${patientId}/Treatment/create`, {
          ...newTreatment,
          healthProviderId: providerId,
        })
        .then(async response => {
          console.log('other', response);
          await getPatient();
          setLoadingTreatment(false);
          setShowTreatmentInput(false);
          setNewTreatment({
            patientId,
            healthProviderId: '',
            treatmentName: '',
            treatmentDetails: '',
            treatmentMedication: '',
          });
        })
        .catch(error => {
          console.error(error);
          setLoadingTreatment(false);
        });
    } else {
      setShowTreatmentInput(false);
    }
  };

  const getPatient = useCallback(() => {
    axios
      .get(`${api}/Patients/ById/${patientId}`)
      .then(response => {
        setPatient(response.data.data);
        setPatientSummary(response.data.data.patientMedicalHistorySummary);
      })
      .catch(error => {
        console.error(error);
      });
  }, [patientId]);

  const patientTreatments = patient?.patientMedicalHistory?.patientTreatments;
  const allergies = patient?.patientMedicalHistory?.allergies;

  _cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  _writeNdef = async () => {
    console.log('xxx');

    //// PatientInfo
    var patientInfo = {
      id: patientSummary.patientId,
      name: patientSummary.patientName,
      provider: patientSummary.providerName,
    }

    //// Allergies
    var allergyArrayObject = patientSummary.allergies;
    var allergiesX = createStringArray(allergyArrayObject);
    var allergies = toCSV(allergiesX, "|")

    /// Treatment
    var treats = patientSummary.patientTreatments;
    var treatments = createStringArray(treats);
    var treats = [];
    
    for (var i = 0; i < treatments.length; i += 1) {
      var x = transformEntityDate(treatments[i])
      treats.push(x)
    }

    treatments = toCSV(treats, ";") // overides

    ///////////
    var patientDetails = {
      patientInfo,
      allergies,
      treatments
    };

    try {

      let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to write some NFC tags!'
      });

      let ndef = await NfcManager.getNdefMessage();

      let bytes = buildUrlPayload(patientDetails);

      await NfcManager.writeNdefMessage(bytes);
      console.warn('successfully write ndef');

      this._cleanUp();
    } catch (ex) {
      console.warn('ex', ex);
      this._cleanUp();
    }

  }



  if (!patient) {
    return <Text style={styles.name}>Loading...</Text>;
  } else {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.photo}
            source={{
              uri: 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
            }}
          />
          <Text style={styles.name}>{patient.userProfile.fullName}</Text>
          <View style={styles.contact}>
            <Icon style={styles.icon} name="local-phone" size={20} />
            <Text style={styles.title}>{patient.userProfile.phoneNumber}</Text>
          </View>

          <View style={styles.contact}>
            <TouchableOpacity
              style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black' }}
              onPress={this._writeNdef}
            >
              <Text style={{ textAlign: 'center' }}>Update Tag</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient details</Text>
            <View style={styles.sectionContent}>
              <View style={styles.contact}>
                <Icon style={styles.icon} name="person" size={20} />
                <Text style={styles.sectionItem}>
                  {patient?.userProfile.fullName?.split(' ')[0]}
                </Text>
              </View>
              <View style={styles.contact}>
                <Icon style={styles.icon} name="mail" size={20} />
                <Text style={styles.sectionItem}>
                  {patient.userProfile.email}
                </Text>
              </View>
              <View style={styles.contact}>
                <Icon style={styles.icon} name="home" size={20} />
                <Text style={styles.sectionItem}>
                  {patient.userProfile.address}
                </Text>
              </View>
            </View>
          </View>

          <TabUI
            patientTreatments={patientTreatments}
            showTreatmentInput={showTreatmentInput}
            newTreatment={newTreatment}
            handleTreatmentChange={handleTreatmentChange}
            handleTreatmentSubmit={handleTreatmentSubmit}
            loadingTreatment={loadingTreatment}
            allergies={allergies}
            showAllergyInput={showAllergyInput}
            newAllergy={newAllergy}
            setNewAllergy={setNewAllergy}
            handleAllergySubmit={handleAllergySubmit}
            loadingAllergy={loadingAllergy}
          />
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  contact: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  icon: {
    marginRight: 2,
  },

  container: {
    flex: 1,
    padding: 16,
    marginTop: 0,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  body: {},
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
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
  section2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#9400D3',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default PatientDetailScreen;
