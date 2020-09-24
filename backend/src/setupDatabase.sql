DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id uuid PRIMARY KEY,
    username varchar(20) UNIQUE NOT NULL,
    password varchar(64) NOT NULL
);