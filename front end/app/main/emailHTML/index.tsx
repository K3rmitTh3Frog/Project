import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const App = () => {
  const { width } = useWindowDimensions();

  const htmlContent = `
    <html dir="ltr"><head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style type="text/css">
    <!--
    -->
    </style></head><body><table dir="ltr"><tbody><tr><td id="i1" style="padding:0; font-family:'Segoe UI Semibold','Segoe UI Bold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif; font-size:17px; color:#707070">Microsoft account</td></tr><tr><td id="i2" style="padding:0; font-family:'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif; font-size:41px; color:#2672ec">New app(s) have access to your data</td></tr><tr><td id="i3" style="padding:0; padding-top:25px; font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif; font-size:14px; color:#2a2a2a">saturday application connected to the Microsoft account <a dir="ltr" id="iAccount" class="link" href="mailto:pr**t@outlook.com" style="color:#2672ec; text-decoration:none">pr**t@outlook.com</a>.</td></tr><tr><td id="i4" style="padding:0; padding-top:25px; font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif; font-size:14px; color:#2a2a2a">If you didn’t grant this access, please remove the app(s) from your account.</td></tr><tr><td style="padding:0; padding-top:25px; font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif; font-size:14px; color:#2a2a2a"><table border="0" cellspacing="0"><tbody><tr><td bgcolor="#2672ec" style="background-color:#2672ec; padding-top:5px; padding-right:20px; padding-bottom:5px; padding-left:20px; min-width:50px"><a id="i5" href="https://account.live.com/consent/Manage?fn=email" style="font-family:'Segoe UI Semibold','Segoe UI Bold','Segoe UI','Helvetica Neue Medium',Arial,sans-serif; font-size:14px; text-align:center; text-decoration:none; font-weight:600; letter-spacing:0.02em; color:#fff">Manage your apps</a></td></tr></tbody></table></td></tr><tr><td id="i6" style="padding:0; padding-top:25px; font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif; font-size:14px; color:#2a2a2a">You can also <a id="iLink3" class="link" href="https://account.live.com/SecurityNotifications/Update" style="color:#2672ec; text-decoration:none">opt out</a> or change where you receive security notifications.</td></tr><tr><td id="i7" style="padding:0; padding-top:25px; font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif; font-size:14px; color:#2a2a2a">Thanks,</td></tr><tr><td id="i8" style="padding:0; font-family:'Segoe UI',Tahoma,Verdana,Arial,sans-serif; font-size:14px; color:#2a2a2a">The Microsoft account team</td></tr></tbody></table><div lang="en-gb" style="margin-top:20px; margin-bottom:10px"><a class="link" href="https://go.microsoft.com/fwlink/?LinkId=521839">Privacy Statement</a><div style="margin-top:10px">Microsoft Corporation, One Microsoft Way, Redmond, WA 98052</div></div></body></html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <RenderHtml
        contentWidth={width}
        source={{ html: htmlContent }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

export default App;
