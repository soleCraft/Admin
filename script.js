document.addEventListener("DOMContentLoaded", function() {
    const eventTableContainer = document.querySelector('.eventTable_Container');
    eventTableContainer.style.display = 'none'; 

    //format the date by dd/mm/yyyy hh:mm
    function formatDateAndTime(dateTimeString) {
        var dateTime = new Date(dateTimeString);
        var day = String(dateTime.getDate()).padStart(2, '0');
        var month = String(dateTime.getMonth() + 1).padStart(2, '0'); 
        var year = dateTime.getFullYear();
        var hours = String(dateTime.getHours()).padStart(2, '0'); 
        var minutes = String(dateTime.getMinutes()).padStart(2, '0'); 
        var amOrPm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? String(hours).padStart(2, '0') : 12;     

        return `${day}/${month}/${year} ${hours}:${minutes} ${amOrPm}`;
    }
    //retrieve only the current date and so on
    function getCurrentDateTimeString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    document.getElementById("startDateTime").min = getCurrentDateTimeString();
    document.getElementById("endDateTime").min = getCurrentDateTimeString();

    document.getElementById("addButton").addEventListener('click', function(event) {
        event.preventDefault();

        var addEvent = document.getElementById('eventName');
        var addAmount = document.getElementById('amount');
        var startDateTime = document.getElementById('startDateTime');
        var endDateTime = document.getElementById('endDateTime');

        if (addEvent.value.length > 0 && addAmount.value.length > 0 && startDateTime.value.length > 0 && endDateTime.value.length > 0) {
            const eventName = addEvent.value;
            const amount = addAmount.value;
            const startDateTimeValue = startDateTime.value;
            const endDateTimeValue = endDateTime.value;

            const table = document.getElementById('eventsTable').querySelector('tbody');
            const newRow = table.insertRow();

            newRow.insertCell(0).innerText = eventName;
            newRow.insertCell(1).innerText = amount;
            newRow.insertCell(2).innerText = formatDateAndTime(startDateTimeValue); 
            newRow.insertCell(3).innerText = formatDateAndTime(endDateTimeValue); 
            const actionsCell = newRow.insertCell(4);

            const trashIcon = document.createElement('i');
            trashIcon.classList.add('bx', 'bxs-trash');
            trashIcon.onclick = function() { deleteRow(newRow); };
            actionsCell.appendChild(trashIcon);

            document.getElementById('eventForm').reset();

            if (eventTableContainer.style.display === 'none') {
                eventTableContainer.style.display = 'block';
            }
        } else {
            if (addEvent.value.length === 0) {
                addEvent.classList.add('error');
                setTimeout(() => {
                    addEvent.classList.remove('error');
                }, 1000);
            }
            if (addAmount.value.length === 0) {
                addAmount.classList.add('error');
                setTimeout(() => {
                    addAmount.classList.remove('error');
                }, 1000);
            }
            if (startDateTime.value.length === 0) {
                startDateTime.classList.add('error');
                setTimeout(() => {
                    startDateTime.classList.remove('error');
                }, 1000);
            }
            if (endDateTime.value.length === 0) {
                endDateTime.classList.add('error');
                setTimeout(() => {
                    endDateTime.classList.remove('error');
                }, 1000);
            }
        }
    });
    
    async function deleteRow(row) {
        row.parentNode.removeChild(row);
    
        // check if the table body is empty
        const tableBody = document.getElementById('eventsTable').getElementsByTagName('tbody')[0];
        if (tableBody.rows.length === 0) {
            eventTableContainer.style.display = 'none'; 
        }
    }
});
