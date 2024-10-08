import React from 'react';
import { WebView } from 'react-native-webview';

export default function LegalScreen() {
    return (
        <WebView
            source={{ uri: 'https://privacy.leaflit.info' }}
            style={{ flex: 1 }}
        />
    );
}