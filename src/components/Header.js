import React, { Component, useState, version, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  Platform,
  NativeModules,
  Alert,
} from "react-native";
import bgImg from "../../images/piano-bg.png";
import headerLogo from "../../images/header-logo.png";
//import menuIcon from "../../images/menu-icon.png";
import backIcon from "../../images/back-btn.png";
import notesImg from "../../images/music-note-icon.png";
import soundImg from "../../images/sound.png";
import noSoundImg from "../../images/no-sound.png";
import { useSelector, useDispatch } from "react-redux";

import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  requestSubscription,
  useIAP,
} from "react-native-iap";
import AsyncStorage from "@react-native-async-storage/async-storage";

var testView = NativeModules.PlayKey;

const Header = (props) => {
  //console.log('header props: ' + JSON.stringify(props));
  //console.log('currentVersion header: ' + currentVersion);

  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const showNotes = useSelector((state) => state.showNotes);
  const upgraded = useSelector((state) => state.upgraded);
  const playSounds = useSelector((state) => state.playSounds);

  const [isLoading, setBuyIsLoading] = useState(false);

  var showMenu = false;
  var showNotesMenu = false;

  if (mode == 0) {
    showMenu = true;
  }

  if (mode > 0) {
    showNotesMenu = true;
  }

  const manageSound = () => {
    // getItems();

    // return;

    if (upgraded) {
      dispatch({ type: "MANAGE_SOUND", status: playSounds ? 0 : 1 });
    } else {
      //requestPurchase2(itemSkus[1]);
      getItems();
      // testView.tapIAP(1).then((result) => {
      //   console.log("show", result);
      // });
    }
  };

  const manageButton = () => {
    //console.log('manageButton');

    if (mode == 0) {
      props.props.navigation.toggleDrawer();
    } else {
      dispatch({ type: "SET_MODE", mode: 0 });
      dispatch({ type: "SET_LEVEL", level: 0 });
      dispatch({ type: "SHOW_NOTES", status: 0 });
    }
  };

  manageNotes = () => {
    dispatch({ type: "SHOW_NOTES", status: showNotes ? 0 : 1 });
  };

  const itemSkus = Platform.select({
    ios: ["com.DivineChords.Full", "com.DivineChords.Full2"],
    android: ["dc20221"],
  });

  let purchaseUpdateSubscription;
  let purchaseErrorSubscription;

  //IAP  const

  useEffect(() => {
    initIAP();
    retrieveData();

    return function cleanup() {
      //console.log("will unmount");

      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
    };
  }, []);

  // old iap

  const initIAP = async () => {
    try {
      const result = await RNIap.initConnection();
      console.log("connection is => ", result);

      getAvailablePurchases();
      //getStuff();
      await RNIap.consumeAllItemsAndroid();

      //console.log("init subscription");
      purchaseUpdateSubscription = purchaseUpdatedListener(
        async (purchase: ProductPurchase) => {
          console.log("purchaseUpdatedListener", purchase);
          if (
            purchase.purchaseStateAndroid === 1 &&
            !purchase.isAcknowledgedAndroid
          ) {
            try {
              const ackResult = await acknowledgePurchaseAndroid(
                purchase.purchaseToken
              );
              console.log("ackResult", ackResult);
            } catch (ackErr) {
              console.warn("ackErr", ackErr);
            }
          }
          purchaseConfirmed();

          dispatch({
            type: "SAVE_PURCHASES",
            receipt: purchase.transactionReceipt,
          });

          purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
              console.log("purchaseErrorListener", error);
              // alert('purchase error', JSON.stringify(error));
            }
          );
        }
      );
    } catch (err) {
      console.log("error in cdm => ", err);
    }
  };

  const getItems = async () => {
    try {
      console.log("itemSkus[0]", itemSkus[0]);
      const products: Product[] = await RNIap.getProducts(itemSkus);
      console.log("Products[0]", products[0]);
      console.log("Products: " + JSON.stringify(products));

      if (products[0]) {
        dispatch({
          type: "PRODUCT_LIST",
          productList: products,
        });
        requestPurchase(itemSkus[0]);
      }
    } catch (err) {
      console.log("getItems || purchase error => ", err);
    }
  };

  // const getSubscriptions = async () => {
  //   try {
  //     const products = await RNIap.getSubscriptions(itemSubs);
  //     console.log("subscription Products => ", products);

  //     dispatch({
  //       type: "PRODUCT_LIST",
  //       productList: products,
  //     });
  //   } catch (err) {
  //     console.log("getSubscriptions error => ", err);
  //   }
  // };

  const getAvailablePurchases = async () => {
    //console.log("getAvailablePurchases");
    try {
      const purchases = await RNIap.getAvailablePurchases();

      console.info("Available purchases => ", purchases);

      const purchases2 = await RNIap.getPurchaseHistory();

      console.info("history purchases => ", purchases2);

      // const purchases3 = await RNIap.getSubscriptions();

      // console.info("subs => ", purchases3);

      const purchases4 = await RNIap.getProducts(itemSkus);

      console.info("prods => ", purchases4);

      if (purchases && purchases.length > 0) {
        purchaseConfirmed();

        console.info("purchases[0].transactionReceipt => ", purchases[0]);

        // dispatch({
        //   type: "SAVE_PURCHASES",
        //   //availableItemsMessage: `Got ${purchases.length} items.`,
        //   receipt: purchases[0].transactionReceipt,
        // });
      }
    } catch (err) {
      //console.warn(err.code, err.message);
      console.log("getAvailablePurchases error ... ", err);
    }
  };

  const requestPurchase = async (sku) => {
    try {
      await RNIap.requestPurchase(sku).then(async (result) => {
        if (Platform.OS == "ios") {
          console.log("ios trans: " + JSON.stringify(result));
          await RNIap.finishTransactionIOS(result.transactionId);
          console.log("iOS receipt => ", result.transactionReceipt);
        } else {
          await RNIap.consumePurchaseAndroid(result.purchaseToken);
          //await RNIap.flushFailedPurchasesCachedAsPendingAndroid(result.purchaseToken);

          console.log("Android receipt");
        }
      });
    } catch (err) {
      console.log("requestPurchase error => ", JSON.stringify(err));

      //Alert.alert("Purchase Error", err.code + ": " + err.message);

      // if (err.code == "E_USER_CANCELLED") {
      // } else {
      //   //Alert.alert("Purchase Error", JSON.stringify(err));
      // }
    }
  };

  // const requestSubscription = async (sku) => {
  //   try {
  //     await getItems();
  //     await RNIap.requestSubscription(sku);
  //   } catch (err) {
  //     console.log("err subscription");
  //     //Alert(err.toLocaleString());
  //   }
  // };

  const purchaseConfirmed = () => {
    console.log("purchaseConfirmed");
    dispatch({
      type: "UPGRADE",
    });

    AsyncStorage.setItem("upgraded", "true");
  };

  const retrieveData = async () => {
    try {
      var value = await AsyncStorage.getItem("upgraded");

      if (value !== null) {
        if (value == "true") {
          //console.log("was upgraded");

          dispatch({
            type: "UPGRADE",
          });
        }
      } else {
        //console.log('save default pitch data');
      }
    } catch (error) {
      // Error retrieving data
    }
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

      {!showMenu ? (
        <TouchableOpacity
          style={{
            zIndex: 3,
            width: 35,
            height: 35,
            position: "absolute",
            right: 70,
            top: 30,
          }}
          onPress={() => manageSound()}
        >
          <Image
            source={playSounds ? soundImg : noSoundImg}
            style={{ zIndex: 3 }}
          />
        </TouchableOpacity>
      ) : null}

      {!showMenu ? (
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
      ) : null}

      {!showMenu ? (
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
          <Image
            source={showNotesMenu ? notesImg : null}
            style={{ zIndex: 3 }}
          />
        </TouchableOpacity>
      ) : null}

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
