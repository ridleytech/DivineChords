import React, { Component, useState, version } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
} from "react-native";
import bgImg from "../../images/piano-bg.png";
import headerLogo from "../../images/header-logo.png";
import menuIcon from "../../images/menu-icon.png";
import backIcon from "../../images/back-btn.png";
import notesImg from "../../images/music-note-icon.png";
import { useSelector, useDispatch } from "react-redux";

const Header = (props) => {
  //console.log('header props: ' + JSON.stringify(props));

  //console.log('currentVersion header: ' + currentVersion);

  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const level = useSelector((state) => state.level);
  const triadmode = useSelector((state) => state.triadmode);
  const intervalmode = useSelector((state) => state.intervalmode);
  const leaderboardMode = useSelector((state) => state.leaderboardMode);

  const showNotes = useSelector((state) => state.showNotes);

  const goHome = () => {
    dispatch({ type: "SET_MODE", mode: 0 });
    dispatch({ type: "SET_LEVEL", level: 0 });
  };

  var showMenu = false;
  var showNotesMenu = false;

  if (mode == 0 && leaderboardMode == 0) {
    showMenu = true;
  }

  if (mode > 0) {
    showNotesMenu = true;
  }

  const manageButton = () => {
    //console.log('manageButton');

    if (mode == 0) {
      props.props.navigation.toggleDrawer();
    } else {
      dispatch({ type: "SET_MODE", mode: 0 });
      dispatch({ type: "SET_LEVEL", level: 0 });
    }
  };

  manageNotes = () => {
    dispatch({ type: "SHOW_NOTES", status: showNotes ? 0 : 1 });
  };

  // const displayNotes = () => {
  //   dispatch({ type: "SHOW_NOTES", status: 1 });
  // };

  // const hideNotes = () => {
  //   dispatch({ type: "SHOW_NOTES", status: 0 });
  // };

  return (
    <View style={{ height: 100 }}>
      <ImageBackground style={{ flex: 1, zIndex: -1 }} source={bgImg} />
      <View style={styles.overlay} />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={headerLogo}
          style={{
            zIndex: 5,
            width: 65,
            height: 65,
          }}
        />
      </View>

      <TouchableOpacity
        style={{
          zIndex: 3,
          width: 35,
          height: 35,
          position: "absolute",
          left: 20,
          top: 30,
        }}
        onPress={() => manageButton()}
      >
        <Image source={showMenu ? null : backIcon} style={{ zIndex: 3 }} />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          zIndex: 3,
          width: 35,
          height: 35,
          position: "absolute",
          right: 20,
          top: 30,
        }}
        onPress={() => manageNotes()}
      >
        <Image source={showNotesMenu ? notesImg : null} style={{ zIndex: 3 }} />
      </TouchableOpacity>

      {/* <Text
        style={{
          zIndex: 3,
          //width: 35,
          height: 35,
          position: "absolute",
          right: 5,
          top: 5,
          fontSize: 10,
          color: "white",
          fontWeight: "bold",
        }}
      >
        Version {props.props.currentVersion}
      </Text> */}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
