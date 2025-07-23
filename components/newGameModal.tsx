// Modal that will create a newGame object containing data to send
import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, View, ImageBackground, TouchableOpacity, Image, Text } from 'react-native';


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
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [gameDate, setGameDate] = useState('');
  const [location, setLocation] = useState('');
  const [tournamentPlace, setTournamentPlace] = useState('');
  const [cashIn, setCashIn] = useState('');
  const [cashOut, setCashOut] = useState('');

  // Function that resets our input boxes back to inital state
  const resetForm = () => {
    setGameType(null);
    setGameDate('');
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
              <TextInput
                value={gameDate}
                onChangeText={text => setGameDate(text)}
                placeholder="Game Date"
                style={styles.input}
              />
              <TextInput
                value={location}
                onChangeText={text => setLocation(text)}
                placeholder="Location"
                style={styles.input}
              />
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
});

export default AddGameModal;
