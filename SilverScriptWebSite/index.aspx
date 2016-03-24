<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="index.aspx.cs" Inherits="SilverScript.index" %>

<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" style="height: 100%">
<head>
    <meta charset="utf-8" />
    <title>SilverScript</title>
    <link rel="stylesheet" href="styles/app.css" type="text/css" />
    <script type="text/javascript" src="/scripts/libs/jquery.js"></script>
    <%=Scripts%>
</head>

<body>

    <div style="position: relative; padding-left: 17px; padding-top: 6px; font-size: large; width: 100%; background: #000000; height: 55px; color: white">
        <div style="width:1050px;margin-left:auto;margin-right:auto">
            <button onclick="SS.SetTemplate('MainPage','/views/GetStarted.html');" style="width: 150px; margin:5px">Get Started</button>
            <button onclick="SS.SetTemplate('MainPage','/views/Download.html');" style="width: 150px;margin:5px">Download</button>
            <button onclick="SS.SetTemplate('MainPage','/views/TestLoad.html');" style="width: 150px; margin:5px">Load Test</button>
            <button onclick="SS.SetTemplate('MainPage','/views/TestBindings.html');" style="width: 180px; margin:5px">Test Bindings</button>
            </div>
    </div>
    <div id="MainPage" data-template="/views/GetStarted.html" style="max-width: 1050px; margin-left:auto;margin-right:auto">

    </div>    
</body>

</html>
