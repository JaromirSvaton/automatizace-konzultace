document.getElementById('documentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var projectName = document.getElementById('projectName').value;
    var programName = document.getElementById('programName').value;
    var clientName = document.getElementById('clientName').value;
    var keyAccountName = document.getElementById('keyAccountName').value;

    fetch('http://localhost:5000/process', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectName: projectName,
            programName: programName,
            clientName: clientName,
            keyAccountName: keyAccountName
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerText = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'An error occurred.';
    });
});
