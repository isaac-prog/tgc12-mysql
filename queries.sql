/* how to do log into MySQL terminal client (or sometimes known command line interface, aka CLI) */
mysql -u root

/* display all the databases in the server */
show databases;

/* create a new database */
create database employee_feedback;

/* switch to the database */
/* use <name of database>; */
use employee_feedback;

/* create the students table */
/* must specify engine as innodb for the foreign keys to work */
create table students (
  student_id int unsigned auto_increment primary key,
  first_name varchar(200) not null,
  last_name varchar(200) not null,
  bio text
) engine = innodb;

/* show all tables in the currently selected database */
show tables;

/* insert rows into tables */
/* insert into <table name> (<columns>) values (<values>) */
insert into students (first_name, last_name, bio) 
    values ("Ah Kow", "Tan", "Year one student");

/* display all rows and all columns from a table */
select * from students;

/* we can choose not to insert into columns that are nullable */
insert into students (first_name, last_name) values ("Mary", "Su");

/* insert many rows at once. Each row is one set of parethenesis */
insert into students (first_name, last_name, bio) values 
    ("John", "Doe", "Unknown person"),
    ("Alice", "Tay", null),
    ("Jane", "Smith", "Unknown person from a different era");
