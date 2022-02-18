import React, { useEffect, useState } from "react";

import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  NativeModules,
  Text,
} from "react-native";
import { useDispatch, useSelector, connect } from "react-redux";
import InsetShadow from "react-native-inset-shadow";

import WhiteIcon from "../../images/blank.jpg";
import GreenIcon from "../../images/blank-green.png";
import BlueIcon from "../../images/blank-green.png";
import YellowIcon from "../../images/blank-green.png";
import BlackIcon from "../../images/black.png";
import BlackGreenIcon from "../../images/black-green.png";

var testView = NativeModules.PlayKey;

const KeyboardView = () => {
  const dispatch = useDispatch();

  const currentChord = useSelector((state) => state.currentChord);
  const currentChordType = useSelector((state) => state.currentChordType);
  const playSounds = useSelector((state) => state.playSounds);
  const showNotes = useSelector((state) => state.showNotes);
  const upgraded = useSelector((state) => state.upgraded);

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
  ]);

  // displayChord = () => {
  //   console.log('display chord');
  //   //var chords = key.split(',');
  // };

  const playChords = (chords: Int8Array) => {
    console.log("play chords: " + chords);

    if (!upgraded || !playSounds) {
      return;
    }

    //return;

    chords.forEach((key) => {
      if (Platform.OS === "ios") {
        testView.playKey(key).then((result) => {
          //console.log('show', result);
        });
      } else {
        //console.log("android down")

        //testView.playKey(key);

        testView.playKeyCB(
          key,
          (msg) => {
            console.log("error: " + msg);
          },
          (response) => {
            console.log("response: " + response);
          }
        );
      }
    });

    setTimeout(() => {
      chords.forEach((key) => {
        if (Platform.OS === "ios") {
          testView.releaseKey(key).then((result) => {
            //console.log('show', result);
          });
        } else {
          //console.log("android down")

          //testView.playKey(key);

          testView.releaseKey(key);
        }
      });
    }, 1500);
  };

  const pressKey = (key: number) => {
    //console.log("key kv1: " + key);

    return;

    if (!playSounds) {
      return;
    }

    var sc = keyStates.slice();

    dispatch({
      type: "SET_CURRENT_CHORD",
      chord: "",
      chordType: "alternate",
    });

    sc[key] = true;
    setKeyStates(sc);

    if (Platform.OS === "ios") {
      testView.playKey(key).then((result) => {
        //console.log('show', result);
      });
    } else {
      //console.log("android down")

      //testView.playKey(key);

      testView.playKeyCB(
        key,
        (msg) => {
          console.log("error: " + msg);
        },
        (response) => {
          console.log("response: " + response);
        }
      );
    }
  };

  const releaseKey = (key: number) => {
    return;

    var sc = keyStates.slice();

    sc[key] = false;
    setKeyStates(sc);

    if (Platform.OS === "ios") {
      testView.releaseKey(key).then((result) => {
        //console.log('show', result);
      });
    } else {
      testView.releaseKey(key);
    }
  };

  useEffect(() => {
    var sc = keyStates.slice();

    if (currentChord != "") {
      //console.log('currentChord kbv: ' + currentChord);

      // console.log('codes kbv: ' + JSON.stringify(codes));

      playChords(currentChord);

      currentChord.forEach((element) => {
        sc[element] = true;
      });
      setKeyStates(sc);
    } else {
      //console.log('clear chord kbv: ' + sc.length);

      sc.forEach((element, ind) => {
        sc[ind] = false;
      });

      setKeyStates(sc);
    }
  }, [currentChord]);

  useEffect(() => {
    if (showNotes) {
      console.log("notes changed");
    }
  }, [showNotes]);

  // useEffect(() => {
  //   var sc = keyStates.slice();

  //   sc[0] = true;
  //   sc[4] = true;
  //   sc[7] = true;

  //   setKeyStates(sc);

  //   dispatch({
  //     type: "SET_CURRENT_CHORD",
  //     chord: "",
  //     chordType: "principal",
  //   });
  // }, []);

  var list = [
    { note: "C", number: 0, type: "white" },
    { note: "Db", number: 1, type: "black" },
    { note: "D", number: 1, type: "white" },
    { note: "Eb", number: 1, type: "black" },
    { note: "E", number: 2, type: "white" },
    { note: "F", number: 3, type: "white" },
    { note: "Gb", number: 1, type: "black" },

    { note: "G", number: 4, type: "white" },
    { note: "Ab", number: 1, type: "black" },

    { note: "A", number: 5, type: "white" },
    { note: "Bb", number: 1, type: "black" },

    { note: "B", number: 6, type: "white" },
    { note: "C", number: 7, type: "white" },
    { note: "Db", number: 1, type: "black" },

    { note: "D", number: 8, type: "white" },
    { note: "Eb", number: 1, type: "black" },

    { note: "E", number: 9, type: "white" },
  ];

  return (
    <InsetShadow
      shadowColor="black"
      shadowRadius={10}
      left={false}
      right={false}
      bottom={false}
    >
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          //justifyContent: "center",
          //alignContent: "center",
        }}
      >
        {/* {list.map((a, ind) => {
        return (
          <View
            onTouchStart={() => pressKey(ind)}
            onTouchEnd={() => releaseKey(ind)}
            style={{
              zIndex: a.type == "white" ? 0 : 10,
              height: a.type == "white" ? "100%" : 50,
            }}
          >
            <Image
              source={a.type == "white" ? WhiteIcon : BlackIcon}
      
            />
          </View>
        );
      })} */}

        <View
          onTouchStart={() => pressKey(0)}
          onTouchEnd={() => releaseKey(0)}
          style={[styles.whiteKey]}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[0] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[0] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[0] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text
              style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}
            >
              C
            </Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(1)}
          onTouchEnd={() => releaseKey(1)}
          style={styles.blackKey2}
        >
          <Image
            source={BlackIcon}
            style={
              keyStates[1] && currentChordType == "principal"
                ? styles.iconBlueBlack
                : keyStates[1] && currentChordType == "relative"
                ? styles.iconYellowBlack
                : keyStates[1] && currentChordType == "alternate"
                ? styles.iconGreenBlack
                : styles.iconBlack
            }
          />
          <View
            style={[
              styles.accidentalView,
              { display: showNotes ? "flex" : "none" },
            ]}
          >
            <Text style={styles.accidentalTxt}>C# Db</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(2)}
          onTouchEnd={() => releaseKey(2)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[2] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[2] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[2] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>D</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(3)}
          onTouchEnd={() => releaseKey(3)}
          style={styles.blackKey3}
        >
          <Image
            source={BlackIcon}
            style={
              keyStates[3] && currentChordType == "principal"
                ? styles.iconBlueBlack
                : keyStates[3] && currentChordType == "relative"
                ? styles.iconYellowBlack
                : keyStates[3] && currentChordType == "alternate"
                ? styles.iconGreenBlack
                : styles.iconBlack
            }
          />
          <View
            style={[
              styles.accidentalView,
              { display: showNotes ? "flex" : "none" },
            ]}
          >
            <Text style={styles.accidentalTxt}>D# Eb</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(4)}
          onTouchEnd={() => releaseKey(4)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[4] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[4] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[4] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>E</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(5)}
          onTouchEnd={() => releaseKey(5)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[5] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[5] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[5] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>F</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(6)}
          onTouchEnd={() => releaseKey(6)}
          style={styles.blackKey4}
        >
          <Image
            source={BlackIcon}
            style={
              keyStates[6] && currentChordType == "principal"
                ? styles.iconBlueBlack
                : keyStates[6] && currentChordType == "relative"
                ? styles.iconYellowBlack
                : keyStates[6] && currentChordType == "alternate"
                ? styles.iconGreenBlack
                : styles.iconBlack
            }
          />
          <View
            style={[
              styles.accidentalView,
              { display: showNotes ? "flex" : "none" },
            ]}
          >
            <Text style={styles.accidentalTxt}>F# Gb</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(7)}
          onTouchEnd={() => releaseKey(7)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[7] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[7] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[7] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>G</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(8)}
          onTouchEnd={() => releaseKey(8)}
          style={styles.blackKey5}
        >
          <Image
            source={BlackIcon}
            style={
              keyStates[8] && currentChordType == "principal"
                ? styles.iconBlueBlack
                : keyStates[8] && currentChordType == "relative"
                ? styles.iconYellowBlack
                : keyStates[8] && currentChordType == "alternate"
                ? styles.iconGreenBlack
                : styles.iconBlack
            }
          />
          <View
            style={[
              styles.accidentalView,
              { display: showNotes ? "flex" : "none" },
            ]}
          >
            <Text style={styles.accidentalTxt}>G# Ab</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(9)}
          onTouchEnd={() => releaseKey(9)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[9] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[9] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[9] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>A</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(10)}
          onTouchEnd={() => releaseKey(10)}
          style={styles.blackKey6}
        >
          <Image
            source={BlackIcon}
            style={
              keyStates[10] && currentChordType == "principal"
                ? styles.iconBlueBlack
                : keyStates[10] && currentChordType == "relative"
                ? styles.iconYellowBlack
                : keyStates[10] && currentChordType == "alternate"
                ? styles.iconGreenBlack
                : styles.iconBlack
            }
          />
          <View
            style={[
              styles.accidentalView,
              { display: showNotes ? "flex" : "none" },
            ]}
          >
            <Text style={styles.accidentalTxt}>A# Bb</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(11)}
          onTouchEnd={() => releaseKey(11)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[11] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[11] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[11] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>B</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(12)}
          onTouchEnd={() => releaseKey(12)}
          style={[styles.whiteKey]}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[12] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[12] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[12] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>C</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(13)}
          onTouchEnd={() => releaseKey(13)}
          style={styles.blackKey7}
        >
          <Image
            source={BlackIcon}
            style={
              keyStates[13] && currentChordType == "principal"
                ? styles.iconBlueBlack
                : keyStates[13] && currentChordType == "relative"
                ? styles.iconYellowBlack
                : keyStates[13] && currentChordType == "alternate"
                ? styles.iconGreenBlack
                : styles.iconBlack
            }
          />
          <View
            style={[
              styles.accidentalView,
              { display: showNotes ? "flex" : "none" },
            ]}
          >
            <Text style={styles.accidentalTxt}>C# Db</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(14)}
          onTouchEnd={() => releaseKey(14)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[14] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[14] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[14] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>D</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(15)}
          onTouchEnd={() => releaseKey(15)}
          style={styles.blackKey8}
        >
          <Image
            source={BlackIcon}
            style={
              keyStates[15] && currentChordType == "principal"
                ? styles.iconBlueBlack
                : keyStates[15] && currentChordType == "relative"
                ? styles.iconYellowBlack
                : keyStates[15] && currentChordType == "alternate"
                ? styles.iconGreenBlack
                : styles.iconBlack
            }
          />
          <View
            style={[
              styles.accidentalView,
              { display: showNotes ? "flex" : "none" },
            ]}
          >
            <Text style={styles.accidentalTxt}>D# Eb</Text>
          </View>
        </View>
        <View
          onTouchStart={() => pressKey(16)}
          onTouchEnd={() => releaseKey(16)}
          style={styles.whiteKey}
        >
          <Image
            source={WhiteIcon}
            style={
              keyStates[16] && currentChordType == "principal"
                ? styles.iconBlue
                : keyStates[16] && currentChordType == "relative"
                ? styles.iconYellow
                : keyStates[16] && currentChordType == "alternate"
                ? styles.iconGreen
                : styles.icon
            }
          />
          <View
            style={[
              styles.whiteKeyView,
              {
                display: showNotes ? "flex" : "none",
              },
            ]}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>E</Text>
          </View>
        </View>
      </View>
    </InsetShadow>
  );
};

export default KeyboardView;

let offset = Dimensions.get("screen").width / 15;
let whiteKeyWidth = Dimensions.get("screen").width / 10;
let blackKeyWidth = Dimensions.get("screen").width / 10;

//console.log('white key width kb1: ' + whiteKeyWidth);

const styles = StyleSheet.create({
  whiteKeyView: {
    width: "100%",
    height: 35,
    bottom: 20,
    position: "absolute",
    //left: "20%",
    alignItems: "center",
    //backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
  },
  accidentalView: {
    width: "100%",
    height: 55,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    //width: 30,
    //backgroundColor: "red",
  },
  accidentalTxt: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  mainContainer: {
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
    tintColor: "white",
  },
  iconBlack: { tintColor: "black" },
  iconGreenBlack: {
    tintColor: "rgba(31, 151, 20,1)",
    borderColor: "black",
    borderWidth: 1,
    // borderBottomLeftRadius: 1,
    // borderBottomRightRadius: 1,
  },
  iconYellowBlack: {
    tintColor: "rgba(255, 254, 82,1)",
    borderColor: "black",
    borderWidth: 1,
    // borderBottomLeftRadius: 1,
    // borderBottomRightRadius: 1,
  },
  iconBlueBlack: {
    tintColor: "rgba(11, 77, 199,1)",
    borderColor: "black",
    borderWidth: 1,
    // borderBottomLeftRadius: 1,
    // borderBottomRightRadius: 1,
  },
  iconGreen: {
    height: "100%",
    maxHeight: 250,
    width: whiteKeyWidth,
    tintColor: "rgba(31, 151, 20,1)",
  },
  iconBlue: {
    height: "100%",
    maxHeight: 250,
    width: whiteKeyWidth,
    tintColor: "rgba(11, 77, 199,1)",
  },
  iconYellow: {
    height: "100%",
    maxHeight: 250,
    width: whiteKeyWidth,
    tintColor: "rgba(255, 254, 82,1)",
  },
  whiteKey: {
    height: "100%",
    maxHeight: 250,
    marginRight: 0.5,
  },
  blackKey: {
    //position: "absolute",
    zIndex: 1,
    width: blackKeyWidth,
  },
  blackKey11: {},
  blackKey2: {
    position: "absolute",
    zIndex: 1,
    //width: blackKeyWidth,
    left: offset,
  },
  blackKey3: {
    position: "absolute",
    zIndex: 1,
    left: offset + whiteKeyWidth,
    //width: blackKeyWidth,
  },
  blackKey4: {
    position: "absolute",
    zIndex: 1,
    left: offset + whiteKeyWidth * 3,
    //width: blackKeyWidth,
  },
  blackKey5: {
    position: "absolute",
    zIndex: 1,
    left: offset + whiteKeyWidth * 4,
    //width: blackKeyWidth,
  },
  blackKey6: {
    position: "absolute",
    zIndex: 1,
    left: offset + whiteKeyWidth * 5,
    //width: blackKeyWidth,
  },
  blackKey7: {
    position: "absolute",
    zIndex: 1,
    left: offset + whiteKeyWidth * 7.05,
    //width: blackKeyWidth,
  },
  blackKey8: {
    position: "absolute",
    zIndex: 1,
    left: offset + whiteKeyWidth * 8.1,
    //width: blackKeyWidth,
  },
});
