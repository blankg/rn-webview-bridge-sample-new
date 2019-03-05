/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { WebView } from "react-native-webview";


export default class App extends Component<{}> {
	constructor(props) {
		super(props);

		this.state = {
			text: "ReactNative WebView Sample",
			text2: ""
		};

		this.onWebViewMessage = this.onWebViewMessage.bind(this);
	}

	handleDataReceived(msgData) {
		this.setState({
			text2: `Message from web view ${msgData.data}`
		});
		msgData.isSuccessfull = true;
		msgData.args = [msgData.data % 2 ? "green" : "red"];
		this.myWebView.injectJavaScript(`window.postMessage('${JSON.stringify(msgData)}', '*');`);
	}

	onWebViewMessage(event) {
		console.log("Message received from webview");

		let msgData;
		try {
			msgData = JSON.parse(event.nativeEvent.data);
		} catch (err) {
			console.warn(err);
			return;
		}

		switch (msgData.targetFunc) {
			case "handleDataReceived":
				this[msgData.targetFunc].apply(this, [msgData]);
				break;
		}
	}

	render() {
		return (
            <View style={styles.container}>
              <Text style={styles.welcome}>{this.state.text}</Text>
              <Text style={styles.welcome}>{this.state.text2}</Text>
              <View style={styles.webViewContainer}>
                <WebView
                    ref={webview => {
						this.myWebView = webview;
					}}
                    scrollEnabled={false}
                    source={Platform.OS === "ios" ? require("./resources/index.html") : {uri: "file:///android_asset/index.html"}}
                    onMessage={this.onWebViewMessage}
                />
              </View>
            </View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center"
	},
	welcome: {
		flex: 1,
		paddingTop: 40,
		fontSize: 20,
		textAlign: "center",
		backgroundColor: "skyblue"
	},
	webViewContainer: {
		flex: 4,
		marginBottom: 0
	}
});
