import React from 'react'

export const htmlspecialchars_decode = (data) => {
  const map = {
    '"Segoe UI"': 'Segoe UI',
    '"Open Sans"': ' Open Sans',
    '"Fira Sans"': 'Fira Sans',
    '"Helvetica Neue"': 'Helvetica Neue',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'"
  };
  return data.replace(/&amp;|&lt;|&gt;|&quot;|&#039;|"Segoe UI"|"Open Sans"|"Fira Sans"|"Helvetica Neue"/gi, function (matched) {
    return map[matched];
  });
}

export const styleParser = (data) => {
  const map = {
    "font-size": "fontSize",
    "font-family": "fontFamily",
    "background-color": "backgroundColor",
    "text-align": "textAlign"
  };
  return data.replace(/font-size|font-family|background-color|text-align/gi, function (matched) {
    return map[matched];
  });
}

export const stringRepAll = (object, data) => {
  let list = '';
  for (let property in object) {
    list = list + '\\' + property + '|';
  }
  let reg = new RegExp(list.substring(0, list.length - 1), "gi");

  return data.replace(reg, function (matched) {
    return object[matched];
  });
}

export const dateConstructor = (dateInt) => {
  const dateObject = new Date(dateInt * 1000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = dateObject.getFullYear();
  const shortYear = "'" + year.toString().substring(2);
  const month = months[dateObject.getMonth()];
  const day = dateObject.getDate();
  let hour = dateObject.getHours();
  let minute = dateObject.getMinutes();
  let ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  hour = hour ? hour : 12;
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  return { year, shortYear, month, day, hour, minute, ampm };
}


const getNodes = (str) =>
  new DOMParser().parseFromString(str, "text/html").body.childNodes;
let createJSX = nodeArray => {
  // const className = nodeArray[0].className;
  return nodeArray.map((node, index) => {
    let attributeObj = { key: index };
    const {
      attributes,
      localName,
      childNodes,
      nodeValue
    } = node;
    if (attributes) {
      Array.from(attributes).forEach(attribute => {
        if (attribute.name === "style") {
          let styleAttributes = attribute.nodeValue.split(";");
          let styleObj = {};
          styleAttributes.forEach(attribute => {
            let [key, value] = attribute.split(":");
            key = styleParser(key);
            styleObj[key] = value;
          });
          attributeObj[attribute.name] = styleObj;
        } else {
          attributeObj[attribute.name] = attribute.nodeValue;
        }
      });
    }
    return localName ?
      React.createElement(
        localName,
        attributeObj,
        childNodes && Array.isArray(Array.from(childNodes)) ?
          createJSX(Array.from(childNodes)) :
          []
      ) :
      nodeValue;
  });
};

export const StringToJSX = props => {
  return createJSX(Array.from(getNodes(props.domString)));
};


export default {
  htmlspecialchars_decode,
  stringRepAll,
  StringToJSX,
  dateConstructor
}