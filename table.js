// Script for the functionality of the events table
        document.getElementById('eventForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const eventName = document.getElementById('eventName').value;
        const ticketPrice = document.getElementById('ticketPrice').value;
        const startDateTime = document.getElementById('startDateTime').value;
        const endDateTime = document.getElementById('endDateTime').value;

        const table = document.getElementById('eventsTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.insertCell(0).innerText = eventName;
        newRow.insertCell(1).innerText = ticketPrice;
        newRow.insertCell(2).innerText =  new Date (startDateTime).toLocaleString();
        newRow.insertCell(3).innerText =  new Date (endDateTime).toLocaleString();
        const actionsCell = newRow.insertCell(4);

        const trashIcon = document.createElement('i');
        trashIcon.classList.add('bx', 'bxs-trash');
        trashIcon.onclick = function() { deleteRow(newRow); };
        actionsCell.appendChild(trashIcon);

        document.getElementById('eventForm').reset();
        });

        function deleteRow(row) {
        row.parentNode.removeChild(row);
        }