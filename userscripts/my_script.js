#!/usr/bin / env node

(function () {
  let isListening = false;
  let searchTerm = "";
  let selections = [];
  let currentIndex = -1;
  let matches = [];

  function highlightMatches() {
    const range = document.createRange();
    const sel = window.getSelection();
    sel.removeAllRanges();

    matches.forEach((match, index) => {
      const span = document.createElement("span");
      span.className =
        index === currentIndex ? "highlight current" : "highlight";
      span.textContent = match.text;
      range.selectNodeContents(match.node);
      range.setStart(match.node, match.offset);
      range.setEnd(match.node, match.offset + match.text.length);
      range.surroundContents(span);
    });
  }

  function findMatches() {
    matches = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    let node;
    while ((node = walker.nextNode())) {
      let index = node.textContent
        .toLowerCase()
        .indexOf(searchTerm.toLowerCase());
      while (index !== -1) {
        matches.push({
          node: node,
          offset: index,
          text: node.textContent.substr(index, searchTerm.length),
        });
        index = node.textContent
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase(), index + 1);
      }
    }
  }

  function moveFocus(direction) {
    if (matches.length === 0) return;
    currentIndex = (currentIndex + direction + matches.length) % matches.length;
    highlightMatches();
    matches[currentIndex].node.parentElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function handleKeydown(e) {
    if (e.ctrlKey && e.key === "d") {
      isListening = true;
      searchTerm = "";
      e.preventDefault();
      // Disable vim shortcuts in qutebrowser
      window.qutebrowser.disableVimBindings();
    } else if (isListening) {
      if (e.key === "Enter") {
        if (selections.length < 2) {
          selections.push(matches[currentIndex]);
          if (selections.length === 2) {
            const range = document.createRange();
            range.setStart(selections[0].node, selections[0].offset);
            range.setEnd(
              selections[1].node,
              selections[1].offset + selections[1].text.length
            );
            const selectedText = range.toString();
            navigator.clipboard.writeText(selectedText).then(() => {
              console.log("Text copied to clipboard");
            });
            isListening = false;
            selections = [];
            // Re-enable vim shortcuts in qutebrowser
            window.qutebrowser.enableVimBindings();
          }
        }
      } else if (e.ctrlKey && e.key === "m") {
        moveFocus(1);
        e.preventDefault();
      } else if (e.ctrlKey && e.key === "u") {
        moveFocus(-1);
        e.preventDefault();
      } else if (e.key.length === 1) {
        searchTerm += e.key;
        findMatches();
        currentIndex = 0;
        highlightMatches();
      } else if (e.key === "Escape") {
        isListening = false;
        selections = [];
        // Remove highlights
        document.querySelectorAll(".highlight").forEach((el) => {
          el.outerHTML = el.innerHTML;
        });
        // Re-enable vim shortcuts in qutebrowser
        window.qutebrowser.enableVimBindings();
      }
    }
  }

  document.addEventListener("keydown", handleKeydown);

  // Inject CSS for highlighting
  const style = document.createElement("style");
  style.textContent = `
        .highlight { background-color: yellow; }
        .highlight.current { background-color: orange; }
    `;
  document.head.appendChild(style);
})();

// Your existing script content here
(function () {
  console.log("custom-script");
  // window.addEventListener('load', () => {
  const sections = document.querySelectorAll(
    "main *:has(a), main *:has(span), section *:has(a), section *:has(span)"
  );
  // console.log(sections);
  let changesMade = false;
  sections.forEach((section) => {
    // console.log( getComputedStyle(section));
    const computedStyle = getComputedStyle(section);
    if (computedStyle.visibility === "hidden") {
      if (section.querySelector("a") || section.querySelector("span")) {
        section.style.visibility = "visible";
        section.style.opacity = "1";
        changesMade = true;
        return false;
      }
    }

    // section.style.visibility = 'visible';
    // section.style.opacity = '1';
    // section.style.display = 'block'
  });
  // });
  let stylesApplied = false;
  // applyStyles('*');

  // Apply styles based on user input
  function applyStyles(input) {
    if (!stylesApplied) {
      if (input === "*") {
        console.log("applyStylesFF");
        const sections = document.querySelectorAll("*");
        sections.forEach((element) => {
          loadHoverStylesFromLocalStorage(element);
        });
      } else {
      }
    }
  }

  function loadHoverStylesFromLocalStorage(element) {
    applyHoverStyles(element); // If not stored, retrieve and apply styles
    return false;
    // const storedStyles = localStorage.getItem('hoverStyles');

    // if (storedStyles) {
    //     const hoverStyles = JSON.parse(storedStyles);

    //     applyStoredStyles(hoverStyles, element);
    // } else {
    //     applyHoverStyles(element); // If not stored, retrieve and apply styles
    // }
  }

  function applyHoverStyles(element) {
    const elementId = element.id;
    if (!elementId) {
      console.error("The element must have an id.");
      return;
    }

    function getHoverRules(cssText, selector) {
      const tempStyleSheet = document.createElement("style");
      tempStyleSheet.textContent = cssText;
      console.log(cssText);
      // return false;

      document.head.appendChild(tempStyleSheet);
      const sheet = tempStyleSheet.sheet;
      const rules = sheet.rules || sheet.cssRules;
      const hoverRules = [];
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.selectorText && rule.selectorText.includes(selector)) {
          hoverRules.push(rule);
        }
      }
      document.head.removeChild(tempStyleSheet);
      return hoverRules;
    }

    const corsProxyUrl = "http://localhost:8080/";

    function fetchStylesheet(url) {
      return fetch(corsProxyUrl + url).then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      });
    }

    const hoverStyles = {};

    function processStylesheet(cssText) {
      const elementHoverRules = getHoverRules(cssText, `#${elementId}:hover`);
      elementHoverRules.forEach((rule) => {
        hoverStyles[rule.selectorText] = hoverStyles[rule.selectorText] || {};
        const styles = rule.style;
        for (let j = 0; j < styles.length; j++) {
          const property = styles[j];
          const value = styles.getPropertyValue(property);
          hoverStyles[rule.selectorText][property] = value;
        }
      });

      element.querySelectorAll("*").forEach((child) => {
        const childSelector = `#${elementId}:hover ${child.tagName.toLowerCase()}${
          child.id ? `#${child.id}` : ""
        }`;
        const childHoverRules = getHoverRules(cssText, childSelector);
        childHoverRules.forEach((rule) => {
          hoverStyles[rule.selectorText] = hoverStyles[rule.selectorText] || {};
          const styles = rule.style;
          for (let j = 0; j < styles.length; j++) {
            const property = styles[j];
            const value = styles.getPropertyValue(property);
            hoverStyles[rule.selectorText][property] = value;
          }
        });
      });
    }

    const promises = [];

    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      if (sheet.href) {
        promises.push(
          fetchStylesheet(sheet.href)
            .then((cssText) => {
              processStylesheet(cssText);
            })
            .catch((e) => {
              console.warn("Cannot access stylesheet: ", sheet.href, e);
            })
        );
      } else {
        // For inline styles
        processStylesheet(sheet.ownerNode.textContent);
      }
    }

    Promise.all(promises).then(() => {
      localStorage.setItem("hoverStyles", JSON.stringify(hoverStyles));
      applyStoredStyles(hoverStyles, element);
    });
  }

  function applyStoredStyles(hoverStyles, element) {
    for (const selector in hoverStyles) {
      if (selector === `#${element.id}:hover`) {
        for (const property in hoverStyles[selector]) {
          element.style[property] = hoverStyles[selector][property];
        }
      } else {
        const childSelector = selector.replace(`#${element.id}:hover `, "");
        const childElement = element.querySelector(childSelector);
        if (childElement) {
          for (const property in hoverStyles[selector]) {
            childElement.style[property] = hoverStyles[selector][property];
          }
        }
      }
    }
  }
})();
// Save this as devtools_resize.js
// Save this as devtools_resize.js
// Save this as devtools_resize.js
(function () {
  let devTools = null;
  let observer = null;

  function findDevTools() {
    // Look for elements that are likely to be part of developer tools
    const possibleSelectors = [
      "#devtools",
      'iframe[src^="chrome-devtools://"]',
      'div[aria-label="Developer Tools"]',
      "#webInspector",
      "#inspector",
      "#webkit-inspector",
      ".devtools-container",
      '[id^="devtools-"]',
      '[class^="devtools-"]',
    ];

    for (let selector of possibleSelectors) {
      let element = document.querySelector(selector);
      if (element) {
        // If it's an iframe, get its parent
        if (element.tagName === "IFRAME") {
          element = element.parentElement;
        }
        // Check if the element is likely to be the devtools (large and at the bottom or right)
        let rect = element.getBoundingClientRect();
        if (
          (rect.bottom === window.innerHeight ||
            rect.right === window.innerWidth) &&
          (rect.width > window.innerWidth * 0.3 ||
            rect.height > window.innerHeight * 0.3)
        ) {
          return element;
        }
      }
    }

    // If not found by selectors, look for a large element at the bottom or right of the viewport
    let allElements = document.querySelectorAll("*");
    for (let element of allElements) {
      let rect = element.getBoundingClientRect();
      if (
        (rect.bottom === window.innerHeight ||
          rect.right === window.innerWidth) &&
        (rect.width > window.innerWidth * 0.3 ||
          rect.height > window.innerHeight * 0.3)
      ) {
        return element;
      }
    }

    return null;
  }

  function setupObserver() {
    observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type === "childList") {
          devTools = findDevTools();
          if (devTools) {
            observer.disconnect();
            console.log("DevTools found:", devTools);
            break;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function resizeDevTools(delta) {
    if (!devTools) {
      devTools = findDevTools();
    }

    if (devTools) {
      let currentHeight = devTools.getBoundingClientRect().height;
      let newHeight = Math.max(100, currentHeight + delta);
      devTools.style.height = newHeight + "px";
      console.log(`Resized DevTools to ${newHeight}px`);
    } else {
      console.log("Developer tools not found");
      setupObserver();
    }
  }

  window.qute = window.qute || {};
  window.qute.devToolsResizeUp = function () {
    resizeDevTools(50);
  };
  window.qute.devToolsResizeDown = function () {
    resizeDevTools(-50);
  };

  // Initial setup
  setupObserver();

  // Debug function
  function ff() {
    let result = findDevTools();
    console.log("Debug: findDevTools result:", result);
    if (result) {
      console.log(
        "Found element:",
        result.tagName,
        result.id,
        result.className
      );
      console.log("Position:", result.getBoundingClientRect());
    }
  }
  console.log(ff());
})();
