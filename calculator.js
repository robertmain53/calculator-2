// Calculator - by Simon Tharby, 2018 (solution to; https://www.theodinproject.com/courses/web-development-101/lessons/calculator)
// Mobile focused design that is also appropriately responsive to desktop environment.
// Disambiguation: In this code, 'key' refers / relates to a / the key(s) on the rendered calculator

// --------------------- layout and basic styling -----------------------------

function setKeysTemplate() {
  // '^' = exponentiation, 'C' = clear, '<' = backspace,
  // 'S' = settings, 'F' = fullscreen (landscapeLong && mobile, only)
  let template = [];

  if (layout === "portrait") {
    if (hand === "r") {
      template = ['±', 'S', '<', 'C',
                  '(', ')', '^', '/',
                  '7', '8', '9', '*',
                  '4', '5', '6', '-',
                  '1', '2', '3', '+',
                  '.', '0', '='];
    } else {
      template = ['C', '<', 'S', '±',
                  '/', '^', '(', ')',
                  '*', '7', '8', '9',
                  '-', '4', '5', '6',
                  '+', '1', '2', '3',
                  '=', '0', '.'];
    }
  } else if (layout === "landscape") {
    if (hand === "r") {
      template = ['7', '8', '9', '/', '^', 'C',
                  '4', '5', '6', '*', '(', '<',
                  '1', '2', '3', '-', ')', 'S',
                  '±', '0', '.', '+', '='];
    } else {
      template = ['C', '^', '/', '7', '8', '9',
                  '<', '(', '*', '4', '5', '6',
                  'S', ')', '-', '1', '2', '3',
                  '=', '+', '.', '0', '±'];
    }
  } else if (layout === "landscapeLong" && mobile === false) {
    if (hand === "r") {
      template = ['±', '7', '8', '9', '^', 'S', '<', 'C',
                  '.', '4', '5', '6', '+', '*', '(', ')',
                  '0', '1', '2', '3', '-', '/', '='];
    } else {
      template = ['C', '<', 'S', '^', '±', '7', '8', '9',
                  '(', ')', '*', '+', '.', '4', '5', '6',
                  '=', '/', '-', '0', '1', '2', '3'];
    }
  } else { // landscapeLong && mobile: true
    if (hand === "r") {
      template = ['±', '7', '8', '9', 'F', 'S', '<', 'C',
                  '.', '4', '5', '6', '+', '*', '(', ')',
                  '0', '1', '2', '3', '-', '/', '^', '='];
    } else {
      template = ['C', '<', 'F', 'S', '±', '7', '8', '9',
                  '(', ')', '*', '+', '.', '4', '5', '6',
                  '=', '^', '/', '-', '0', '1', '2', '3'];
    }
  }

  return template;
}

function getDisplayData() {
  calcW = window.innerWidth;
  WinOutW = window.outerWidth;
  screenW = screen.width;
  calcH = window.innerHeight;
  WinOutH = window.outerHeight;
  screenH = screen.height;

  if (screen.width < window.innerWidth || fullscrn === true) {
    mobile = true; // probably mobile, but not a foolproof method
  } else {mobile = false;}
}

function setLayout() {
  if (mobile === false && maximize === false) {
    if (screenW < 2200) {
      if (calcW > 480) { calcW = 480; }
      if (calcH > 385) { calcH = 385; }
    } else if (screenW < 4400) {
      if (calcW > 720) { calcW = 720; }
      if (calcH > 578) { calcH = 578; }
    }
  }

  winRatio = calcW / calcH;

  if (winRatio < 1.2) {
    layout = "portrait";
    displayBheight = calcH * (1 / 15);
    displayAheight = calcH * (2 / 15);
    keyRows = 6;
  } else if (winRatio >= 1.2 && winRatio < 2.1) {
    layout = "landscape";
    displayBheight = calcH * (1 / 11);
    displayAheight = calcH * (2 / 11);
    keyRows = 4;
  } else {
    layout = "landscapeLong";
    displayBheight = calcH * (1 / 9);
    displayAheight = calcH * (2 / 9);
    keyRows = 3;
  }

  keyboardHeight = calcH - displayAheight - displayBheight;

  if (layout === "landscapeLong" && mobile === true) {
    numOfKeys = 24;
  } else {
    numOfKeys = 23;
  }
  keyHeight = (keyboardHeight / keyRows); // -2px for key 1px border
}

function drawPage() {
  getDisplayData();
  setLayout();
  destroyKeys();
  container.style.width = `${calcW}px`;

  if (mobile === false) {
    container.style.margin = `${(window.innerHeight - calcH) / 2}px auto`;
  } else {
    container.style.margin = `auto`;
  }

  input = "";
  updateDispB();
  createKeys();
  stylePage();
  styleMenu();
  addEventListeners();
}

function createKeys() {
  for (let i = 0; i < numOfKeys; i++) {
    const key = document.createElement('div');
    key.classList.add('key');
    key.id = i.toString();
    //key.style.backgroundColor = "#20272d";
    key.style.border = "1px solid #414e58";

    if (hand === "r" && i === 22) { // place double-width '=' key
      if (layout === "portrait") {
        key.style.gridColumn = "3 / span 2";
      } else if (layout === "landscape") {
        key.style.gridColumn = "5 / span 2";
      } else if (mobile === false) { // landscapeLong layout for mobile has no double-width '=' key (uses 'extra' key for fullscreen key)
        key.style.gridColumn = "7 / span 2";
      }
    } else if (hand === "l" && i === 20 && layout === "portrait") {
      key.style.gridColumn = "1 / span 2";
    } else if (hand === "l" && i === 18 && layout === "landscape") {
      key.style.gridColumn = "1 / span 2";
    } else if (hand === "l" && i === 16 && layout === "landscapeLong" && mobile === false) {
      key.style.gridColumn = "1 / span 2";
    } else if (hand === "l" && i > 20 && layout === "portrait") { // place keys after double-width '=' key (if exists before last key)
      key.style.gridColumn = `${(i % 4) + 2} / span 1`;
    } else if (hand === "l" && i > 18 && layout === "landscape") {
      key.style.gridColumn = `${(i % 6) + 2} / span 1`;
    } else if (hand === "l" && i > 16 && layout === "landscapeLong" && mobile === false) {
      key.style.gridColumn = `${(i % 8) + 2} / span 1`;
    } else { // place keys before double-width '=' key (if exists)
      if (layout === "portrait") {
        key.style.gridColumn = `${(i % 4) + 1} / span 1`;
      } else if (layout === "landscape") {
        key.style.gridColumn = `${(i % 6) + 1} / span 1`;
      } else {
        key.style.gridColumn = `${(i % 8) + 1} / span 1`;
      }
    }

    let clickAtt = document.createAttribute("onclick");
    clickAtt.value = "keyClick(this.id)";
    key.setAttributeNode(clickAtt);

    key.style.lineHeight = `${keyHeight}px`;
    keyboard.appendChild(key);

    const keyPara = document.createElement('p');  // add <p> element to key
    keyPara.classList.add('keyPara');
    keyPara.id = `keyPara${i}`;
    key.appendChild(keyPara);
  }
}

function destroyKeys() {
  let elements = document.getElementsByClassName('key');
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

function stylePage() {
  if (layout === "portrait") {
    fontSizeA = calcW / 10;
    fontSizeB = calcW / 23;
  } else if (layout === "landscape") {
    fontSizeA = calcH / 7.8;
    fontSizeB = calcH / 18;
  } else {
    fontSizeA = calcH / 6;
    fontSizeB = calcH / 16;
  }

  displayB.style.height= `${displayBheight}px`;
  displayA.style.height= `${displayAheight}px`;
  keyboard.style.height= `${keyboardHeight}px`;

  displayB.style.lineHeight = `${displayBheight}px`;
  displayA.style.lineHeight = `${displayAheight}px`;

  displayAtext.style.fontSize = `${fontSizeA}px`;
  displayBtext.style.fontSize = `${fontSizeB}px`;

  container.style.backgroundColor = containerBgColor;
  displayB.style.backgroundColor = dispBbgColor;
  body.style.background = bodyBgColor;

  if (mobile === false && maximize === false) {
    container.style.webkitBoxShadow = "2px 2px 17px 2px rgba(0, 0, 0, 0.4)";
    container.style.mozBoxShadow =  "2px 2px 17px 2px rgba(0, 0, 0, 0.4)";
    container.style.boxShadow = "2px 2px 17px 2px rgba(0, 0, 0, 0.4)";
  }

  // ------------- keys styling ----------------------

  keysTemplate = setKeysTemplate();

  fontSizeKeys = keyHeight / 1.8;

  for (let i = 0; i < numOfKeys; i++) { // style each <p> on each key, including a string
    let thisKey = document.getElementById(`${i}`);
    let keyPara = document.getElementById(`keyPara${i}`);

    if (keysTemplate[i] === '^') { // special scrollPosition for 'x^y' text (with superscript)
      vertOffset = fontSizeKeys * -0.198;
      horOffset = fontSizeKeys * -0.3;
      keyPara.innerHTML = `x<sup>y</sup>`;
      keyPara.style.margin = `${vertOffset}px ${horOffset}px 0 0`;
    } else {
      keyPara.innerHTML = keysTemplate[i];
    }

    thisKey.style.backgroundColor = keyBgColor;
    thisKey.style.border = "none";
    keyPara.style.textAlign = "center";

    if (keysTemplate[i] === '^') { // font sizes
      keyPara.style.fontSize = `${fontSizeKeys * 0.9}px`;
    } else {
      keyPara.style.fontSize = `${fontSizeKeys}px`;
    }

    switch (keysTemplate[i]) {
      case 'C':
        keyPara.style.color = keyClearColor;
        let tooltipAttClr = document.createAttribute("title");
        tooltipAttClr.value = "clear all"; // Set the value of the html 'title' property (tooltip) attribute
        keyPara.setAttributeNode(tooltipAttClr);
        break;
      case '<':
        keyPara.style.color = keyBackspColor;
        let tooltipAttBsp = document.createAttribute("title");
        tooltipAttBsp.value = "backspace"; // Set the value of the html 'title' property (tooltip) attribute
        keyPara.setAttributeNode(tooltipAttBsp);
        break;
      case '=':
        keyPara.style.color = keyEqualsColor;
        break;
      case '+': case '-': case '*': case '/':
        keyPara.style.color = keyOperatorColor;
        break;
      case '±': case '^': case '(': case ')':
        keyPara.style.color = keyAuxColor;
        break;
      case 'S':
        keyPara.style.color = keySettingsColor;
        let tooltipAttSet = document.createAttribute("title");
        tooltipAttSet.value = "settings"; // Set the value of the html 'title' property (tooltip) attribute
        keyPara.setAttributeNode(tooltipAttSet);
        break;
      case 'F':
        keyPara.style.color = keyFcolor;
        break;
      default:
        keyPara.style.color = keyDigitColor;
    }
  }
}

function styleMenu() {
  if (layout === "portrait") {
    menuW = calcW * 0.75;
    menuH = calcH * 0.75;
  } else {
    menuH = calcH * 0.8;
    menuW = menuH;
  }

  menuContainer.style.position = "fixed";
  menuContainer.style.top = `${(window.innerHeight - menuH) / 2}px`;
  menuContainer.style.left = `${(window.innerWidth - menuW) / 2}px`;
  menuContainer.style.height = `${(menuH)}px`;
  menuContainer.style.width = `${(menuW)}px`;
  menuContainer.style.backgroundColor = keyDigitColor;

  let menuBorder = menuH / 30;
  let closeBorder = menuBorder / 2;
  let menuBoxH = (menuH - (5 * menuBorder)) / 4;
  let menuBoxW = menuW - (2 * menuBorder);

  for (let i = 1; i < 5; i++) {
    let thisBox = document.getElementById(`menuBox${i}`);
    let thisText = document.getElementById(`menuText${i}`);
    thisBox.style.position = "relative";
    thisBox.style.top = `${(menuBorder * i)}px`;
    thisBox.style.left = `${(menuBorder)}px`;
    if (i === 4) {
      thisBox.style.height = `${(menuBoxH) - (2 * closeBorder)}px`;
      thisBox.style.width = `${(menuBoxW) - (2 * closeBorder)}px`;
      thisText.style.lineHeight = `${(menuBoxH) - (2 * closeBorder)}px`;
    } else {
      thisBox.style.height = `${(menuBoxH)}px`;
      thisBox.style.width = `${(menuBoxW)}px`;
      thisText.style.lineHeight = `${(menuBoxH)}px`;
    }
    thisText.style.textAlign = "center";


    if (i === 1 || i === 4) {
      thisBox.style.backgroundColor = keyDigitColor;
      thisText.style.color = keyBgColor;
    } else {
      thisBox.style.backgroundColor = keyBgColor;
      thisText.style.color = keyDigitColor;
    }

    if (i === 4) {
      thisBox.style.borderStyle = "solid";
      thisBox.style.borderWidth = `${(closeBorder)}px`;
      thisBox.style.borderColor = keyBgColor;
    }

    if (i == 3) {
      thisText.style.fontSize = `${menuBoxW / 10}px`; // currently no difference; might not need
      if (mobile === false) {
        if (maximize === false) {
          thisText.innerHTML = "maximize"; // will need to add if/else if's for different states and desktop v mobile
        } else {
          thisText.innerHTML = "default size"; // will need to add if/else if's for different states and desktop v mobile
        }
      } else if (maximize === false) {
        thisText.innerHTML = "fullscreen";
      } else {
        thisText.innerHTML = "windowed";
      }
    } else {
      thisText.style.fontSize = `${menuBoxW / 10}px`;
      if (i == 2) {
        if (hand === "r") {
          thisText.innerHTML = "left handed";
        } else {
          thisText.innerHTML = "right handed";
        }
      }
    }

  }
}

// ---------- event listeners and input/output/display logic ---------------------

function addEventListeners() {
  keys = document.querySelectorAll('.key');
  keys.forEach(key => key.addEventListener('mouseover', hover));
  keys = document.querySelectorAll('.key');
  keys.forEach(key => key.addEventListener('mouseout', unHover));

  let clickMenuHandAtt = document.createAttribute("onclick");
  clickMenuHandAtt.value = "switchHandLayout()";
  menuBox2.setAttributeNode(clickMenuHandAtt);

  let clickMenuMaximizeAtt = document.createAttribute("onclick");
  clickMenuMaximizeAtt.value = "toggleMaxLayout()";
  menuBox3.setAttributeNode(clickMenuMaximizeAtt);

  let clickMenuCloseAtt = document.createAttribute("onclick");
  clickMenuCloseAtt.value = "hideMenu()";
  menuBox4.setAttributeNode(clickMenuCloseAtt);

  for (let i = 2; i < 5; i++) {
    let thisBox = document.getElementById(`menuBox${i}`);
    thisBox.addEventListener('mouseover', menuHover);
    thisBox.addEventListener('mouseout', menuUnHover);
  }
}

function hover() {
  if (mobile === false && menuActive === false) {
    let thisID = this.id.toString();
    let element = document.getElementById(`keyPara${thisID}`);
    let style = window.getComputedStyle(element,"");
    let textColor = style.getPropertyValue("color");
    let hsl = getHSLvalues(textColor);
    prevColor = textColor;
    document.getElementById(`keyPara${thisID}`).style.color = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2] * 1.4}%)`;
  }
}

function unHover () {
  if (mobile === false && menuActive === false) {
    let thisID = this.id.toString();
    document.getElementById(`keyPara${thisID}`).style.color = prevColor;
  }
}

function menuHover() {
  let thisID = this.id.toString();
  document.getElementById(`${thisID}`).style.backgroundColor = menuHoverColor;
}

function menuUnHover() {
  let thisID = this.id.toString();
  if (thisID === "menuBox4") {
    document.getElementById(`${thisID}`).style.backgroundColor = keyDigitColor;
  } else {
    document.getElementById(`${thisID}`).style.backgroundColor = keyBgColor;
  }
}

function showMenu() {
  menuActive = true;
  haltAnimations();
  keysTemplate = setKeysTemplate();
  let indexS = keysTemplate.indexOf("S");
  document.getElementById(`keyPara${indexS}`).style.color = keySettingsColor;
  menuContainer.style.zIndex = "1";
}

function hideMenu() {
  menuActive = false;
  menuContainer.style.zIndex = "-1";
}

function switchHandLayout() {
  if (hand === "r") {
    hand = "l";
  } else {
    hand = "r";
  }
  drawPage();
  hideMenu();
}

function toggleMaxLayout() {
  if (maximize === false) {
    maximize = true;
    if (mobile === true) {
      goFullscreen();
    }
  } else {
    maximize = false;
    if (mobile === true) {
      exitFullscreen();
    }
  }
  drawPage();
  hideMenu();
}

function goFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  fullscrn = true;
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
  fullscrn = false;
}

function animateWarningDispA() { // used for "faulty expression", "n * unclosed ')'" AND "invalid input" warnings
  switch (countWarningAnim) {
      case 0: displayAtext.style.opacity = "0.3"; break;
      case 1: displayAtext.style.opacity = "0.6"; break;
      case 2: displayAtext.style.opacity = "0.8"; break;
      case 3: displayAtext.style.opacity = "0.9"; break;
      case 4: displayAtext.style.opacity = "1.0"; break;
      case 5: displayAtext.style.opacity = "1.0"; break;
      case 6: displayAtext.style.opacity = "0.9"; break;
      case 7: displayAtext.style.opacity = "0.8"; break;
      case 8: displayAtext.style.opacity = "0.7"; break;
      case 9: displayAtext.style.opacity = "0.6"; break;
      case 10: displayAtext.style.opacity = "0.5"; break;
      case 11: displayAtext.style.opacity = "0.6"; break;
      case 12: displayAtext.style.opacity = "0.7"; break;
      case 13: displayAtext.style.opacity = "0.8"; break;
      case 14: displayAtext.style.opacity = "0.9"; break;
      case 15: displayAtext.style.opacity = "1.0"; break;
      case 16: displayAtext.style.opacity = "1.0"; break;
      case 17: displayAtext.style.opacity = "1.0"; break;
      case 18: displayAtext.style.opacity = "1.0"; break;
      case 19: displayAtext.style.opacity = "1.0"; break;
      case 20: displayAtext.style.opacity = "1.0"; break;
      case 22: displayAtext.style.opacity = "1.0"; break;
      case 23: displayAtext.style.opacity = "1.0"; break;
      case 24: displayAtext.style.opacity = "1.0"; break;
      case 25: displayAtext.style.opacity = "0.9"; break;
      case 26: displayAtext.style.opacity = "0.8"; break;
      case 27: displayAtext.style.opacity = "0.7"; break;
      case 28: displayAtext.style.opacity = "0.6"; break;
      case 29: displayAtext.style.opacity = "0.5"; break;
      case 30: displayAtext.style.opacity = "0.3"; break;
      case 31: displayAtext.style.opacity = "1.0"; countWarningAnim = 0; displayAtext.innerHTML = strA + "&nbsp;";
                displayAtext.style.color = bodyColor; clearInterval(warningAnim); invalidAnim = false;
  }
  countWarningAnim++;
}

function haltAnimations() { /// REFACTOR???
  clearInterval(clickAnim);
  clearInterval(scrollAnim);
  if (lastElemClicked != null) {
    document.getElementById(lastElemClicked).style.background = keyBgColor; //counter = 0;
  }
  clearInterval(warningAnim);
  if (invalidAnim === true) {
    strA = dispAstore;
    invalidAnim = false;
  }
  displayAtext.style.opacity = "1.0";
  displayAtext.style.color = bodyColor;
  displayAtext.innerHTML = strA + "&nbsp;";
  countWarningAnim = 0;
  if (startup === true) {
    startup = false;
    displayBtext.style.opacity = "1.0";
    clear();
  }
  if (powWarning === true) {
    powWarning = false;
    clear();
  }
}

function invalidInputWarning() {
  invalidAnim = true;
  displayAtext.style.opacity = "0.0";
  displayAtext.style.color = keyClearColor;
  displayAtext.innerHTML = "invalid input&nbsp;";
  countWarningAnim = 0;
  warningAnim = setInterval(function(){ animateWarningDispA() }, 30);
}

function keyClick (clickedID) {
  function animateClick() {
    let elem = document.getElementById(`${clickedID}`);
    lastElemClicked = clickedID;

    switch (counter) {
        case 0: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 10%, ` + keyBgColor + ` 90%)`; break;
        case 1: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 20%, ` + keyBgColor + ` 90%)`; break;
        case 2: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 30%, ` + keyBgColor + ` 100%)`; break;
        case 3: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 40%, ` + keyBgColor + ` 100%)`; break;
        case 4: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 65%, ` + keyBgColor + ` 100%)`; break;
        case 5: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 40%, ` + keyBgColor + ` 100%)`; break;
        case 6: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 30%, ` + keyBgColor + ` 100%)`; break;
        case 7: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 20%, ` + keyBgColor + ` 100%)`; break;
        case 8: elem.style.background = `radial-gradient(${prevColor} 0%, ` + keyBgColor + ` 10%, ` + keyBgColor + ` 100%)`; break;
        case 9: elem.style.background = keyBgColor; counter = 0; clearInterval(clickAnim);
    }
    counter++;
  }

  haltAnimations();

  if (mobile === true) {
    prevColor = document.getElementById(`keyPara${clickedID}`).style.getPropertyValue("color");
  }

  counter = 0;
  let template = setKeysTemplate();

  input = template[clickedID]; // template[clickedID] is the character represented (in; keyPara) on the clicked calculator keypad key

  if (menuActive === false) {
    if (resultToClear === true) {
      if (input != "±" && input != "=" && input != ')' && input != 'S' && input != 'F') {
        if (input === "+" || input === "-" || input === "*"
          || input === "/" || input === "^" || input === "<" || input === '=') {
            if (infinityToClear === false) {
              history = "";
              updateDispB();
            }
        } else {
          history = "";
          updateDispB();
          strA = "";
          updateDispA("");
          decimal = false;
          scrollPosition = 0;
          infinityToClear = false;
        }
        if (infinityToClear === false) {
          resultToClear = false;
          digits = 0;
        }
      }
    }

    if (input === "S") {
      showMenu();
    } else if (input === "F") {
      toggleMaxLayout();
    } else if (input === "C" || (infinityToClear === true && input === '<')) {
      clear();
    } else if (input === "<") {
      if (strA != "") {
        updateDispA(input);
      } else {
        updateDispB();
      }
    } else if (input === "+" || input === "-" || input === "*"
      || input === "/" || input === "^") {
        if (strA != "" && resultToClear === false) { // cannot be first action after clear all
              history = history + strA + input;
              operatorCount++;
              updateDispA(input);
              updateDispB();
        } else if (strA != "" && resultToClear === true) {
          invalidInputWarning();
        } else if (history != "") { // cannot be first action after clear all or restart
          updateDispB();
        } else {
          invalidInputWarning();
        }
    } else if (input === ".") {
        if (decimal === false && digits < 16) { // cannot add 2nd decimal point to display A
          if (strA === "") { // add 0 prefix if '.' is 1st input after dispA clear
            input = "0.";
            digits= digits + 2;
            decimal = true;
            updateDispA(input);
          } else {
            digits++;
            decimal = true;
            updateDispA(input);
          }
        } else {
          invalidInputWarning();
        }
    } else if (input === "(") {
        updateDispA(input);
    } else if (input === ")") {
        if (parenth > 0 && operatorEdit == false) { // cannot close unopened parentheses
          updateDispA(input);
        } else if (parenth > 0 && operatorEdit == true) {
          updateDispB();
        } else {
          invalidInputWarning();
        }
    } else if (input === "±") {
      updateDispA(input);
    } else if (input === "=") {
      if (history != "" && resultToClear === false) { // cannot be first action after clear all
        if (parenth === 0 && operatorEdit === false && strA != "") {
          evaluate();
        } else if (strA === "" && history != "" && parenth === 0 && operatorEdit === true) {
          evaluate();
        } else if (strA === "" && history != "" && parenth === 0 && operatorCount === 1) {
          history = history + history.slice(0, history.length - 1);
          evaluate();
        } else if (parenth === 0 && strA === "" && history.slice(-1) === ')') {
          evaluate();
        } else {
          displayAtext.style.opacity = "0.0";
          displayAtext.style.color = keyClearColor;

          if (parenth != 0) {
            displayAtext.innerHTML = parenth + " * unclosed ')'&nbsp;";
          } else {
            displayAtext.innerHTML = "faulty expression&nbsp;";
          }

          countWarningAnim = 0;
          warningAnim = setInterval(function(){ animateWarningDispA() }, 30);
        }
      }
    } else { // digit (0 - 9)
      if (digits < 16) {
        digits++;
        updateDispA(input);
      }
    }

    dispAstore = strA;
    clickAnim = setInterval(function(){ animateClick() }, 20);
  }
}

function round(number, precision) {
  var shift = function (number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    var numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
  };

  return shift(Math.round(shift(number, precision, false)), precision, true);
}

function parseResult(string) {
  function moveDecimal(numStr) {
    let index = numStr.indexOf('.');
    let newStr = "";

    if ((negative === true && index != 2) || (negative === false && index != 1)) {
      let part1 = numStr.slice(0, index);
      let part2 = numStr.slice(index + 1, numStr.length);
      if (negative === false) {
        newStr = numStr.slice(0, 1) + '.' + part1.slice(1, part1.length) + part2;
        return [newStr, index - 1];
      } else {
        newStr = numStr.slice(0, 2) + '.' + part1.slice(2, part1.length) + part2;
        return [newStr, index - 2];
      }
    } else {
      return [numStr, 0];
    }
  }

  function insertDecimal(numStr) {
    let newStr = "";
    let index = 0;

    if (negative === true) {
      index = 2;
    } else {
      index = 1;
    }

    let part1 = numStr.slice(0, index);
    let part2 = numStr.slice(index, numStr.length);
    newStr = part1 + '.' + part2;
    return [newStr, numStr.length -index];
  }

  function positionDecimal(numStr) {
    if (numStr.indexOf('.') < 0) { // does not have decimal
      decArry = insertDecimal(numStr);
    } else { // has decimal
      decArry = moveDecimal(numStr);
    }
    return decArry;
  }

  function roundToFit(numStr) {
    if (negative === false) {
      result = round(parseFloat(numStr), lenLimit - expStr.length - 2);
    } else {
      result = round(parseFloat(numStr), lenLimit - expStr.length - 3);
    }
    return result;
  }

  function makeExp(exp) {
    if (exp >= 0) {
      expStr = "e+" + exp.toString();
    } else {
      expStr = "e" + exp.toString();
    }
    return expStr;
  }

  function parseExponent(numStr) {
    expStr = numStr.slice(numStr.indexOf('e'), numStr.length);
    numStr = numStr.slice(0, numStr.length - expStr.length);

    if (expStr.indexOf('-') > -1) {
      exp = parseInt(expStr.slice(expStr.indexOf('-'), expStr.length));
    } else {
      exp = parseInt(expStr.slice(expStr.indexOf('+') + 1, expStr.length));
    }
    return [numStr, exp];
  }

  let num = parseFloat(string);
  let lenLimit = 16;
  let negative = false;
  let result = 0;
  let exp = 0;
  let expStr = "";
  let decArry = [];

  if (string.slice(0, 1) === '-') {
    lenLimit = lenLimit + 1 // (including '-')
    negative = true;
  }

  if ((num >= 10000000000000000 || num <= -10000000000000000) && string.indexOf('e') < 0) { // value too large for display, no exponent, with or without decimals
    decArry = positionDecimal(string);
    string = decArry[0];
    expStr = makeExp(decArry[1]);
    result = roundToFit(string);
    return result.toString() + expStr;
  } else if (string.indexOf('e') > -1) { // has exponent
    let parseExp = parseExponent(string);
    string = parseExp[0];
    decArry = positionDecimal(string);
    string = decArry[0];
    exp = parseExp[1] + decArry[1];
    expStr = makeExp(exp);
    result = roundToFit(string);
    return result.toString() + expStr;
  } else { // all other forms of result
    let index = string.indexOf('.');
    result = round(parseFloat(string), lenLimit - index - 1);
    return result.toString();
  }
}

function evaluate() {
  history = history + strA;
  let toEval = history;
  origExprToEval = history;
  toEval = evalPowers(toEval);
  toEval[0] = toEval[0].replace(/--/g,'+'); // JS eval() doesn't like '--'
  let result = 0;
  let resultStr = "";

  if (toEval[1] === 'no power') {
    result = eval(toEval[0]);
    resultStr = result.toString();
  } else {
    resultStr = 'power error!'; // This will trigger error animation (TO DO)
  }

  if (resultStr.slice(0, 1) === 'I' || resultStr.slice(0, 2) === '-I' || resultStr.slice(0, 1) === 'N' || resultStr.slice(0, 1) === 'p') {
    infinityToClear = true;
    resultToClear = true;
    if (resultStr === "NaN"){
      resultStr = "undefined: 0/0";
    } else if (resultStr.slice(0, 1) === 'p') {
      powStr = toEval[0];
      resultStr = 'power error!';
      playPowWarnAnimation();
    } else if (resultStr.slice(0, 2) != '-I') {
      resultStr = "infinity";
    } else {
      resultStr = "-infinity";
    }
  } else {
    resultStr = parseResult(resultStr);
  }

  if (resultStr != "power error!") {
    history = history + "=";
    updateDispB();
  }
  strA = resultStr;
  updateDispA("");

  if (result < 0) {
    positive = false;
  } else {
    positive = true;
  }
  if (resultStr.indexOf('.') > -1) {
    decimal = true;
  } else {
    decimal = false;
  }

  operatorEdit = false;
  resultToClear = true;
  operatorCount = 0;
}

function updateDispA(input) {
  if (operatorEdit === false) {
    if (input === "±") {
      if (infinityToClear === false) {
        if (positive === true) {
          strA = "-" + strA;
          positive = false;
        } else {
          strA = strA.slice(1, strA.length);
          positive = true;
        }
      } else {
        invalidInputWarning();
      }
    } else if (input === "(") {
        if (strA === "") {
          parenth = parenth + 1;
          history = history + "(";
          updateDispB();
        } else {
          invalidInputWarning();
        }
    } else if (input === ")") {
      if (strA === "") {
        let check = history.slice(history.length-1, history.length);
        if (check != "+" && check != "-" && check != "*"
            && check != "/" && check != "^" && check != '(') {
          history = history + ")";
          parenth = parenth - 1;
          updateDispB();
        } else {
          invalidInputWarning();
        }
      } else if (digits < 16 && resultToClear === false) {
          parenth = parenth - 1;
          strA = strA + ")";
      } else {
        invalidInputWarning();
      }
    } else if (input === "<") {
        if (strA != "") {
          let check = strA.slice(strA.length-1, strA.length);
          if ((history.length === 0 && strA.length === 1) || strA.indexOf('e') > -1) {
            clear();
          } else if (check === ".") {
            decimal = false;
          }
          if (check === ')') {
            parenth = parenth + 1;
          }
          strA = strA.slice(0, -1);
          digits = digits - 1;
        }
    } else if (input === "+" || input === "-" || input === "*"
      || input === "/" || input === "^") {
        strA = "";
        digits = 0;
        decimal = false;
        positive = true;
    } else {
      let check = strA.slice(strA.length-1, strA.length);
      if (check != ')') {
        strA = strA + input;
      } else {
        invalidInputWarning();
      }
    }
  }

  if (msgToClrDispB === true && strA != '') {
    if (history.slice(0,1) != '(') {
      history = '';
      displayBtext.innerHTML = "";
    }
    msgToClrDispB = false;
  }

  if (invalidAnim == false) {
    displayAtext.innerHTML = strA + "&nbsp;";
  }

}

function updateDispB() {
  if (powWarnDisplaying === true && (input != "" && input != "+" && input != "-"
      && input != "/" && input != "*" && input != "^" && input != ")" && input != "=")) {
        powWarnDisplaying = false;
      }

  let dispBcleared = false;
  check = history.slice(history.length-1, history.length);

  if (input === '<') {
    if ((check === '+' || check === '-' || check === '/' || check === '*' ||
    check === '^') && operatorEdit === false) {
      history = history.slice(0, history.length - 1);
      operatorEdit = true;
      operatorCount--;
    } else if (strA === "") {
      clear();
      dispBcleared = true;
    }
  } else if ((input === '+' || input === '-' || input === '/' || input === '*' ||
    input === '^') && operatorEdit === true) {
    history = history + input;
    operatorCount++;
    operatorEdit = false;
  } else if ((input === '+' || input === '-' || input === '/' || input === '*' ||
    input === '^') && operatorEdit === false  && resultToClear === false
    && check != '(') {
    history = history.slice(0, history.length - 1);
    history = history + input;
  } else if ((input === '+' || input === '-' || input === '/' || input === '*' ||
    input === '^') && strA === '') {
    invalidInputWarning();
  } else if (input === ')' && resultToClear === false) {
    parenth = parenth - 1;
    history = history + input;
  }

  if (dispBcleared != true && powWarnDisplaying === false) {
    let output = "";

    switch (layout) {
      case "portrait":
        if (history.length > (maxCharsPortrait - 2)) {
          output = "..." + history.slice(history.length - maxCharsPortrait + 5, history.length);
        } else {
          output = history;
        }
        break;
      case "landscape":
        if (history.length > (maxCharsLandscape - 2)) {
          output = "..." + history.slice(history.length - maxCharsLandscape + 5, history.length);
        } else {
          output = history;
        }
        break;
      case "landscapeLong":
        if (history.length > (maxCharsLandsLong - 2)) {
          output = "..." + history.slice(history.length - maxCharsLandsLong + 5, history.length);
        } else {
          output = history;
        }
        break;
    }

    output = output + "&nbsp;&nbsp;";
    displayBtext.innerHTML = output;
  } else {
    dispBcleared = false;
  }
}

function clear() {
  strA = "";
  strB = "";
  history = "";
  decimal = false;
  parenth = 0;
  digits = 0;
  positive = true;
  resultToClear = false;
  displayAtext.innerHTML = "";
  displayBtext.innerHTML = "waiting for input...&nbsp;&nbsp;";
  infinityToClear = false;
  operatorEdit = false;
  operatorCount = 0;
  msgToClrDispB = true;
}

/** Converts an RGB color value to HSL. Conversion formula adapted from
 *  http://en.wikipedia.org/wiki/HSL_color_space. Assumes r, g, and b are
 *  contained in the set [0, 255] and returns h, s, and l in the set [0, 1].
 *  adapted from: https://gist.github.com/mjackson/5311256 **/
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.floor(360 - (h * 360)); // hue scale used here was inversion of that used by browsers
  s = Math.floor(s * 100);
  l = Math.floor(l * 100);
  return [ h, s, l ];
}

function parseRGB(rgbString) {
    let red = "";
    let green = "";
    let blue = "";
    let char = "";
    let color = "";
    let rgbArray = [];

    for (let i = 1; i < 4; i++) { // this code block strips rgb values out of css rgb string (background-color of a 'square' element)
      if (i == 1) {
        rgbString = rgbString.slice(4);
      } else {
        rgbString = rgbString.slice(2);
      }
      char = rgbString.slice(0, 1);
      color = "";
      do {
        color = color + char;
        rgbString = rgbString.slice(1);
        char = rgbString.slice(0, 1);
      } while (char != "," && char != ")");
      if (i == 1) {red = color;}
      else if (i == 2) {blue = color;}
      else {green = color;}
    }

    rgbArray[0] = parseInt(red);
    rgbArray[1] = parseInt(green);
    rgbArray[2] = parseInt(blue);
    return rgbArray;
  }

  function getHSLvalues(rgbString) {
    let rgbArray = parseRGB(rgbString);
    let hslArray = rgbToHsl(rgbArray[0], rgbArray[1], rgbArray[2])
    return hslArray;
  }

//               >>> parsing and evaluating powers <<<
//
// All power '^' expressions included in the bases of other power expressions
// are prioritized, and are otherwise considered in order, beginning from
// the end of the input string. Parsing the base and exponent components
// from the input string, before evaluating each with Math.pow(base, exponent),
// involves considering if each is parenthesized or not, negative value or not,
// and/or includes an 'e+17' type component.

function evalPowers(inStr) {
  function findNextPower() {
    let breakSearch = false;
    while (index > 0 && breakSearch === false) {
      index--;
      if (strArray[index] === '^') {
        breakSearch = true;
      }
    }
    return index;
  }

  function parseBase(index) {
    baseStr = "";
     if (strArray[index - 1] === ')') { // base IS parenthesized
       let parenthCount = 1;
       let i = 2;
       baseStr = ')';
       let char = strArray[index - i];

       while (parenthCount != 0) {
         if (char === '(') {
           parenthCount--;
         } else if (char === ')') {
           parenthCount++;
         }
         baseStr = char + baseStr;
         i++;
         char = strArray[index - i];
       }

     } else { // base is NOT parenthesized
       let breakOut = false;
       let i = 1;
       let char = strArray[index - i];
       let prevChar = strArray[index - i - 1]; // prevChar enables check for 'e' notation and negative base
       while ( breakOut === false && ((char != '+' && char != '/' && char != '*' && char != '^' && char != '(' && typeof char != 'undefined')
              || (prevChar === 'e' || prevChar === '+' || prevChar === '-' || prevChar === '/' || prevChar === '*' || prevChar === '^') ||
              (typeof char != 'undefined' && typeof prevChar === 'undefined'))) {
           if (char === '(' || (char === '-' && baseStr.slice(0, 1) === '-')) {
             breakOut = true;
           } else { // add char to front of base
             baseStr = char + baseStr;
             i++;
             char = strArray[index - i];
             prevChar = strArray[index - i - 1];
           }
       }
     }
     return baseStr;
  }

  function findPowToEval() {
    findNextPower();
    baseStr = parseBase(index);
    if (baseStr.indexOf('^') > -1) { // base contains power (parenthesized) {
      return [index, 'powInBase'];
    } else if (index > 0) {
      return [index, 'readyToParse'];
    } else { // string does NOT contain '^'
      return [index, 'NO POWER'];
    }
  }

  function findPowerlessBase() {
    location = findPowToEval();
    while (location[1] === 'powInBase') {
      index--;
      location = findPowToEval();
    }
    return location;
  }

  function parseExponent() {
    let char = strArray[index + 1];
    let expStr = "";
    let parenth = 0;

    if (char === "(") { // exponent IS parenthesized
      parenth++;
      expStr = "(";
      let  i = 2;
      while (parenth != 0) {
        char = strArray[index + i];
        expStr = expStr + char;
        i++;
        if (char === "(") {
          parenth++;
        } else if (char === ")") {
          parenth--;
        }
      }
    } else { // exponent is NOT parenthesized
      let i = 2;
      char = strArray[index + 1];
      let prevChar = strArray[index];
      while ((char != '-' && char != '+' && char != '/' && char != '*' && char != '^' &&
            char != ')' && typeof char != 'undefined') || (prevChar === 'e'
            || prevChar === '^')) {
         expStr = expStr + char;
         prevChar = char;
         char = strArray[index + i];
         i++;
       }
    }
    return expStr;
  }

  function evalOnePower() {
      if (location[1] === 'readyToParse') {
      expStr = parseExponent();
      evalStr = "Math.pow(" + baseStr + ", " + expStr + ")";
      evalStr = eval(evalStr).toString();

      if (evalStr === 'NaN') { // Power error (-ve base with non-integer exponent: e.g. -9^0.5)
        return [baseStr + '^' + expStr, 'Power error!']; // return array with error flag and string

      } else { // rebuild result string
        inStr = inStr.slice(0, index - baseStr.length) + evalStr + inStr.slice(index + expStr.length + 1, inStr.length);
        return [inStr, 'evaluated']
      }
    } else { // no power in string, so just return string
      return [inStr, 'no power'];
    }
  }

  let strArray = [...inStr];
  let index = strArray.length;
  let baseStr = "";
  let location = [];
  let expStr = "";
  let evalStr = "";

  location = findPowerlessBase();
  let result = evalOnePower();

  while (result[1] != 'no power' && result[1] != 'Power error!') {
    strArray = [...inStr];
    index = strArray.length;
    baseStr = "";
    location = [];
    expStr = "";
    evalStr = "";
    location = findPowerlessBase();
    result = evalOnePower();
  }
  return result;
}

//  ---------------- scrolling text animations: 1. startup 2. power error ---------------------

function scrollTextDispB() { // adapted from: https://stanko.github.io/javascript-animation-loop/
  const now = getTime();
  const delta = (now - lastUpdate) / FRAME_DURATION;
  scrollPosition += 0.1 * delta;
  let start = 0;

  if (scrollPosition < (msgLen + scrollMax) && startup === true) {
    if (scrollPosition > scrollMax) {
      start = scrollPosition - scrollMax;
    }
    let spaces = scrollMax - scrollPosition - msgLen;
    if (spaces > 0) {
      for (let i = 0; i < spaces; i++) {
        scrollStr = scrollStr + " ";
      }
    }
    displayBtext.innerHTML = scrollStr.slice(start, scrollPosition) + "  ";
  }

  lastUpdate = now;

  if ((scrollPosition < (msgLen + scrollMax)) && startup === true) {
    requestAnimationFrame(scrollTextDispB, 100);
  } else if (startup === true) {
    startup = false;
    clearInterval(scrollAnim);
    clear();
  }
}

function playStartupAnimation() {
  if (layout === "portrait") {
    scrollMax = maxCharsPortrait + 1;
  } else if (layout === "landscape") {
    scrollMax = maxCharsLandscape - 1;
  } else {
    scrollMax = maxCharsLandsLong - 1;
  }
  startup = true;
  message = "Calculator, by Simon Tharby (2018)";
  displayBtext.style.whiteSpace = "pre";
  scrollStr = message;
  msgLen = message.length;
  displayBtext.innerHTML = "";
  displayBtext.style.opacity = "1.0"; // Reset visibility for startup message (and after)
  scrollAnim = setInterval(function(){ scrollTextDispB(message) }, 100);
}

function scrollPowWarnDispB() { // includes ideas from: https://stanko.github.io/javascript-animation-loop/
  const now = getTime();
  const delta = (now - lastUpdate) / FRAME_DURATION;
  scrollPosition += 0.1 * delta;
  let start = 0;

  if (scrollPosition <= (msgLen + redLen + 1) && powWarning === true) {
    if (scrollPosition > scrollMax) {
      start = scrollPosition - scrollMax;
    }

    let numRedChars = scrollPosition - msgLen;
    if (numRedChars > redLen) {numRedChars = redLen;}
    else if (numRedChars < 0) {numRedChars = 0;}
    let redStr = `<span style="color: ` + keyClearColor + `">` + redText.slice(0, numRedChars) + `</span>`;

    displayBtext.innerHTML = scrollStr.slice(start, scrollPosition - numRedChars + 1) + redStr + "  ";
  }

  lastUpdate = now;

  if (scrollPosition <= (msgLen + redLen + 1) && powWarning === true) {
    requestAnimationFrame(scrollPowWarnDispB, 100);
  } else if (powWarning === true) {
    powWarning = false;
    clearInterval(scrollAnim);
    powWarnDisplaying = true;
  }
}

function playPowWarnAnimation() { // Warning message when a power expression = complex number(s) = NaN
  if (layout === "portrait") {    // i.e. Only when the base is negative and the exponent is non-integer (fractional)
    scrollMax = maxCharsPortrait + 1;
  } else if (layout === "landscape") {
    scrollMax = maxCharsLandscape - 1;
  } else {
    scrollMax = maxCharsLandsLong - 1;
  }
  scrollPosition = 0;
  powWarning = true;
  message = "Power error found: ";
  displayBtext.style.whiteSpace = "pre";
  scrollStr = message;
  msgLen = message.length;
  lastUpdate = getTime();

  redText = powStr + "=NaN";
  redLen = redText.length;

  console.log(origExprToEval);
  let indexOfPow = origExprToEval.indexOf(powStr);
  console.log(indexOfPow);

  scrollAnim = setInterval(function(){ scrollPowWarnDispB(message) }, 100);
}

//----------- keybard input handling ------------------------

function getKey(key) {
  let charStr = String.fromCharCode(key)
  if (charStr === "s" || charStr === "f" || charStr === "c") {
    charStr = charStr.toUpperCase();
  } else if (key === 13) {
    charStr = "=";
  } else if (key === 37 || key === 46 || key === 66 || key === 98) {
    charStr = "<";
  } else if (key === 35) {
    charStr = "±";
  }

  let inputID = -1;
  let template = setKeysTemplate();

  for (i = 0; i < template.length; i++) {
    if (charStr === template[i]) {
      inputID = i;
    }
  }
  if (inputID != -1) {
    keyClick(inputID);
  }
}

function code(e) { // adapted from Faino's answer to: https://stackoverflow.com/questions/16089421/simplest-way-to-detect-keypresses-in-javascript
    e = e || window.event;
    return(e.keyCode || e.which);
}
window.onload = function(){
    document.onkeypress = function(e){
        let key = code(e);
        getKey(key);
    };
};

// ---------- initial declarations and commands -------------

let calcW = 0;
let WinOutW = 0;
let screenW = 0;
let calcH = 0;
let WinOutH = 0;
let screenH = 0;
let winRatio = 0;
let mobile = false;
let layout = "portrait"; // 3 options: portrait, landscape, landscapeLong
let hand = "r";
let menuActive = false;
let maximize = false;
let fullscrn = false;

let displayAheight = 0;
let displayBheight = 0;
let keyboardHeight = 0;
let keyHeight = 0;
let keyRows = 0;
let keys = [];

let menuH = 0;
let menuW = 0;

let fontSizeA = 0;
let fontSizeB = 0;
let fontSizeKeys = 0;

let gridRowHeight = 0;
let gridColumns = 0;
let numOfKeys = 0;
let keysTemplate = [];

let horOffset = 0;
let vertOffset = 0;

// maximum string lengths for secondary display (displayB):
let maxCharsPortrait = 39;
let maxCharsLandscape = 41;
let maxCharsLandsLong = 66;

let strA = "";
let strB = "";
let history = "";
let input = "";

let parenth = 0;
let decimal = false;
let digits = 0;
let positive = true;
let resultToClear = false
let infinityToClear = false;
let operatorEdit = false;
let msgToClrDispB = false;
let origExprToEval = "";

let prevColor = "";
let keyBgColor = "#14202b";
let dispBbgColor = "#192938";
let containerBgColor = "#101519";
let keyboardBgColor = "#11443f";
let bodyBgColor = "#7a7b6e";

let bodyColor = "#c0daf1"; // default text color (used in displays)
let keyDigitColor = "hsl(208, 52%, 72%)"; // default key text color (digits and '.')
let keyOperatorColor = "hsl(208, 96%, 56%)";
let keyAuxColor = "hsl(208, 41%, 42%)"; // text color for '±', '^', '(' and ')' keys
let keyEqualsColor = "hsl(124, 39%, 62%)";
let keyClearColor = "hsl(340, 64%, 55%)"; // text color for 'C' key AND red warning text
let keyBackspColor = "hsl(15, 60%, 63%)";
let keySettingsColor = "hsl(273, 50%, 56%)";
let keyFcolor = "hsl(297, 36%, 53%)";
let menuHoverColor = "hsl(208, 52%, 42%)";

let clickAnim = null;
let warningAnim = null;
let invalidAnim = false; // set to true when animation starts, false at end / interruption


let body = document.getElementsByTagName('body')[0];
let para = document.getElementsByTagName('p')[0];
let displayA = document.getElementById('displayA');
let displayB = document.getElementById('displayB');
let displayAtext = document.getElementById('displayAtext');
let displayBtext = document.getElementById('displayBtext');
let keyboard = document.getElementById('keyboard');
let container = document.getElementById('container');

let dispAstore = "";

let counter = 0; // counter for key-click animation; animateClick()
let countWarningAnim = 0; // counter for animateWarningDispA()
let operatorCount = 0;

let lastElemClicked = null;
let startup = false;
let powWarning = false;
let powWarnDisplaying = false;
let powStr = "";
let redText = "";
let redLen = 0;

const FRAME_DURATION = 1000 / 60;
const getTime = typeof performance === 'function' ? performance.now : Date.now;
let scrollPosition = 0;
let lastUpdate = getTime();
let message = "";
let msgLen = 0;
let scrollStr = "";
let scrollMax = 0;
let scrollAnim = null;

menuContainer.style.zIndex = "-1";
body.style.color = bodyColor;
body.style.fontFamily = "'Ubuntu Mono', monospace";
body.style.fontWeight = "normal";
container.style.margin = "auto";
displayB.style.textAlign = "right";
displayA.style.backgroundColor = "black";
displayA.style.textAlign = "right";
keyboard.style.backgroundColor = keyboardBgColor;
keyboard.style.display = "grid";
keyboard.style.margin = "auto";

drawPage(); // Also called whenever window (body) is resized
displayBtext.style.opacity = "0.0"; // Prevents brief flash of 'waiting for input...' message at startup
clear();
playStartupAnimation();
