

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetchStatementButton').addEventListener('click', async () => {
        const name = document.getElementById('studentName').value;

        try {
            const response = await fetch(`/student/${name}/statement`);
            const result = await response.json();

            if (response.ok) {
                document.getElementById('studentDisplayName').innerText = result.student;
                document.getElementById('totalFees').innerText = result.totalFees;
                document.getElementById('totalPaid').innerText = result.totalPaid;
                document.getElementById('outstandingBalance').innerText = result.outstandingBalance;

                const paymentHistoryList = document.getElementById('paymentHistoryList');
                paymentHistoryList.innerHTML = ''; // Clear existing data

                result.payments.forEach(payment => {
                    paymentHistoryList.innerHTML += `
                        <tr>
                            <td>${payment.amount}</td>
                            <td>${new Date(payment.date).toLocaleDateString()}</td>
                        </tr>
                    `;
                });

                document.getElementById('statement').style.display = 'block'; // Show statement
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Error fetching statement. Please try again.');
        }
    });

    // Back button functionality
    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'index.html'; // Navigate back to the home page
    });
});