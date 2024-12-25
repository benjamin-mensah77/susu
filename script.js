

document.getElementById('registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const studentClass = document.getElementById('class').value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, class: studentClass }),
    });

    const result = await response.json();
    alert(result.message);
    document.getElementById('registrationForm').reset();
});

document.getElementById('paymentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('paymentName').value;
    const amount = parseFloat(document.getElementById('amount').value);

    const response = await fetch('/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, amount }),
    });

    const result = await response.json();
    alert(result.message);

    // Generate receipt if payment is successful
    if (result.student) {
        const receiptDetails = `
            Student Name: ${result.student.name}<br>
            Class: ${result.student.class}<br>
            Amount Paid: ${amount}<br>
            Payment Date: ${new Date().toLocaleDateString()}
        `;
        document.getElementById('receiptDetails').innerHTML = receiptDetails;
        document.getElementById('receipt').style.display = 'block'; // Show receipt
    }

    document.getElementById('paymentForm').reset();
});

// View students button functionality
document.getElementById('viewStudentsButton').addEventListener('click', () => {
    window.location.href = 'viewStudents.html'; // Navigate to the view students page
});

// View statement button functionality
document.getElementById('viewStatementButton').addEventListener('click', () => {
    window.location.href = 'viewStatement.html'; // Navigate to the view statement page
});

// Print receipt functionality
document.getElementById('printReceiptButton').addEventListener('click', () => {
    const receiptContent = document.getElementById('receipt').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Receipt</title>');
    printWindow.document.write('<style>body { font-family: Arial, sans-serif; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});