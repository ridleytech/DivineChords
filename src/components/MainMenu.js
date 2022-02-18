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

import { FlatList, ScrollView } from "react-native-gesture-handler";

const MainMenu = ({ setMode }) => {
  var levels = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Eb", "Bb", "F"];

  const opacity = useState(new Animated.Value(0))[0];

  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: false,
  }).start();

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
        <Animated.View style={{ opacity: opacity }}>
          <View
            style={{
              height: 65,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              backgroundColor: "#F6FA43",
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 20,
                fontWeight: "bold",
                padding: 20,
                textAlign: "center",
              }}
            >
              Select Key
            </Text>
          </View>

          <ScrollView style={{ height: "100%" }}>
            {levels.map((level, index) => {
              //console.log('ind: ' + level + ' ' + index);
              var icon;

              return (
                <TouchableOpacity
                  onPress={() => {
                    setMode(index + 1);
                  }}
                  key={index}
                >
                  <View
                    style={{
                      backgroundColor: "#3AB24A",

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
                        color: "white",
                      }}
                    >
                      {level}
                    </Text>
                  </View>

                  <Image
                    source={icon}
                    style={{ position: "absolute", right: 12, top: 12 }}
                  />
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
