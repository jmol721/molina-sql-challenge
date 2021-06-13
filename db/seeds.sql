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

INSERT INTO employee (first_name, last_name)
VALUES 
    ("Jose", "Molina"),
    ("Lauren", "Hunter"),
    ("Juan", "Doe"),
    ("Scotch", "Tape"),
    ("Kevin", "Ho"),
    ("Mc", "Lovin");