INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ("Software Engineer", 125000.00, 1),
    ("Salesperson", 65000.00, 2),
    ("Sales Manager", 100000.00, 2),
    ("Accountant", 95000.00, 3),
    ("Legal Advisor", 110000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Lauren", "Hunter", 1, NULL),
    ("Jose", "Molina", 1, 1),
    ("Scotch", "Tape", 2, NULL),
    ("Juan", "Doe", 2, NULL),
    ("Kevin", "Ho", 3, NULL),
    ("Mc", "Lovin", 4, NULL);