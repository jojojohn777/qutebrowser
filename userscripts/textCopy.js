(function () {
  // alert('supp');
  // if (typeof yourVariable !== "undefined") {
  //   alert('sup');
  //   return false;
  // }

  let searchTextMod = false;
  let textToHighlight;
  let text1 = "";
  let text1Position = "";
  let text2Position = "";
  let text2 = "";
  let currentIndex = -1; // Keep track of the current element being highlighted
  let elements = [];
  let currentInput = "";
  document.addEventListener("keyup", (e) => {
    if (e.ctrlKey && e.key == ";" && searchTextMod == false) {
      createAndFocusInput();
    } else if (e.ctrlKey && e.key == ";" && searchTextMod) {
      if (document.getElementById("custom-input")) {
        document.getElementById("custom-input").remove();
      }
    }
    if (searchTextMod && e.key == "Enter") {
      createVimShortcut();
      if (document.getElementById("custom-input")) {
        // alert(textToHighlight);
        document.getElementById("custom-input").remove();
        createAndFocusInput();
      }
      searchTextMod = false;
      return true;
    }
    //   // Only consider alphabetic keypresses
    if (
      e.key.length === 1 &&
      /^[a-z]$/i.test(e.key) &&
      searchTextMod == false
    ) {
      currentInput += e.key.toLowerCase(); // Capture keypress and build the combination
      if (currentInput.length === 2) {
        // If two characters have been entered
        const word_set_id = document
          .querySelector(`[data-combo="${currentInput}"]`)
          .getAttribute("word-set-id");

        // alert(word_set_id);
        if (!text1Position) {
          text1Position = document.querySelector(
            `[word-set="index-${word_set_id}"]`
          );
          text1Position.removeAttribute("word-set");
          text1Position.setAttribute("copy-start", true);
          document.getElementById("custom-input").remove();
          createAndFocusInput();

          removeDataComboElements();
          removeHighlights();
        } else {
          // alert(word_set_id);
          text2Position = document.querySelector(
            `[word-set="index-${word_set_id}"]`
          );
          text2Position.setAttribute("copy-end", true);
          // console.log(text2Position);

          copyToClipboard(copyBetweenMarkers());
          removeHighlights(true);
          removeDataComboElements();
        }

        currentInput = ""; // Reset after two characters
      }
    }

    if (searchTextMod == false && e.ctrlKey && e.key == ";") {
      createAndFocusInput();
    }
    if (searchTextMod) {
      if (e.ctrlKey && e.key == "e") {
        document.getElementById("custom-input").remove();
        searchTextMod = false;
      }
      if (document.getElementById("custom-input")){
        textToHighlight = document.getElementById("custom-input").value;
      }else{
        createAndFocusInput()
      }
      if (textToHighlight.length > 2 && searchTextMod) {
        highlightText(textToHighlight);
      }
    }

    if (e.key == "Enter" && searchTextMod) {
      createVimShortcut();
      if (!text1Position) {
        text1Position = document.querySelector("[selected-word]");
        text1Position.setAttribute("copy-start", true);
        text1Position.removeAttribute("selected-word");
        document.getElementById("custom-input").value = "";
      } else {
        text2Position = document.querySelector("[selected-word]");
        text2Position.removeAttribute("selected-word");
        text2Position.setAttribute("copy-end", true);
        document.getElementById("custom-input").remove();
        // alert(copyBetweenMarkers());
        copyToClipboard(copyBetweenMarkers());
        removeHighlights(true);
        text1Position = false;
        text2Position = false;
      }
      goThrough = false;
    }
  });

  createAndFocusInput();

  function createAndFocusInput() {
    searchTextMod = true;

    // Remove existing input if any
    let existingInput = document.getElementById("custom-input");
    if (existingInput) {
      existingInput.focus();
      return;
    }

    // Create new input
    let input = document.createElement("input");
    input.id = "custom-input";
    input.style.position = "fixed";
    input.style.top = "10px";
    input.style.left = "1000px";
    input.style.zIndex = "9999";
    input.style.padding = "5px";
    input.style.width = "300px";
    input.style.fontSize = "16px";

    // Add input to page
    document.body.appendChild(input);

    // Focus input
    input.focus();
  }

  function highlightText(searchTextMod) {
    if (searchTextMod.trim() === "") return;

    removeHighlights();

    const regex = new RegExp(searchTextMod, "gi");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const matches = [];
    let node;
    while ((node = walker.nextNode())) {
      let match;
      while ((match = regex.exec(node.textContent))) {
        matches.push({ node, index: match.index, length: match[0].length });
      }
    }

    for (let i = matches.length - 1; i >= 0; i--) {
      const { node, index, length } = matches[i];
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + length);
      const highlightSpan = document.createElement("mark");

      highlightSpan.setAttribute("word-set", "index-" + i);
      highlightSpan.style.backgroundColor = "green";
      highlightSpan.style.color = "#000000";
      range.surroundContents(highlightSpan);
    }

    const firstHighlight = document.querySelector("mark");
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function removeHighlights(all = false) {
    const highlights = document.querySelectorAll("mark");
    highlights.forEach((highlight) => {
      if (!highlight.hasAttribute("copy-start") || all) {
        const parent = highlight.parentNode;
        parent.replaceChild(
          document.createTextNode(highlight.textContent),
          highlight
        );
        parent.normalize();
      }
    });
  }

  function generateAlphabetCombos() {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const combos = [];

    // Generate combinations of two letters
    for (let i = 0; i < chars.length; i++) {
      for (let j = 0; j < chars.length; j++) {
        combos.push(chars[i] + chars[j]);
      }
    }
    return combos;
  }

  function createVimShortcut() {
    const wordSetElements = document.querySelectorAll(
      "[word-set]:not([copy-start]):not([copy-end])"
    );
    const combos = generateAlphabetCombos(); // Get all possible 2-letter combinations

    wordSetElements.forEach((element, index) => {
      const combo = combos[index]; // Use each combo for each element

      // Create the shortcut element
      const shortcut = document.createElement("div");
      shortcut.textContent = combo;
      shortcut.style.position = "absolute";
      shortcut.style.background = "yellow";
      shortcut.style.color = "black";
      
      shortcut.style.padding = "2px 5px";
      shortcut.style.fontSize = "16px";
      shortcut.style.borderRadius = "3px";
      shortcut.style.zIndex = "1000";
      shortcut.setAttribute("word-set-id", index);
      // console.log(index);

      // let word-set-id= element.getAttribute('word-set');
      // shortcut.setAttribute('word-set-id',word-set-id)

      // Position it relative to the element
      const rect = element.getBoundingClientRect();
      shortcut.style.top = `${window.scrollY + rect.top - 20}px`; // Slightly above the element
      shortcut.style.left = `${window.scrollX + rect.left}px`;

      // Add the combo as a data attribute for reference
      shortcut.setAttribute("data-combo", combo);

      // Add to the body
      document.body.appendChild(shortcut);
    });
  }

  function removeDataComboElements() {
    const comboElements = document.querySelectorAll("[data-combo]"); // Select all elements with 'data-combo' attribute
    comboElements.forEach((element) => element.remove()); // Remove each element from the DOM
  }
  function copyBetweenMarkers() {
    
    // Find the elements that have the start and end markers
    const startMark = document.querySelector('[copy-start="true"]');
    const endMark = document.querySelector("[copy-end]");

    if (!startMark || !endMark) {
      console.log("Start or end mark not found");
      return "";
    }

    // Create a range object to extract content between the two marks
    const range = document.createRange();
    range.setStartBefore(startMark);
    range.setEndAfter(endMark);

    // Extract the HTML content
    const fragment = range.cloneContents();
    const container = document.createElement("div");
    container.appendChild(fragment);

    return container.textContent;
  }
  function copyToClipboard(text) {
    // text = text.replace(/\s+/g, " ")
    text = text.replace(/(\n\s*)+/g, "\n");
    
    text.trim()
    // return text.trim(); // Remove any leading/trailing space
    // alert(text);
    if (!navigator.clipboard) {
      fallbackCopyToClipboard(text);
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
})();

