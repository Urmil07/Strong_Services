module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      "module-resolver",
      {
        alias: {
          "Common": "./Source/Common",
          "CApp": "./Source/Components/App",
          "CAuth": "./Source/Components/Auth",
          "Reducers": "./Source/Redux/ExtraReducers",
          "@Constants": "./Source/Constants",
          "@Interfaces": "./Source/Interfaces",
          "@ReduxHook": "./Source/Utils/Hook/ReduxHook",
          "App": "./Source/Screens/App",
          "Auth": "./Source/Screens/Auth",
          "@Utils": "./Source/Utils",
          "@DB": "./Source/DB",
          "@": "./Source",
        },
      },
    ],
  ],
};
