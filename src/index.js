const baseUrl = 'http://localhost:3000';

// Step 1: Fetch the data for the first movie
fetch(`${baseUrl}/films/1`)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    // Populate the movie details on the page
    document.getElementById('poster').src = data.poster;
    document.getElementById('title').innerText = data.title;
    document.getElementById('runtime').innerText = `${data.runtime} minutes`;
    document.getElementById('showtime').innerText = data.showtime;
    const remainingTickets = data.capacity - data.tickets_sold;
    document.getElementById('ticket-num').innerText = remainingTickets;
    const buyTicketButton = document.getElementById('buy-ticket');
    if (remainingTickets === 0) {
      buyTicketButton.innerText = 'Sold Out';
      buyTicketButton.disabled = true;
    }
  })
  .catch(error => console.error('Error:', error));

// Step 2: Fetch all movies and populate the film menu
fetch(`${baseUrl}/films`)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    const filmsList = document.getElementById('films');
    data.forEach(movie => {
      const li = document.createElement('li');
      li.classList.add('film', 'item');
      li.textContent = movie.title;

      // Add a delete button for each film
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.addEventListener('click', () => {
        // Remove the film from the server and the list
        fetch(`${baseUrl}/films/${movie.id}`, {
          method: 'DELETE'
        })
          .then(() => {
            li.remove();
          })
          .catch(error => console.error('Error:', error));
      });

      li.appendChild(deleteButton);

      li.addEventListener('click', () => {
        // Fetch and display details for the clicked movie
        fetch(`${baseUrl}/films/${movie.id}`)
          .then(response => response.json())
          .then(data => {
            document.getElementById('poster').src = data.poster;
            document.getElementById('title').innerText = data.title;
            document.getElementById('runtime').innerText = `${data.runtime} minutes`;
            document.getElementById('showtime').innerText = data.showtime;
            const remainingTickets = data.capacity - data.tickets_sold;
            document.getElementById('ticket-num').innerText = remainingTickets;
            const buyTicketButton = document.getElementById('buy-ticket');
            if (remainingTickets === 0) {
              buyTicketButton.innerText = 'Sold Out';
              buyTicketButton.disabled = true;
            } else {
              buyTicketButton.innerText = 'Buy Ticket';
              buyTicketButton.disabled = false;
            }
          })
          .catch(error => console.error('Error:', error));
      });

      filmsList.appendChild(li);
    });
    // Remove the default placeholder li element
    const placeholderElement = document.querySelector('#films .film');
    if (placeholderElement) {
      placeholderElement.remove();
    }
  })
  .catch(error => console.error('Error:', error));

// Step 3: Implement the functionality to buy a ticket
const buyTicketButton = document.getElementById('buy-ticket');
buyTicketButton.addEventListener('click', () => {
  const remainingTicketsElement = document.getElementById('ticket-num');
  let remainingTickets = parseInt(remainingTicketsElement.innerText);
  if (remainingTickets > 0) {
    remainingTickets--;
    remainingTicketsElement.innerText = remainingTickets;
    const movieId = 1; 
    fetch(`${baseUrl}/films/${movieId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickets_sold: remainingTickets }),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
    if (remainingTickets === 0) {
      buyTicketButton.innerText = 'Sold Out';
      buyTicketButton.disabled = true;
    }
  } else {
    // Handle case where tickets are sold out
    buyTicketButton.innerText = 'Sold Out';
    buyTicketButton.disabled = true;
  }
});
