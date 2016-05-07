# Nativescript-Firebase

## Installation

This app is built with the [NativeScript CLI](https://github.com/NativeScript/nativescript-cli).
Once you have the CLI [installed](https://github.com/NativeScript/nativescript-cli#installation), start by cloning this repo:

## Usage

```
$ git clone https://github.com/Bart-Bakker/Nativescript-Firebase.git
$ cd Nativescript-Firebase
$ tns plugin add nativescript-plugin-firebase
$ tns platform add ios
$ tns platform add android
```

Next, Head on over to firebase.com and sign up for a free account. Your first 'Firebase' will be automatically created and made available via a URL like https://resplendent-fire-4211.firebaseio.com/

Now you can use the run command to run this app on iOS:

```
$ tns run ios --emulator
$ tns emulate ios --device iPhone-6s
```

.. or on Android
```
$ tns run android --emulator
$ tns emulate android --geny "Nexus 6_23"
```