import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  Button,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  NativeModules,
  Keyboard,
  Alert,
  Linking,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { useDispatch, useSelector, connect } from "react-redux";

import Slider from "@react-native-community/slider";
//import styles from './styles';
import data from "../data/questions.json";
import Instructions from "./Instructions";
import KeyboardView from "./KeyboardView";
import KeyboardView2 from "./KeyboardView2";
import KeyboardView3 from "./KeyboardView3";
import { saveTestScore, saveProgress } from "../thunks/";

import cStaff from "../../images/staff/C-major.png";
import dStaff from "../../images/staff/D-major.png";
import eStaff from "../../images/staff/E-major.png";
import fStaff from "../../images/staff/F-major.png";
import gStaff from "../../images/staff/G-major.png";
import aStaff from "../../images/staff/A-major.png";
import bStaff from "../../images/staff/B-major.png";

import dbStaff from "../../images/staff/D-flat-major.png";
import ebStaff from "../../images/staff/E-flat-major.png";
import fsStaff from "../../images/staff/F-sharp-major.png";
import gbStaff from "../../images/staff/G-flat-major.png";
import abStaff from "../../images/staff/A-flat-major.png";
import bbStaff from "../../images/staff/B-flat-major.png";

//https://nicedoc.io/zmxv/react-native-sound

//console.log('data: ' + JSON.stringify(data));

//console.log('instructions level 3: ' + JSON.stringify(instructions));

//https://github.com/zmxv/react-native-sound

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;

const ChordsView = ({ level, mode, props }) => {
  const dispatch = useDispatch();

  // level = 3;
  // dispatch({type: 'SET_LEVEL', level: 3});

  //console.log('mode: ' + mode);

  mode = mode - 1;

  const [quizStarted, setQuizStarted] = useState(true);
  const [instructions, setInstructions] = useState(null);

  const [principalChords, setPrincipalChords] = useState(null);
  const [relativeChords, setRelativeChords] = useState(null);
  const [alternateChords, setAlternateChords] = useState(null);

  const [restarted, setRestarted] = useState(false);
  const [staff1, setStaff] = useState(false);

  const opacity = useState(new Animated.Value(0))[0];

  const [keyStates, setKeyStates] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  useEffect(() => {
    //console.log('pitch level changed');
    //populateInstructions();
  }, [level]);

  //audio playhead

  Animated.timing(opacity, {
    toValue: 1,
    duration: 1500,
    useNativeDriver: false,
  }).start();

  //init load
  var level1 = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Eb", "Bb", "F"];

  var modename = level1[mode] + " Major";

  useEffect(() => {
    var key = level1[mode];

    //console.log('key: ' + key);
    var chords;
    var staff;

    if (key == "C") {
      chords = data.DivineChords.C;
      staff = cStaff;
    } else if (key == "G") {
      chords = data.DivineChords.G;
      staff = gStaff;
    } else if (key == "D") {
      chords = data.DivineChords.D;
      staff = dStaff;
    } else if (key == "A") {
      chords = data.DivineChords.A;
      staff = aStaff;
    } else if (key == "E") {
      chords = data.DivineChords.E;
      staff = eStaff;
    } else if (key == "B") {
      chords = data.DivineChords.B;
      staff = bStaff;
    } else if (key == "F#") {
      chords = data.DivineChords.Fs;
      staff = fsStaff;
    } else if (key == "Db") {
      chords = data.DivineChords.Db;
      staff = dbStaff;
    } else if (key == "Eb") {
      chords = data.DivineChords.Eb;
      staff = ebStaff;
    } else if (key == "Bb") {
      chords = data.DivineChords.Bb;
      staff = bbStaff;
    } else if (key == "Gb") {
      chords = data.DivineChords.Gb;
      staff = gbStaff;
    } else if (key == "Ab") {
      chords = data.DivineChords.Ab;
      staff = abStaff;
    } else if (key == "F") {
      chords = data.DivineChords.F;
      staff = fStaff;
    }
    setPrincipalChords(chords.principal);
    setRelativeChords(chords.relative);
    setAlternateChords(chords.alternate);
    setStaff(staff);

    //console.log('chords: ' + JSON.stringify(chords));
    //console.log('chords: ' + JSON.stringify(chords));
  }, []);

  useEffect(() => {
    if (alternateChords) {
      //console.log('alt: ' + JSON.stringify(alternateChords));
    }
  }, [alternateChords]);

  useEffect(() => {
    if (principalChords) {
      //console.log('principal: ' + JSON.stringify(principalChords));
    }
  }, [principalChords]);

  useEffect(() => {
    if (relativeChords) {
      //console.log('relative: ' + JSON.stringify(relativeChords));
    }
  }, [relativeChords]);

  const populateInstructions = () => {
    var instructions; // = data.Interval.level3Instructions;

    if (mode == 1) {
      instructions = data.Pitch.level1Instructions;
    } else if (mode == 2) {
      instructions = data.Pitch.level2Instructions;
    } else if (mode == 3) {
      instructions = data.Pitch.level3Instructions;
    } else if (mode == 4) {
      instructions = data.Pitch.level4Instructions;
    } else if (mode == 5) {
      instructions = data.Pitch.level5Instructions;
    }

    setInstructions(instructions);
  };

  const showChords = (key, type) => {
    //console.log('press chord: ' + key);

    var codes;

    if (key == "C") {
      codes = data.KeyCodes.C;
    } else if (key == "G") {
      codes = data.KeyCodes.G;
    } else if (key == "D") {
      codes = data.KeyCodes.D;
    } else if (key == "A") {
      codes = data.KeyCodes.A;
    } else if (key == "E") {
      codes = data.KeyCodes.E;
    } else if (key == "B") {
      codes = data.KeyCodes.B;
    } else if (key == "F#") {
      codes = data.KeyCodes.Fs;
    } else if (key == "Db") {
      codes = data.KeyCodes.Db;
    } else if (key == "Eb") {
      codes = data.KeyCodes.Eb;
    } else if (key == "Bb") {
      codes = data.KeyCodes.Bb;
    } else if (key == "F") {
      codes = data.KeyCodes.F;
    } else if (key == "G7") {
      codes = data.KeyCodes.G7;
    } else if (key == "Am") {
      codes = data.KeyCodes.Am;
    } else if (key == "Dm") {
      codes = data.KeyCodes.Dm;
    } else if (key == "Em") {
      codes = data.KeyCodes.Em;
    } else if (key == "C6") {
      codes = data.KeyCodes.C6;
    } else if (key == "Cdim") {
      codes = data.KeyCodes.Cdim;
    } else if (key == "Caug") {
      codes = data.KeyCodes.Caug;
    } else if (key == "F6") {
      codes = data.KeyCodes.F6;
    } else if (key == "Am6") {
      codes = data.KeyCodes.Am6;
    } else if (key == "G") {
      codes = data.KeyCodes.G;
    } else if (key == "D7") {
      codes = data.KeyCodes.D7;
    } else if (key == "Bm") {
      codes = data.KeyCodes.Bm;
    } else if (key == "G6") {
      codes = data.KeyCodes.G6;
    } else if (key == "Gdim") {
      codes = data.KeyCodes.Gdim;
    } else if (key == "Gaug") {
      codes = data.KeyCodes.Gaug;
    } else if (key == "Em6") {
      codes = data.KeyCodes.Em6;
    } else if (key == "A7") {
      codes = data.KeyCodes.A7;
    } else if (key == "Gm") {
      codes = data.KeyCodes.Gm;
    } else if (key == "F#m") {
      codes = data.KeyCodes.Fsm;
    } else if (key == "D6") {
      codes = data.KeyCodes.D6;
    } else if (key == "Ddim") {
      codes = data.KeyCodes.Ddim;
    } else if (key == "Daug") {
      codes = data.KeyCodes.Daug;
    } else if (key == "Bm6") {
      codes = data.KeyCodes.Bm6;
    } else if (key == "E7") {
      codes = data.KeyCodes.E7;
    } else if (key == "C#m") {
      codes = data.KeyCodes.Csm;
    } else if (key == "A6") {
      codes = data.KeyCodes.A6;
    } else if (key == "Adim") {
      codes = data.KeyCodes.Adim;
    } else if (key == "Aaug") {
      codes = data.KeyCodes.Aaug;
    } else if (key == "F#m6") {
      codes = data.KeyCodes.Fsm6;
    } else if (key == "G#7") {
      codes = data.KeyCodes.Gs7;
    } else if (key == "G#m") {
      codes = data.KeyCodes.Gsm;
    } else if (key == "E6") {
      codes = data.KeyCodes.E6;
    } else if (key == "Edim") {
      codes = data.KeyCodes.Edim;
    } else if (key == "Eaug") {
      codes = data.KeyCodes.Eaug;
    } else if (key == "Cm6") {
      codes = data.KeyCodes.Cm6;
    } else if (key == "D#m") {
      codes = data.KeyCodes.Dsm;
    } else if (key == "B6") {
      codes = data.KeyCodes.B6;
    } else if (key == "Bdim") {
      codes = data.KeyCodes.Bdim;
    } else if (key == "Baug") {
      codes = data.KeyCodes.Baug;
    } else if (key == "G#m6") {
      codes = data.KeyCodes.Gsm6;
    } else if (key == "F#") {
      codes = data.KeyCodes.Fs;
    } else if (key == "C#7") {
      codes = data.KeyCodes.Cs7;
    } else if (key == "A#m") {
      codes = data.KeyCodes.Asm;
    } else if (key == "F#6") {
      codes = data.KeyCodes.Fs6;
    } else if (key == "F#dim") {
      codes = data.KeyCodes.Fsdim;
    } else if (key == "F#aug") {
      codes = data.KeyCodes.Fsaug;
    } else if (key == "D#m6") {
      codes = data.KeyCodes.Dsm6;
    } else if (key == "Db") {
      codes = data.KeyCodes.Db;
    } else if (key == "Gb") {
      codes = data.KeyCodes.Gb;
    } else if (key == "Ab7") {
      codes = data.KeyCodes.Ab7;
    } else if (key == "Bbm") {
      codes = data.KeyCodes.Bbm;
    } else if (key == "Ebm") {
      codes = data.KeyCodes.Ebm;
    } else if (key == "Fm") {
      codes = data.KeyCodes.Fm;
    } else if (key == "Db6") {
      codes = data.KeyCodes.Db6;
    } else if (key == "Dbdim") {
      codes = data.KeyCodes.Dbdim;
    } else if (key == "Dbaug") {
      codes = data.KeyCodes.Dbaug;
    } else if (key == "Gb6") {
      codes = data.KeyCodes.Gb6;
    } else if (key == "Bbm6") {
      codes = data.KeyCodes.Bbm6;
    } else if (key == "Ab") {
      codes = data.KeyCodes.Ab;
    } else if (key == "Bb7") {
      codes = data.KeyCodes.Bb7;
    } else if (key == "Cm") {
      codes = data.KeyCodes.Cm;
    } else if (key == "Eb6") {
      codes = data.KeyCodes.Eb6;
    } else if (key == "Ebdim") {
      codes = data.KeyCodes.Ebdim;
    } else if (key == "Ebaug") {
      codes = data.KeyCodes.Ebaug;
    } else if (key == "Ab6") {
      codes = data.KeyCodes.Ab6;
    } else if (key == "Bb") {
      codes = data.KeyCodes.Bb;
    } else if (key == "F7") {
      codes = data.KeyCodes.F7;
    } else if (key == "Bb6") {
      codes = data.KeyCodes.Bb6;
    } else if (key == "Bbdim") {
      codes = data.KeyCodes.Bbdim;
    } else if (key == "Bbaug") {
      codes = data.KeyCodes.Bbaug;
    } else if (key == "Gm6") {
      codes = data.KeyCodes.Gm6;
    } else if (key == "C7") {
      codes = data.KeyCodes.C7;
    } else if (key == "Fdim") {
      codes = data.KeyCodes.Fdim;
    } else if (key == "Faug") {
      codes = data.KeyCodes.Faug;
    } else if (key == "Dm6") {
      codes = data.KeyCodes.Dm6;
    }

    dispatch({
      type: "SET_CURRENT_CHORD",
      chord: codes,
      chordType: type,
    });
  };

  const releaseChord = () => {
    //console.log('release chord');

    dispatch({
      type: "SET_CURRENT_CHORD",
      chord: "",
      chordType: "",
    });
  };

  //console.log('PL mode: ' + mode);
  //console.log('PL modename: ' + modename);

  return (
    <>
      {restarted ? (
        <Instructions
          instructions={instructions}
          modename={modename}
          level={level}
          startQuiz={() => startQuiz()}
        />
      ) : quizStarted ? (
        <>
          <View style={styles.mainContainer}>
            <ScrollView>
              <View
                style={{
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Text style={styles.headerTxt}>{modename}</Text>
                {staff1 ? (
                  <Image source={staff1} style={styles.staffImg} />
                ) : null}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.chordHeader}>Principal Chords</Text>
                </View>

                {principalChords ? (
                  <View>
                    <View style={styles.btnContainer}>
                      {principalChords.map((level, index) => {
                        return (
                          <TouchableOpacity
                            key={level}
                            onPressIn={() => {
                              showChords(level, "principal");
                            }}
                            onPressOut={() => {
                              releaseChord();
                            }}
                          >
                            <LinearGradient
                              colors={["#E2E2E2", "#004DC7"]}
                              style={styles.chordBtn}
                              key={level + 1}
                            >
                              <Text key={level + 2} style={styles.btnTxt}>
                                {level}
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : null}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.chordHeader}>Relative Minor Chords</Text>
                </View>

                {relativeChords ? (
                  <View>
                    <View style={styles.btnContainer}>
                      {relativeChords.map((level, index) => {
                        return (
                          <TouchableOpacity
                            key={level}
                            onPressIn={() => {
                              showChords(level, "relative");
                            }}
                            onPressOut={() => {
                              releaseChord();
                            }}
                          >
                            <LinearGradient
                              colors={["#E2E2E2", "#FFFE52"]}
                              style={styles.chordBtn}
                              key={level + 1}
                            >
                              <Text style={styles.btnTxt} key={level + 2}>
                                {level}
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : null}

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text style={styles.chordHeader}>Alternate Chords</Text>
                </View>
                {alternateChords ? (
                  <View>
                    <View style={styles.btnContainer}>
                      {alternateChords.map((level, index) => {
                        return (
                          <TouchableOpacity
                            key={level}
                            onPressIn={() => {
                              showChords(level, "alternate");
                            }}
                            onPressOut={() => {
                              releaseChord();
                            }}
                          >
                            <LinearGradient
                              colors={["#E2E2E2", "#1F9714"]}
                              style={styles.chordBtn}
                              key={level + 1}
                            >
                              <Text style={styles.btnTxt} key={level + 2}>
                                {level}
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ) : null}
              </View>

              <View style={{ height: 250 }} />
            </ScrollView>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                backgroundColor: "black",
                flex: 1,
              }}
            >
              {width > 450 ? <KeyboardView2 /> : <KeyboardView />}
            </View>
          </View>
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    loggedIn: state.loggedIn,
    level: state.level,
  };
};

export default connect(mapStateToProps, { saveTestScore, saveProgress })(
  ChordsView
);

let offset = Dimensions.get("screen").width / 9.2;

let whiteKeyWidth = Dimensions.get("screen").width / 7;
let blackKeyWidth = Dimensions.get("screen").width / 13;
let btnWidth = Dimensions.get("screen").width / 3.7;

//blackKeyWidth = 5;

const styles = StyleSheet.create({
  headerTxt: {
    fontFamily: "Helvetica Neue",
    fontSize: 22,
    fontWeight: "bold",
    color: "#3AB24A",
    width: "95%",
    textAlign: "center",
  },
  staffImg: {
    width: 100,
    height: 100,
  },
  chordHeader: {
    fontFamily: "Helvetica Neue",
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "flex-start",
    //backgroundColor: "red",
  },
  btnTxt: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 12,
    textAlign: "center",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.65)",
    textShadowRadius: 5,
  },
  chordBtn: {
    height: 65,
    marginBottom: 10,
    width: btnWidth,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    marginRight: 10,
  },
  mainContainer: {
    //backgroundColor: 'yellow',
    //position: 'absolute',
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "white",
    flex: 1,
  },
  checkbox: {
    alignSelf: "center",
  },
  icon: {
    height: "100%",
    maxHeight: 250,
    width: whiteKeyWidth,
  },
  whiteKey: {
    height: "100%",
    maxHeight: 250,
    marginRight: 0.5,
  },
  blackKey: { position: "absolute", zIndex: 1 },
  blackKey2: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset,
  },
  blackKey3: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth,
  },
  blackKey4: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth * 3,
  },
  blackKey5: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth * 4,
  },
  blackKey6: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    width: blackKeyWidth,
    left: offset + whiteKeyWidth * 5,
  },
});
