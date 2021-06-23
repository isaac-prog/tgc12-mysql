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
SELECT * from employees WHERE jobTitle != "sales rep";

/* How to sort */

/* Display all employees sorted by their first name in ascending order */
SELECT * from employees ORDER BY firstName;
SELECT * from employees ORDER BY firstName ASC;

/* select all the sales rep and order them by their first name in descending order */
SELECT firstName, lastName, email, jobTitle 
	FROM employees WHERE jobTitle = "Sales Rep" 
	ORDER BY firstName DESC;

/* SOLUTIONS */
/* Q1. */
SELECT city, phone, country from offices;

/* Q2 */
SELECT * FROM orders WHERE comments LIKE "%fedex%";

/* Q4 */
SELECT customerName, contactFirstName, contactLastName FROM customers
ORDER BY customerName DESC

/* Q5 */
SELECT * FROM employees where (firstName LIKE "%son%" OR lastName LIKE "%son%") and 
officeCode between 1 and 3 AND jobTitle = "Sales Rep"

/* JOINS */

/* For each employee, display the details of their office */
SELECT * FROM employees
	JOIN offices ON employees.officeCode = offices.officeCode

/* Show all the first name, last name, country and city
for Emplyoees who are sales rep and order by country's name in descending order */
/* Join will go first, then WHERE, then ORDER BY then SELECT */
SELECT firstName, lastName, city, country, jobTitle FROM employees
	JOIN offices ON employees.officeCode = offices.officeCode
	WHERE jobTitle = "Sales Rep"
	ORDER BY country DESC


/* Also display the officeCode. Note how we specify the name of the table
in front of the `officeCode` column to tell SQL which table to take the column from */
SELECT firstName, lastName, employees.officeCode, city, country, jobTitle FROM employees
	JOIN offices ON employees.officeCode = offices.officeCode
	WHERE jobTitle = "Sales Rep"
	ORDER BY country DESC


/* Three way joins */
/* For each customer, display the customer name, the first name and last name
of their sales rep and which city their sales rep is based in */
SELECT customerName, 
       firstName as "Sales Rep First Name",
	   lastName as "Sales Rep Last Name",
	   offices.city as "Sales Rep City"
	FROM customers 
	JOIN employees
		ON customers.salesRepEmployeeNumber = employees.employeeNumber	
	JOIN offices
		ON employees.officeCode = offices.officeCode

/* DATES */

/* Find all the orders that are ordered on 9th Jan 2003 */
select * from orders where orderDate = '2003-01-09'

/* Find all the orders that are ordered between 9th Jan 2003  31st Apr 2003*/
select * from orders where orderDate >= '2003-01-09' AND orderDate <= '2003-04-31';
select * from orders where orderDate BETWEEN '2003-01-09' AND '2003-04-31';

/* Find all the orders made 3 days ago */
select * from orders where DATEDIFF(CURDATE(), orderDate) <= 3;

/* split a date into its year, month and day components */
select orderNumber, YEAR(orderDate), MONTH(orderDate), DAY(orderDate) from orders;

/* Find all the orders that are ordered in the month of January in 2004 */
select * from orders where YEAR(orderDate) = 2004 AND MONTH(orderDate) = 1;
/* OR: (but take note of the numebr of days in the month) */
select * from orders where orderDate BETWEEN '2004-01-01' AND '2004-01-31'

/* JOIN QUESTIONS SOLUTION */

/* Q3 */
select orders.*, customerName, contactLastName, contactFirstName
	from customers 
	join orders
		on customers.customerNumber = orders.customerNumber
    where customers.customerNumber = 124;

/* Q6 */
SELECT products.productName, orderNumber, priceEach, products.productCode, orderLineNumber
    from orderdetails join products
    on orderdetails.productCode = products.productCode

/* Q7 */
SELECT customerName, state, city, payments.* from payments inner join customers
on payments.customerNumber = customers.customerNumber
where country = "USA";

/** AGGREGATION **/

/* count how many customers there are */
SELECT count(*) from customers 

/* select the countries which customers are from, without duplicates */
SELECT distinct country FROM customers;

/* sum up the quantity ordered column in the orderdetails table */
SELECT sum(quantityOrdered) FROM orderdetails;

/* find the average quantity ordered across all the order details */
SELECT avg(quantityOrdered) FROM orderdetails;

/* display for each order how many days between ordering and shipping */
SELECT orderNumber, DATEDIFF(shippedDate, orderDate) as "lag" from orders;

/** GROUP BY **/
/* 1. whatever we group by, we must select */
/* 2. we can only use aggregation functions in SELECT after selecting whatever we group by */
SELECT officeCode, count(*) FROM employees
GROUP BY(officeCode)

/* Count how  many sales rep there are in each office */
SELECT officeCode, count(*) from employees
WHERE jobTitle = "Sales Rep"
GROUP BY(officeCode)

/* Show how many sales rep there in each office, and display the city each office is in */
/* WHATEVER you select, you must group by (except for aggregation columns) */
SELECT offices.officeCode, city, count(*) from employees
JOIN offices ON employees.officeCode = offices.officeCode
WHERE jobTitle = "Sales Rep"
GROUP BY offices.officeCode, city

/* Display how many orders were made, by the years */
select YEAR(orderDate), count(*) from orders
group by YEAR(orderDate)

/* Display the total amount payment per year */
SELECT YEAR(paymentDate), sum(amount) FROM payments
group by YEAR(paymentDate)

/* Display the total amount payment per year and month */
SELECT YEAR(paymentDate),  MONTH(paymentDate), sum(amount) FROM payments
group by YEAR(paymentDate), MONTH(paymentDate)

/* Display only the month and year where the total amount earned is greater than 300000 */
SELECT YEAR(paymentDate),  MONTH(paymentDate), sum(amount) FROM payments
group by YEAR(paymentDate), MONTH(paymentDate)
having sum(amount) >= 300000

/* order of clauses : https://sqlbolt.com/lesson/select_queries_order_of_execution */

/* Show all offices that have more than 2 sales rep */
SELECT employees.officeCode, city, state, count(*) AS "Sales Rep Count" from employees
JOIN offices ON employees.officeCode = offices.officeCode
WHERE jobTitle = "Sales Rep"
group by employees.officeCode, city, state
HAVING count(*) > 2
ORDER BY city DESC

/* SOLUTIONS */
/* Q8 */
select offices.officeCode, city, state, count(*) from offices
 join employees on employees.officeCode = offices.officeCode
 where offices.country = "USA"
 group by offices.officeCode, city, state

 /* Q9 */
 select  customers.customerNumber, customers.customerName, avg(amount) 
from payments join customers on customers.customerNumber = payments.customerNumber
group by customers.customerNumber, customers.customerName

/* Q10 */
select  customers.customerNumber, customers.customerName, avg(amount) from payments join customers
on customers.customerNumber = payments.customerNumber
group by customers.customerNumber, customers.customerName
having avg(amount) >= 10000

/* Q11 */
select orderdetails.productCode, productName, sum(quantityOrdered) as 'Total Quantity'
from orderdetails join products on orderdetails.productCode = products.productCode
group by orderdetails.productCode, productName
order by 'Total Quantity' desc
limit 10

/* Q12 */
select * from orders where orderDate between '2003-01-01' and '2003-12-31' 

/* Q13 */
select month(orderDate) as 'Month', count(*) as 'Number of Orders made' from orders
where orderDate between '2003-01-1' and '2003-12-31'
group by month(orderDate)

/* As Q13, but over the span of two years (2003 to 2004) */
select year(orderDate) as 'Year', month(orderDate) as 'Month', count(*) as 'Number of Orders made' from orders
where orderDate between '2003-01-1' and '2004-12-31'
group by year(orderDate), month(orderDate)

/** SUBQUERIES **/

/* Find the average employee per office */
  select (select count(*) from employees) /  (select count(*) from offices) 

/* Find all the offices which employee count is higher than average */
select officeCode, count(*) from employees
group by officeCode
having count(*) >  (select count(*) from employees) /  (select count(*) from offices)

/* Find all the customers who do not have a sales rep */
/* the set of all customers without sales rep is the set of all customers
 - the set of customers with sales rep */

select * from customers where customerNumber NOT IN
	(select customerNumber from customers where salesRepEmployeeNumber IS NOT NULL)


/* Find all the products that have not been ordered before */
select * from products where 
 productCode not in (SELECT distinct productCode FROM orderdetails)


 /* PREPARED STATEMENTS */
 select * from employees where officeCode = ?

 /* in a follow-up, we specify where each ? is */