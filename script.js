let componentsData = [];
let currentComponent = null;
let currentFieldsData = {};

// Fetch the static JSON
fetch('./components.json')
  .then((res) => res.json())
  .then((data) => {
    componentsData = data;
    populateAvailableComponents();
  })
  .catch((err) => {
    console.error('Error loading components.json:', err);
  });

function populateAvailableComponents() {
  const container = document.getElementById('available-components');

  // For each component definition, create a button
  componentsData.forEach((component) => {
    const btn = document.createElement('button');
    btn.textContent = component.componentName;
    btn.className = 'button-component';
    btn.onclick = () => selectComponent(component);
    container.appendChild(btn);
  });
}

function selectComponent(component) {
  // Reset form editor
  const formEditor = document.getElementById('form-editor');
  formEditor.innerHTML = '';
  currentFieldsData = {};
  currentComponent = component;

  // Create input fields based on the component definition
  component.fields.forEach((field) => {
    const label = document.createElement('label');
    label.textContent = field.label;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Enter ${field.label} here`;
    input.addEventListener('input', (e) => {
      currentFieldsData[field.name] = e.target.value;
    });

    formEditor.appendChild(label);
    formEditor.appendChild(input);
  });
}

document.getElementById('btn-generate').addEventListener('click', generateJSON);

function generateJSON() {
  if (!currentComponent) {
    alert('Please select a component first.');
    return;
  }

  // Construct the final JSON for the current component
  // You can modify this structure to your needs
  const outputObj = {
    componentName: currentComponent.componentName,
    fields: { ...currentFieldsData }
  };

  const outputTextarea = document.getElementById('json-output');
  outputTextarea.value = JSON.stringify(outputObj, null, 2);
}


  // Listen for clicks on the "Open Draft Mode" button
  const draftModeBtn = document.getElementById('draftModeBtn');
  const draftUrlInput = document.getElementById('draftUrlInput');

  draftModeBtn.addEventListener('click', () => {
    const userUrl = draftUrlInput.value.trim();
    
    if (!userUrl) {
      alert('Please enter a URL first.');
      return;
    }

    // Build the new URL by appending /?draftMode
    let finalUrl;
    if (userUrl.endsWith('/')) {
      finalUrl = userUrl + '?draftMode';
    } else {
      finalUrl = userUrl + '/?draftMode';
    }

    /* 
    ----------------------------
    A) Open the new URL in a tab
    ----------------------------
    */
    window.open(finalUrl, '_blank');


    /*
    ------------------------------------------------------------
    B) If you need to FETCH data from that URL (instead of open):
    ------------------------------------------------------------
    */
    /*
    fetch(finalUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Draft Mode data:', data);
        // do something with the fetched data...
        // e.g. display it in your JSON output panel
        // document.getElementById('jsonOutput').textContent =
        //   JSON.stringify(data, null, 2);
      })
      .catch(err => console.error('Error fetching draft data:', err));
    */
  });
</script>
