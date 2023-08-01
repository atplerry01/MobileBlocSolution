/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-trailing-spaces */
/* eslint-disable quotes */
import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect} from 'react';
import * as Animatable from 'react-native-animatable';

import {useNavigation} from '@react-navigation/native';
import {HealthBImage} from '../assets';

const HomeScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1 relative">
      {/* First Section */}

      <View className="flex-row px-6 mt-8 items-center space-x-2">
        <View className="w-16 h-16 bg-black rounded-full items-center justify-center">
          <Text className="text-[#00BCC9] text-1xl font-semibold">Health</Text>
        </View>

        <Text className="text-[#2A2B4B] text-3xl font-semibold">Bloc</Text>
      </View>

      {/* Second Section */}
      <View className="px-6 mt-8 space-y-3">
        <Text className="text-[#3C6072] text-[33px]">Build Engaging digital health products</Text>
        <Text className="text-[#00BCC9] text-[30px] font-bold">
          Securely &
        </Text>
        <Text className="text-[#f2a03c] text-[30px] font-bold">
          Faster
        </Text>

        <Text className="text-[#3C6072] text-base">

        </Text>
      </View>

      {/* Circle Section */}
      <View className="w-[400px] h-[400px] bg-[#00BCC9] rounded-full absolute bottom-36 -right-36"></View>
      <View className="w-[400px] h-[400px] bg-[#E99265] rounded-full absolute -bottom-28 -left-36"></View>

      {/* Image container */}
      <View className="flex-1 relative items-center justify-centerr">
        <Animatable.Image
          animation="fadeIn"
          easing="ease-in-out"
          style={{width:'90%',height:250,marginTop:0,}}
          source={HealthBImage}
          className="w-full h-full object-cover mt-20"
        />

        <TouchableOpacity
          // onPress={() => navigation.navigate("Patient")}
          onPress={() => navigation.navigate('Login')}
          className="absolute bottom-20 w-24 h-24 border-l-2 border-r-2 border-t-4 border-[#00BCC9] rounded-full items-center justify-center">
          <Animatable.View
            animation={'pulse'}
            easing="ease-in-out"
            iterationCount={'infinite'}
            className="w-20 h-20 items-center justify-center rounded-full bg-[#00BCC9]">
            <Text className="text-gray-50 text-[36px] font-semibold">Go</Text>
          </Animatable.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
