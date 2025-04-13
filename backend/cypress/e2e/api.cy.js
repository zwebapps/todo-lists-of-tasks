describe('Todo API Tests', () => {
  const apiUrl = 'http://localhost:3000/api';

  it('should create a new todo list', () => {
    cy.request('POST', `${apiUrl}/lists`, { title: 'Test List' })
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('_id');
        expect(response.body.title).to.eq('Test List');
      });
  });

  it('should retrieve all todo lists', () => {
    cy.request('GET', `${apiUrl}/lists`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should update a todo list', () => {
    // First, create a list to update
    cy.request('POST', `${apiUrl}/lists`, { title: 'Old Title' })
      .then((createResponse) => {
        const listId = createResponse.body._id;
        // Now, update the list
        cy.request('PUT', `${apiUrl}/lists/${listId}`, { title: 'New Title' })
          .then((updateResponse) => {
            expect(updateResponse.status).to.eq(200);
            expect(updateResponse.body.title).to.eq('New Title');
          });
      });
  });

  it('should delete a todo list', () => {
    // First, create a list to delete
    cy.request('POST', `${apiUrl}/lists`, { title: 'To Delete' })
      .then((createResponse) => {
        const listId = createResponse.body._id;
        // Now, delete the list
        cy.request('DELETE', `${apiUrl}/lists/${listId}`)
          .then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(200);
          });
      });
  });

  it('should add a task to a list', () => {
    // First, create a list to add a task to
    cy.request('POST', `${apiUrl}/lists`, { title: 'Task List' })
      .then((createResponse) => {
        const listId = createResponse.body._id;
        // Now, add a task to the list
        cy.request('POST', `${apiUrl}/lists/${listId}/tasks`, {
          title: 'New Task',
          description: 'Task description',
        }).then((taskResponse) => {
          expect(taskResponse.status).to.eq(201);
          expect(taskResponse.body).to.have.property('_id');
          expect(taskResponse.body.title).to.eq('New Task');
        });
      });
  });

  it('should retrieve tasks for a list', () => {
    // First, create a list and add a task
    cy.request('POST', `${apiUrl}/lists`, { title: 'List with Tasks' })
      .then((createResponse) => {
        const listId = createResponse.body._id;
        cy.request('POST', `${apiUrl}/lists/${listId}/tasks`, {
          title: 'Task 1',
        }).then(() => {
          // Now, retrieve tasks for the list
          cy.request('GET', `${apiUrl}/lists/${listId}/tasks`)
            .then((tasksResponse) => {
              expect(tasksResponse.status).to.eq(200);
              expect(tasksResponse.body).to.be.an('array');
              expect(tasksResponse.body.length).to.be.greaterThan(0);
            });
        });
      });
  });

  it('should update a task', () => {
    // First, create a list and add a task
    cy.request('POST', `${apiUrl}/lists`, { title: 'List for Task Update' })
      .then((createResponse) => {
        const listId = createResponse.body._id;
        cy.request('POST', `${apiUrl}/lists/${listId}/tasks`, {
          title: 'Task to Update',
        }).then((taskResponse) => {
          const taskId = taskResponse.body._id;
          // Now, update the task
          cy.request('PUT', `${apiUrl}/tasks/${taskId}`, {
            title: 'Updated Task Title',
            completed: true,
          }).then((updateResponse) => {
            expect(updateResponse.status).to.eq(200);
            expect(updateResponse.body.title).to.eq('Updated Task Title');
            expect(updateResponse.body.completed).to.be.true;
          });
        });
      });
  });

  it('should delete a task', () => {
    // First, create a list and add a task
    cy.request('POST', `${apiUrl}/lists`, { title: 'List for Task Deletion' })
      .then((createResponse) => {
        const listId = createResponse.body._id;
        cy.request('POST', `${apiUrl}/lists/${listId}/tasks`, {
          title: 'Task to Delete',
        }).then((taskResponse) => {
          const taskId = taskResponse.body._id;
          // Now, delete the task
          cy.request('DELETE', `${apiUrl}/tasks/${taskId}`)
            .then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(200);
            });
        });
      });
  });
});
