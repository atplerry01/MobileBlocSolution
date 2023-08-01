/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import nfcManager, { NfcTech } from 'react-native-nfc-manager';
import AndroidPrompt from '../components/AndroidPrompt';
import * as Animatable from 'react-native-animatable';

const Nfc = props => {
  const { navigation } = props;
  const [hasNfc, setHasNfc] = useState(null);
  const [enabled, setEnabled] = useState(null);
  const androidPromptRef = useRef();

  useEffect(() => {
    async function checkNfc() {
      const supported = await nfcManager.isSupported();
      if (supported) {
        await nfcManager.start();
        setEnabled(await nfcManager.isEnabled());
      }
      setHasNfc(supported);
    }
    checkNfc();
  }, []);

  useEffect(() => {
    function handleUrl(url) {
      if (url) {
        navigation.navigate('DeepLinking', {
          msg: url.split('://')[1],
        });
        console.warn(url);
      }
    }

    Linking.getInitialURL().then(url => {
      handleUrl(url);
    });

    Linking.addEventListener('url', event => {
      handleUrl(event.url);
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [navigation]);

  async function readNdef() {
    try {
      if (Platform.OS === 'android') {
        androidPromptRef.current.setVisible(true);
      }
      await nfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await nfcManager.getTag();
      androidPromptRef.current.setHintText('Read success!');
      navigation.navigate('Tag', { tag });
    } catch (error) {
      return 0;
    } finally {
      nfcManager.cancelTechnologyRequest();
      if (Platform.OS === 'android') {
        androidPromptRef.current.setVisible(false);
      }
    }
  }

  function renderNfcButtons() {
    if (hasNfc === null) {
      return null;
    } else if (!hasNfc) {
      return (
        <View style={styles.wrapper}>
          <Text>Your device doesn't support NFC</Text>
        </View>
      );
    } else if (!enabled) {
      return (
        <View style={styles.wrapper}>
          <Text>Your NFC is not enabled</Text>
          <TouchableOpacity onPress={() => nfcManager.goToNfcSetting()}>
            <Text>GO TO SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => setEnabled(await nfcManager.isEnabled())}>
            <Text>CHECK AGAIN</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.bottom}>
        <Text style={styles.btn} onPress={() => navigation.navigate('Tag')}>
          READ
        </Text>
     
        <AndroidPrompt
          ref={androidPromptRef}
          onCancelPress={() => {
            nfcManager.cancelTechnologyRequest();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.wrapper}
        className="flex-1 relative items-center justify-center">
        <Text style={styles.bannerText}>SCAN</Text>
      </View>
      {renderNfcButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 42,
    textAlign: 'center',
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  btn: {
    width: 250,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Nfc;
