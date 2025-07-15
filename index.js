import config from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  // Get all language checkboxes
  const languageCheckboxes = document.querySelectorAll(
    'input[name="language"]'
  );

  const translateButton = document.getElementById("translate-button");

  // Debug: Check if config is loaded
  console.log("API Key loaded:", config.OPENAI_API_KEY ? "Yes" : "No");
  console.log("Environment variables:", config.OPENAI_API_KEY);
  translateButton.addEventListener("click", function () {
    const textToTranslate = document.getElementById(
      "text-to-translate-textarea"
    );
    const selectedLanguage = document.querySelector(
      'input[name="language"]:checked'
    );
    console.log(textToTranslate.value);
    console.log(selectedLanguage.value);
    translateText(textToTranslate.value, selectedLanguage.value);
  });

  // Add event listener to each checkbox
  languageCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // If this checkbox is checked, uncheck all others
      if (this.checked) {
        languageCheckboxes.forEach((otherCheckbox) => {
          if (otherCheckbox !== this) {
            otherCheckbox.checked = false;
          }
        });
      }
    });
  });

  languageCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const languageItem = this.closest(".language-select-item");

      // Remove selected class from all items
      document.querySelectorAll(".language-select-item").forEach((item) => {
        item.classList.remove("selected");
      });

      // Add selected class to the checked item
      if (this.checked) {
        languageItem.classList.add("selected");
      }
    });
  });
});

async function translateText(text, language) {
  const apiKey = config.OPENAI_API_KEY;
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Translate the following text to ${language}: ${text}`,
          },
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.choices[0].message.content);
    displayTranslation(data.choices[0].message.content);
    return "fin";
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

function displayTranslation(translation) {
  const languageSelect = document.getElementById("language-select");
  languageSelect.style.display = "none";
  const selectLanguage = document.getElementById("select-language");
  selectLanguage.innerText = "Your Translation";
  const mainContent = document.getElementById("main-content");
  const translateButton = document.getElementById("translate-button");
  translateButton.style.display = "none";

  // Create the textarea element
  const textarea = document.createElement("textarea");
  textarea.name = "translation";
  textarea.id = "translation-textarea";
  textarea.placeholder = "Translation";
  textarea.className = "text-to-translate";

  // Set the value after creating the element
  textarea.value = translation;

  // Add the textarea to the main content
  mainContent.appendChild(textarea);

  const startOverButton = document.createElement("button");
  startOverButton.id = "start-over-button";
  startOverButton.className = "action-button";
  startOverButton.innerText = "Start Over";
  startOverButton.addEventListener("click", function () {
    window.location.reload();
  });
  mainContent.appendChild(startOverButton);
}
