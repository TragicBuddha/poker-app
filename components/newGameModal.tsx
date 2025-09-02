// Modal that will create a newGame object containing data to send
import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { Image, ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { updateBankroll } from './statistics/updateBankroll';
import { db } from '/Users/hj/Desktop/ReactNative/poker-app/app/backend/firebaseConfig'
import { removeFocus } from '@/utilities/key_uti';
import BlindsPicker from './pickers/blindsPicker';
import DatePicker from './pickers/datePicker';
import LocationPicker from './pickers/locationPicker';
import TimePicker from './pickers/timePicker';
import PlacementPicker from './pickers/placementPicker';

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

  // Placement and money states
  const [totalPlayers, setTotalPlayers] = useState('')
  const [tournamentPlace, setTournamentPlace] = useState('');
  const placementOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11+']
  const [cashIn, setCashIn] = useState('');
  const [cashOut, setCashOut] = useState('');

  // Visibility States
  const [blindPickerVisible, setBlindPickerVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);
  const [placementPickerVisible, setPlacementPickerVisible] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false)


  // Function that resets our input boxes back to inital state
  const resetForm = () => {
    setGameType(null);
    setBlindAmount('');
    setGameDate(null);
    setStartTime(null);
    setEndTime(null);
    setLocation('');
    setTournamentPlace('');
    setTotalPlayers('')
    setCashIn('');
    setCashOut('');
  };

  // Function that handles setting activeField to correct time variable
  const onChangeTime = (time: Date) => {
    if (activeTimeField === 'start') setStartTime(time);
    else if (activeTimeField === 'end') setEndTime(time);
  };
  
  // Function that calculates our total hours played
  const totalHoursCalc = (startTime: Date | null, endTime: Date | null) => {
    if (startTime && endTime && endTime < startTime) {
      const msInDay = 24 * 60 * 60 * 1000;
      const endTimeFix = new Date(endTime.getTime() + msInDay);
      const milSecDiff = endTimeFix.getTime() - startTime.getTime();
      const hours = milSecDiff / 1000 / 60 / 60;
      return Math.round(hours);
    } else if (startTime && endTime) {
      const milSecDiff = endTime.getTime() - startTime.getTime();
      const hours = milSecDiff / 1000 / 60 / 60;
      return Math.round(hours);
    }
  }

  // Function that calculates our total profit for a session
  const profitLossCal = (cashIn: number, cashOut: number) => {
    const profitLoss = cashOut - cashIn
    return profitLoss
  }

  // Saves our game after save button is pressed
  const handleSaveGame = async () => {
  try {
    const gameData: any = {
      gameType,
      location,
      gameDate: gameDate ? gameDate.toISOString() : null,
    };

    if (gameType === GameType.CASH) {
      gameData.startTime = startTime ? startTime.toISOString() : null;
      gameData.endTime = endTime ? endTime.toISOString() : null;
      gameData.hoursPlayed = totalHoursCalc(startTime, endTime);
      gameData.blindAmount = blindAmount;
      gameData.cashIn = cashIn ? parseFloat(cashIn) : 0;
      gameData.cashOut = cashOut ? parseFloat(cashOut) : 0;
      gameData.profitLoss = profitLossCal(gameData.cashIn, gameData.cashOut)
    } else if (gameType === GameType.TOURNAMENT) {
      gameData.tournamentPlace = tournamentPlace;
      gameData.totalPlayers = totalPlayers ? parseFloat(totalPlayers) : 0;
      gameData.cashIn = cashIn ? parseFloat(cashIn) : 0;
      gameData.cashOut = cashOut ? parseFloat(cashOut) : 0;
      gameData.profitLoss = profitLossCal(gameData.cashIn, gameData.cashOut)
    }
    await updateBankroll(gameData.profitLoss)
    await addDoc(collection(db, "games"), gameData);
    console.log("Game saved!");
    resetForm();
    onClose();
  } catch (error) {
    console.error("Error saving game: ", error);
  }
};

  // Rendering our modal 
  return (
    // Opening Modal and setting top wrapper as image background
    <Modal 
      animationType="slide"
      visible={isVisible} 
      onRequestClose={onClose}>
      <ImageBackground
        source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/app_background.png')}
        style={styles.background}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => {
          resetForm();
          onClose();}}
          style={styles.backButtonContainer}>
          <View style={styles.backButton}>
            <Image
              source={require('../assets/images/exit_button.png')}
              style={styles.backButtonImage}
            />
            <Text style={styles.backButtonText}>Back</Text>
          </View>
        </TouchableOpacity>

        {/*Rendering entry box's for data thats needed in both cash or tournament play*/}
        {(gameType === GameType.CASH || gameType === GameType.TOURNAMENT) && (
          <>
            <TouchableOpacity onPress={() => { removeFocus(); setLocationPickerVisible(true) }} style={styles.entryTouchable}>
              <Text>
                {location || 'Location'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { removeFocus(); setDatePickerVisible(true)}} style={styles.entryTouchable}>
              <Text>
                {gameDate ? gameDate.toLocaleDateString([],
                { year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : 'Select Date'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/*Rendering entry box's for data thats needed in just tournament play*/}
        {gameType === GameType.TOURNAMENT && (
          <>
            <TextInput
              value={cashIn}
              onChangeText={text => setCashIn(text)}
              keyboardType='decimal-pad'
              placeholder="Buy in"
              style={styles.entryTouchable}
            />
            <TextInput
              value={cashOut}
              onChangeText={text => setCashOut(text)}
              keyboardType='decimal-pad'
              placeholder="We made it past the bubble?! (Cash out)"
              style={styles.entryTouchable}
            />
            <TouchableOpacity onPress={() => { removeFocus(); setPlacementPickerVisible(true) }} style={styles.entryTouchable}>
              <Text>
                {tournamentPlace || 'Final Placement'}
              </Text>
            </TouchableOpacity>
            <TextInput
              value={totalPlayers}
              onChangeText={text => setTotalPlayers(text)}
              keyboardType='decimal-pad'
              placeholder="Total Players"
              style={styles.entryTouchable}
            />
          </>
        )}

        {/*Rendering entry box's for data thats needed in just cash play*/}
        {gameType === GameType.CASH && (
          <>
            <TouchableOpacity onPress={() => {removeFocus(); openTimePicker('start')}} style={styles.entryTouchable}>
              <Text>{startTime ? startTime.toLocaleTimeString([],
                { hour: 'numeric',
                  minute: '2-digit'
                }
              ) : 'Start Time'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {removeFocus(); openTimePicker('end')}} style={styles.entryTouchable}>
              <Text>{endTime ? endTime.toLocaleTimeString([],
                { hour: 'numeric',
                  minute: '2-digit'
                }) : 'End Time'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {removeFocus(); setBlindPickerVisible(true)}} style={styles.entryTouchable}>
              <Text>
                {blindAmount || 'Select Blinds'}
              </Text>
            </TouchableOpacity>

            <TextInput
              value={cashIn}
              onChangeText={text => setCashIn(text)}
              placeholder="Cash In"
              keyboardType='decimal-pad'
              style={styles.entryTouchable}
            />
            
            <TextInput
              value={cashOut}
              onChangeText={text => setCashOut(text)}
              placeholder="Cash Out"
              keyboardType='decimal-pad'
              onFocus={() => {
                if (pickerOpen) Keyboard.dismiss();
              }}
              onEndEditing={() => Keyboard.dismiss()}
              style={styles.entryTouchable}
            />
          </>
        )}

        {/* Game Type Container, leed us to other componenets */}
        <View style={styles.gameTypeContainer}>

          <TouchableOpacity onPress={() => setGameType(GameType.CASH)} style={styles.gameTypeTouchable}>
            <Image
              source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/cashGame_button.png')}
              style={styles.gameTypeImage}
            />
            
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setGameType(GameType.TOURNAMENT)} style={styles.gameTypeTouchable}>
            <Image
              source={require('/Users/hj/Desktop/ReactNative/poker-app/assets/images/tournamentGame_button.png')}
              style={styles.gameTypeImage}
            />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSaveGame}
            style={styles.saveButtonContainer}>
          <ImageBackground
            source={require('../assets/images/saveGame_button.png')}
            style={styles.saveTouchable}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>
      
      {/* Picker Bank triggered by touchableOpacity's */}
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
      <PlacementPicker
        visible={placementPickerVisible}
        selectedValue={tournamentPlace}
        options={placementOptions}
        onValueChange={(value) => {
          setTournamentPlace(value);}}
        onClose={() => setPlacementPickerVisible(false)}
      />
    </Modal>
  );
};

// Styling of modal
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    paddingTop: 100
  },
  
  // Container styling's
  gameTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    top: 500,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 80,
  },
  saveButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 700,
    alignSelf: 'center',
    marginTop: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },

  // TouchableOpacity Styling's
  gameTypeTouchable: {
  },
  gameTypeImage: {
    width: 150, 
    height: 150,
  },
  entryTouchable: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    top: 50,
    width: '90%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center'
  },
  saveTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    width: 150,
  },
  saveButtonText: {
    fontFamily: 'ComicNeue-Font', 
    fontSize: 45,
    color: 'white',
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
