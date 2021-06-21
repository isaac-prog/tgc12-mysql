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


/* create courses */

create table courses (
    course_id int unsigned auto_increment primary key,
    title varchar(100) not null,
    description tinytext not null
) engine=innodb;

insert into courses (title, description) values 
('Management', 'Managing money, people and resources'),
('HR', 'Human resources 101'),
('Marketing', 'Marketing 101');

/* create the professors table */
create table professors (
    professor_id int unsigned auto_increment primary key,
    first_name varchar(200) not null,
    last_name varchar(200) not null,
    salulation varchar(4) not null
) engine=innodb;

insert into professors (first_name, last_name, salulation) values ('Tom', 'Jerry', 'Mr.');

create table feedback_statuses (
    feedback_status_id int unsigned auto_increment primary key,
    text text not null
) engine=innodb;

/* see all the columns but not the content */
describe feedback_statuses;

insert into feedback_statuses (text) 
    values ('Pending'),
    ('Acknowledged'),
    ('Resolved'),
    ('Escalated');

/* Foreign Key */
create table modules (
    module_id int unsigned auto_increment primary key,
    name varchar(200) not null,
    description tinytext not null,
    professor_id int unsigned not null,
    foreign key(professor_id) references professors(professor_id)
) engine=innodb;

/* INVALID EXAMPLE */
insert into modules (name, description, professor_id) values
     ("Interviews 101", "How to conduct interviews", 2);

/* VALID */
/* It's valid because there is a row in the professors table which professor_id is 1) */
insert into modules (name, description, professor_id) values
     ("Interviews 101", "How to conduct interviews", 1);

/* DELETE */
/* ONLY delete the student whose student_id is 4 */
delete from students where student_id = 4;

/* We cannot delete rows where there are other rows depended on it */
delete from professors where professor_id = 1;

/* Create CLASSES */
create table classes (
    class_id int unsigned auto_increment primary key,
    semester varchar(10) not null,
    course_id int unsigned not null,
    foreign key(course_id) references courses(course_id) on delete cascade,
    module_id int unsigned not null,
    foreign key(module_id) references modules(module_id) on delete cascade
) engine=innodb;

insert into classes (semester, course_id, module_id) values ("AY2021-B", 3, 2);

/* rename columns */
alter table classes rename column semester to semster_code;
/*
 alter table classes add column new_of_column unsigned int 
*/

/* UPDATE A ROW */
update students set bio = "Stays in AMK" where student_id = 2;