/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

function alert(message) {
  Alert.alert('Info', message, [
    {
      text: 'Okay',
    },
  ]);
}

export default function Login({navigation: {navigate}}) {
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: '',
  });

  const handleChange = (name, value) => {
    setLoginInfo({...loginInfo, [name]: value});
  };

  const handleSubmit = async event => {
    if (0) {
      return navigate('Scan');
    }
    await axios
      .post('http://healthbloc.whycespace.com/login/', loginInfo)
      .then(async response => {
        // Reset form data

        if (response.data.responseCode === 200) {
          if (
            response.data.data &&
            response.data.data.userDetails.isDoctor === false
          ) {
            alert('This portal is not enable for Patients');
          } else {
            await AsyncStorage.setItem(
              'user',
              JSON.stringify(response.data.data),
            );

            navigate('Patients');
          }
        } else {
          alert(response.data.message);
        }

        setLoginInfo({username: '', password: ''});
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false); // Set loading state to false
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Username"
          value={loginInfo.username}
          placeholderTextColor="#003f5c"
          onChangeText={handleChange.bind(this, 'username')}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          value={loginInfo.password}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={handleChange.bind(this, 'password')}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
        <Text style={{color: '#fff'}}>{loading ? 'Loading' : 'LOGIN'}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    borderBottomWidth: 1,
    width: '80%',
    height: 45,
    marginBottom: 20,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    paddingLeft: 0,
    marginLeft: 0,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: '85%',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: '#00BCC9',
  },
});
