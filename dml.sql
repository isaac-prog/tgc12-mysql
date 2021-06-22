/* select all columns from rows where job title is "Sales Rep" */
select * from employees where jobTitle = "Sales Rep"

/* get the first name, last name and email from all employees who are sales rep */
select firstName, lastName, email from employees where jobTitle = "Sales Rep"

/* get the first name, last name and email froma ll employees whose job title
includes the word 'sales' */
SELECT firstName, lastName, email, jobTitle FROM employees WHERE jobTitle like "%sales%";

/* Find all the sales rep in office code 1 */
SELECT * from employees WHERE officeCode = 1 AND jobTitle = "Sales Rep"

/* Find all the employees from office code 1 and office code 2 */
SELECT * from employees WHERE officeCode = 1 OR officeCode = 4;

/* Find all the employees who are NOT from office code 1 or office code 4 */
SELECT * from employees WHERE officeCode not in (1, 4)

/* Find all the employees who are not sales rep */
SELECT * from employees WHERE jobTitle != "sales rep"