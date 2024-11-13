document.getElementById('githubForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const userDetailsDiv = document.getElementById('userDetails');
    const repoListDiv = document.getElementById('repoList');

    userDetailsDiv.innerHTML = ''; 
    repoListDiv.innerHTML = ''; 

    fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())
        .then(userData => {
            if (userData.message === "Not Found") {
                userDetailsDiv.innerHTML = `<p>User ${username} not found.</p>`;
            } else {
                userDetailsDiv.innerHTML = `
                    <h2>${userData.name} (@${userData.login})</h2>
                    <img src="${userData.avatar_url}" alt="${userData.login}">
                    <p>Followers: ${userData.followers} - Following: ${userData.following}</p>
                    <p>Repos: ${userData.public_repos}</p>
                    <p>Repos List: </p>
                `;
                
                fetch(`https://api.github.com/users/${username}/repos`)
                    .then(response => response.json())
                    .then(reposData => {
                        reposData.forEach(repo => {
                            const repoItem = document.createElement('div');
                            repoItem.classList.add('repo-item');
                            repoItem.textContent = repo.name;
                            
                            repoItem.addEventListener('click', () => {
                                window.open(repo.html_url, '_blank');
                            });
                            
                            repoListDiv.appendChild(repoItem);
                        });
                    })
                    .catch(error => {
                        userDetailsDiv.innerHTML += `<p>Error fetching repositories for user ${username}. Please try again.</p>`;
                    });
            }
        })
        .catch(error => {
            userDetailsDiv.innerHTML = `<p>Error fetching user details for ${username}. Please try again.</p>`;
        });
});