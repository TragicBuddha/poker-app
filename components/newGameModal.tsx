// Modal that will create a newGame object containing data to send
import React, { useState } from 'react';
import { Image, ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import BlindsPicker from './pickers/blindsPicker';
import DatePicker from './pickers/datePicker';
import LocationPicker from './pickers/locationPicker';
import TimePicker from './pickers/timePicker';

// Defines our modal
interface AddGameModalProps {
  isVisible: boolean;
  onClose: () => void;
}

// Defines our game types and turns them into strings
enum GameType {
  CASH = 'CASH',
  TOURNAMENT = 'TOURNAMENT',
}

// initializing our modal adding our props and creating inital variables and their state
const AddGameModal: React.FC<AddGameModalProps> = ({ isVisible, onClose }) => {
  // Game type state
  const [gameType, setGameType] = useState<GameType | null>(null);

  // Blind State
  const [blindAmount, setBlindAmount] = useState('');
  const blindOptions = ['0.25/0.50', '1/3'];

  // Location State
  const [location, setLocation] = useState('');
  const locationOptions = ['Dept. of Interiors', "Terwilliger's Midweek Madness", "David's Den", "Cherokee Harris"]
  
  // Date and time states with time functions
  const [gameDate, setGameDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [activeTimeField, setActiveTimeField] = useState<'start' | 'end' | null>(null);
  const openTimePicker = (field: 'start' | 'end') => {
    setActiveTimeField(field);
    setTimePickerVisible(true);
  };

  const onChangeTime = (time: Date) => {
    if (activeTimeField === 'start') setStartTime(time);
    else if (activeTimeField === 'end') setEndTime(time);
  };

  // Placement and money states
  const [tournamentPlace, setTournamentPlace] = useState('');
  const placementOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11+']
  const [cashIn, setCashIn] = useState('');
  const [cashOut, setCashOut] = useState('');

  // Visibility States
  const [blindPickerVisible, setBlindPickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);

  // Function that resets our input boxes back to inital state
  const resetForm = () => {
    setGameType(null);
    setBlindAmount('');
    setGameDate(new Date());
    setLocation('');
    setTournamentPlace('');
    setCashIn('');
    setCashOut('');
  };

  // Rendering our modal 
  return (
    <Modal 
      animationType="slide"
      visible={isVisible} 
      onRequestClose={onClose}>
      <ImageBackground
        source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/app_background.png')}
        style={styles.background}
      >
        <View style={styles.modalContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setGameType(GameType.CASH)} style={styles.imageButton}>
              <Image
                source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/cashGame_button.png')}
                style={styles.image}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGameType(GameType.TOURNAMENT)} style={styles.imageButton}>
              <Image
                source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/tournamentGame_button.png')}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
          {(gameType === GameType.CASH || gameType === GameType.TOURNAMENT) && (
            <>
              <TouchableOpacity onPress={() => setLocationPickerVisible(true)} style={styles.input}>
                <Text>
                  {location || 'Location'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.input}>
                <Text>
                  {gameDate ? gameDate.toLocaleDateString([],
                  { year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setBlindPickerVisible(true)} style={styles.input}>
                <Text>
                  {blindAmount || 'Select Blinds'}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {gameType === GameType.TOURNAMENT && (
            <TextInput
              value={tournamentPlace}
              onChangeText={text => setTournamentPlace(text)}
              placeholder="Final Placing"
              style={styles.input}
            />
          )}
          {gameType === GameType.CASH && (
            <>
              <TouchableOpacity onPress={() => openTimePicker('start')} style={styles.input}>
                <Text>{startTime ? startTime.toLocaleTimeString([],
                  { hour: 'numeric',
                    minute: '2-digit'
                  }
                ) : 'Start Time'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openTimePicker('end')} style={styles.input}>
                <Text>{endTime ? endTime.toLocaleTimeString([],
                  { hour: 'numeric',
                    minute: '2-digit'
                  }) : 'End Time'}</Text>
              </TouchableOpacity>

              <TextInput
                value={cashIn}
                onChangeText={text => setCashIn(text)}
                placeholder="Cash In"
                style={styles.input}
              />
              <TextInput
                value={cashOut}
                onChangeText={text => setCashOut(text)}
                placeholder="Cash Out"
                style={styles.input}
              />
            </>
          )}
          <TouchableOpacity style={styles.saveButtonContainer}>
            <ImageBackground
              source={require('../assets/images/saveGame_button.png')}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.backButtonContainer}>
            <View style={styles.backButton}>
              <Image
                source={require('../assets/images/exit_button.png')}
                style={styles.backButtonImage}
              />
              <Text style={styles.backButtonText}>Back</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <LocationPicker
        visible={locationPickerVisible}
        selectedValue={location}
        options={locationOptions}
        onValueChange={(value) => {
          setLocation(value);}}
        onClose={() => setLocationPickerVisible(false)}
      />
      <BlindsPicker
        visible={blindPickerVisible}
        selectedValue={blindAmount}
        options={blindOptions}
        onValueChange={(value) => {
          setBlindAmount(value);}}
        onClose={() => setBlindPickerVisible(false)}
      />
      <DatePicker
        visible={datePickerVisible}
        date={gameDate ?? new Date()}
        onChangeDate={setGameDate}
        onClose={() => setDatePickerVisible(false)}
      />
      <TimePicker
        visible={timePickerVisible}
        time={
          activeTimeField === 'start'
          ? startTime ?? new Date()
          : endTime ?? new Date()}
        onChangeTime={onChangeTime}
        onClose={() => setTimePickerVisible(false)}
      />
    </Modal>
  );
};

// Styling of modal
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  imageButton: {
    marginHorizontal: 10,
  },
  image: {
    width: 150, 
    height: 150,
    marginTop: 120 
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  saveButtonContainer: {
    marginTop: 20,
  },
  saveButton: {
    height: 225,
    width: 225,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'ComicNeue-Font', 
    fontSize: 50,
    color: 'white',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonImage: {
    height: 70, 
    width: 70, 
  },
  backButtonText: {
    fontFamily: 'ComicNeue-Font', 
    fontSize: 16,
    color: 'white',
    marginTop: 0,
  },
  pickerOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closePickerButton: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closePickerText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddGameModal;
