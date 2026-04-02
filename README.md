# Project Title

Simple overview of use/purpose.

## Description

An in-depth paragraph about your project and overview of use.

## Getting Started

### Dependencies

* Describe any prerequisites, libraries, OS version, etc., needed before installing program.
* ex. Windows 10

### Installing

#### PostgreSql
* check postgresql running in background: `brew services list`


    `postgresql@18 started kevinmunroe ~/Library/LaunchAgents/homebrew.mxcl.postgresql@18.plist`
* create main database (if not exists): `kevinmunroe$ create database bay_area_rent_trends`
* Goto psql command prompt: `kevinmunroe$ psql -U kevinmunroe -d postgres`
* At psql prompt, check database exists:
  `postgres=# \l`

  #### List of databases
  Name                  |    Owner    | Encoding | Locale Provider | ...     
  ----------------------+-------------+----------+-------------
  bay_area_rent_trends | kevinmunroe | UTF8     | libc  ...        
  postgres             | kevinmunroe | UTF8     | libc  ...  
  ...

### Create Tables
1. Zillow ZORI
``` 
  CREATE TABLE rent_data (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    rent_index NUMERIC(10,2),
  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
    UNIQUE (city, state, date)
  );

  CREATE INDEX idx_rent_city_date
  ON rent_data (city, state, date); 
  ```
2. Census/ACS
```
  CREATE TABLE income_data (
      id SERIAL PRIMARY KEY,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(50) NOT NULL,
      year INT NOT NULL,
      median_income NUMERIC(12,2),
  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
      UNIQUE (city, state, year)
  );
  
  CREATE INDEX idx_income_city_year
  ON income_data (city, state, year);
```
3. BLS wage data
```
  CREATE TABLE wage_data (
      id SERIAL PRIMARY KEY,
      region VARCHAR(150) NOT NULL,
      date DATE NOT NULL,
      avg_wage NUMERIC(12,2),
  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
      UNIQUE (region, date)
  );
  
  CREATE INDEX idx_wage_region_date
  ON wage_data (region, date);
```
4. Redfin housing
```
  CREATE TABLE housing_data (
      id SERIAL PRIMARY KEY,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(50) NOT NULL,
      date DATE NOT NULL,
      median_home_price NUMERIC(14,2),
  
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
      UNIQUE (city, state, date)
  );
  
  CREATE INDEX idx_housing_city_date
  ON housing_data (city, state, date);
```
5. Mapping table between city/state and region
```
  CREATE TABLE region_mapping (
      city VARCHAR(100),
      state VARCHAR(50),
      region VARCHAR(150)
  );
```
6. List of Bay Area cities, to be used in view next
``` 
CREATE TABLE bay_area_cities (
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    PRIMARY KEY (city, state)
);
```
7. View that filters rent_data by bay area cities
``` 
  CREATE VIEW bay_area_rent_data AS
    SELECT r.*
    FROM rent_data r
    JOIN bay_area_cities b
      ON r.city = b.city
     AND r.state = b.state;
```
8. Finally seed the bay_area_cities: 
``` 
    INSERT INTO bay_area_cities (city, state) VALUES
      ('San Francisco', 'CA'),
      ('Oakland', 'CA'),
      ('San Jose', 'CA'),
      ('Santa Rosa', 'CA'),
      ('Napa', 'CA'),
      ('Vallejo', 'CA'),
      ('Berkeley', 'CA'),
      ('Fremont', 'CA'),
      ('San Mateo', 'CA'),
      ('Redwood City', 'CA'),
      ('Palo Alto', 'CA'),
      ('Mountain View', 'CA'),
      ('Sunnyvale', 'CA'),
      ('Hayward', 'CA'),
      ('Concord', 'CA'),
      ('Richmond', 'CA');
```
### Front End

*  ```npm create vite@latest bay-area-rent-ui -- --template react```

Make sure Node is version 24 or greater.
* 
### Executing program

* How to run the program
* Step-by-step bullets
```
code blocks for commands
```

## Help

Any advise for common problems or issues.
```
command to run if program contains helper info
```

## Authors

Contributors names and contact info

ex. Dominique Pizzie  
ex. [@DomPizzie](https://twitter.com/dompizzie)

## Version History

* 0.2
    * Various bug fixes and optimizations
    * See [commit change]() or See [release history]()
* 0.1
    * Initial Release

## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
* [awesome-readme](https://github.com/matiassingers/awesome-readme)
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
* [dbader](https://github.com/dbader/readme-template)
* [zenorocha](https://gist.github.com/zenorocha/4526327)
* [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
