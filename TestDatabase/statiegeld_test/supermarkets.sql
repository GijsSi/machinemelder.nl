create table supermarkets
(
    id                int auto_increment
        primary key,
    uuid              varchar(36)                  null,
    latitude          decimal(10, 8)               null,
    longitude         decimal(11, 8)               null,
    storeType         varchar(50)                  null,
    city              varchar(100)                 null,
    countryCode       varchar(10)                  null,
    houseNumber       varchar(10)                  null,
    houseNumberExtra  varchar(10)                  null,
    postalCode        varchar(10)                  null,
    street            varchar(255)                 null,
    openingDays       longtext collate utf8mb4_bin null
        check (json_valid(`openingDays`)),
    machineWorking    tinyint(1)                   null,
    supermarketBranch varchar(30)                  null,
    constraint uuid
        unique (uuid)
);

