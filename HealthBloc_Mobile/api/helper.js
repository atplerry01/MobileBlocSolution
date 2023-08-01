/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isExpired} from 'react-jwt';

const api = 'http://healthbloc.whycespace.com/api';

export let jwtToken = '';
AsyncStorage.getItem('user').then(d => {
    if (d) {
        jwtToken = JSON.parse(d)['jwtToken'];
    }
}).catch((e) => console.log(e))

export async function test(cb) {
  const expired = await isExpired(jwtToken);
  if (expired) {
    AsyncStorage.removeItem('user');
    window.location.pathname = '/login';
  }
  cb();
}

export default api;
