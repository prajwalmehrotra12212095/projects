document.getElementById("searchBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const userCard = document.getElementById("userCard");

    userCard.innerHTML = `<p>Loading...</p>`; // Show loading state

    if (username === "") {
        userCard.innerHTML = `<p class="error">Please enter a username.</p>`;
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error("User not found");
        }

        const user = await response.json();

        userCard.innerHTML = `
            <img src="${user.avatar_url}" alt="Profile Picture" class="profile-img">
            <h2>${user.name || "No Name Available"}</h2>
            <p>${user.bio || "No bio available"}</p>
            <p><strong>Followers:</strong> ${user.followers}</p>
            <p><strong>Following:</strong> ${user.following}</p>
            <p><strong>Repositories:</strong> ${user.public_repos}</p>
            <a href="${user.html_url}" target="_blank">View Profile</a>
        `;

        userCard.classList.remove("hidden"); // Show user card
    } catch (error) {
        userCard.innerHTML = `<p class="error">${error.message}</p>`;
    }
});
