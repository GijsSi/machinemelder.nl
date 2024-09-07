create table sticker_requests
(
    id            int auto_increment
        primary key,
    storeId       int                                    not null,
    firstName     varchar(255)                           not null,
    lastName      varchar(255)                           not null,
    email         varchar(255)                           not null,
    streetAddress varchar(255)                           not null,
    city          varchar(255)                           not null,
    region        varchar(255)                           not null,
    postalCode    varchar(20)                            not null,
    payed         tinyint(1) default 0                   null,
    created_at    timestamp  default current_timestamp() not null,
    requestId     varchar(255)                           null,
    sessionId     varchar(255)                           null,
    constraint sticker_requests_ibfk_1
        foreign key (storeId) references supermarkets (id)
            on delete cascade
);

create index storeId
    on sticker_requests (storeId);

