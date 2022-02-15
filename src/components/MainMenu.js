import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
  Linking,
} from "react-native";
import Header from "./Header";
import Hyperlink from "react-native-hyperlink";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { FlatList, ScrollView } from "react-native-gesture-handler";

const MainMenu = ({ setMode }) => {
  var levels = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Eb", "Bb", "F"];

  const loggedIn = useSelector((state) => state.loggedIn);
  const accessFeature = useSelector((state) => state.accessFeature);
  const highestCompletedPitchLevel = useSelector(
    (state) => state.highestCompletedPitchLevel
  );
  const highestCompletedIntervalBrokenLevel = useSelector(
    (state) => state.highestCompletedIntervalBrokenLevel
  );
  const highestCompletedIntervalBlockedLevel = useSelector(
    (state) => state.highestCompletedIntervalBlockedLevel
  );
  const highestCompletedTriadsBlockedLevel = useSelector(
    (state) => state.highestCompletedTriadsBlockedLevel
  );
  const highestCompletedTriadsBrokenLevel = useSelector(
    (state) => state.highestCompletedTriadsBrokenLevel
  );
  const highestCompletedBassLevel = useSelector(
    (state) => state.highestCompletedBassLevel
  );
  const highestCompletedProgressionLevel = useSelector(
    (state) => state.highestCompletedProgressionLevel
  );

  const isAdmin = useSelector((state) => state.isAdmin);

  const opacity = useState(new Animated.Value(0))[0];
  const dispatch = useDispatch();
  useEffect(() => {
    //console.log('main menu load');
    //Sentry.nativeCrash();
    //throw new Error('My first Sentry error RR!');
    // Sentry.captureMessage('TEST message on crash');
    // Sentry.nativeCrash();
    // var eventId = Sentry.captureException(new Error('Testing 2'));
    // console.log('test errorID: ' + eventId);
    //checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin == true) {
      console.log("isAdmin: " + isAdmin);
      storeAdminData();
    }
  }, [isAdmin]);

  useEffect(() => {
    // console.log(
    //   'check loggedin status: loggedIn: ' + loggedIn + ' admin: ' + isAdmin,
    // );

    if (loggedIn) {
      checkAdmin();
    } else if (loggedIn === false && isAdmin === null) {
      console.log("remove admin data");
      removeAdminData();
    }
  }, [loggedIn]);

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

  viewCourse = () => {
    let url =
      "https://pianolessonwithwarren.com/courses/the-ear-training-regimen-for-beginners-and-intermediates/";

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const checkAdmin = async () => {
    try {
      var value = await AsyncStorage.getItem("isAdmin");

      if (value !== null) {
        // We have data!!
        console.log(`has admin: ` + value);

        dispatch({ type: "SET_ADMIN" });
      } else {
        console.log(`no admin status`);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const storeAdminData = async () => {
    try {
      await AsyncStorage.setItem("isAdmin", "true");

      console.log("admin status saved");
    } catch (error) {
      console.log("admin status not saved");
      // Error saving data
    }
  };

  const removeAdminData = async () => {
    try {
      await AsyncStorage.removeItem("isAdmin");

      console.log("admin status remove");
    } catch (error) {
      console.log("admin status not remove");
      // Error saving data
    }
  };

  return (
    <>
      <View
        style={{
          padding: 20,
          backgroundColor: "white",
          flex: 1,
          width: "100%",
        }}
      >
        <Text
          style={{
            fontFamily: "Helvetica Neue",
            fontSize: 20,
            fontWeight: "bold",
            color: "#3AB24A",
            textAlign: "center",
          }}
        >
          Divine Chords
        </Text>

        {/* <View
          style={{
            marginTop: 0,
            display: 'flex',
            //flexDirection: 'row',
            backgroundColor: 'red',
            width: '116%',
            marginLeft: '-7%',
            marginTop: 20,
            paddingLeft: '7%',
            paddingRight: '8%',
            height: 45,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}>
            For best audio quality, use a good pair of headphones or earbuds.
          </Text>
        </View> */}
        {/* <Image source={videoImg} style={styles.video} /> */}
        <Animated.View style={{ marginTop: 25, opacity: opacity }}>
          <View
            style={{
              backgroundColor: "#3AB24A",
              height: 65,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                padding: 20,
                textAlign: "center",
              }}
            >
              Select Key
            </Text>
          </View>

          {/* <FlatList
            style={styles.list}
            data={levels}
            renderItem={listItem}
            keyExtractor={(item, index) => index.toString()}
          /> */}

          {/* {console.log('hcbl: ' + highestCompletedBassLevel)} */}

          <ScrollView style={{ height: "100%" }}>
            {levels.map((level, index) => {
              //console.log('ind: ' + level + ' ' + index);
              var icon;

              // if (index == 0) {
              //   if (highestCompletedPitchLevel < 3) {
              //     icon = null;
              //   } else {
              //     icon = checkIcon;
              //   }
              // } else if (index == 1) {
              //   if (
              //     highestCompletedIntervalBrokenLevel < 5 ||
              //     highestCompletedIntervalBlockedLevel < 5
              //   ) {
              //     icon = null;
              //   } else {
              //     icon = checkIcon;
              //   }
              // } else if (index == 2) {
              //   if (
              //     highestCompletedTriadsBlockedLevel < 10 ||
              //     highestCompletedTriadsBrokenLevel < 10
              //   ) {
              //     icon = null;
              //   } else {
              //     icon = checkIcon;
              //   }
              // } else if (index == 3) {
              //   if (highestCompletedBassLevel < 4) {
              //     icon = null;
              //   } else {
              //     icon = checkIcon;
              //   }
              // } else if (index == 4) {
              //   if (highestCompletedProgressionLevel < 7) {
              //     icon = null;
              //   } else {
              //     icon = checkIcon;
              //   }
              // }

              return (
                <TouchableOpacity
                  onPress={() => {
                    setMode(index + 1);
                  }}
                  key={index}
                >
                  <View
                    style={{
                      backgroundColor: "#F6FA43",
                      height: 65,
                      marginBottom: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        padding: 20,
                        textAlign: "center",
                      }}
                    >
                      {level}
                    </Text>
                  </View>

                  <Image
                    source={icon}
                    style={{ position: "absolute", right: 12, top: 12 }}
                  />

                  {/* {loggedIn && accessFeature == 2 ? (
                    <Image
                      source={icon}
                      style={{position: 'absolute', right: 12, top: 12}}
                    />
                  ) : (
                    <Image
                      source={
                        index < highestCompletedPitchLevel ? checkIcon : null
                      }
                      style={{position: 'absolute', right: 12, top: 12}}
                    />
                  )} */}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 270 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </>
  );
};

export default MainMenu;
