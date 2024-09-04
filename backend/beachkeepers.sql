drop table studies;
drop table interacts;
drop table tourist;
drop table parkvisitor cascade constraints;
drop table registers;
drop table position;
drop table shift;
drop table crab;
drop table legal;
drop table species;
drop table bait;
drop table trap;
drop table crabber;
drop table volunteer;
drop table email;
drop table supervisor;
drop sequence supervisor_id;
drop sequence volunteer_id;

CREATE SEQUENCE supervisor_id
START WITH 6
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE SEQUENCE volunteer_id
START WITH 116
INCREMENT BY 1
NOCACHE
NOCYCLE;

create table supervisor
    (employeeid int, 
    firstname varchar(30), 
    lastname varchar(30), 
    password varchar(60), 
    phone char(12),
    primary key (employeeid),
    UNIQUE (firstname, lastname));

grant select on supervisor to public;

create table email
    (firstname varchar(30),
    lastname varchar(30),
    email varchar(35),
    employeeid int not null,
    primary key (email),
    foreign key (employeeid) references supervisor ON DELETE CASCADE);
    
grant select on email to public;

create table volunteer
    (volunteerid int, 
    firstname varchar(30), 
    lastname varchar(30), 
    password varchar(60), 
    experience int, 
    employeeid int not null,
    primary key (volunteerid),
    UNIQUE (firstname, lastname),
    foreign key (employeeid) references supervisor(employeeid) ON DELETE CASCADE);

grant select on volunteer to public;

create table bait
    (baittype varchar(7), 
    successrate number, 
    primary key (baittype));

grant select on bait to public;

create table species
    (species varchar(9), 
    legalsize int,
    primary key (species));

grant select on species to public;

create table legal
    (species varchar(9), 
    sex varchar(4),
    takehome varchar(8),
    primary key (species, sex, takehome));

grant select on legal to public;

create table shift
    (shift_date date, 
    lowtide char(8), 
    hightide char(8),
    primary key (shift_date));

grant select on shift to public;

create table position
    (positionname varchar(10), 
    shift_date date not null, 
    difficulty int, 
    pos_location varchar(15),
    primary key (positionname, shift_date),
    foreign key (shift_date) references shift ON DELETE CASCADE);

grant select on position to public;

create table registers
    (volunteerid int, 
    positionname varchar(10), 
    shift_date date,
    primary key (volunteerid, positionname, shift_date),
    foreign key (volunteerid) references volunteer,
    foreign key (positionname, shift_date) references position ON DELETE CASCADE);

grant select on registers to public;

create table parkvisitor
    (phone char(12), 
    firstname varchar(30), 
    age varchar(5),
    primary key (phone));

grant select on parkvisitor to public;

create table tourist
    (phone char(12), 
    pref_language varchar(20), 
    homecountry varchar(50),
    primary key (phone),
    foreign key (phone) references parkvisitor ON DELETE CASCADE);

grant select on tourist to public;

create table crabber
    (phone char(12), 
    licensenum int unique, 
    volunteerid int	not null,
    primary key (phone),
    foreign key (volunteerid) references volunteer,
    foreign key (phone) references parkvisitor ON DELETE CASCADE);

grant select on crabber to public;

create table trap
    (trapid int, 
    baittype varchar(10), 
    traptype varchar(10),
    trap_location varchar(8),
    phone char(12) not null,
    primary key (trapid),
    foreign key (phone) references crabber ON DELETE CASCADE);

grant select on trap to public;

create table crab
    (crabid int, 
    species varchar(15), 
    sex varchar(4),
    crab_size int,
    injury varchar(6),
    trapid int not null,
    primary key (crabid),
    foreign key (trapid) references trap ON DELETE CASCADE);

grant select on crab to public;

create table interacts
    (volunteerid int, 
    phone char(12), 
    topic varchar(55),
    primary key (volunteerid, phone, topic),
    foreign key (volunteerid) references volunteer,
    foreign key (phone) references parkvisitor);

grant select on interacts to public;

create table studies
    (volunteerid int, 
    crabid int,
    primary key (volunteerid, crabid),
    foreign key (volunteerid) references volunteer ON DELETE CASCADE,
    foreign key (crabid) references crab ON DELETE CASCADE);

grant select on studies to public;


insert into supervisor values(1, 'April', 'Rudgate', '123', '778-945-1049');
insert into supervisor values(2, 'Keely', 'Rangford', '123', '604-802-3581');
insert into supervisor values(3, 'Chris', 'Rahoney', '123', '778-381-4112');
insert into supervisor values(4, 'Danielle', 'Slark', '123', '604-202-0733');
insert into supervisor values(5, 'Rachel', 'Breen', '123', '778-515-8466');

insert into email values('April', 'Rudgate', 'april.rudgate@gmail.com', 1);
insert into email values('Keely', 'Rangford', 'keely.rangford@gmail.com', 2);
insert into email values('Chris', 'Rahoney', 'chris.rahoney@gmail.com', 3);
insert into email values('Danielle', 'Slark', 'danielle.slark@gmail.com', 4);
insert into email values('Rachel', 'Breen', 'rachel.breen@gmail.com', 5);

insert into volunteer values(100, 'Elayne', 'Lu', '123', 9, 1);
insert into volunteer values(101, 'Lisa', 'Kooz', '123', 14, 5);
insert into volunteer values(102, 'Cheryl', 'Cheng', '123', 10, 5);
insert into volunteer values(103, 'Calum', 'Lederat', '123', 4, 2);
insert into volunteer values(104, 'Eric', 'Dunce', '123', 5, 3);
insert into volunteer values(105, 'Jordin', 'Thumper', '123', 5, 3);
insert into volunteer values(106, 'Baley', 'Johnston', '123', 7, 3);
insert into volunteer values(107, 'Danny', 'Wang', '123', 6, 4);
insert into volunteer values(108, 'Kevin', 'Xu', '123', 8, 2);
insert into volunteer values(109, 'Brute', 'Yang', '123', 11, 1);
insert into volunteer values(110, 'Jazzy', 'Singh', '123', 4, 1);
insert into volunteer values(111, 'Ani', 'Rube', '123', 2, 2);
insert into volunteer values(112, 'Dora', 'Rose', '123', 1, 5);
insert into volunteer values(113, 'Kirsty', 'Fluver', '123', 0, 5);
insert into volunteer values(114, 'Orla', 'Sharma', '123', 12, 4);
insert into volunteer values(115, 'Uma', 'Smith', '123', 3, 4);

insert into shift values(TO_DATE('2023-06-24', 'YYYY-MM-DD'), '10:34:23', '21:59:00');
insert into shift values(TO_DATE('2023-07-09', 'YYYY-MM-DD'), '10:39:48', '22:11:08');
insert into shift values(TO_DATE('2024-06-30', 'YYYY-MM-DD'), '10:52:28', '23:18:47');
insert into shift values(TO_DATE('2024-07-01', 'YYYY-MM-DD'), '11:44:53', '24:42:12');
insert into shift values(TO_DATE('2024-07-13', 'YYYY-MM-DD'), '12:26:27', '00:33:06');

insert into position values('Measurer', TO_DATE('2023-06-24', 'YYYY-MM-DD'), 3, 'wharf');
insert into position values('Recorder', TO_DATE('2023-07-09', 'YYYY-MM-DD'), 5, 'wharf');
insert into position values('Handler', TO_DATE('2024-06-30', 'YYYY-MM-DD'), 4, 'wharf');
insert into position values('Info tent', TO_DATE('2024-07-01', 'YYYY-MM-DD'), 1, 'picnic area');
insert into position values('Measurer', TO_DATE('2024-07-13', 'YYYY-MM-DD'), 3, 'wharf');

insert into registers values(104, 'Measurer', TO_DATE('2023-06-24', 'YYYY-MM-DD'));
insert into registers values(103, 'Measurer', TO_DATE('2023-06-24', 'YYYY-MM-DD'));
insert into registers values(100, 'Handler', TO_DATE('2024-06-30', 'YYYY-MM-DD'));
insert into registers values(102, 'Info tent', TO_DATE('2024-07-01', 'YYYY-MM-DD'));
insert into registers values(101, 'Measurer', TO_DATE('2024-07-13', 'YYYY-MM-DD'));

insert into parkvisitor values('778-284-9134', 'Maxim', 'Youth');
insert into parkvisitor values('604-038-1435', 'Layla', 'Adult');
insert into parkvisitor values('604-678-4319', 'Raymond', 'Adult');
insert into parkvisitor values('224-649-9683', 'Alan', 'Youth');
insert into parkvisitor values('316-274-3485', 'Edouard', 'Adult');
insert into parkvisitor values('856-462-3021', 'Ivan', 'Youth');
insert into parkvisitor values('982-017-0112', 'Celeste', 'Adult');
insert into parkvisitor values('245-924-5203', 'Elisa', 'Adult');
insert into parkvisitor values('374-939-2754', 'Chloe', 'Adult');
insert into parkvisitor values('984-921-5234', 'Dave', 'Adult');
insert into parkvisitor values('185-274-5245', 'Trevor', 'Adult');
insert into parkvisitor values('256-397-9103', 'Favian', 'Adult');
insert into parkvisitor values('642-174-8903', 'Rob', 'Adult');
insert into parkvisitor values('876-924-0982', 'Russell', 'Adult');
insert into parkvisitor values('275-431-0470', 'Barbara', 'Youth');
insert into parkvisitor values('389-134-7421', 'Carol', 'Youth');
insert into parkvisitor values('130-984-3497', 'Lee', 'Youth');

insert into crabber values('778-284-9134', '825492638', 101);
insert into crabber values('604-038-1435', '740274927', 102);
insert into crabber values('604-678-4319', '312436442', 104);
insert into crabber values('316-274-3485', '628365816', 102);
insert into crabber values('245-924-5203', '528947552', 102);
insert into crabber values('374-939-2754', '467898763', 110);
insert into crabber values('984-921-5234', '398475253', 115);
insert into crabber values('185-274-5245', '824779340', 109);
insert into crabber values('256-397-9103', '143251431', 108);
insert into crabber values('642-174-8903', '165413437', 107);

insert into tourist values('224-649-9683', 'English', 'Canada');
insert into tourist values('316-274-3485', 'French', 'Canada');
insert into tourist values('856-462-3021', 'Spanish', 'Chile');
insert into tourist values('982-017-0112', 'Mandarin', 'China');
insert into tourist values('876-924-0982', 'English', 'Canada');
insert into tourist values('275-431-0470', 'Korean', 'South Korea');
insert into tourist values('389-134-7421', 'Korean', 'South Korea');
insert into tourist values('130-984-3497', 'Hindi', 'India');

insert into interacts values(104, '224-649-9683', 'Starfish');
insert into interacts values(101, '316-274-3485', 'Jellyfish bloom');
insert into interacts values(100, '604-678-4319', 'Sexing crabs');
insert into interacts values(100, '604-038-1435', 'Invasive crabs');
insert into interacts values(105, '316-274-3485', 'Ochre stars');
insert into interacts values(107, '374-939-2754', 'Leather stars');
insert into interacts values(112, '982-017-0112', 'Eating algae');
insert into interacts values(110, '185-274-5245', 'Proper bait disposal');
insert into interacts values(109, '984-921-5234', 'Getting a sports fishing license');
insert into interacts values(102, '876-924-0982', 'Crabbing success these days');
insert into interacts values(103, '256-397-9103', 'Jellyfish bloom');
insert into interacts values(106, '984-921-5234', 'Dead seal pup');
insert into interacts values(108, '256-397-9103', 'Orcas swimming up Indian Arm');
insert into interacts values(111, '316-274-3485', 'Boat docking area');
insert into interacts values(113, '856-462-3021', 'Boat docking area');
insert into interacts values(114, '389-134-7421', 'Jellyfish bloom');
insert into interacts values(115, '642-174-8903', 'Sexing crabs');
insert into interacts values(107, '316-274-3485', 'Local crab species');
insert into interacts values(102, '984-921-5234', 'Where is Cod Rock trail');
insert into interacts values(102, '245-924-5203', 'Jughead Island hike difficulty');
insert into interacts values(105, '185-274-5245', 'Jellyfish bloom');
insert into interacts values(110, '275-431-0470', 'Sexing crabs');
insert into interacts values(101, '130-984-3497', 'Getting a sports fishing license');
insert into interacts values(104, '374-939-2754', 'Jellyfish bloom');
insert into interacts values(106, '778-284-9134', 'Jellyfish bloom');
insert into interacts values(114, '642-174-8903', 'Illegal crabbing');

insert into trap values(1, 'Chicken', 'Circle', 'East', '778-284-9134');
insert into trap values(2, 'Turkey', 'Clamshell', 'Main', '604-038-1435');
insert into trap values(3, 'Turkey', 'Clamshell', 'North', '604-678-4319');
insert into trap values(4, 'Pork', 'Box', 'South', '642-174-8903');
insert into trap values(5, 'Chicken', 'Clamshell', 'South', '642-174-8903');
insert into trap values(6, 'Chicken', 'Clamshell', 'East', '256-397-9103');
insert into trap values(10, 'Chicken', 'Clamshell', 'Main', '256-397-9103');
insert into trap values(12, 'Chicken', 'Clamshell', 'North', '185-274-5245');
insert into trap values(14, 'Chicken', 'Clamshell', 'East', '374-939-2754');
insert into trap values(13, 'Chicken', 'Clamshell', 'North', '374-939-2754');
insert into trap values(15, 'Chicken', 'Clamshell', 'South', '185-274-5245');
insert into trap values(17, 'Chicken', 'Clamshell', 'East', '245-924-5203');
insert into trap values(8, 'Chicken', 'Circle', 'South', '984-921-5234');
insert into trap values(26, 'Chicken', 'Clamshell', 'East', '984-921-5234');
insert into trap values(34, 'Chicken', 'Clamshell', 'Main', '245-924-5203');
insert into trap values(50, 'Chicken', 'Clamshell', 'Main', '316-274-3485');
insert into trap values(11, 'Chicken', 'Clamshell', 'Main', '316-274-3485');
insert into trap values(16, 'Chicken', 'Clamshell', 'Main', '316-274-3485');
insert into trap values(9, 'Chicken', 'Clamshell', 'Main', '316-274-3485');

insert into bait values('Chicken', 0.78);
insert into bait values('Beef', 0.14);
insert into bait values('Pork', 0.56);
insert into bait values('Duck', 0.63);
insert into bait values('Turkey', 0.92);

insert into species values('Dungeness', 165);
insert into species values('Red rock', 115);
insert into species values('Graceful', null);
insert into species values('Green', 0);
insert into species values('Shore', null);

insert into legal values('Dungeness', 'M', 'Yes');
insert into legal values('Graceful', 'M', 'No');
insert into legal values('Dungeness', 'F', 'No');
insert into legal values('Shore', 'M', 'No');
insert into legal values('Red rock', 'F', 'No');

insert into crab values(1,'Red rock', 'M', 108, 'Y', 5);
insert into crab values(2, 'Graceful', 'F', 59, 'Y', 2);
insert into crab values(3, 'Dungeness', 'F', 103, 'N', 3);
insert into crab values(4, 'Graceful', 'M', 94, 'N', 3);
insert into crab values(5, 'Dungeness', 'F', 87, 'Y', 4);
insert into crab values(6, 'Dungeness', 'F', 81, 'N', 1);
insert into crab values(7, 'Dungeness', 'F', 100, 'N', 1);
insert into crab values(8, 'Dungeness', 'M', 78, 'N', 1);
insert into crab values(9, 'Graceful', 'F', 70, 'N', 1);
insert into crab values(10, 'Dungeness', 'M', 83, 'N', 1);
insert into crab values(11, 'Dungeness', 'F', 77, 'N', 1);
insert into crab values(12, 'Graceful', 'F', 77, 'N', 1);
insert into crab values(13, 'Dungeness', 'F', 71, 'N', 1);
insert into crab values(14, 'Graceful', 'M', 77, 'N', 1);
insert into crab values(15, 'Dungeness', 'F', 70, 'N', 1);
insert into crab values(16, 'Graceful', 'F', 57, 'N', 1);
insert into crab values(17, 'Graceful', 'F', 73, 'Y', 1);
insert into crab values(18, 'Dungeness', 'F', 67, 'N', 1);
insert into crab values(19, 'Graceful', 'F', 76, 'N', 1);
insert into crab values(20, 'Graceful', 'F', 68, 'N', 1);
insert into crab values(21, 'Graceful', 'F', 73, 'N', 1);
insert into crab values(22, 'Dungeness', 'M', 74, 'N', 4);
insert into crab values(23, 'Dungeness', 'M', 68, 'N', 3);
insert into crab values(24, 'Dungeness', 'F', 73, 'N', 3);
insert into crab values(25, 'Dungeness', 'M', 73, 'N', 2);
insert into crab values(26, 'Dungeness', 'M', 85, 'N', 2);
insert into crab values(27, 'Dungeness', 'F', 67, 'N', 2);
insert into crab values(28, 'Graceful', 'F', 78, 'N', 6);
insert into crab values(29, 'Red rock', 'F', 85, 'N', 6);
insert into crab values(30, 'Dungeness', 'F', 97, 'N', 6);
insert into crab values(31, 'Red rock', 'M', 81, 'N', 5);
insert into crab values(32, 'Dungeness', 'F', 80, 'N', 5);
insert into crab values(33, 'Dungeness', 'F', 74, 'N', 5);
insert into crab values(34, 'Dungeness', 'F', 81, 'N', 5);
insert into crab values(35, 'Dungeness', 'M', 76, 'Y', 1);
insert into crab values(36, 'Red rock', 'F', 103, 'N', 1);
insert into crab values(37, 'Dungeness', 'M', 78, 'N', 1);
insert into crab values(38, 'Dungeness', 'M', 81, 'N', 1);
insert into crab values(39, 'Dungeness', 'F', 87, 'N', 1);
insert into crab values(40, 'Dungeness', 'F', 80, 'N', 1);
insert into crab values(41, 'Dungeness', 'F', 80, 'N', 1);
insert into crab values(42, 'Dungeness', 'F', 85, 'N', 1);
insert into crab values(43, 'Dungeness', 'F', 91, 'N', 10);
insert into crab values(44, 'Dungeness', 'F', 91, 'N', 10);
insert into crab values(45, 'Dungeness', 'F', 95, 'Y', 10);
insert into crab values(46, 'Dungeness', 'F', 91, 'N', 10);
insert into crab values(47, 'Graceful', 'F', 99, 'N', 10);
insert into crab values(48, 'Dungeness', 'F', 83, 'N', 10);
insert into crab values(49, 'Red rock', 'F', 116, 'N', 9);
insert into crab values(50, 'Graceful', 'M', 85, 'N', 9);
insert into crab values(51, 'Graceful', 'F', 67, 'Y', 12);
insert into crab values(52, 'Dungeness', 'F', 84, 'N', 12);
insert into crab values(53, 'Dungeness', 'F', 92, 'N', 12);
insert into crab values(54, 'Dungeness', 'F', 96, 'N', 12);
insert into crab values(55, 'Dungeness', 'F', 99, 'N', 12);
insert into crab values(56, 'Graceful', 'M', 63, 'N', 12);
insert into crab values(57, 'Dungeness', 'M', 67, 'N', 12);
insert into crab values(58, 'Dungeness', 'F',71, 'N', 10);
insert into crab values(59, 'Dungeness', 'F', 152, 'N', 10);
insert into crab values(60, 'Dungeness', 'F', 89, 'N', 10);
insert into crab values(61, 'Dungeness', 'F', 85, 'N', 10);
insert into crab values(62, 'Dungeness', 'F', 87, 'N', 10);
insert into crab values(63, 'Dungeness', 'M', 97, 'Y', 10);
insert into crab values(64, 'Graceful', 'F', 86, 'Y', 5);
insert into crab values(65, 'Graceful', 'F', 76, 'Y', 9);
insert into crab values(66, 'Dungeness', 'F', 77, 'N', 9);
insert into crab values(67, 'Dungeness', 'F', 76, 'N', 5);
insert into crab values(68, 'Graceful', 'M', 74, 'N', 5);
insert into crab values(69, 'Dungeness', 'F', 88, 'N', 10);
insert into crab values(70, 'Graceful', 'M', 83, 'N', 10);
insert into crab values(71, 'Dungeness', 'M', 94, 'N', 10);
insert into crab values(72, 'Dungeness', 'F', 95, 'N', 10);
insert into crab values(73, 'Graceful', 'M', 72, 'N', 9);
insert into crab values(74, 'Dungeness', 'M', 92, 'N', 14);
insert into crab values(75, 'Dungeness', 'F', 83, 'Y', 14);
insert into crab values(76, 'Graceful', 'M', 95, 'N', 16);
insert into crab values(77, 'Dungeness', 'M', 78, 'N', 16);
insert into crab values(94, 'Dungeness', 'F', 67, 'N', 13);
insert into crab values(95, 'Dungeness', 'F', 72, 'N', 13);
insert into crab values(96, 'Dungeness', 'F', 81, 'N', 13);
insert into crab values(97, 'Dungeness', 'F', 94, 'N', 15);
insert into crab values(98, 'Dungeness', 'F', 80, 'N', 15);
insert into crab values(99, 'Dungeness', 'M', 93, 'N', 15);
insert into crab values(100, 'Dungeness', 'M', 105, 'N', 15);
insert into crab values(101, 'Dungeness', 'F', 96, 'N', 15);
insert into crab values(102, 'Dungeness', 'M', 108, 'N', 15);
insert into crab values(108, 'Dungeness', 'M', 108, 'N', 17);
insert into crab values(109, 'Dungeness', 'F', 116, 'N', 17);
insert into crab values(110, 'Dungeness', 'F', 92, 'N', 17);
insert into crab values(124, 'Graceful', 'F', 75, 'Y', 8);
insert into crab values(125, 'Dungeness', 'F', 67, 'N', 8);
insert into crab values(126, 'Dungeness', 'M', 75, 'Y', 8);
insert into crab values(173, 'Dungeness', 'F', 94, 'N', 26);
insert into crab values(174, 'Graceful', 'F', 77, 'Y', 26);
insert into crab values(180, 'Dungeness', 'F', 90, 'Y', 34);
insert into crab values(181, 'Dungeness', 'M', 95, 'N', 50);
insert into crab values(182, 'Graceful', 'M', 80, 'Y', 50);
insert into crab values(191, 'Dungeness', 'M', 84, 'N', 11);
insert into crab values(267, 'Dungeness', 'F', 93, 'N', 8);
insert into crab values(268, 'Dungeness', 'M', 89, 'N', 13);

insert into studies values(114, 1);
insert into studies values(103, 1);
insert into studies values(104, 2);
insert into studies values(104, 4);
insert into studies values(101, 5);
insert into studies values(107, 6);
insert into studies values(108, 6);
insert into studies values(106, 7);
insert into studies values(110, 8);
insert into studies values(100, 9);
insert into studies values(112, 10);
insert into studies values(107, 11);
insert into studies values(110, 12);
insert into studies values(106, 13);
insert into studies values(115, 14);
insert into studies values(110, 14);
insert into studies values(101, 15);
insert into studies values(102, 16);
insert into studies values(106, 17);
insert into studies values(115, 18);
insert into studies values(100, 19);
insert into studies values(111, 20);
insert into studies values(114, 20);
insert into studies values(106, 21);
insert into studies values(102, 22);
insert into studies values(113, 23);
insert into studies values(106, 24);
insert into studies values(105, 24);
insert into studies values(102, 25);
insert into studies values(106, 26);
insert into studies values(107, 27);
insert into studies values(102, 27);
insert into studies values(112, 28);
insert into studies values(101, 29);
insert into studies values(102, 30);
insert into studies values(105, 31);
insert into studies values(114, 32);
insert into studies values(110, 33);
insert into studies values(100, 34);
insert into studies values(112, 35);
insert into studies values(107, 36);
insert into studies values(102, 37);
insert into studies values(106, 37);
insert into studies values(114, 38);
insert into studies values(101, 39);
insert into studies values(107, 40);
insert into studies values(114, 41);
insert into studies values(100, 42);
insert into studies values(111, 42);
insert into studies values(111, 43);
insert into studies values(110, 44);
insert into studies values(101, 45);
insert into studies values(114, 46);
insert into studies values(115, 47);
insert into studies values(102, 47);
insert into studies values(102, 48);
insert into studies values(106, 48);
insert into studies values(103, 49);
insert into studies values(113, 49);
insert into studies values(102, 50);
insert into studies values(101, 51);
insert into studies values(107, 52);
insert into studies values(112, 53);
insert into studies values(100, 54);
insert into studies values(102, 55);
insert into studies values(103, 55);
insert into studies values(110, 56);
insert into studies values(101, 57);
insert into studies values(115, 57);
insert into studies values(108, 58);
insert into studies values(107, 59);
insert into studies values(104, 59);
insert into studies values(101, 59);
insert into studies values(103, 60);
insert into studies values(101, 60);
insert into studies values(102, 61);
insert into studies values(103, 62);
insert into studies values(106, 62);
insert into studies values(114, 63);
insert into studies values(105, 64);
insert into studies values(113, 65);
insert into studies values(101, 66);
insert into studies values(104, 66);
insert into studies values(109, 67);
insert into studies values(103, 67);
insert into studies values(112, 68);
insert into studies values(115, 68);
insert into studies values(103, 69);
insert into studies values(108, 70);
insert into studies values(105, 71);
insert into studies values(100, 72);
insert into studies values(107, 72);
insert into studies values(113, 73);
insert into studies values(109, 73);
insert into studies values(102, 74);
insert into studies values(115, 75);
insert into studies values(113, 76);
insert into studies values(111, 77);
insert into studies values(108, 77);
insert into studies values(112, 77);
insert into studies values(104, 77);
insert into studies values(100, 94);
insert into studies values(105, 95);
insert into studies values(110, 95);
insert into studies values(108, 96);
insert into studies values(103, 97);
insert into studies values(100, 97);
insert into studies values(103, 98);
insert into studies values(113, 98);
insert into studies values(112, 99);
insert into studies values(105, 100);
insert into studies values(109, 101);
insert into studies values(100, 101);
insert into studies values(108, 108);
insert into studies values(110, 108);
insert into studies values(100, 109);
insert into studies values(101, 110);
insert into studies values(102, 124);
insert into studies values(111, 125);
insert into studies values(105, 126);
insert into studies values(109, 173);
insert into studies values(111, 173);
insert into studies values(115, 173);
insert into studies values(100, 174);
insert into studies values(112, 174);
insert into studies values(109, 180);
insert into studies values(105, 181);
insert into studies values(107, 181);
insert into studies values(113, 181);
insert into studies values(107, 182);
insert into studies values(102, 182);
insert into studies values(114, 182);
insert into studies values(105, 191);
insert into studies values(114, 191);
insert into studies values(109, 267);
insert into studies values(115, 268);
