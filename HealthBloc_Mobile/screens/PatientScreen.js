/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
/* eslint-disable semi */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {HeroImage} from '../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decodeToken} from 'react-jwt';
import {jwtToken} from '../api/helper';
import axios from 'axios';

const api = 'http://healthbloc.whycespace.com/api';

export default PatientScreen = ({navigation: {navigate}}) => {
  const navigation = useNavigation();
  const loadingRef = useRef();

<<<<<<< HEAD
  const [comments, setComments] = useState(myData);
  //
  const [patients, setPatients] = useState([]);
=======
  // const [patients, setPatients] = useState([]);
  const [patients, setPatients] = useState(null);
>>>>>>> 03d4e8325a3a0310de8b298fbd63e58d644ffc84
  const [provider, setProvider] = useState('');

  useEffect(() => {
    getPatients();
  }, []);

  useEffect(() => {
    console.log(provider);
    setTimeout(() => {
      getPatients();
    }, 10);
  }, []);

  const getPatients = useCallback(async () => {
    // return
    const providerId = await decodeToken(jwtToken)?.ProviderId;
    console.log('get', providerId)
    axios
      .get(`${api}/Patients/ByProviderId/${providerId}`)
      .then(response => {
        // console.log(response.data);
        setPatients(response.data.data);
        getHealthCareProvider(providerId);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const getHealthCareProvider = async id => {
    try {
      const name = await axios.get(`${api}/HealthProviders/${id}`);
      setProvider(name.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (patients?.length === 0) {
    return (
      <Text ref={loadingRef} onPress={() => console.log('pressed!')}>
        No Patients
      </Text>
    );
  }

  if (!provider) {
    return (
      <Text ref={loadingRef} onPress={() => console.log('pressed!')}>
        Loading
      </Text>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1 relative">
      {/* Second Section */}
      <View className="px-6 mt-8 space-y-3">
        <Text className="text-[#3C6072] text-[25px]">{provider?.name}</Text>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text className="text-[#3C6072] text-[15px]">Patients list</Text>
        </View>
      </View>

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
              onPress={() =>
                navigate('Patient Detail', {
                  patientId: Notification.id,
                  providerId: provider.id,
                })
              }>
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
      />

      {/* Image container */}
      <View className="flex-1 relative items-center justify-center">
        <Animatable.Image
          animation="fadeIn"
          easing="ease-in-out"
          source={HeroImage}
          className="w-full h-full object-cover mt-20"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Tag')}
          className="absolute bottom-20 w-24 h-24 border-l-2 border-r-2 border-t-4 border-[#00BCC9] rounded-full items-center justify-center">
          <Animatable.View
            animation={'pulse'}
            easing="ease-in-out"
            iterationCount={'infinite'}
            className="w-20 h-20 items-center justify-center rounded-full bg-[#00BCC9]">
            <Text className="text-gray-50 text-[22px] font-semibold">Scan</Text>
          </Animatable.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  // }
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  container: {
    paddingRight: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  image: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginLeft: 20,
  },
  time: {
    fontSize: 11,
    color: '#808080',
  },
  name: {
    fontSize: 16,
    color: 'black',
  },
  section2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00BCC9',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  loginBtn: {
    borderRadius: 20,
    padding: 10,
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00BCC9',
  },
});
