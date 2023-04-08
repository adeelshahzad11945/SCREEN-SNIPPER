document.addEventListener('DOMContentLoaded', function() {
  var button = document.getElementById('take-screenshot');
  var copyButton = document.getElementById('copy-screenshot');
  button.addEventListener('click', function() {
    var fileNameWithExtension = document.getElementById('file-name').value || 'screenshot.png'; // use the input value if provided, otherwise default to "screenshot.png"
    var fileName = fileNameWithExtension.split('.').slice(0, -1).join('.'); // remove the file extension
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(image) {
      var link = document.createElement('a');
      link.href = image;
      link.download = fileName + '.png'; // add the .png extension
      link.click();
    });
  });
  copyButton.addEventListener('click', function() {
    chrome.tabs.captureVisibleTab(null, {format: 'png'}, function(image) {
      var canvas = document.createElement('canvas');
      var img = new Image();
      img.src = image;
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        var dataUrl = canvas.toDataURL('image/png');
        copyToClipboard(dataUrl);
      };
    });
  });
});

function copyToClipboard(dataUrl) {
  var blob = dataURLtoBlob(dataUrl);
  var item = new ClipboardItem({ "image/png": blob });
  navigator.clipboard.write([item]).then(function() {
    console.log("Screenshot copied to clipboard");
    var copyNotification = document.getElementById('copy-notification');
    copyNotification.style.display = 'block';
    setTimeout(function() {
      copyNotification.style.display = 'none';
    }, 2000);
  }, function() {
    console.log("Failed to copy screenshot to clipboard");
  });
}

function dataURLtoBlob(dataUrl) {
  var arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}
