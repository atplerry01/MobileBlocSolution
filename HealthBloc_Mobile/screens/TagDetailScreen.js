import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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

function createTreatmentItems(namesArray) {
  return {
    treatmentName: namesArray[0],
    treatmentDetails: namesArray[1],
    treatmentMedication: namesArray[2],
    createdOn: namesArray[3]
  }
}

class TagDetailScreen extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      initPage: true,
      patientDetails: {},
    }
  }

  componentDidMount = async () => {
    NfcManager.start();
  }

  componentWillUnmount() {
    this._cleanUp();
  }

  _cleanUp = () => {
    NfcManager.cancelTechnologyRequest().catch(() => 0);
  }

  _readNdef = async () => {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();

      this.setState({ initPage: false });

      var patientInfo = {};
      var allergies = [];
      var treatments = [];

      for (let i = 0; i < tag.ndefMessage.length; i++) {
        var message = Ndef.uri.decodePayload(tag.ndefMessage[i].payload);

        if (i == 0) {
          patientInfo = JSON.parse(message)
          this.setState({ patientInfo })
        } else if (i == 1) {
          var allerg = JSON.parse(message);
          let arr = allerg.split('|');
          allergies = arr;
          this.setState({ allergies })
        } else {
          var treats = JSON.parse(message);
          let treatsLists = treats.split(';');

          console.log('===> treatsLists ===', treatsLists);

          // createTreatmentItems
          treatsLists.forEach(item => {
            var xx = item.split('|');
            var treat = createTreatmentItems(xx)
            treatments.push(treat);
          });
        }

        this.setState({ treatments })
      }

      console.log(this.state.patientInfo)
      console.log(this.state.allergies)
      console.log(this.state.treatments)

    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  render() {
    console.log(this.state.patientInfo);

    return (
      <ScrollView style={styles.container}>


        {this.state.initPage &&
          <View style={styles.header}>

            <Image
              style={styles.photo}
              source={{
                uri: 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
              }}
            />

            <Text style={styles.name}>{'Scan Tag ...'}</Text>

            <View style={styles.contact}>
              <TouchableOpacity
                style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black' }}
                onPress={this._readNdef}
              >
                <Text style={{ textAlign: 'center' }}>Read Tag</Text>
              </TouchableOpacity>
            </View>
          </View>
        }

        {
          !this.state.initPage &&
          <View>

            <View style={styles.header}>
              <Image
                style={styles.photo}
                source={{
                  uri: 'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
                }}
              />
              <Text style={styles.name}>{this.state.patientInfo && this.state.patientInfo.name}</Text>
              <View style={styles.contact}>
                <Icon style={styles.icon} name="home" size={20} />
                <Text style={styles.title}>{this.state.patientInfo && this.state.patientInfo.provider}</Text>
              </View>

              <View style={styles.contact}>
                <TouchableOpacity
                  style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black' }}
                  onPress={this._readNdef}
                >
                  <Text style={{ textAlign: 'center' }}>Read Tag</Text>
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
                      {this.state.patientInfo && this.state.patientInfo.name}
                    </Text>
                  </View>

                  <View style={styles.contact}>
                    <Icon style={styles.icon} name="home" size={20} />
                    <Text style={styles.sectionItem}>
                      {this.state.patientInfo && this.state.patientInfo.provider}
                    </Text>
                  </View>
                </View>
              </View>
            </View>



            <View style={{ paddingBottom: 20 }}>
              <Text style={[styles.sectionTitle, { paddingBottom: 10 }]}>Patient Treatments</Text>

              {this.state.treatments &&
                this.state.treatments.map((item, index) => (
                  <View>
                    <View style={[ styles.row, { paddingBottom: 10 }]}>
                      <Text style={[{ fontWeight: 900 }]}>Treatment: </Text>
                      <Text>{item.treatmentName}</Text>
                    </View>

                    <View style={[ styles.row, { paddingBottom: 10 }]}>
                      <Text style={{ fontWeight: 900 }}>Details: </Text>
                      <Text>{item.treatmentDetails}</Text>
                    </View>

                    <View style={[styles.row, { paddingBottom: 10 }]}>
                      <Text style={{ fontWeight: 900 }}>Medications: </Text>
                      <Text>{item.treatmentMedication}</Text>
                    </View>

                    <View style={[ styles.row, { paddingBottom: 10 }]}>
                      <Text style={{ fontWeight: 900 }}>Date Created: </Text>
                      <Text>{item.createdOn}</Text>
                    </View>
                    <View>
                      <Text>{'......................'}</Text>
                    </View>
                  </View>
                ))
              }


            </View>

            <View style={{ paddingBottom: 50 }}>
              <Text style={[styles.sectionTitle, { paddingBottom: 10 }]}>Patient Allergies</Text>

              {this.state.allergies &&
                this.state.allergies.map((item, index) => (
                  <View style={styles.row} key={index}>
                    <Text style={{ paddingBottom: 10 }}>{item}</Text>
                  </View>
                ))
              }

            </View>
          </View>
        }

      </ScrollView>
    );
  }




}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'left'
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

export default TagDetailScreen