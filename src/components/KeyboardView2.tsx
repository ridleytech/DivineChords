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
import BlackIcon from "../../images/black.png";
import BlackGreenIcon from "../../images/black-green.png";

var testView = NativeModules.PlayKey;

const KeyboardView2 = () => {
  const currentChord = useSelector((state) => state.currentChord);
  const currentChordType = useSelector((state) => state.currentChordType);
  const playSounds = useSelector((state) => state.playSounds);
  const showNotes = useSelector((state) => state.showNotes);

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
  ]);

  const playChords = (chords: Int8Array) => {
    console.log("play chords: " + chords);

    if (!playSounds) {
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
    return;

    console.log("key: " + key);

    var sc = keyStates.slice();

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
      //testView.releaseKey(key);

      //console.log("android up")

      // testView.releaseKey(
      //     key,
      //     (msg) => {
      //       console.log('error: ' + msg);
      //     },
      //     (response) => {
      //       console.log('response: ' + response);
      //     },
      //   );

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

  return (
    <>
      <InsetShadow
        shadowColor="black"
        shadowRadius={10}
        left={false}
        right={false}
        bottom={false}
      >
        <View
          style={{
            backgroundColor: "black",
            display: "flex",
            flex: 1,
            flexDirection: "row",
            //bottom: 100,
          }}
        >
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>C</Text>
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
                {
                  display: showNotes ? "flex" : "none",
                },
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>D</Text>
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
                {
                  display: showNotes ? "flex" : "none",
                },
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>E</Text>
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>F</Text>
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
                {
                  display: showNotes ? "flex" : "none",
                },
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>G</Text>
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
                {
                  display: showNotes ? "flex" : "none",
                },
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>A</Text>
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
                {
                  display: showNotes ? "flex" : "none",
                },
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>B</Text>
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>C</Text>
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
                {
                  display: showNotes ? "flex" : "none",
                },
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>D</Text>
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
                {
                  display: showNotes ? "flex" : "none",
                },
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>E</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(17)}
            onTouchEnd={() => releaseKey(17)}
            style={styles.whiteKey}
          >
            <Image
              source={WhiteIcon}
              style={
                keyStates[17] && currentChordType == "principal"
                  ? styles.iconBlue
                  : keyStates[17] && currentChordType == "relative"
                  ? styles.iconYellow
                  : keyStates[17] && currentChordType == "alternate"
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>F</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(18)}
            onTouchEnd={() => releaseKey(18)}
            style={styles.blackKey9}
          >
            <Image
              source={BlackIcon}
              style={
                keyStates[18] && currentChordType == "principal"
                  ? styles.iconBlueBlack
                  : keyStates[18] && currentChordType == "relative"
                  ? styles.iconYellowBlack
                  : keyStates[18] && currentChordType == "alternate"
                  ? styles.iconGreenBlack
                  : styles.iconBlack
              }
            />
            <View
              style={[
                styles.accidentalView,
                {
                  display: showNotes ? "flex" : "none",
                },
              ]}
            >
              <Text style={styles.accidentalTxt}>F# Gb</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(19)}
            onTouchEnd={() => releaseKey(19)}
            style={styles.whiteKey}
          >
            <Image
              source={WhiteIcon}
              style={
                keyStates[19] && currentChordType == "principal"
                  ? styles.iconBlue
                  : keyStates[19] && currentChordType == "relative"
                  ? styles.iconYellow
                  : keyStates[19] && currentChordType == "alternate"
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>G</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(20)}
            onTouchEnd={() => releaseKey(20)}
            style={styles.blackKey10}
          >
            <Image
              source={BlackIcon}
              style={
                keyStates[20] && currentChordType == "principal"
                  ? styles.iconBlueBlack
                  : keyStates[20] && currentChordType == "relative"
                  ? styles.iconYellowBlack
                  : keyStates[20] && currentChordType == "alternate"
                  ? styles.iconGreenBlack
                  : styles.iconBlack
              }
            />
            <View
              style={[
                styles.accidentalView,
                {
                  display: showNotes ? "flex" : "none",
                },
              ]}
            >
              <Text style={styles.accidentalTxt}>G# Ab</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(21)}
            onTouchEnd={() => releaseKey(21)}
            style={styles.whiteKey}
          >
            <Image
              source={WhiteIcon}
              style={
                keyStates[21] && currentChordType == "principal"
                  ? styles.iconBlue
                  : keyStates[21] && currentChordType == "relative"
                  ? styles.iconYellow
                  : keyStates[21] && currentChordType == "alternate"
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>A</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(22)}
            onTouchEnd={() => releaseKey(22)}
            style={styles.blackKey11}
          >
            <Image
              source={BlackIcon}
              style={
                keyStates[22] && currentChordType == "principal"
                  ? styles.iconBlueBlack
                  : keyStates[22] && currentChordType == "relative"
                  ? styles.iconYellowBlack
                  : keyStates[22] && currentChordType == "alternate"
                  ? styles.iconGreenBlack
                  : styles.iconBlack
              }
            />
            <View
              style={[
                styles.accidentalView,
                {
                  display: showNotes ? "flex" : "none",
                },
              ]}
            >
              <Text style={styles.accidentalTxt}>A# Bb</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(23)}
            onTouchEnd={() => releaseKey(23)}
            style={styles.whiteKey}
          >
            <Image
              source={WhiteIcon}
              style={
                keyStates[23] && currentChordType == "principal"
                  ? styles.iconBlue
                  : keyStates[23] && currentChordType == "relative"
                  ? styles.iconYellow
                  : keyStates[23] && currentChordType == "alternate"
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
              <Text style={{ fontSize: 35, fontWeight: "bold" }}>B</Text>
            </View>
          </View>
          <View
            onTouchStart={() => pressKey(24)}
            onTouchEnd={() => releaseKey(24)}
            style={[styles.whiteKey]}
          >
            <Image
              source={WhiteIcon}
              style={
                keyStates[24] && currentChordType == "principal"
                  ? styles.iconBlue
                  : keyStates[24] && currentChordType == "relative"
                  ? styles.iconYellow
                  : keyStates[24] && currentChordType == "alternate"
                  ? styles.iconGreen
                  : styles.icon
              }
            />
          </View>
          <View
            onTouchStart={() => pressKey(25)}
            onTouchEnd={() => releaseKey(25)}
            style={styles.blackKey12}
          >
            <Image
              source={BlackIcon}
              style={
                keyStates[25] && currentChordType == "principal"
                  ? styles.iconBlueBlack
                  : keyStates[25] && currentChordType == "relative"
                  ? styles.iconYellowBlack
                  : keyStates[25] && currentChordType == "alternate"
                  ? styles.iconGreenBlack
                  : styles.iconBlack
              }
            />
          </View>
          <View
            onTouchStart={() => pressKey(26)}
            onTouchEnd={() => releaseKey(26)}
            style={[styles.whiteKey]}
          >
            <Image
              source={WhiteIcon}
              style={
                keyStates[26] && currentChordType == "principal"
                  ? styles.iconBlue
                  : keyStates[26] && currentChordType == "relative"
                  ? styles.iconYellow
                  : keyStates[26] && currentChordType == "alternate"
                  ? styles.iconGreen
                  : styles.icon
              }
            />
          </View>
        </View>
      </InsetShadow>
    </>
  );
};

export default KeyboardView2;

let offset = Dimensions.get("screen").width / 17;
var whiteKeyWidth = Dimensions.get("screen").width / 14;
var blackKeyWidth = Dimensions.get("screen").width / 12;

// var a = 1.1;
// var b = 0;

// if (whiteKeyWidth > 70) {
//   whiteKeyWidth = whiteKeyWidth * a;
//   blackKeyWidth = blackKeyWidth * a;
//   offset = offset * a;
// }

// console.log('white key width kb2: ' + whiteKeyWidth);
// console.log('black key width kb2: ' + blackKeyWidth);

const styles = StyleSheet.create({
  whiteKeyView: {
    width: "100%",
    height: 35,
    bottom: 20,
    position: "absolute",
    //left: "30%",
    alignItems: "center",
    //backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
  },
  accidentalTxt: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
    tintColor: "white",
    //borderWidth: 1,
  },
  whiteKey: {
    height: "100%",
    maxHeight: 250,
    //marginRight: 0.5,
    width: whiteKeyWidth,
    borderWidth: 1,
  },
  blackKey2: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset,
    //backgroundColor: 'red',
  },
  blackKey3: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth,
  },
  blackKey4: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 3,
  },
  blackKey5: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 4,
  },
  blackKey6: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 5,
  },

  blackKey7: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 7,
  },
  blackKey8: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 8,
  },
  blackKey9: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 10,
  },
  blackKey10: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 11,
  },
  blackKey11: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 12,
  },
  blackKey12: {
    position: "absolute",
    zIndex: 1,
    height: 135,
    //width: blackKeyWidth,
    left: offset + whiteKeyWidth * 14,
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
  accidentalView: {
    width: "100%",

    height: 55,
    bottom: 20,
    position: "absolute",
    //left: 0,
    alignItems: "center",
  },
  iconBlack: { tintColor: "black" },
});
