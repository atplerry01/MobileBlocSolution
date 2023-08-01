/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, {useEffect, useCallback, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Ndef} from 'react-native-nfc-manager';
import TabUI from '../components/Tab';
import {jwtToken} from '../api/helper';
import {decodeToken} from 'react-jwt';

const api = 'http://healthbloc.whycespace.com/api';

const TagDetailScreen = props => {
  const [patient, setPatient] = useState(null);
  const [uri, setUri] = useState(null);
  const {route} = props;
  const {tag} = route.params;
  const {navigation: {navigate}} = props

  const [loadingAllergy, setLoadingAllergy] = useState(false);
  const [showAllergyInput, setShowAllergyInput] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');

  const [loadingTreatment, setLoadingTreatment] = useState(false);
  const [showTreatmentInput, setShowTreatmentInput] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    patientId: '',
    healthProviderId: '',
    treatmentName: '',
    treatmentDetails: '',
    treatmentMedication: '',
  });

  useEffect(() => {
    //getPatient();
  }, []);

  const handleAllergySubmit = async event => {
    event.preventDefault();
    if (!showAllergyInput) {
      setShowAllergyInput(true);
    } else if (newAllergy) {
      const patientId = patient.id;
      setNewAllergy('');
      setLoadingAllergy(true); // Set loading state to true
      axios
        .post(`${api}/PatientHistory/${patientId}/Allery/create`, {
          patientId,
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
    setNewTreatment({...newTreatment, [name]: value});
  };

  const handleTreatmentSubmit = async event => {
    event.preventDefault();
    if (!showTreatmentInput) {
      setShowTreatmentInput(true);
    } else if (
      newTreatment.treatmentName &&
      newTreatment.treatmentDetails &&
      newTreatment.treatmentMedication
    ) {
      const patientId = patient.id;
      try {
        const providerId = await decodeToken(jwtToken)?.ProviderId;
        setLoadingTreatment(true); // Set loading state to true
        axios
          .post(`${api}/PatientHistory/${patientId}/Treatment/create`, {
            ...newTreatment,
            patientId,
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
      } catch (error) {}
    } else {
      setShowTreatmentInput(false);
    }
  };

  const patientTreatments = patient?.patientMedicalHistory?.patientTreatments;
  const allergies = patient?.patientMedicalHistory?.allergies;

  // useEffect(() => {
  //   if (tag.ndefMessage && tag.ndefMessage.length > 0) {
  //     const ndefRecord = tag.ndefMessage[0];
  //     if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
  //       if (ndefRecord.type.every((b, i) => b === Ndef.RTD_BYTES_URI[i])) {
  //         setUri(Ndef.uri.decodePayload(ndefRecord.payload));
  //         // getPatient();
  //       }
  //     }
  //   } else {
  //     navigate('Scan')
  //   }
  // }, [tag.ndefMessage, navigate]);

  // useEffect(() => {
  //   if (uri) {
  //     // getPatient();
  //   }
  // }, [getPatient, uri]);

  const getPatient = useCallback(async () => {
    const _patientId = "168d9b4c-3d16-4534-883a-93a872f167e5"; //JSON.parse(uri)?.patientId;
    const providerId = await decodeToken(jwtToken)?.ProviderId;
    console.log(providerId, typeof providerId);
    await axios
      .get(`${api}/Patients/ById/${_patientId}`)
      .then(({data: {data}}) => {
        console.log(data);
        // setPatient({
        //   Name: data.userProfile.fullName,
        //   email: data.userProfile.email,
        //   gender: data.userProfile.gender,
        //   address: data.userProfile.address,
        // });
        setPatient(data);
        // console.log(patient);
      })
      .catch(error => {
        console.log(error);
      });
  }, [uri]);

  // if (tag.ndefMessage && tag.ndefMessage.length > 0) {
  //   const ndefRecord = tag.ndefMessage[0];
  //   if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
  //     if (ndefRecord.type.every((b, i) => b === Ndef.RTD_BYTES_URI[i])) {
  //       uri = Ndef.uri.decodePayload(ndefRecord.payload);
  //       // setPatientId(uri);
  //     }
  //   }
  // }



  // if (patient) {
  //   return (
  //     <View style={styles.wrapper}>
  //       <Text style={styles.bannerText}>{JSON.stringify(patient)}</Text>
  //     </View>
  //   );
  // }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.photo}
          source={{
            uri: 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
          }}
        />
        <Text style={styles.name}>{'Akinsanya Olanrewaju'}</Text>
        <View style={styles.contact}>
          <Icon style={styles.icon} name="local-phone" size={20} />
          <Text style={styles.title}>{'+2348099898908'}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient details</Text>
          <View style={styles.sectionContent}>
            <View style={styles.contact}>
              <Icon style={styles.icon} name="person" size={20} />
              <Text style={styles.sectionItem}>
                {'Akinsanya Olanrewaju'}
              </Text>
            </View>
            <View style={styles.contact}>
              <Icon style={styles.icon} name="mail" size={20} />
              <Text style={styles.sectionItem}>
                {'atplerry@gmail.com'}
              </Text>
            </View>
            <View style={styles.contact}>
              <Icon style={styles.icon} name="home" size={20} />
              <Text style={styles.sectionItem}>
                {'11/4 Kings Meadow, Edinburgh'}
              </Text>
            </View>
          </View>
        </View>

        {/* <TabUI
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
        /> */}
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  btn: {
    width: 250,
    marginBottom: 15,
  },
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

export default TagDetailScreen;
