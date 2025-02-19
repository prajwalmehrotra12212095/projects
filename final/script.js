// Registration logic
document.getElementById('registration-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('student-name').value;
    const studentId = document.getElementById('student-id').value;
    const studentEmail = document.getElementById('student-email').value;
    const studentPhone = document.getElementById('student-phone').value;

    if (studentId && studentName && studentEmail && studentPhone) {
        // Store the ID and name in local storage
        localStorage.setItem('studentId', studentId);
        localStorage.setItem('studentName', studentName);
        localStorage.setItem('studentEmail', studentEmail);
        localStorage.setItem('studentPhone', studentPhone);
        alert('Registration successful! You can now log in.');
        window.location.href = 'index.html'; // Redirect to login page
    } else {
        alert("Please fill in all fields.");
    }
});

// Login logic
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const studentId = document.getElementById('student-id').value;

    if (studentId) {
        // Redirect to club-details.html after successful login
        localStorage.setItem('studentId', studentId); // Save the student ID for use on the next page
        window.location.href = 'club-details.html';
    } else {
        alert("Please enter a valid Student ID");
    }
});

// Club details page logic
if (window.location.pathname.endsWith('club-details.html')) {
    const studentId = localStorage.getItem('studentId');
    const studentName = localStorage.getItem('studentName') || 'Guest';
    const studentEmail = localStorage.getItem('studentEmail') || 'N/A';
    
    document.getElementById('profile-id').innerText = studentId || 'N/A';
    document.getElementById('profile-name').innerText = studentName;
    document.getElementById('profile-email').innerText = studentEmail;

    // Example club data
    const clubs = [
        {
            name: 'Coding Club',
            contact: 'codingclub@college.edu',
            image: 'coding_club.jpg',
            events: ['Hackathon 2023', 'Weekly Coding Sessions'],
            updates: ['New coding workshop announced!', 'Join us for the hackathon next month!']
        },
        {
            name: 'Art Club',
            contact: 'artclub@college.edu',
            image: 'art_club.jpg',
            events: ['Art Exhibition', 'Painting Workshop'],
            updates: ['Exhibition opening next week!']
        },
        {
            name: 'Music Club',
            contact: 'musicclub@college.edu',
            image: 'music_club.jpg',
            events: ['Open Mic Night', 'Music Festival'],
            updates: ['Sign up for Open Mic Night!']
        },
        {
            name: 'Drama Club',
            contact: 'dramaclub@college.edu',
            image: 'drama_club.jpg',
            events: ['Theater Play', 'Acting Workshop'],
            updates: ['Auditions for the next play are coming up!']
        },
        {
            name: 'Sports Club',
            contact: 'sportsclub@college.edu',
            image: 'sports_club.jpg',
            events: ['Annual Sports Meet', 'Weekly Matches'],
            updates: ['Join us for the Annual Sports Meet!']
        },
        {
            name: 'Photography Club',
            contact: 'photoclub@college.edu',
            image: 'photo_club.jpg',
            events: ['Photo Walk', 'Exhibition'],
            updates: ['Photo Walk scheduled for next Saturday!']
        }
    ];

    // Display club updates
    const currentUpdates = document.getElementById('current-updates');
    clubs.forEach(club => {
        club.updates.forEach(update => {
            const updateElement = document.createElement('p');
            updateElement.innerText = update;
            currentUpdates.appendChild(updateElement);
        });
    });

    // Display club information
    const clubsDiv = document.getElementById('clubs');
    clubs.forEach(club => {
        const clubDiv = document.createElement('div');
        clubDiv.classList.add('club');
        clubDiv.innerHTML = `
            <h3><a href="${club.name.toLowerCase().replace(' ', '-')}-details.html">${club.name}</a></h3>
            <p>Contact: ${club.contact}</p>
            <img src="${club.image}" alt="${club.name}" style="width: 100px; height: auto;">
            <h4>Events:</h4>
            <ul>
                ${club.events.map(event => `<li>${event}</li>`).join('')}
            </ul>
        `;
        clubsDiv.appendChild(clubDiv);
    });
}

