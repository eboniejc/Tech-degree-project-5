let employees = [];
const container = document.querySelector('.gallery');
//extra credit
let activeModal = null;
let modals = [];

///get employees
async function getEmployees() {
    try {
        const response = await fetch('https://randomuser.me/api/?results=12&inc=name,email,location,phone,dob,picture');
        if (!response.ok) throw new Error('Something went wrong');
        const data = await response.json();

        employees = data.results;
        displayEmployees(data.results);
    } catch (error) {
        console.log(error);
    }
}

//show employees
function displayEmployees(data) {
    data.forEach((employee) => {
        const employeeHTML = `
                <div class="card">
                 <div class="card-img-container">
                 <img class="card-img" src="${employee.picture.medium}" alt="profile picture"/>
                    </div>
                   <div class="card-info-container">
                            <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                            <p class="card-text">${employee.email}</p>
                            <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                                </div>
                        </div>
                   
             `;

        document.querySelector('.gallery')
            .insertAdjacentHTML('beforeend', employeeHTML);
    });
}

//click logic when card selected
container.addEventListener('click', (event) => {
    const employeeCard = event.target.closest('.card');
    if (!employeeCard) return;

    const employeeName = employeeCard.querySelector('.card-name').textContent.trim();
    const employeeIndex = Array.from(container.children).indexOf(employeeCard);
    const employee = employees[employeeIndex];

    if (employee) {
        displayEmployeesModal(employee, employeeIndex);
    }
});

//employee modal
function displayEmployeesModal(employee, index) {
    activeModal = index;
    const modalHTML = `
    <div class="modal-container">
    <div class="modal">
        <button type="button" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
  <img class="modal-img" src="${employee.picture.medium}" alt="profile picture"/>         
   <h3 class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
            <p class="modal-text">${employee.email}</p>
            <p class="modal-text cap">${employee.location.city}</p>
            <hr>
            <p class="modal-text">${employee.phone}</p>
            <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state}, ${employee.location.postcode}</p>
            <p class="modal-text">Birthday: ${new Date(employee.dob.date).toLocaleDateString()}</p>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    </div>
`;

    container.insertAdjacentHTML('afterend', modalHTML);
    modals.push(document.querySelector('.modal-container'));

    // Close button logic
    const modalContainer = document.querySelector('.modal-container');
    const closeButton = document.querySelector('.modal-close-btn');
    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });

    //use escape to close modal
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modalContainer.remove();
        }
    });

    //click outside of modal to close

    modalContainer.addEventListener('click', (event) => {
        const isOutside = !event.target.closest('.modal');
        if (isOutside) {
            modalContainer.remove();
        }
    });

    //Extra credit add prev/next

    const nextButton = document.querySelector('#modal-next');
    const prevButton = document.querySelector('#modal-prev');

    nextButton.addEventListener('click', openNextModal);
    prevButton.addEventListener('click', openPrevModal);

    function openModal(index) {
        const currentModal = document.querySelector('.modal-container');
        if (currentModal) currentModal.remove(); // Remove current modal

        displayEmployeesModal(employees[index], index); // Open the new modal
    }

    function openNextModal() {
        const nextIndex = (activeModal + 1) % employees.length;
        openModal(nextIndex);
    }

    function openPrevModal() {
        const prevIndex = (activeModal - 1 + employees.length) % employees.length;
        openModal(prevIndex);
    }

}


//Add Search Functionality
const employeeSearch = document.getElementById('search-input');
employeeSearch.addEventListener('keyup', e => {
    let currentValue = e.target.value.toLowerCase();
    let employeeName = document.querySelectorAll('h3.card-name');
    employeeName.forEach(employee => {
        if (employee.textContent.toLowerCase().includes(currentValue)) {
            employee.parentNode.parentNode.style.display = 'flex';
        } else {
            employee.parentNode.parentNode.style.display = 'none';
        }
    });

});



// Initialize fetching employees
getEmployees();

