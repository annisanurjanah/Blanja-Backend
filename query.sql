create database belanja;

\c belanja;

create type enum_type AS ENUM('L','P');

create table customer(
    id_customer int primary key not null,
    name varchar(255) not null,
    phone int not null,
    password varchar(10) not null,
    email varchar(255) not null,
    gender enum_type,
    tgl_lahir date
);

create table seller(
    id_seller int primary key not null,
    name varchar(255) not null,
    phone int not null,
    password varchar(10) not null,
    email varchar(255) not null,
    gender enum_type,
    tgl_lahir date
);

create table category(
    id_category int primary key not null,
    name varchar(255)
);

create table product(
    id_produk int primary key not null,
    name varchar(255) not null,
    price int not null,
    deskripsi varchar(255),
    stock int not null,
    rating int not null,
    color varchar(100) not null,
    size int,
    id_category int,
    CONSTRAINT fk_category FOREIGN KEY (id_category) REFERENCES category(id_category),
    id_seller int,
    CONSTRAINT fk_seller FOREIGN KEY (id_seller) REFERENCES seller(id_seller)
);

insert into customer (id_customer, name, phone, password, email, gender, tgl_lahir) 
values (1, 'Shania', 0878826705, 'Shania28', 'Saniarizkiagustin@gmail.com', 'P', '28-04-2000'), 
(2, 'Dhimas', 081234567, 'Dhimas0801', 'Dhimasswara@gmail.com', 'L', '08-01-2001'),  
(3, 'Hosea', 089876543, 'HoseaL', 'HoseaLeonardo@gmail.com', 'L', '17-05-1998');

insert into seller (id_seller, name, phone, password, email, gender, tgl_lahir) 
values (1, 'Ilham', 089873572, 'Ilham28', 'IlhamDarmawann@gmail.com', 'L', '23-07-2004'), 
(2, 'Rizal', 086382947, 'Rizal123', 'Rizal@gmail.com', 'L', '15-09-2000'),  
(3, 'Alif', 082547392, '123Alif', 'Alif@gmail.com', 'L', '09-12-1999');

insert into category (id_category, name) 
values (1, 'pakaian'), (2, 'aksesoris'), (3, 'sepatu');

insert into product (id_produk, name, price, deskripsi, stock, rating, color, size, id_category, id_seller) 
values (1, 'celana', 75000, 'ini adalah celana', 10, 5, 'hitam', 20, 1, 1), 
(2, 'kalung', 300000, 'ini adalah kalung', 15, 4, 'emas', 25, 2, 2),  
(3, 'higheels', 150000, 'ini adalah higheels', 5, 3, 'merah', 39, 3, 3);