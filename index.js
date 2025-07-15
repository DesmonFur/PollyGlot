// Get all language checkboxes
const languageCheckboxes = document.querySelectorAll('input[name="language"]');

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
