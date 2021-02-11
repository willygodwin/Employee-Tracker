-- Departments
INSERT INTO department ()
VALUES (1, "Product Development");

INSERT INTO department ()
VALUES (2, "Research and Development");

INSERT INTO department ()
VALUES (3, "Sales");


-- Roles
INSERT INTO role(title, salary, department_id)
VALUES ("Intern", 40, 1);

INSERT INTO role(title, salary, department_id)
VALUES ( "Scientist", 110, 2);


-- Employees
INSERT INTO employees(first_name, last_name, role_id)
VALUES ( "Jane", "Godwin", 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ( "Stormer", "Godwin", 1, 1);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ( "Juliet", "Godwin", 2, 3);

INSERT INTO employees()
VALUES (1, "Will", "Godwin", 1, null);