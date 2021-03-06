import { act } from "react-test-renderer";

var local = false;
var localPath = "http://localhost:8888/ridleytech/pianolesson/";
var remotePath = "https://pianolessonwithwarren.com/dev_site/pianolesson/";

var url;

if (local) {
  url = localPath;
} else {
  url = remotePath;
}

const inititalState = {
  a: 1,
  isAdmin: null,
  level: 0,
  mode: 0,
  triadmode: 0,
  leaderboardMode: 0,
  previousMode: null,
  userid: null,
  intervalmode: 0,
  highestCompletedIntervalBrokenLevel: 0,
  highestCompletedIntervalBlockedLevel: 0,
  highestCompletedPitchLevel: 0,
  highestCompletedBassLevel: 0,
  highestCompletedProgressionLevel: 0,
  //highestCompletedTriadsLevel: 0,
  highestCompletedTriadsBlockedLevel: 0,
  highestCompletedTriadsBrokenLevel: 0,
  loggedIn: null,
  graphStarted: false,
  loginEnabled: true,
  loginError: false,
  supportSent: false,
  supportEnabled: true,
  supportError: false,
  responseMessage: null,
  username: null,
  deviceUsername: null,
  password: null,
  fullname: null,
  leaderData: [],
  url: url,
  accessFeature: 0,
  currentVersion: 1.0,
  latestVersion: null,
  hasProgress: null,
  loginErrorMsg: "",
  currentChord: "",
  currentChordType: "",
  playSounds: false,
  showNotes: false,
  upgraded: false,
  productList: [],
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case "GET_QUESTION":
      return {
        ...state,
        stuff: 1,
      };
    case "AUTH_DATA":
      let loginData = action.payload.data;

      console.log(`loginData: ${JSON.stringify(loginData)}`);
      var loginStatus = false;
      var loginError1 = false;
      var mode1 = state.mode;
      var msg;
      var uname = action.user.username.toUpperCase();
      var admin = false;

      if (uname == "RIDLEY1224" || uname == "STRIKER85" || uname == "TEST") {
        loginStatus = true;
        loginError1 = false;
        mode1 = state.previousMode;
        msg = null;
        admin = true;
      } else if (loginData.hasAccount === true && loginData.isActive === true) {
        loginStatus = true;
        loginError1 = false;
        mode1 = state.previousMode;
        msg = null;
      } else {
        loginError1 = true;

        if (loginData.hasAccount === false) {
          msg = "Username/password combination invalid.";
        } else {
          msg =
            "Your membership is currently inactive. Please reactivate your membership.";
        }
      }

      console.log(`status: ${loginStatus}`);

      return {
        ...state,
        username: action.user.username,
        password: action.user.password,
        loggedIn: loginStatus,
        loginEnabled: true,
        loginError: loginError1,
        mode: mode1,
        loginErrorMsg: msg,
        isAdmin: admin,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loginError: true,
        loginEnabled: true,
      };

    case "SAVE_PURCHASES":
      return {
        ...state,
        receipt: action.receipt,
        upgraded: true,
      };

    case "PRODUCT_LIST":
      //console.log("payload: " + JSON.stringify(action));
      return {
        ...state,
        productList: action.productList,
      };

    case "UPGRADE":
      return {
        ...state,
        upgraded: true,
        playSounds: true,
      };

    case "MANAGE_SOUND":
      return {
        ...state,
        playSounds: action.status,
      };

    case "RESET_LEADER_DATA":
      console.log("RESET_LEADER_DATA");
      return {
        ...state,
        leaderData: [],
      };

    case "AUTH_SITE_DATA":
      let authData = action.payload.data;

      console.log(`AUTH_SITE_DATA loginData: ${JSON.stringify(authData)}`);
      var userid1;

      if (authData.status !== "username missing") {
        userid1 = parseInt(authData.userid);
      }

      return {
        ...state,
        userid: userid1,
      };

    case "LOGIN_SITE_ERROR":
      return {
        ...state,
      };

    case "SET_ACCESS_FEATURE":
      return {
        ...state,
        accessFeature: action.payload.accessData.status,
        latestVersion: action.payload.accessData.latestVersion,
      };

    case "SET_USERNAME":
      return {
        ...state,
        username: action.username,
      };

    case "SET_USERID":
      return {
        ...state,
        userid: action.userid,
      };

    case "SET_DEVICE_USERNAME":
      return {
        ...state,
        deviceUsername: action.username,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loginError: true,
        loginEnabled: true,
      };

    case "SUPPORT_DATA":
      let supportData = action.payload;

      console.log(`support data: ${JSON.stringify(supportData)}`);
      var supportStatus = false;
      var supportError1 = false;
      var responseMessage1;

      //{"is_valid":false,"validation_messages":{"2":"Please enter a valid email address."},"page_number":1,"source_page_number":1}

      if (supportData.is_valid == true) {
        // var successResponse =
        //   "<div id='gform_confirmation_wrapper_2' class='gform_confirmation_wrapper '><div id='gform_confirmation_message_2' class='gform_confirmation_message_2 gform_confirmation_message'>Thanks for contacting us! We will get in touch with you within 24 hours.</div></div>";

        // if (supportData.confirmation_message === successResponse) {
        // }

        //console.log('confirmation messages matches');

        responseMessage1 =
          "Thanks for contacting us! We will get in touch with you within 24 hours.";
        supportStatus = true;
        supportError1 = false;
      } else {
        responseMessage1 = supportData.validation_messages[2];

        supportError1 = true;
      }

      console.log(`status: ${supportStatus}`);

      return {
        ...state,
        supportSent: supportStatus,
        supportEnabled: true,
        supportError: supportError1,
        responseMessage: responseMessage1,
      };

    case "SUPPORT_ERROR":
      return {
        ...state,
        supportError: true,
        supportEnabled: true,
        responseMessage: "Message was not sent. Please try again later.",
      };

    case "CLEAR_SUPPORT_ERROR":
      //console.log('CLEAR_SUPPORT_ERROR');
      return {
        ...state,
        supportSent: false,
        supportError: false,
        responseMessage: null,
      };

    case "MANAGE_LOGIN":
      return {
        ...state,
        loginEnabled: action.status,
      };

    case "MANAGE_SUPPORT":
      return {
        ...state,
        supportEnabled: action.status,
      };

    case "LOGIN_USER":
      console.log("login redux");
      return {
        ...state,
        // username: action.username,
        // password: action.password,
        loggedIn: true,
      };

    case "SHOW_LOGIN":
      //console.log('SHOW_LOGIN');

      var pm = state.mode;

      return {
        ...state,
        mode: 6,
        previousMode: pm,
      };

    case "LOGOUT_USER":
      console.log("logout redux");
      return {
        ...state,
        loggedIn: false,
        username: null,
        password: null,
        userid: null,
        hasProgress: null,
        isAdmin: null,
      };

    case "SET_ADMIN":
      //console.log('SET_ADMIN');
      return {
        ...state,
        isAdmin: true,
      };

    case "MANAGE_GRAPH":
      //console.log('MANAGE_GRAPH: ' + JSON.stringify(action));

      return {
        ...state,
        graphStarted: action.status,
      };

    case "SHOW_NOTES":
      //console.log('MANAGE_GRAPH: ' + JSON.stringify(action));

      return {
        ...state,
        showNotes: action.status,
      };

    case "PROGRESS_INFO":
      let progressData = action.payload.progressData;

      //console.log(`progressData: ${JSON.stringify(progressData)}`);

      return {
        ...state,
        highestCompletedIntervalBrokenLevel: parseInt(progressData.ibrhi),
        highestCompletedIntervalBlockedLevel: parseInt(progressData.iblhi),
        highestCompletedPitchLevel: parseInt(progressData.phi),
        highestCompletedBassLevel: parseInt(progressData.bhi),
        highestCompletedProgressLevel: parseInt(progressData.prhi),
        //highestCompletedTriadsLevel: parseInt(progressData.thi),
        highestCompletedTriadsBlockedLevel: parseInt(progressData.tblhi),
        highestCompletedTriadsBrokenLevel: parseInt(progressData.tbrhi),
        hasProgress: true,
      };

    case "LEADER_DATA":
      let leaderData = action.payload.leaderData;

      console.log(`leaderData: ${JSON.stringify(leaderData)}`);

      return {
        ...state,
        leaderData: leaderData,
      };

    case "SCORE_SAVED":
      let scoreData = action.payload;

      console.log(`scoreData: ${JSON.stringify(scoreData)}`);

      return {
        ...state,
        //leaderData: leaderData,
      };

    case "SET_PITCH_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(action.level.highestCompletedPitchLevel);
      var levelVal = state.highestCompletedPitchLevel;

      // console.log(`sp completed: ${completedLevel}
      // levelVal: ${levelVal}`);

      if (completedLevel > state.highestCompletedPitchLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedPitchLevel: levelVal,
      };

    case "SET_CURRENT_CHORD":
      //console.log('action: ' + JSON.stringify(action));

      var chord = action.chord;
      var chordType = action.chordType;

      return {
        ...state,
        currentChord: chord,
        currentChordType: chordType,
      };

    case "SET_BASS_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(action.level.highestCompletedBassLevel);
      var levelVal = state.highestCompletedBassLevel;

      // console.log(`sp completed: ${completedLevel}
      // levelVal: ${levelVal}`);

      if (completedLevel > state.highestCompletedBassLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedBassLevel: levelVal,
      };

    case "SET_PROGRESSION_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(
        action.level.highestCompletedProgressionLevel
      );
      var levelVal = state.highestCompletedProgressionLevel;

      // console.log(`sp completed: ${completedLevel}
      // levelVal: ${levelVal}`);

      if (completedLevel > state.highestCompletedProgressionLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedProgressionLevel: levelVal,
      };

    case "SET_INTERVAL_BROKEN_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(
        action.level.highestCompletedIntervalBrokenLevel
      );
      var levelVal = state.highestCompletedIntervalBrokenLevel;

      if (completedLevel > state.highestCompletedIntervalBrokenLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedIntervalBrokenLevel: levelVal,
      };

    case "SET_INTERVAL_BLOCKED_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(
        action.level.highestCompletedIntervalBlockedLevel
      );
      var levelVal = state.highestCompletedIntervalBlockedLevel;

      if (completedLevel > state.highestCompletedIntervalBlockedLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedIntervalBlockedLevel: levelVal,
      };

    // case 'SET_TRIADS_PROGRESS':
    //   //console.log('action: ' + JSON.stringify(action));

    //   var completedLevel = parseInt(action.level.highestCompletedTriadsLevel);
    //   var levelVal = state.highestCompletedTriadsLevel;

    //   if (completedLevel > state.highestCompletedTriadsLevel) {
    //     levelVal = completedLevel;
    //   }

    //   return {
    //     ...state,
    //     highestCompletedTriadsLevel: levelVal,
    //   };

    case "SET_TRIADS_BLOCKED_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(
        action.level.highestCompletedTriadsBlockedLevel
      );
      var levelVal = state.highestCompletedTriadsBlockedLevel;

      if (completedLevel > state.highestCompletedTriadsBlockedLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedTriadsBlockedLevel: levelVal,
      };

    case "SET_TRIADS_BROKEN_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(
        action.level.highestCompletedTriadsBrokenLevel
      );
      var levelVal = state.highestCompletedTriadsBrokenLevel;

      if (completedLevel > state.highestCompletedTriadsBrokenLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedTriadsBrokenLevel: levelVal,
      };

    case "RESET_PROGRESS":
      //console.log('action: ' + JSON.stringify(action));

      console.log("RESET_PROGRESS");
      return {
        ...state,
        highestCompletedPitchLevel: 0,
        highestCompletedBassLevel: 0,
        highestCompletedIntervalBlockedLevel: 0,
        highestCompletedIntervalBrokenLevel: 0,
        highestCompletedTriadsLevelBlocked: 0,
        highestCompletedTriadsLevelBroken: 0,
      };

    case "SET_LEVEL":
      return {
        ...state,
        level: action.level,
      };

    case "SET_MODE":
      return {
        ...state,
        mode: action.mode,
      };

    case "SET_LEADERBOARD_MODE":
      return {
        ...state,
        leaderboardMode: action.mode,
      };

    case "SET_TRIAD_MODE":
      return {
        ...state,
        triadmode: action.mode,
      };

    case "SET_INTERVAL_MODE":
      return {
        ...state,
        intervalmode: action.mode,
      };

    case "PROGRESS_SAVED":
      console.log("PROGRESS_SAVED: " + JSON.stringify(action.payload));

      return {
        ...state,
      };

    default:
      return state;
  }
};
