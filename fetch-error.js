const http = require('http');

http.get('http://localhost:5181/src/renderer/main.tsx', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (data.includes('Error')) {
      console.log('Error found in response:', data.substring(0, 500));
    } else {
      console.log('Response OK (len: ' + data.length + ')');
      // If it's Vite, it injects an error overlay script if there is a build error.
      if (data.includes('vite-error-overlay')) {
        console.log('Vite Error Overlay detected!');
        console.log(data);
      }
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
