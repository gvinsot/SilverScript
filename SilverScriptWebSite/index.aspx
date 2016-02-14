<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="SilverScript.index" %>

<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" style="height: 100%">
<head>
    <meta charset="utf-8" />
    <title>SilverScript HTML App</title>
    <link rel="stylesheet" href="styles/bootstrap.css" type="text/css" />
    <link rel="stylesheet" href="styles/app.css" type="text/css" />
    <script type="text/javascript" src="/scripts/libs/jquery.js"></script>
    <%=Scripts%>
</head>

<body data-context="/raw/subscriptions.json" style="height: 100%">

    <div style="position: relative; padding-left: 17px; padding-top: 6px; font-size: large; width: 100%; background: #000000; height: 40px; color: white">
        SilverScript
    </div>
    <div style="height: calc(100% - 40px); width: 100%; display: flex">
        <div style="position: relative; background: #66CCFF; height: 100%; width: 200px">
            <button onclick="SilverScriptTools.BindingTools.SetContent('MainPage','/views/GetStarted.html');" style="width: 100%; height: 40px; display:block">Get Started</button>
            <button onclick="SilverScriptTools.BindingTools.SetContent('MainPage','/views/Download.html');" style="width: 100%;height: 40px; display:block">Download</button>
            <button onclick="SilverScriptTools.BindingTools.SetContent('MainPage','/views/Documentation.html');" style="width: 100%; height: 40px; display:block">Documentation</button>
            <button onclick="SilverScriptTools.BindingTools.SetContent('MainPage','/views/TestPage.html');" style="width: 100%; height: 40px; display:block">Test Page</button>

        </div>
        <div id="MainPage" data-template="/views/GetStarted.html" style="height: 100%; width: calc(100% - 200px); display: flex">

        </div>
    </div>
</body>

</html>
