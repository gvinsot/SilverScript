SilverScript
=======
SilverScript is a javascript framework dedicated to bring XAML binding syntax to javascript.
Coupled to TypeScript it provides the perfect environment for XAML developper.

# Get Started.

![Logo](images/logo.png)

Add the references or download the sample project for TypeScript definitions (Silverscript needs jQuery 2+)

[https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js](https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js)

[http://silverscript.azurewebsites.net/scripts/silverscript.js](http://silverscript.azurewebsites.net/scripts/silverscript.js)

### Set the datacontext

```html
<div id="testDiv" data-context="/api/mycontroller">
  ...
</div>

or

<div id="testDiv" data-context="http://www.mywebsite.com/myobject.json">
  ...
</div>

or

$('testDiv')["data-context-value"]=myObject;
```

### Bind OneTime (default)

```html
<span data-binding="{Path=name,Destination=Content}">
</span>

or

<a href="blank" data-binding="{Path=name,Destination=href}">
  My dynamic link
</a>
```

### OneWay Binding

```html
<span data-binding="{Path=name,Destination=Content,Mode=OneWay}">
</span>

Important remark: a PropertyChanged property will automatically be added to the datacontext object and the binding will update in case the PropertyChanged event is raised on this object.
```

### TwoWay Binding

```html
<input type="text" data-binding="{Path=name,Destination=Content,Mode=TwoWay}">
</input>
```

### Data templates for items lists

```html
<table style="width:100%" data-source="/viewmodels/Test" data-template="/views/item.html">
</table>

And template (item.html):

<tr>
  <td data-binding="{Path=FirstName,Destination=Content}"></td>
  <td data-binding="{Path=LastName,Destination=Content}"></td>
</tr>
```

### Converters

```html
<span data-binding="{Path=name,Destination=Content,Converter=MyMethod,ConverterParameter=myparameter}">
</span>

MyMethod will be called with parameters: MyMethod(valueToConvert,'myparameter')
```

### Bind to another element

```html
<span data-binding="{Path=name,Destination=Content,ElementName=IdOfAnotherDiv}"></span>
```

### Multiple bindings

```html
<a href="blank" data-binding="{Path=link,Destination=href}{Path=label,Destination=Content}"></a>
```

### Code your own ViewModel

You can create a json object and add it a PropertyChanged property of type EventHandler.
You can call yourobject.PropertyChanged.FireEvent("myPropertyName") to raise the PropertyChanged event and update all bindings referencing this property.

