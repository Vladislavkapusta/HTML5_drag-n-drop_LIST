// Check if File API is supported
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // File API supported
  const dropZone = document.getElementById('dropZone');
  const fileListContainer = document.getElementById('fileListContainer');
  const sortSelect = document.getElementById('sortSelect');
  let filesArray = []; // Array to store the uploaded files

  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('drop', handleFileDrop);
  sortSelect.addEventListener('change', sortFiles);

  function handleDragOver(event) {
    event.preventDefault();
    dropZone.classList.add('drag-over');
  }

  function handleFileDrop(event) {
    event.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = event.dataTransfer.files;
    filesArray = filesArray.concat([...files]); // Add the dropped files to the array
    const sortedFiles = sortFilesByWeightAndType([...filesArray]);
    displaySortedFiles(sortedFiles);
  }

  function sortFiles() {
    const selectedOption = sortSelect.value.toLowerCase();
    const files = Array.from(fileListContainer.children);

    files.sort((a, b) => {
      const aSortValue = a.dataset[selectedOption];
      const bSortValue = b.dataset[selectedOption];

      if (selectedOption === 'size') {
        return parseInt(aSortValue) - parseInt(bSortValue);
      } else {
        return aSortValue.localeCompare(bSortValue);
      }
    });

    fileListContainer.innerHTML = '';
    files.forEach(file => {
      fileListContainer.appendChild(file);
    });
  }

  function sortFilesByWeightAndType(files) {
    return files.sort((a, b) => {
      if (a.size !== b.size) {
        return a.size - b.size;
      } else {
        return a.type.localeCompare(b.type);
      }
    });
  }

  function displaySortedFiles(sortedFiles) {
    fileListContainer.innerHTML = '';
  
    sortedFiles.forEach((file) => {
      if (!fileListContainer.querySelector(`[data-name="${file.name}"]`)) {
        const listItem = document.createElement('li');
        const fileName = document.createElement('span');
        fileName.textContent = `${file.name} (${file.type}) - ${file.size} bytes`;
        listItem.appendChild(fileName);
  
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.addEventListener('click', () => downloadFile(file));
        listItem.appendChild(downloadButton);
  
        listItem.dataset.name = file.name;
        listItem.dataset.size = file.size;
        listItem.dataset.type = file.type;
  
        fileListContainer.appendChild(listItem);
      }
    });
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} else {
  // File API not supported
  console.log("File API not supported!");
}