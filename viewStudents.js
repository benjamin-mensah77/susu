

document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html'; // Navigate back to the home page
  });

async function fetchStudents() {
    const response = await fetch('/students');
    const students = await response.json();
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Clear existing data

    students.forEach(student => {
        const paymentDetails = student.payments.map(payment => 
            `Amount: ${payment.amount}, Date: ${new Date(payment.date).toLocaleDateString()}`
        ).join('<br>');
        
        studentList.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${student.feeStatus}</td>
                <td>${paymentDetails || 'No payments yet'}</td>
            </tr>
        `;
    });
}

// Fetch students when the page loads
fetchStudents();