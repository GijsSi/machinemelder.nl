create table meldingen
(
    id                int auto_increment
        primary key,
    latitude          decimal(10, 8)                       null,
    longitude         decimal(11, 8)                       null,
    supermarktId      int                                  not null,
    machineWorking    tinyint(1)                           null,
    createdAt         datetime default current_timestamp() null,
    reporterIpAddress text                                 null,
    constraint meldingen_albertheijn_id_fk
        foreign key (supermarktId) references supermarkets (id)
);

create index idx_supermarktId
    on meldingen (supermarktId);

