#drop database noteGest;

#describe students;

create database if not exists noteGest;

use noteGest;

create table if not exists courses (
	course_id VARCHAR(3) primary key,
    course_name varchar(40) not null,
    course_weekly_hours integer not null
);

create table if not exists users (
	user_id integer auto_increment primary key,
	user_username VARCHAR(40) NOT NULL unique,
	user_password VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_image BLOB NOT NULL
);

create table if not exists teachers (
	teacher_id integer primary key,
	department VARCHAR(3),
    foreign key (teacher_id) references users(user_id) on delete cascade,
    foreign key (department) references courses(course_id) on update restrict
);

create table if not exists students (
	student_id integer primary key,
	wich_year INTEGER NOT NULL,
    is_repeating BOOLEAN NOT NULL,
    foreign key (student_id) references users(user_id) on delete cascade
);